import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Plus, Filter, Calendar, User, AlertCircle, Clock, ListTodo } from "lucide-react";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksApp,
});

const initialTasks = [
  { id: 1, title: "Review Q3 partnership proposal from TechNova", project: "CRM", priority: "High", due: "2026-07-18", assignee: "Alice W.", done: false },
  { id: 2, title: "Prepare investor deck for Horizon Ventures", project: "CRM", priority: "High", due: "2026-07-20", assignee: "Bob M.", done: false },
  { id: 3, title: "Approve employee handbook updates", project: "HRM", priority: "Medium", due: "2026-07-22", assignee: "Carol L.", done: false },
  { id: 4, title: "Order replacement parts for CNC Machine #3", project: "Operations", priority: "Critical", due: "2026-07-17", assignee: "Alex M.", done: true },
  { id: 5, title: "Finalize Q3 marketing campaign budget", project: "Projects", priority: "Medium", due: "2026-07-25", assignee: "Eve A.", done: false },
  { id: 6, title: "Renew software licenses - annual", project: "Accounting", priority: "Low", due: "2026-08-01", assignee: "Finance", done: false },
  { id: 7, title: "Complete NDA review - Strategic Partner", project: "Legal", priority: "Medium", due: "2026-07-19", assignee: "Lisa C.", done: true },
  { id: 8, title: "Update server SSL certificates", project: "Operations", priority: "High", due: "2026-07-21", assignee: "Mike R.", done: false },
];

const filters = ["All", "My Tasks", "Assigned", "Overdue", "Completed"];

function TasksApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState("All");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      project: "General",
      priority: "Medium" as const,
      due: "2026-07-30",
      assignee: "Me",
      done: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "Completed") return t.done;
    if (activeFilter === "Overdue") return t.due < "2026-07-17" && !t.done;
    if (activeFilter === "My Tasks") return t.assignee === "Alice W." || t.assignee === "Me";
    return true;
  });

  const priorityColors: Record<string, string> = {
    Critical: "text-red-400",
    High: "text-orange-400",
    Medium: "text-amber-400",
    Low: "text-gray-400",
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <ListTodo size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanTasks</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Task management across all AnanOS apps.</p>
        </div>
      </div>

      {/* Add task */}
      <div className="mb-6 flex items-center gap-3 border border-blueprint-grid/20 bg-blueprint-surface px-5 py-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/50"
        />
        <button onClick={addTask} disabled={!newTaskTitle.trim()} className="flex items-center gap-1.5 border border-blueprint-grid/20 bg-blueprint-brass/10 px-3 py-1.5 text-xs text-blueprint-brass transition hover:bg-blueprint-brass/20 disabled:opacity-30">
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs transition ${
              activeFilter === f
                ? "border-blueprint-brass bg-blueprint-brass/10 text-blueprint-paper"
                : "border-blueprint-grid/20 text-blueprint-muted hover:border-blueprint-grid/40 hover:text-blueprint-paper"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-blueprint-muted">{tasks.filter((t) => !t.done).length} remaining</span>
      </div>

      {/* Task list */}
      <div className="space-y-1">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`flex items-start gap-4 border border-blueprint-grid/10 bg-blueprint-surface px-5 py-3.5 transition hover:border-blueprint-grid/30 ${task.done ? "opacity-50" : ""}`}>
            <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
              {task.done ? <CheckCircle2 size={18} className="text-green-400" /> : <Circle size={18} className="text-blueprint-muted hover:text-blueprint-brass" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`text-sm ${task.done ? "text-blueprint-muted line-through" : "text-blueprint-paper"}`}>{task.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-blueprint-muted">
                <span className="flex items-center gap-1">
                  <Filter size={10} />
                  {task.project}
                </span>
                <span className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                  <AlertCircle size={10} />
                  {task.priority}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {task.due}
                </span>
                <span className="flex items-center gap-1">
                  <User size={10} />
                  {task.assignee}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}