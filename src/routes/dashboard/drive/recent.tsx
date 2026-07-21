// ─── /dashboard/drive/recent — Recents ────────────────────────
// Sorted by updatedAt (desc), all items anywhere in the tree.

import { createFileRoute } from "@tanstack/react-router";
import { Clock, Inbox } from "lucide-react";
import ItemListView from "../../../components/drive/ItemListView";
import { useDrive } from "../../../lib/drive/store";

export const Route = createFileRoute("/dashboard/drive/recent")({
  component: DriveRecent,
});

function DriveRecent() {
  const drive = useDrive();
  const recent = drive.items
    .filter((i) => i.trashedAt === null)
    .filter((i) => Date.now() - i.updatedAt < 14 * 24 * 60 * 60 * 1000) // last 14 days
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <ItemListView
      title="Recents"
      description="Items you've created, modified, or uploaded in the last 14 days."
      emptyTitle="Nothing recent"
      emptyDescription="As you create and edit files, they'll show up here automatically."
      emptyIcon={Clock}
      filter={() => recent}
    />
  );
}
