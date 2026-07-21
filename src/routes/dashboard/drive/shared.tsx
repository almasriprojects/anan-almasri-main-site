// ─── /dashboard/drive/shared — Shared ─────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { Share2, Inbox } from "lucide-react";
import ItemListView from "../../../components/drive/ItemListView";
import { useDrive } from "../../../lib/drive/store";

export const Route = createFileRoute("/dashboard/drive/shared")({
  component: DriveShared,
});

function DriveShared() {
  const drive = useDrive();
  const shared = drive.items.filter((i) => i.shared && i.trashedAt === null);

  return (
    <ItemListView
      title="Shared"
      description="Items you've shared with the team. Right-click any item to manage sharing."
      emptyTitle="Nothing shared"
      emptyDescription="Select an item and toggle the share icon, or right-click → Share, to add it here."
      emptyIcon={Share2}
      filter={() => shared}
    />
  );
}
