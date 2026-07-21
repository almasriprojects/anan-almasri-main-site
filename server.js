// Live container stats server + SPA static host
// Serves the React build from /usr/share/nginx/html (created by vite build)
// and exposes /api/stats which reads the real container's /proc/* files.
import express from "express";
import { readFile, readdir } from "node:fs/promises";
import { hostname, platform, arch, cpus, uptime, networkInterfaces } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);
const app = express();
const PORT = process.env.PORT || 8080;
const STATIC_DIR = process.env.STATIC_DIR || "/usr/share/nginx/html";

// ─── Helpers ─────────────────────────────────────────────────────
const safeRead = async (p) => {
  try { return await readFile(p, "utf8"); } catch { return ""; }
};

// Calculate CPU% using /proc/stat deltas (need two samples)
let lastCpuSample = null;
async function readCpuPercent() {
  const stat = await safeRead("/proc/stat");
  if (!stat) return 0;
  const cpuLine = stat.split("\n").find((l) => l.startsWith("cpu "));
  if (!cpuLine) return 0;
  const parts = cpuLine.split(/\s+/).slice(1).map(Number);
  const idle = parts[3] + (parts[4] || 0);
  const total = parts.reduce((a, b) => a + b, 0);
  if (lastCpuSample) {
    const dTotal = total - lastCpuSample.total;
    const dIdle = idle - lastCpuSample.idle;
    const pct = dTotal > 0 ? Math.round(((dTotal - dIdle) / dTotal) * 100) : 0;
    lastCpuSample = { total, idle };
    return Math.max(0, Math.min(100, pct));
  }
  lastCpuSample = { total, idle };
  return 0; // first sample — no delta yet
}

// Memory from /proc/meminfo (in kB)
async function readMemory() {
  const m = await safeRead("/proc/meminfo");
  if (!m) return { usedBytes: 0, totalBytes: 0, percent: 0, usedGB: "0", totalGB: "0" };
  const get = (k) => {
    const re = new RegExp(`${k}:\\s+(\\d+)`);
    const match = m.match(re);
    return match ? parseInt(match[1], 10) : 0;
  };
  const total = get("MemTotal");
  const avail = get("MemAvailable") || (total - get("MemFree") - get("Buffers") - get("Cached"));
  const used = total - avail;
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  return {
    usedBytes: used * 1024,
    totalBytes: total * 1024,
    percent,
    usedGB: (used / 1024 / 1024).toFixed(2),
    totalGB: (total / 1024 / 1024).toFixed(2),
  };
}

// Network from /proc/net/dev (cumulative bytes since boot)
async function readNetwork() {
  const n = await safeRead("/proc/net/dev");
  if (!n) return { rxBytes: 0, txBytes: 0, rxMB: "0", txMB: "0" };
  const lines = n.split("\n").slice(2);
  let rx = 0, tx = 0;
  for (const line of lines) {
    const [iface, rest] = line.split(":");
    if (!iface || !rest) continue;
    if (iface.trim() === "lo") continue; // skip loopback
    const parts = rest.trim().split(/\s+/);
    rx += parseInt(parts[0], 10) || 0;
    tx += parseInt(parts[8], 10) || 0;
  }
  return {
    rxBytes: rx,
    txBytes: tx,
    rxMB: (rx / 1024 / 1024).toFixed(2),
    txMB: (tx / 1024 / 1024).toFixed(2),
  };
}

// Disk usage via `df` on root filesystem
async function readDisk() {
  try {
    const { stdout } = await execFileP("df", ["-B1", "/"]);
    const lines = stdout.trim().split("\n");
    const parts = lines[1].split(/\s+/);
    const total = parseInt(parts[1], 10);
    const used = parseInt(parts[2], 10);
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
    return {
      usedBytes: used,
      totalBytes: total,
      percent,
      usedGB: (used / 1024 / 1024 / 1024).toFixed(2),
      totalGB: (total / 1024 / 1024 / 1024).toFixed(2),
    };
  } catch {
    return { usedBytes: 0, totalBytes: 0, percent: 0, usedGB: "0", totalGB: "0" };
  }
}

// Format uptime as "Xd Yh Ym"
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ─── /api/stats endpoint ─────────────────────────────────────────
let cached = null;
let lastFetchAt = 0;
const CACHE_MS = 1000; // throttle recomputation to 1s

app.get("/api/stats", async (_req, res) => {
  try {
    const now = Date.now();
    if (cached && now - lastFetchAt < CACHE_MS) {
      return res.json(cached);
    }
    const [cpu, memory, network, disk] = await Promise.all([
      readCpuPercent(),
      readMemory(),
      readNetwork(),
      readDisk(),
    ]);
    const data = {
      cpu,
      memory,
      disk,
      network,
      uptime: formatUptime(uptime()),
      hostname: hostname(),
      platform: platform(),
      arch: arch(),
      cpus: cpus().length,
      ips: Object.values(networkInterfaces()).flat().filter((i) => i.family === "IPv4").map((i) => i.address),
      timestamp: now,
    };
    cached = data;
    lastFetchAt = now;
    res.set("Cache-Control", "no-store");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Health check (kept compatible with the old Dockerfile)
app.get("/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).send("ok");
});

// Serve React build (static assets + SPA fallback)
app.use(express.static(STATIC_DIR, { maxAge: "1h", index: false }));

// SPA fallback for client routes (anything that isn't an asset)
app.get(/^\/(?!api|assets|health).*/, async (_req, res, next) => {
  try {
    const html = await readFile(`${STATIC_DIR}/index.html`, "utf8");
    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
  console.log(`[server] static dir: ${STATIC_DIR}`);
  console.log(`[server] hostname: ${hostname()}  cpus: ${cpus().length}  arch: ${arch()}`);
});
