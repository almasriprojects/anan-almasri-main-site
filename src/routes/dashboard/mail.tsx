import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Inbox, Send, Star, Archive, Trash2, Search, Paperclip, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/mail")({
  component: MailApp,
});

const inboxEmails = [
  { id: 1, from: "Sarah Johnson", email: "sarah@technova.com", subject: "Q3 Partnership Proposal", preview: "Hi team, I've attached the Q3 partnership proposal for your review...", date: "10:32 AM", starred: true, unread: true, hasAttachments: true },
  { id: 2, from: "Michael Chen", email: "mchen@quantumdyn.io", subject: "Invoice #INV-2026-0842", preview: "Please find attached the invoice for the completed project milestone...", date: "9:15 AM", starred: false, unread: true, hasAttachments: true },
  { id: 3, from: "HR Department", email: "hr@ananenterprise.com", subject: "Updated Employee Handbook 2026", preview: "The updated employee handbook is now available. Please review the changes...", date: "Yesterday", starred: false, unread: false, hasAttachments: false },
  { id: 4, from: "David Kim", email: "dkim@horizon.vc", subject: "Meeting Follow-up - Investment Round", preview: "Thank you for the meeting yesterday. We're very interested in moving forward...", date: "Yesterday", starred: true, unread: false, hasAttachments: false },
  { id: 5, from: "System Notification", email: "noreply@ananenterprise.com", subject: "Security Alert: New Login Detected", preview: "A new login was detected from Chrome on macOS. If this wasn't you...", date: "2 days ago", starred: false, unread: false, hasAttachments: false },
  { id: 6, from: "Carol Lee", email: "carol@ananenterprise.com", subject: "Marketing Campaign Results - June", preview: "Here's the summary of our June marketing campaigns. Overall performance...", date: "2 days ago", starred: false, unread: true, hasAttachments: true },
  { id: 7, from: "Bob Martinez", email: "bob@ananenterprise.com", subject: "Sales Pipeline Update - Weekly", preview: "Weekly sales pipeline update. We have 3 new hot leads this week...", date: "3 days ago", starred: false, unread: false, hasAttachments: false },
];

const folders = [
  { name: "Inbox", count: 7, icon: Inbox, active: true },
  { name: "Sent", count: 0, icon: Send, active: false },
  { name: "Starred", count: 2, icon: Star, active: false },
  { name: "Archive", count: 0, icon: Archive, active: false },
  { name: "Trash", count: 0, icon: Trash2, active: false },
];

function MailApp() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [activeFolder, setActiveFolder] = useState("Inbox");

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-7xl flex-col px-6 py-6 lg:px-10">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
          <Mail size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanMail</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Enterprise email client with smart folders.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden border border-blueprint-grid/20 bg-blueprint-surface">
        {/* Sidebar */}
        <div className="hidden w-56 border-r border-blueprint-grid/20 p-4 sm:block">
          <button className="mb-6 w-full border border-blueprint-brass/30 bg-blueprint-brass/10 px-4 py-2.5 text-sm font-medium text-blueprint-brass transition hover:bg-blueprint-brass/20">
            Compose
          </button>
          <div className="space-y-1">
            {folders.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.name}
                  onClick={() => setActiveFolder(f.name)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition ${
                    activeFolder === f.name
                      ? "bg-blueprint-brass/10 text-blueprint-paper"
                      : "text-blueprint-muted hover:bg-blueprint-bg/50 hover:text-blueprint-paper"
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{f.name}</span>
                  {f.count > 0 && <span className="rounded-full bg-blueprint-brass/20 px-2 py-0.5 text-[11px] text-blueprint-brass">{f.count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email List */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-blueprint-grid/20 px-5 py-3">
            <div className="flex flex-1 items-center gap-2">
              <Search size={15} className="text-blueprint-muted" />
              <input type="text" placeholder="Search mail..." className="w-full bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/50" />
            </div>
            <div className="flex items-center gap-2 text-blueprint-muted">
              <ChevronLeft size={16} className="cursor-pointer hover:text-blueprint-paper" />
              <span className="text-xs">1-7 of 7</span>
              <ChevronRight size={16} className="cursor-pointer hover:text-blueprint-paper" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {inboxEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`flex cursor-pointer items-start gap-4 border-b border-blueprint-grid/10 px-5 py-4 transition hover:bg-blueprint-bg/50 ${
                  selectedEmail === email.id ? "bg-blueprint-bg/70" : ""
                } ${email.unread ? "border-l-2 border-l-blueprint-brass" : ""}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blueprint-brass/15 text-xs font-bold text-blueprint-brass">
                  {email.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`truncate text-sm ${email.unread ? "font-semibold text-blueprint-paper" : "text-blueprint-muted"}`}>
                      {email.from}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-blueprint-muted">
                      {email.hasAttachments && <Paperclip size={12} />}
                      {email.starred && <Star size={12} className="fill-amber-400 text-amber-400" />}
                      <span>{email.date}</span>
                    </div>
                  </div>
                  <p className={`mt-0.5 truncate text-sm ${email.unread ? "text-blueprint-paper" : "text-blueprint-muted"}`}>
                    {email.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-blueprint-muted/70">{email.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}