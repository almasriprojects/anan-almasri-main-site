// ─── /dashboard/drive/starred — Starred ───────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { Star, Inbox } from "lucide-react";
import ItemListView from "../../../components/drive/ItemListView";
import { useDrive } from "../../../lib/drive/store";

export const Route = createFileRoute("/dashboard/drive/starred")({
  component: DriveStarred,
});

function DriveStarred() {
  const drive = useDrive();
  const starred = drive.items.filter((i) => i.starred && i.trashedAt === null);

  return (
    <ItemListView
      title="Starred"
      description="Your favorite items. Click the star icon on any item to add or remove it from here."
      emptyTitle="No starred items"
      emptyDescription="Hover any item and click the star icon to keep it close at hand."
      emptyIcon={Star}
      filter={() => starred}
    />
  );
}
