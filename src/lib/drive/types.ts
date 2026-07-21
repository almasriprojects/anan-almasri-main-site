// ─── Drive data model ──────────────────────────────────────────
// All items live in a single flat collection; folders are items
// whose `kind === "folder"` and items reference their parent by id.

export type FileKind =
  | "folder"
  | "document"
  | "pdf"
  | "spreadsheet"
  | "presentation"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "text"
  | "other";

export type ItemKind = "folder" | "file";

export interface DriveItem {
  id: string;
  parentId: string | null; // null = root level
  name: string;
  kind: ItemKind;
  fileKind?: FileKind; // only for files
  /** bytes */
  size: number;
  mimeType?: string;
  extension?: string;
  ownerId: string;
  ownerName: string;
  createdAt: number;
  updatedAt: number;
  starred: boolean;
  shared: boolean;
  trashedAt: number | null;
  tags: string[];
  /** folder color tint */
  color?: FolderColor;
  /** text / markdown body for text-like files */
  content?: string;
  /** object URL for uploaded image / blob preview (not persisted) */
  thumbnailUrl?: string;
}

export type FolderColor =
  | "blue"
  | "green"
  | "rose"
  | "violet"
  | "purple"
  | "amber"
  | "cyan"
  | "orange"
  | "gray";

export type ViewMode = "grid" | "list";
export type SortKey = "name" | "size" | "kind" | "modified";

export interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

export interface ActivityEvent {
  id: string;
  itemId: string;
  itemName: string;
  action:
    | "created"
    | "uploaded"
    | "renamed"
    | "moved"
    | "starred"
    | "unstarred"
    | "shared"
    | "unshared"
    | "trashed"
    | "restored"
    | "deleted"
    | "duplicated";
  at: number;
  detail?: string;
}

// ─── Helpers used by the store / components ────────────────────
export const ROOT_ID: null = null;
