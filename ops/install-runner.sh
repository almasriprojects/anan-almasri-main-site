#!/usr/bin/env bash
# One-shot installer for the self-hosted GitHub Actions runner.
#
# What this script does (in order):
#   1. Creates the `deploy` user and adds it to the `docker` group.
#   2. Installs the hardened systemd unit (ops/runner.service) and enables it.
#   3. Downloads the official GitHub Actions runner into /opt/actions-runner.
#   4. Registers the runner against the repo, with the single label
#      "anan-blueprint-vps" — no other workflow can ever schedule here.
#   5. Starts the runner as a background process (the unit restarts it).
#
# You run this exactly once on the VPS. The runner then keeps itself
# up-to-date and polls GitHub for new jobs.
#
# Prerequisites (you set these before running this script):
#   - $RUNNER_REPO  e.g. "almasriprojects/anan-almasri-main-site"
#   - $RUNNER_TOKEN a one-time registration token from the repo's
#                   Settings → Actions → Runners → "New self-hosted runner"
#   - jq            (apt-get install -y jq) — used by the workflow too
#
# Usage:
#   RUNNER_REPO="almasriprojects/anan-almasri-main-site" \
#   RUNNER_TOKEN="ghs_..." \
#   sudo -E ./ops/install-runner.sh
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "❌ Please run this as root: sudo -E $0" >&2
  exit 1
fi

if [ -z "${RUNNER_REPO:-}" ]; then
  echo "❌ RUNNER_REPO must be set, e.g. almasriprojects/anan-almasri-main-site" >&2
  exit 1
fi
if [ -z "${RUNNER_TOKEN:-}" ]; then
  echo "❌ RUNNER_TOKEN must be set, generate one in the repo's Actions > Runners page" >&2
  exit 1
fi

RUNNER_VERSION="${RUNNER_VERSION:-2.319.1}"
RUNNER_NAME="${RUNNER_NAME:-anan-blueprint-vps}"
RUNNER_LABELS="${RUNNER_LABELS:-anan-blueprint-vps,self-hosted,linux,x64}"
RUNNER_DIR="/opt/actions-runner"
REPO_DIR="${REPO_DIR:-/srv/anan-blueprint}"
ENV_FILE="${ENV_FILE:-/etc/anan-blueprint/app.env}"

echo "→ Creating deploy user"
if ! id deploy >/dev/null 2>&1; then
  useradd -m -s /bin/bash deploy
fi
# Allow the deploy user to talk to the Docker daemon (no sudo needed).
usermod -aG docker deploy
# Allow the runner to read the env file (read-only, no write).
mkdir -p "$(dirname "$ENV_FILE")"
touch "$ENV_FILE"
chown root:deploy "$ENV_FILE"
chmod 0440 "$ENV_FILE"

echo "→ Installing the hardened systemd unit"
install -m 0644 "$(dirname "$0")/runner.service" /etc/systemd/system/actions.runner.service
systemctl daemon-reload

echo "→ Downloading GitHub Actions runner v${RUNNER_VERSION}"
mkdir -p "$RUNNER_DIR"
chown deploy:deploy "$RUNNER_DIR"
TARBALL="actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
if [[ ! -f "$RUNNER_DIR/${TARBALL}" ]]; then
  sudo -u deploy curl -fsSL -o "$RUNNER_DIR/${TARBALL}" \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/${TARBALL}"
  sudo -u env HOME="$RUNNER_DIR" bash -c "cd '$RUNNER_DIR' && tar xzf '$TARBALL'"
fi

echo "→ Registering the runner"
sudo -u deploy env HOME="$RUNNER_DIR" \
  "$RUNNER_DIR/config.sh" \
    --unattended \
    --disable-update \
    --url "https://github.com/${RUNNER_REPO}" \
    --token "$RUNNER_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --work "_work"

# Remove the registration token from disk; it's single-use.
unset RUNNER_TOKEN

echo "→ Starting the runner (as a background process supervised by systemd)"
# The unit expects run.sh in the runner dir. The official tarball ships one.
chmod +x "$RUNNER_DIR/run.sh"
# The unit file uses WorkingDirectory=/opt/actions-runner, so systemd will
# exec run.sh with the right env. We do not call ./run.sh directly here
# because the unit will manage it; starting it twice would crash the
# runner.
systemctl enable --now actions.runner.service

echo "→ Verifying"
sleep 3
systemctl --no-pager status actions.runner.service || true
echo
echo "Done. The runner should now be 'online' in:"
echo "  https://github.com/${RUNNER_REPO}/settings/actions/runners"
echo "  (Settings -> Actions -> Runners)"

echo
echo "Next steps:"
echo "  1. Edit ${ENV_FILE} so the deploy user can read the same vars as before."
echo "  2. Verify the repo lives at ${REPO_DIR} and the deploy user can read it."
echo "  3. Open the Actions tab on the repo and run the 'Deploy to VPS' workflow"
echo "     via workflow_dispatch as a smoke test (Actions -> Deploy to VPS -> Run workflow)."
