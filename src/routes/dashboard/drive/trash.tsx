// ─── /dashboard/drive/trash — Trash ───────────────────────────
// Trashed items, with restore + delete-forever actions.
// The + New actions are hidden here (you can't create new in trash).

import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import ItemListView from "../../../components/drive/ItemListView";
import { useDrive } from "../../../lib/drive/store";

export const Route = createFileRoute("/dashboard/drive/trash")({
  component: DriveTrash,
});

function DriveTrash() {
  const drive = useDrive();
  const trashed = drive.items.filter((i) => i.trashedAt !== null);

  return (
    <ItemListView
      title="Trash"
      description={`${trashed.length} item${trashed.length !== 1 ? "s" : ""} · Restore to bring them back, or delete forever.`}
      emptyTitle="Trash is empty"
      emptyDescription="Items you delete will appear here. You can restore them for 30 days."
      emptyIcon={Trash2}
      showNew={false}
      filter={() => trashed}
    />
  );
}
