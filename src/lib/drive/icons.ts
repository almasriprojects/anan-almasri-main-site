// ─── Maps a FileKind → lucide icon + Tailwind color ───────────

import {
  Archive,
  FileText,
  FileSpreadsheet,
  FileCode,
  File as FileIcon,
  FileImage,
  FileVideo,
  FileMusic,
  FileType,
  Folder,
} from "lucide-react";
import type { FileKind } from "./types";
import type { LucideIcon } from "lucide-react";

export interface KindMeta {
  Icon: LucideIcon;
  color: string; // tailwind text color
  label: string;
}

export const KIND_META: Record<FileKind, KindMeta> = {
  folder: { Icon: Folder, color: "text-blueprint-brass", label: "Folder" },
  document: { Icon: FileText, color: "text-blue-400", label: "Document" },
  pdf: { Icon: FileText, color: "text-rose-400", label: "PDF" },
  spreadsheet: { Icon: FileSpreadsheet, color: "text-emerald-400", label: "Spreadsheet" },
  presentation: { Icon: FileType, color: "text-amber-400", label: "Presentation" },
  image: { Icon: FileImage, color: "text-violet-400", label: "Image" },
  video: { Icon: FileVideo, color: "text-fuchsia-400", label: "Video" },
  audio: { Icon: FileMusic, color: "text-pink-400", label: "Audio" },
  archive: { Icon: Archive, color: "text-orange-400", label: "Archive" },
  code: { Icon: FileCode, color: "text-cyan-400", label: "Code" },
  text: { Icon: FileText, color: "text-blueprint-paper/70", label: "Text" },
  other: { Icon: FileIcon, color: "text-blueprint-muted", label: "File" },
};
