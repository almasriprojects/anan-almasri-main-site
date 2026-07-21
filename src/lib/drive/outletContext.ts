// ─── Shared outlet context for drive pages ────────────────────
// Child pages (Browse, Recent, Folder, etc.) consume this context
// to access the shared selection/CRUD state of the parent layout.

import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { DriveItem } from "./types";

export interface DriveOutletContext {
  currentFolder: DriveItem | null;
  selectedIds: Set<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
  activeId: string | null;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  renamingId: string | null;
  setRenamingId: Dispatch<SetStateAction<string | null>>;
  onItemClick: (id: string, e: React.MouseEvent) => void;
  onItemDoubleClick: (id: string, e: React.MouseEvent) => void;
  onItemContextMenu: (id: string, e: React.MouseEvent) => void;
  onRenameCommit: (id: string, name: string) => void;
  onRenameCancel: () => void;
  onItemDragStart: (id: string, e: React.DragEvent) => void;
  onItemDragEnd: () => void;
  onToggleStar: (id: string) => void;
  onToggleShare: (id: string) => void;
  onTrash: (ids: string[]) => void;
  onRestore: (ids: string[]) => void;
  onDeleteForever: (ids: string[]) => void;
  onMore: (id: string, e: React.MouseEvent) => void;
  onNewFolder: () => void;
  onNewFile: () => void;
}

export const DriveOutletCtx = createContext<DriveOutletContext | null>(null);

export function useDriveOutlet(): DriveOutletContext {
  const ctx = useContext(DriveOutletCtx);
  if (!ctx) throw new Error("useDriveOutlet must be used inside /dashboard/drive layout");
  return ctx;
}
