import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StickyNote, Plus, Search, Trash2, Edit3, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/notes")({
  component: NotesApp,
});

const initialNotes = [
  { id: 1, title: "Q3 Strategy Meeting Notes", content: "Key discussion points:\n\n1. Revenue target: $3.5M for Q3\n2. New market expansion - EU region\n3. Hiring plan: 15 new positions\n4. Product roadmap review\n\nAction items: Alice to finalize budget, Bob to research partners.", updated: "2 hours ago", color: "border-l-amber-500" },
  { id: 2, title: "CRM Pipeline Ideas", content: "Ideas to improve sales pipeline:\n\n- Automate lead scoring with AI\n- Add chatbot for initial qualification\n- Integrate with LinkedIn API\n- Create automated follow-up sequences\n\nPriority: High impact, medium effort.", updated: "Yesterday", color: "border-l-blue-500" },
  { id: 3, title: "Employee Onboarding Checklist", content: "New hire checklist:\n\n☐ IT equipment setup\n☐ Email & Slack accounts\n☐ HR documentation\n☐ Team introduction meetings\n☐ 30/60/90 day plan\n☐ Training schedule", updated: "2 days ago", color: "border-l-violet-500" },
  { id: 4, title: "Sprint Retrospective Notes", content: "What went well:\n- On-time delivery of API integration\n- Strong collaboration across teams\n\nWhat to improve:\n- Better estimation for complex tasks\n- More frequent code reviews\n\nActions: Implement story point refinement sessions.", updated: "3 days ago", color: "border-l-emerald-500" },
  { id: 5, title: "Meeting with Investors (Horizon VC)", content: "Attendees: David Kim, Sarah Chen, Team\n\nAgenda:\n1. Series A pitch deck review\n2. Financial projections\n3. Market opportunity\n4. Team background\n\nNext steps: Send follow-up materials by Friday.", updated: "4 days ago", color: "border-l-rose-500" },
];

function NotesApp() {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState(initialNotes[0]);
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-7xl flex-col px-6 py-6 lg:px-10">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <StickyNote size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanNotes</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Collaborative notes and documentation.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-72 flex-col border border-blueprint-grid/20 bg-blueprint-surface">
          <div className="flex items-center justify-between border-b border-blueprint-grid/20 p-3">
            <div className="flex items-center gap-2 border border-blueprint-grid/20 px-3 py-1.5">
              <Search size={13} className="text-blueprint-muted" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="w-28 bg-transparent text-xs text-blueprint-paper outline-none placeholder:text-blueprint-muted/50" />
            </div>
            <button className="flex items-center gap-1 border border-blueprint-grid/20 bg-blueprint-brass/10 px-2.5 py-1.5 text-xs text-blueprint-brass hover:bg-blueprint-brass/20">
              <Plus size={12} />
              New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`cursor-pointer border-b border-blueprint-grid/10 p-4 transition hover:bg-blueprint-bg/50 ${selectedNote.id === note.id ? "bg-blueprint-bg/70 border-l-2 border-l-blueprint-brass" : note.color}`}
              >
                <p className="truncate text-sm font-medium text-blueprint-paper">{note.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-blueprint-muted">{note.content}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blueprint-muted/60">
                  <Clock size={10} />
                  {note.updated}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex flex-1 flex-col border border-blueprint-grid/20 bg-blueprint-surface">
          <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-3">
            <h2 className="font-mono text-lg font-bold text-blueprint-paper">{selectedNote.title}</h2>
            <div className="flex gap-2">
              <button className="border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted hover:text-blueprint-paper"><Edit3 size={12} /> Edit</button>
              <button className="border border-blueprint-grid/20 px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="whitespace-pre-wrap text-sm leading-7 text-blueprint-muted">{selectedNote.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}