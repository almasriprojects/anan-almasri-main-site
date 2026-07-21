// ─── /dashboard/drive/upload — Upload Center ───────────────────
// Drag-and-drop upload center.  Also lists recent uploads.

import { createFileRoute } from "@tanstack/react-router";
import { FileUp, Clock } from "lucide-react";
import UploadDropzone from "../../../components/drive/UploadDropzone";
import ActivityStrip from "../../../components/drive/ActivityStrip";
import { useDrive } from "../../../lib/drive/store";
import { formatBytes } from "../../../lib/drive/utils";
import type { ActivityEvent } from "../../../lib/drive/types";

export const Route = createFileRoute("/dashboard/drive/upload")({
  component: DriveUpload,
});

function DriveUpload() {
  const drive = useDrive();

  const recentUploads = drive.activity.filter((a) => a.action === "uploaded").slice(0, 12);
  const totalUploaded = drive.items
    .filter((i) => i.trashedAt === null && i.kind === "file")
    .reduce((s, i) => s + i.size, 0);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 lg:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
          <FileUp size={18} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">Drive</p>
          <h1 className="font-mono text-lg font-semibold text-blueprint-paper">Upload Center</h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Dropzone + stats */}
        <div className="space-y-4 lg:col-span-2">
          <UploadDropzone
            onFiles={(files) => drive.importFiles(files, null)}
            hint="Drop files here to upload to My Drive"
          />

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Total files" value={drive.items.filter((i) => i.kind === "file" && i.trashedAt === null).length.toString()} />
            <Stat label="Total size" value={formatBytes(totalUploaded)} />
            <Stat label="Recent uploads" value={recentUploads.length.toString()} />
          </div>
        </div>

        {/* Recent activity */}
        <div className="border border-blueprint-grid/20 bg-blueprint-surface/40 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock size={11} className="text-blueprint-brass" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted">
              Recent uploads
            </p>
          </div>
          <ActivityStrip events={recentUploads as ActivityEvent[]} max={20} emptyMessage="No uploads yet" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-blueprint-grid/20 bg-blueprint-surface/40 p-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">{label}</p>
      <p className="mt-1.5 font-mono text-base font-bold text-blueprint-paper">{value}</p>
    </div>
  );
}
