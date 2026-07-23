// Live container stats server + SPA static host
// Serves the React build from /usr/share/nginx/html (created by vite build)
// and exposes /api/stats which reads the real container's /proc/* files.
import express from "express";
import { readFile, readdir, appendFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { hostname, platform, arch, cpus, uptime, networkInterfaces } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHmac, timingSafeEqual } from "node:crypto";

const execFileP = promisify(execFile);
const app = express();
const PORT = process.env.PORT || 8080;
// We're always behind Cloudflare Tunnel in production, which terminates TLS
// and forwards over plain HTTP — trust its X-Forwarded-Proto so `secure`
// cookies (below) are set correctly instead of silently never being sent.
app.set("trust proxy", 1);
// STATIC_DIR resolution order:
//   1. Explicit STATIC_DIR env var (production dockerfile sets nothing —
//      `/usr/share/nginx/html` is hardcoded in the Dockerfile).
//   2. `/usr/share/nginx/html` (production default in Docker).
//   3. `./dist` (local dev: `npm run build` outputs here).
// This lets `node server.js` work locally with zero env setup.
function resolveStaticDir() {
  if (process.env.STATIC_DIR) return process.env.STATIC_DIR;
  if (existsSync("/usr/share/nginx/html")) return "/usr/share/nginx/html";
  return "./dist";
}
const STATIC_DIR = resolveStaticDir();
console.log(`[server] static dir resolved to: ${STATIC_DIR}`);

// Admin login (Telegram OTP via n8n, server-side session cookie)
const ADMIN_OTP_WEBHOOK_URL =
  process.env.ADMIN_OTP_WEBHOOK_URL || "https://n8n.ananalmasri.com/webhook/admin-login";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "";
const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// Chat config (server-side only — keys never reach the browser)
// Primary upstream: your n8n chatbot webhook. Production path preferred.
// Fallback upstream: OpenRouter (set OPENROUTER_API_KEY to enable).
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "https://n8n.ananalmasri.com/webhook/chatbot";
const N8N_WEBHOOK_TEST_URL =
  process.env.N8N_WEBHOOK_TEST_URL ||
  "https://n8n.ananalmasri.com/webhook-test/chatbot";
// If true, use the webhook-test URL (only works after clicking Execute on canvas).
const USE_N8N_TEST = String(process.env.USE_N8N_TEST || "").toLowerCase() === "true";
const N8N_URL = USE_N8N_TEST ? N8N_WEBHOOK_TEST_URL : N8N_WEBHOOK_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
const OPENROUTER_URL =
  process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1/chat/completions";
const CHAT_LOG_DIR = process.env.CHAT_LOG_DIR || "./data";
const CHAT_LOG_FILE = `${CHAT_LOG_DIR}/chat-log.ndjson`;
const CHAT_TIMEOUT_MS = Number(process.env.CHAT_TIMEOUT_MS || 60000);
// Dev-only: expose /api/chat-test (mirror of the exact Postman body shape
// for hand-testing the n8n webhook without going through the full client
// identity gate). NEVER enable in production.
const ENABLE_TEST_ENDPOINT =
  String(process.env.ENABLE_TEST_ENDPOINT || "").toLowerCase() === "true";

// Identity gate is enforced server-side too — never trust the client.
const NAME_RE = /^[a-zA-Z\u0600-\u06FF .'-]{2,60}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-IP rate limit (sliding window). Free-tier friendly.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 12; // 12 requests / minute / IP
const ipBuckets = new Map(); // ip -> [timestamps]
function rateCheck(ip) {
  const now = Date.now();
  const arr = (ipBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return false;
  arr.push(now);
  ipBuckets.set(ip, arr);
  return true;
}

// Per-identity throttle (5s between messages from the same email)
const lastByIdentity = new Map(); // email -> ts
function identityThrottle(email) {
  const now = Date.now();
  const last = lastByIdentity.get(email) || 0;
  if (now - last < 5000) return false;
  lastByIdentity.set(email, now);
  return true;
}

// ─── Helpers ─────────────────────────────────────────────────────
// n8n responses vary by workflow/node: plain text, an object with a
// `content`/`output` field, an array of node results, or JSON encoded inside a
// string. Extract only the assistant's text so transport metadata can never be
// displayed as a chat message.
const CHAT_TEXT_KEYS = ["content", "output", "text", "message", "reply", "answer"];
const CHAT_WRAPPER_KEYS = ["data", "body", "result", "response"];
const MAX_CHAT_UNWRAP_DEPTH = 6;

function extractChatContent(value, depth = 0) {
  if (depth > MAX_CHAT_UNWRAP_DEPTH || value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
      const decoded = JSON.parse(trimmed);
      if (typeof decoded === "string") {
        return extractChatContent(decoded, depth + 1) || decoded.trim();
      }
      if (decoded && typeof decoded === "object") {
        return extractChatContent(decoded, depth + 1);
      }
    } catch {
      // Genuine plain text — already safe to display.
    }
    return trimmed;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractChatContent(item, depth + 1);
      if (candidate) return candidate;
    }
    return "";
  }

  if (typeof value === "object") {
    for (const key of CHAT_TEXT_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      const candidate = extractChatContent(value[key], depth + 1);
      if (candidate) return candidate;
    }
    for (const key of CHAT_WRAPPER_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      const candidate = extractChatContent(value[key], depth + 1);
      if (candidate) return candidate;
    }
  }

  return "";
}

function normalizeUpstreamChatResponse(raw) {
  if (typeof raw !== "string" || !raw.trim()) return "";
  try {
    return extractChatContent(JSON.parse(raw));
  } catch {
    return raw.trim();
  }
}

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

// ─── Admin session helpers ────────────────────────────────────────
// Signed, stateless session token: base64url(payload).base64url(hmac).
// No new dependency — Node's built-in crypto is enough for one cookie.
function signAdminSession(exp) {
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyAdminSession(token) {
  if (!token || !ADMIN_SESSION_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  const out = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

// n8n responses vary by workflow shape (plain object, array of node results,
// or `{ json: {...} }`) — unwrap to the actual payload.
function normalizeAdminResponse(raw) {
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    return first?.json ?? first;
  }
  if (raw?.json) return raw.json;
  return raw;
}

// ─── /api/admin/* endpoints (Telegram OTP via n8n) ────────────────
app.post("/api/admin/request-otp", express.json({ limit: "4kb" }), async (_req, res) => {
  try {
    const r = await fetch(ADMIN_OTP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request_code" }),
    });
    const raw = await r.json().catch(() => null);
    const data = normalizeAdminResponse(raw) ?? {};
    if (!r.ok || data?.success === false) {
      return res.status(502).json({ success: false, message: data?.message ?? "Unable to request OTP." });
    }
    res.json({ success: true, message: data?.message ?? "OTP sent to Telegram." });
  } catch (err) {
    res.status(502).json({ success: false, message: String(err) });
  }
});

app.post("/api/admin/verify-otp", express.json({ limit: "4kb" }), async (req, res) => {
  try {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!code) {
      return res.status(400).json({ success: false, message: "Please enter the code you received." });
    }
    const r = await fetch(ADMIN_OTP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify_code", code }),
    });
    const raw = await r.json().catch(() => null);
    const data = normalizeAdminResponse(raw) ?? {};

    if (!r.ok || data?.success !== true) {
      return res.status(401).json({ success: false, message: data?.message ?? "Invalid code. Please try again." });
    }
    if (!ADMIN_SESSION_SECRET) {
      console.warn("[admin] ADMIN_SESSION_SECRET is not set — refusing to issue a session");
      return res.status(500).json({ success: false, message: "Server is not configured for admin login." });
    }

    const token = signAdminSession(Date.now() + ADMIN_SESSION_TTL_MS);
    res.cookie(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: "auto", // real TLS via trust proxy in prod, plain http in local dev
      sameSite: "strict",
      maxAge: ADMIN_SESSION_TTL_MS,
      path: "/",
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
});

app.get("/api/admin/session", (req, res) => {
  const { [ADMIN_SESSION_COOKIE]: token } = parseCookies(req);
  res.set("Cache-Control", "no-store");
  res.json({ authenticated: verifyAdminSession(token) });
});

// ─── /api/chat-log endpoint ──────────────────────────────────────
async function ensureLogDir() {
  if (!existsSync(CHAT_LOG_DIR)) {
    try { await mkdir(CHAT_LOG_DIR, { recursive: true }); } catch {}
  }
}
async function appendLog(entry) {
  try {
    await ensureLogDir();
    await appendFile(CHAT_LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.error("[chat-log] write failed:", err);
  }
}

app.post("/api/chat-log", express.json({ limit: "16kb" }), async (req, res) => {
  try {
    const { name, email, question, answer, source, model, intent, ts } = req.body || {};
    if (!email || !EMAIL_RE.test(String(email).toLowerCase())) {
      return res.status(400).json({ ok: false, error: "invalid email" });
    }
    await appendLog({
      name: name ? String(name).slice(0, 60) : "",
      email: String(email).toLowerCase(),
      question: question ? String(question).slice(0, 4000) : "",
      answer: answer ? String(answer).slice(0, 8000) : "",
      source: source || "fallback",
      model: model || "",
      intent: intent || "",
      ts: ts || Date.now(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// ─── /api/chat endpoint ──────────────────────────────────────────
app.post("/api/chat", express.json({ limit: "32kb" }), async (req, res) => {
  try {
    const { name, email, messages, system } = req.body || {};
    // sessionId is a per-browser thread ID (from localStorage on the client).
    // We prefer it for n8n memory threading so anonymous visitors and
    // multi-device users don't all collapse onto the same email-keyed session.
    const clientSessionId = req.body && req.body.sessionId ? String(req.body.sessionId) : "";
    if (!email || !EMAIL_RE.test(String(email).toLowerCase())) {
      return res.status(400).json({ ok: false, error: "invalid email" });
    }
    const cleanEmail = String(email).toLowerCase();
    if (!name || !NAME_RE.test(String(name))) {
      return res.status(400).json({ ok: false, error: "invalid name" });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ ok: false, error: "no messages" });
    }
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim() || "unknown";
    if (!rateCheck(ip)) {
      return res.status(429).json({ ok: false, error: "rate limit exceeded (per IP)" });
    }
    if (!identityThrottle(cleanEmail)) {
      return res.status(429).json({ ok: false, error: "please wait a few seconds before sending another message" });
    }
    // Server-side cap on history length
    const trimmed = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

    // ─── Upstream 1: n8n webhook (primary) ─────────────────────
    // We send both a flat `chatInput` (what n8n's Chat Trigger node
    // expects by default) and the structured history so the workflow
    // can pick whichever shape its nodes are wired to.
    const lastUser = [...trimmed].reverse().find((m) => m.role === "user");
    // Prefer the per-browser chatSessionId from the client; fall back to
    // the email so Postman-style callers (or older clients) still get a
    // stable key.
    const effectiveSessionId = clientSessionId || cleanEmail;
    const n8nPayload = {
      chatInput: lastUser?.content || "",
      sessionId: effectiveSessionId,
      action: "sendMessage",
      messages: trimmed,
      system: system ? String(system).slice(0, 8000) : "",
      context: {
        source: "demo",
        name,
        email: cleanEmail,
        sessionId: effectiveSessionId,
        ts: Date.now(),
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
    try {
      // Masked outbound log — lets us see exactly what's going to n8n
      // (including the resolved sessionId) without dumping the full
      // system prompt or message history on every call.
      console.log(
        "[chat] → n8n",
        JSON.stringify(
          {
            url: N8N_URL,
            sessionId: effectiveSessionId,
            action: n8nPayload.action,
            chatInput: (n8nPayload.chatInput || "").slice(0, 120),
            messages: `[${trimmed.length} msg${trimmed.length === 1 ? "" : "s"}]`,
            system: `[${(n8nPayload.system || "").length} chars]`,
            context: n8nPayload.context,
          },
          null,
          2
        )
      );
      const r = await fetch(N8N_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AA-Demo-Chat/1.0",
        },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const raw = await r.text();
      if (!r.ok) {
        console.warn(`[chat] n8n ${r.status}  body=${raw.slice(0, 200)}`);
        // Fall through to OpenRouter below.
        throw new Error(`n8n ${r.status}`);
      }
      const content = normalizeUpstreamChatResponse(raw);
      if (!content) {
        console.warn("[chat] n8n returned empty body");
        throw new Error("n8n empty");
      }
      console.log(`[chat] ← n8n ok  ${content.length} chars`);
      return res.json({
        ok: true,
        source: "n8n",
        content,
        model: N8N_URL,
      });
    } catch (n8nErr) {
      // ─── Upstream 2: OpenRouter (fallback) ─────────────────
      clearTimeout(timer);
      if (!OPENROUTER_API_KEY) {
        return res.json({
          ok: true,
          source: "server-fallback",
          content: `Could not reach the n8n chatbot webhook (${N8N_URL}): ${String(n8nErr.message || n8nErr)}. Set OPENROUTER_API_KEY to enable an automatic OpenRouter fallback.`,
          model: "",
        });
      }
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), CHAT_TIMEOUT_MS);
      try {
        console.log(`[chat] → openrouter  model=${OPENROUTER_MODEL}`);
        const r = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": req.headers.origin || `http://${req.headers.host}`,
            "X-Title": "Anan Almasri — Demo Chat",
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              ...(system ? [{ role: "system", content: String(system).slice(0, 8000) }] : []),
              ...trimmed,
            ],
            temperature: 0.4,
            max_tokens: 700,
          }),
          signal: controller2.signal,
        });
        clearTimeout(timer2);
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          return res.status(502).json({ ok: false, error: `openrouter ${r.status}`, detail: text.slice(0, 500) });
        }
        const json = await r.json();
        const content = json?.choices?.[0]?.message?.content || "";
        if (!content) {
          return res.status(502).json({ ok: false, error: "empty model response" });
        }
        return res.json({
          ok: true,
          source: "openrouter",
          content: String(content),
          model: json?.model || OPENROUTER_MODEL,
        });
      } catch (err) {
        clearTimeout(timer2);
        const msg = err?.name === "AbortError" ? "model timeout" : String(err);
        return res.status(504).json({ ok: false, error: msg });
      }
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// ─── /api/chat-test endpoint (DEV ONLY) ──────────────────────────
// Mirrors the exact Postman body shape the user has verified works
// against the n8n webhook. Skip the identity gate / rate limit / log
// so you can fire-and-forget from a button on the chat card. Disabled
// unless ENABLE_TEST_ENDPOINT=true.
app.post("/api/chat-test", express.json({ limit: "32kb" }), async (req, res) => {
  if (!ENABLE_TEST_ENDPOINT) {
    return res.status(404).json({ ok: false, error: "test endpoint disabled" });
  }
  try {
    const body = req.body || {};
    // Accept the Postman shape verbatim, with sensible defaults so the
    // button just works when fired from the chat card.
    const sessionId = body.sessionId ? String(body.sessionId) : "demo-session-42";
    const chatInput = body.chatInput ? String(body.chatInput) : "Hi from the dev Postman-mirror button";
    const name = body.name ? String(body.name) : "Postman Mirror";
    const email = body.email ? String(body.email).toLowerCase() : "postman-mirror@local";
    const system = body.system ? String(body.system) : "";
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = body.context && typeof body.context === "object" ? body.context : { source: "postman-test" };
    const action = body.action ? String(body.action) : "sendMessage";

    const n8nPayload = {
      chatInput,
      sessionId,
      action,
      messages,
      system,
      context: { ...context, page: context.page || req.headers.referer || "" },
    };

    console.log(
      "[chat-test] → n8n",
      JSON.stringify(
        {
          url: N8N_URL,
          sessionId,
          action,
          chatInput: chatInput.slice(0, 120),
          messages: `[${messages.length} msg${messages.length === 1 ? "" : "s"}]`,
          system: `[${system.length} chars]`,
          context: n8nPayload.context,
        },
        null,
        2
      )
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
    try {
      const r = await fetch(N8N_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AA-Demo-Chat/1.0 (test)",
        },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const raw = await r.text();
      const content = normalizeUpstreamChatResponse(raw);
      if (!r.ok) {
        return res.status(r.status).json({
          ok: false,
          error: `n8n ${r.status}`,
          detail: raw.slice(0, 500),
          sent: n8nPayload,
        });
      }
      if (!content) {
        return res.status(502).json({ ok: false, error: "n8n returned empty body", sent: n8nPayload });
      }
      console.log(`[chat-test] ← n8n ok  ${content.length} chars`);
      return res.json({
        ok: true,
        source: "n8n",
        content,
        sent: n8nPayload,
      });
    } catch (err) {
      clearTimeout(timer);
      return res.status(504).json({
        ok: false,
        error: err?.name === "AbortError" ? "n8n timeout" : String(err),
        sent: n8nPayload,
      });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
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
