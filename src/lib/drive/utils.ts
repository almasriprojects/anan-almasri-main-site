// ─── Formatters & small helpers ────────────────────────────────

import type { DriveItem, FileKind, FolderColor } from "./types";

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  const fixed = value >= 100 || i === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(fixed)} ${units[i]}`;
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  if (day < 30) return `${Math.floor(day / 7)}w ago`;
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatExactDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function genId(prefix = "id"): string {
  // crypto.randomUUID exists in modern browsers; fallback for safety
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 14)}`;
}

// ─── mime / extension → FileKind mapping ───────────────────────
const MIME_TO_KIND: Record<string, FileKind> = {
  "application/pdf": "pdf",
  "application/zip": "archive",
  "application/x-tar": "archive",
  "application/x-gzip": "archive",
  "application/x-7z-compressed": "archive",
  "application/x-rar-compressed": "archive",
  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "spreadsheet",
  "application/vnd.ms-powerpoint": "presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "presentation",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "text/plain": "text",
  "text/markdown": "text",
  "text/csv": "spreadsheet",
  "text/html": "code",
};

const EXT_TO_KIND: Record<string, FileKind> = {
  pdf: "pdf",
  doc: "document",
  docx: "document",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  csv: "spreadsheet",
  ppt: "presentation",
  pptx: "presentation",
  txt: "text",
  md: "text",
  rtf: "document",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  mp4: "video",
  mov: "video",
  webm: "video",
  avi: "video",
  mkv: "video",
  mp3: "audio",
  wav: "audio",
  flac: "audio",
  ogg: "audio",
  m4a: "audio",
  zip: "archive",
  tar: "archive",
  gz: "archive",
  tgz: "archive",
  "7z": "archive",
  rar: "archive",
  js: "code",
  jsx: "code",
  ts: "code",
  tsx: "code",
  json: "code",
  py: "code",
  rb: "code",
  go: "code",
  rs: "code",
  java: "code",
  kt: "code",
  swift: "code",
  css: "code",
  html: "code",
  xml: "code",
  yml: "code",
  yaml: "code",
  sh: "code",
  conf: "code",
  log: "text",
};

export function getExtension(name: string): string {
  const i = name.lastIndexOf(".");
  if (i <= 0 || i === name.length - 1) return "";
  return name.slice(i + 1).toLowerCase();
}

export function inferFileKind(name: string, mime?: string): FileKind {
  if (mime && MIME_TO_KIND[mime]) return MIME_TO_KIND[mime];
  if (mime?.startsWith("image/")) return "image";
  if (mime?.startsWith("video/")) return "video";
  if (mime?.startsWith("audio/")) return "audio";
  if (mime?.startsWith("text/")) return "text";
  const ext = getExtension(name);
  return EXT_TO_KIND[ext] ?? "other";
}

// ─── hierarchy helpers ─────────────────────────────────────────
export function buildBreadcrumb(
  itemId: string | null,
  items: DriveItem[],
): DriveItem[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const path: DriveItem[] = [];
  let current = itemId ? byId.get(itemId) : undefined;
  let safety = 0;
  while (current && safety < 64) {
    path.unshift(current);
    if (current.parentId == null) break;
    current = byId.get(current.parentId);
    safety++;
  }
  return path;
}

export function isDescendant(
  candidateId: string,
  ofItemId: string,
  items: DriveItem[],
): boolean {
  // returns true if candidateId === ofItemId OR lives anywhere beneath it
  if (candidateId === ofItemId) return true;
  const byParent = new Map<string, string[]>();
  items.forEach((i) => {
    if (i.parentId) {
      const arr = byParent.get(i.parentId) ?? [];
      arr.push(i.id);
      byParent.set(i.parentId, arr);
    }
  });
  const stack = [ofItemId];
  let safety = 0;
  while (stack.length && safety < 1000) {
    const id = stack.pop()!;
    if (id === candidateId) return true;
    const kids = byParent.get(id);
    if (kids) stack.push(...kids);
    safety++;
  }
  return false;
}

// ─── folder color classes ─────────────────────────────────────
export const FOLDER_COLORS: Record<FolderColor, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  rose: "text-rose-400",
  violet: "text-violet-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  cyan: "text-cyan-400",
  orange: "text-orange-400",
  gray: "text-gray-400",
};

// ─── name validation ──────────────────────────────────────────
export function validateName(
  name: string,
  existing: DriveItem[],
  parentId: string | null,
  ignoreId?: string,
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name cannot be empty";
  if (trimmed.length > 120) return "Name is too long (max 120 chars)";
  if (/[\\/:*?"<>|]/.test(trimmed)) return 'Name cannot contain \\ / : * ? " < > |';
  const conflict = existing.find(
    (i) =>
      i.parentId === parentId &&
      i.id !== ignoreId &&
      i.trashedAt === null &&
      i.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (conflict) return `An item named "${trimmed}" already exists here`;
  return null;
}
