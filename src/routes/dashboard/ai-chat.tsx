import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, RefreshCw, Info } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai-chat")({
  component: AIChatApp,
});

const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm **AnanAI**, your enterprise AI assistant. I can help you with:\n\n• 📊 **Analytics** — Query business data & generate reports\n• 📝 **Document Analysis** — Summarize contracts, reports & files\n• 💡 **Business Insights** — Get recommendations on operations, sales, HR\n• 🔍 **Search** — Find information across all AnanOS apps\n\nHow can I help you today?",
  },
];

const suggestions = [
  "What's our revenue trend this quarter?",
  "Summarize the employee handbook",
  "Which leads are hot in the CRM?",
  "Show me project status overview",
  "What inventory items are low in stock?",
];

function AIChatApp() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "revenue": "Based on the Analytics data, your **total revenue this quarter is $2.4M**, up 18.2% from last quarter. The top-performing apps are CRM (+12.3%) and Projects (+22.1%).",
        "employee handbook": "I've found the **Employee Handbook 2026** in AnanDrive. Key sections include:\n\n• **Code of Conduct** — Professional standards & ethics\n• **Benefits** — Health, 401k, PTO policy\n• **Remote Work** — Hybrid schedule guidelines\n• **Performance Reviews** — Bi-annual review cycle\n\nThe full PDF is available in the HR Documents folder.",
        "hot": "I found **2 hot leads** in your CRM pipeline:\n\n1. **Sarah Johnson** — TechNova Inc., $120K deal\n2. **David Kim** — Horizon Ventures, $250K deal\n\nBoth are ready for follow-up. Would you like me to draft an email template?",
        "project status": "Here's the current project snapshot:\n\n• **Website Redesign** — 75% (On Track)\n• **Mobile App v2** — 45% (At Risk ⚠️)\n• **API Integration** — 90% (On Track)\n• **Data Migration** — 30% (Behind ⚠️)\n• **Q3 Marketing Campaign** — 60% (On Track)\n\nWould you like a detailed breakdown of any project?",
        "low in stock": "Critical inventory alerts:\n\n• **Electronic Controller v3** — 5 units (Min: 20) ⚠️ Critical\n• **Hydraulic Fluid 5Gal** — 28 pails (Min: 30) Low Stock\n\nI recommend placing orders for both items immediately.",
      };

      let response = "I'll look into that for you. Based on my analysis:\n\n• I can see relevant data across AnanOS apps\n• Would you like me to check a specific app?\n• Or you can ask me to perform a deeper analysis.";

      for (const [key, val] of Object.entries(responses)) {
        if (text.toLowerCase().includes(key)) {
          response = val;
          break;
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1500);
  };

  const handleSuggestion = (s: string) => {
    handleSend(s);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-5xl flex-col px-6 py-6 lg:px-10">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanAI</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Enterprise AI assistant powered by all your business data.</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-6 ${
                msg.role === "user"
                  ? "bg-blueprint-brass/15 border border-blueprint-brass/30 text-blueprint-paper"
                  : "border border-blueprint-grid/20 bg-blueprint-surface text-blueprint-muted"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong class='text-blueprint-paper'>$1</strong>") }}
            />
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface px-5 py-3">
              <RefreshCw size={14} className="animate-spin text-blueprint-brass" />
              <span className="text-sm text-blueprint-muted">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !loading && (
        <div className="my-4">
          <p className="mb-2 text-xs uppercase tracking-[0.34em] text-blueprint-brass/60">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-blueprint-grid/20 bg-blueprint-surface/70 px-4 py-2 text-xs text-blueprint-muted transition hover:border-blueprint-brass/40 hover:text-blueprint-paper"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="mt-4 border border-blueprint-grid/20 bg-blueprint-surface p-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask AnanAI anything about your business..."
            className="flex-1 bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/50"
            disabled={loading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blueprint-brass/20 text-blueprint-brass transition hover:bg-blueprint-brass/30 disabled:opacity-30"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-blueprint-muted/50">
          <Info size={10} />
          AnanAI has access to CRM, Operations, Accounting, HRM, Legal, Inventory, Projects & Analytics data
        </p>
      </div>
    </div>
  );
}