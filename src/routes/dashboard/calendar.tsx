import { createFileRoute } from "@tanstack/react-router";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarApp,
});

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const events = [
  { id: 1, title: "Team Standup", day: 16, time: "9:00 AM", duration: "30 min", type: "meeting", attendees: 8 },
  { id: 2, title: "Client Call - TechNova", day: 16, time: "11:00 AM", duration: "1 hr", type: "client", attendees: 4 },
  { id: 3, title: "Lunch with Investors", day: 17, time: "12:30 PM", duration: "1.5 hr", type: "client", attendees: 3 },
  { id: 4, title: "Design Review", day: 18, time: "2:00 PM", duration: "1 hr", type: "meeting", attendees: 6 },
  { id: 5, title: "Q3 Planning Session", day: 19, time: "10:00 AM", duration: "2 hr", type: "meeting", attendees: 12 },
  { id: 6, title: "1:1 with Alice", day: 20, time: "3:00 PM", duration: "30 min", type: "one-on-one", attendees: 2 },
];

const today = 16;

const getEventsForDay = (day: number) => events.filter((e) => e.day === day);

const typeColors: Record<string, string> = {
  meeting: "border-l-blue-500 bg-blue-500/5",
  client: "border-l-emerald-500 bg-emerald-500/5",
  "one-on-one": "border-l-violet-500 bg-violet-500/5",
};

function CalendarApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanCalendar</h1>
            <p className="mt-1 text-sm text-blueprint-muted">Scheduling, meetings, and team events.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-brass/10 px-4 py-2.5 text-sm text-blueprint-brass transition hover:bg-blueprint-brass/20">
          <Plus size={16} />
          New Event
        </button>
      </div>

      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        {/* Month header */}
        <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <ChevronLeft size={18} className="cursor-pointer text-blueprint-muted hover:text-blueprint-paper" />
            <h2 className="font-mono text-xl font-bold text-blueprint-paper">July 2026</h2>
            <ChevronRight size={18} className="cursor-pointer text-blueprint-muted hover:text-blueprint-paper" />
          </div>
          <div className="flex gap-2">
            <button className="border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted hover:text-blueprint-paper">Today</button>
            <button className="border border-blueprint-grid/20 bg-blueprint-brass/10 px-3 py-1.5 text-xs text-blueprint-brass">Month</button>
            <button className="border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted hover:text-blueprint-paper">Week</button>
            <button className="border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted hover:text-blueprint-paper">Day</button>
          </div>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-blueprint-grid/20">
          {weekDays.map((d) => (
            <div key={d} className="px-3 py-2 text-center text-xs uppercase tracking-[0.3em] text-blueprint-muted">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day === today;
            return (
              <div key={day} className={`min-h-[100px] border-b border-r border-blueprint-grid/10 p-2 transition hover:bg-blueprint-bg/30 ${isToday ? "bg-blueprint-brass/5" : ""}`}>
                <div className={`mb-1 flex h-6 w-6 items-center justify-center text-xs ${isToday ? "rounded-full bg-blueprint-brass text-blueprint-bg font-bold" : "text-blueprint-muted"}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className={`border-l-2 px-1.5 py-0.5 text-[10px] ${typeColors[e.type]}`}>
                      <p className="truncate font-medium text-blueprint-paper">{e.title}</p>
                      <p className="text-blueprint-muted">{e.time}</p>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-blueprint-brass">+{dayEvents.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-6 border border-blueprint-grid/20 bg-blueprint-surface p-5">
        <p className="mb-4 text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Today's Events</p>
        <div className="space-y-3">
          {events.filter((e) => e.day === today).map((e) => (
            <div key={e.id} className="flex items-center gap-4 border-b border-blueprint-grid/10 pb-3 last:border-0">
              <div className={`h-8 w-1 rounded-full ${e.type === "meeting" ? "bg-blue-500" : e.type === "client" ? "bg-emerald-500" : "bg-violet-500"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-blueprint-paper">{e.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-blueprint-muted">
                  <span className="flex items-center gap-1"><Clock size={11} />{e.time} ({e.duration})</span>
                  <span className="flex items-center gap-1"><Users size={11} />{e.attendees} attendees</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}