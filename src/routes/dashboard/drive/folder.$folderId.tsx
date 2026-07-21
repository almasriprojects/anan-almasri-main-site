// ─── /dashboard/drive/folder/$folderId — Folder detail ────────
// Lists the children of a single folder.

import { createFileRoute, useParams, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Folder, Inbox, ArrowLeft } from "lucide-react";
import ItemListView from "../../../components/drive/ItemListView";
import { useDrive } from "../../../lib/drive/store";

export const Route = createFileRoute("/dashboard/drive/folder/$folderId")({
  component: DriveFolder,
});

function DriveFolder() {
  const { folderId } = useParams({ from: "/dashboard/drive/folder/$folderId" });
  const drive = useDrive();
  const navigate = useNavigate();

  const folder = drive.items.find((i) => i.id === folderId);

  // If the folder doesn't exist (e.g. after trashing or hard refresh)
  // send the user back to the drive root
  useEffect(() => {
    if (drive.ready && !folder) {
      navigate({ to: "/dashboard/drive" });
    }
  }, [drive.ready, folder, navigate]);

  if (!folder) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-blueprint-muted">
        <Inbox size={28} />
        <p className="text-xs">Folder not found.</p>
        <Link
          to="/dashboard/drive"
          className="flex items-center gap-1 text-[11px] text-blueprint-brass transition hover:text-blueprint-paper"
        >
          <ArrowLeft size={11} />
          Back to My Drive
        </Link>
      </div>
    );
  }

  // If it's a trashed folder, redirect to trash
  if (folder.trashedAt !== null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-blueprint-muted">
        <Inbox size={28} />
        <p className="text-xs">This folder is in the Trash.</p>
        <Link
          to="/dashboard/drive/trash"
          className="flex items-center gap-1 text-[11px] text-blueprint-brass transition hover:text-blueprint-paper"
        >
          <ArrowLeft size={11} />
          Open Trash
        </Link>
      </div>
    );
  }

  const childCount = drive.items.filter(
    (i) => i.parentId === folder.id && i.trashedAt === null,
  ).length;

  return (
    <ItemListView
      title={folder.name}
      description={`${childCount} item${childCount !== 1 ? "s" : ""} inside this folder`}
      emptyTitle="Empty folder"
      emptyDescription="Drag and drop files here, or use the Folder / File / Upload actions above to add content."
      emptyIcon={Folder}
      filter={(all) =>
        all.filter((i) => i.parentId === folder.id && i.trashedAt === null)
      }
    />
  );
}
