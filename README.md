# Anan Almasri — Portfolio Site

A Vite + React + TypeScript + Tailwind site styled as a "Technical Blueprint". The public homepage is the **Blueprint Eternity** demo — an interactive, six-sprint showcase that doubles as the live production site. The original long-form marketing portfolio is preserved at **`/legacy`** so existing links and screenshots still resolve.

## Routes

| Path | What it is |
| --- | --- |
| `/` | **Blueprint Eternity** — the new public homepage (PlottingHero → System diagram → Project gallery → Live chat). |
| `/demo` | Identical to `/`; kept so the in-page "legacy site" link still works. |
| `/legacy` | The original marketing landing page (Navbar, Hero, WhatIBuild, Projects, Experience, Closing, Footer). |
| `/api/stats` | Live container CPU / memory / disk / network metrics. |
| `/api/chat` | Identified chat proxy → n8n → OpenRouter fallback. |
| `/api/chat-log` | Append-only NDJSON transcript per visitor. |
| `/health` | Docker health check. |

## Develop

```bash
npm install
npm run dev
# Blueprint Eternity on http://localhost:5173
# Marketing landing on http://localhost:5173/legacy
```

## Deploy to the VPS

`scripts/deploy.sh` is the one-command deploy: it pulls `main`, rebuilds the `app` image, restarts the container, waits for `/health`, and tails the last logs on failure.

```bash
# from your local machine, after the git push below
ssh deploy@<vps-host>
REPO_DIR=/srv/anan-blueprint ENV_FILE=/etc/anan-blueprint/app.env \
  ./scripts/deploy.sh
```

**Rollback** (in case the new release is bad):

```bash
git -C /srv/anan-blueprint checkout <previous-sha>
cd /srv/anan-blueprint && docker compose up -d --build app
```

The repo contains the docker-compose stack, so no separate image registry is required.

## Build + serve (Express, production)

```bash
npm run build
cp .env.example .env   # then fill in OPENROUTER_API_KEY
node server.js
# SPA + /api/stats + /api/chat + /api/chat-log on http://localhost:8080
```

`server.js` serves the Vite build from `dist/`, exposes live container stats at `/api/stats`, and proxies the demo chat.

## Demo chat (Sprint 5 + Sprint 6)

The §4 section of the public homepage (`/`) is a real, identified chat surface that proxies to an **n8n chatbot webhook** with an **OpenRouter** fallback. The same experience lives at `/demo` for symmetry.

### Flow

1. First visit shows the **IdentityGate** inside the chat card:
   - **Step 1** — Full name (validated, 2–60 chars, supports Arabic + Latin)
   - **Step 2** — Email (RFC-style validation)
2. Identity persists in `localStorage` under `aa-chat-identity`. Refresh → no re-prompt.
3. A per-browser **chat session ID** is generated on first load (`crypto.randomUUID()`, cached in `localStorage` under `chatSessionId`) and shipped on every request. The server forwards it to n8n as `sessionId` so the n8n workflow can thread memory per visitor — independently of whether they've given a name yet, and across refreshes / devices.
4. Every question POSTs to `/api/chat` with `{ sessionId, chatInput, name, email, system, messages, context }`.
5. The server forwards the request to the **n8n webhook** (`N8N_WEBHOOK_URL`, default `https://n8n.ananalmasri.com/webhook/chatbot`). The payload shape matches what the n8n Chat Trigger node expects:
   ```json
   {
     "chatInput": "...",
     "sessionId": "<per-browser uuid>",
     "action": "sendMessage",
     "messages": [{ "role": "user|assistant", "content": "..." }],
     "system": "...",
     "context": { "source": "demo", "name": "...", "email": "...", "sessionId": "...", "ts": 0 }
   }
   ```
6. If the n8n webhook fails (5xx, 404, timeout, empty body), the server transparently falls back to **OpenRouter** (`OPENROUTER_API_KEY` / `OPENROUTER_MODEL`, default `nvidia/nemotron-3-ultra-550b-a55b:free`). Without an OpenRouter key, the response is a `server-fallback` message; the client then surfaces a deterministic 14-intent local router so the demo never goes silent.
7. Every exchange is appended to `data/chat-log.ndjson` (gitignored) — one JSON object per line with `name`, `email`, `question`, `answer`, `source`, `model`, `intent`, `ts`, `ip`.

### Environment

Copy `.env.example` to `.env` and fill in:

```bash
# n8n (primary)
N8N_WEBHOOK_URL=https://n8n.ananalmasri.com/webhook/chatbot
N8N_WEBHOOK_TEST_URL=https://n8n.ananalmasri.com/webhook-test/chatbot
USE_N8N_TEST=false

# OpenRouter (fallback)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions

# Dev-only
ENABLE_TEST_ENDPOINT=false

# Misc
CHAT_LOG_DIR=./data
CHAT_TIMEOUT_MS=60000
PORT=8080
STATIC_DIR=./dist
```

### Dev mode — `?dev=1` and the Postman-mirror trigger

When developing against the n8n workflow, you want a way to fire the
**literal Postman body** you already have working, without going through
the full identity gate / rate limit / chat-log pipeline. Two pieces:

1. **Set `ENABLE_TEST_ENDPOINT=true`** in your server `.env`. This exposes
   `POST /api/chat-test` (a dev-only endpoint that forwards a Postman-shaped
   body straight to the n8n webhook, bypassing auth, rate limit, and log).
2. **Open the chat card with `?dev=1`**: `http://localhost:8080/?dev=1` (or
   `http://localhost:8080/demo?dev=1` or `http://localhost:8080/legacy?dev=1`).
   An amber **`[ POSTMAN ]`** button appears in the title bar; clicking it
   fires the exact body you've been testing in Postman (`sessionId: "demo-session-42"`,
   the logistics opener, etc.). The response (or error) is surfaced in a small
   banner above the message list so it never pollutes the user's real thread.

The server logs every outbound call as a masked JSON blob so you can see
the resolved `sessionId`, `chatInput` preview, and `messages` count
without dumping the full system prompt or history on every request:

```
[chat] → n8n
{
  "url": "https://n8n.ananalmasri.com/webhook/chatbot",
  "sessionId": "demo-session-42",
  "action": "sendMessage",
  "chatInput": "Hi, I run a small logistics company...",
  "messages": "[1 msg]",
  "system": "[1200 chars]",
  "context": { "source": "demo", "name": "...", "email": "...", "sessionId": "demo-session-42", "ts": 0 }
}
```

### Server-side protections

- Identity validated server-side (regex on name, email).
- Per-IP rate limit: 12 requests / 60 s sliding window.
- Per-identity throttle: 1 message / 5 s per email.
- Message content capped at 4 KB; history capped at 12 turns.
- Per-request model timeout (default 60 s, abort-controller).
- Stale-response guard on the client: a second `ask()` invalidates
  earlier in-flight responses so they can't clobber a newer answer.

### System prompt

`src/data/chatSystemPrompt.ts` pins the model into the role of **Anan's Demo Assistant** with hard scope, style, and "do-not-invent" rules. The model is told to cite project sheets (e.g. `SHEET-03`) when referencing a project, which the UI renders as "USED IN" pills that scroll to the matching sheet in the gallery.

## Project structure

```
server.js                          # Express: serves SPA, /api/stats, /api/chat, /api/chat-log
src/
  components/
    demo/                          # The /demo preview
      DemoShell.tsx
      PlottingHero.tsx
      DrawingInspector.tsx
      AnimatedSystemDiagram.tsx    # Sprint 2 — interactive system architecture
      HorizontalGallery.tsx        # Sprint 3 — 9 project sheets
      ChatPanel.tsx                # Sprint 5 — identity-gated chat
      IdentityGate.tsx             # Sprint 5 — 2-step modal
      ChatBubble.tsx               # Sprint 5 — markdown-lite renderer
      ...
  data/
    chatSystemPrompt.ts            # Sprint 5 — strict system prompt
    fallbackResponses.ts           # 14 intent-keyed responses
    projectsData.ts                # 9 project sheets (gallery)
    systemDiagramData.ts           # 10 nodes / 14 edges (diagram)
  lib/
    demo/
      aiClient.ts                  # Sprint 5 — POST /api/chat, log, fallback
      fallback.ts                  # Sprint 4 — intent router
      chatIdentity.ts              # Sprint 5 — localStorage identity
    motion.ts                      # Shared motion tokens
.env.example
.gitignore                         # Includes data/ and chat-log.ndjson
```

## License

Personal portfolio code. All rights reserved by Anan Almasri.
