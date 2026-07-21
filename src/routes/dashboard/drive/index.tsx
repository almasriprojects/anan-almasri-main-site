// ─── /dashboard/drive — Browse (My Drive root) ────────────────
// Lists the top-level items:  root folders + root files.

import { createFileRoute } from "@tanstack/react-router";
import { HardDrive, Inbox } from "lucide-react";
import { useDrive } from "../../../lib/drive/store";
import ItemListView from "../../../components/drive/ItemListView";
import type { DriveItem } from "../../../lib/drive/types";
import { formatBytes } from "../../../lib/drive/utils";
import StorageBar from "../../../components/drive/StorageBar";

export const Route = createFileRoute("/dashboard/drive/")({
  component: DriveBrowse,
});

function DriveBrowse() {
  const drive = useDrive();

  // Stats for the header
  const live = drive.items.filter((i) => i.trashedAt === null);
  const totalFolders = live.filter((i) => i.kind === "folder").length;
  const totalFiles = live.filter((i) => i.kind === "file").length;
  const totalSize = live
    .filter((i) => i.kind === "file")
    .reduce((s, i) => s + i.size, 0);

  return (
    <ItemListView
      title="My Drive"
      description={`${totalFolders} folder${totalFolders !== 1 ? "s" : ""} · ${totalFiles} file${totalFiles !== 1 ? "s" : ""} · ${formatBytes(totalSize)}`}
      emptyTitle="No items yet"
      emptyDescription="Drag and drop files here, click the Upload button, or use the + Folder / + File actions to get started."
      emptyIcon={Inbox}
      showNew
      filter={(all) => all.filter((i) => i.trashedAt === null && i.parentId === null)}
      contentBelow={
        <div className="border-b border-blueprint-grid/15 bg-blueprint-surface/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <HardDrive size={11} className="text-blueprint-brass" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted">
              Local Storage
            </span>
          </div>
          <div className="mt-2">
            <StorageBar
              usedBytes={totalSize}
              quotaBytes={500 * 1024 * 1024} // demo: 500 MB
              percent={(totalSize / (500 * 1024 * 1024)) * 100}
            />
          </div>
        </div>
      }
    />
  );
}
