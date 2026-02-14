"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

type Intent = "create_reminder" | "create_contact" | "log_interaction";

type LinkAction = { type: "link"; label: string; href: string };
type IntentAction = { type: "intent"; label: string; intent: Intent };
type DismissAction = { type: "dismiss"; label: string };

type Action = LinkAction | IntentAction | DismissAction;

type Message = {
  role: "assistant" | "user";
  content: string;
  actions?: Action[];
};

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi Alejandro 👋 I'm your assistant. Want help planning your week?",
      actions: [
        { type: "intent", label: "Create reminder", intent: "create_reminder" },
        { type: "intent", label: "Add contact", intent: "create_contact" },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message ?? "Got it.",
          actions: (data.actions ?? []) as Action[],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops 😅 something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleIntent(intent: Intent) {
    if (intent === "create_reminder") window.location.href = "/reminders/new";
    if (intent === "create_contact") window.location.href = "/contacts/new";
    if (intent === "log_interaction") window.location.href = "/interactions/new";
  }

  function dismissAssistantMessage(index: number) {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-3xl border-2 border-neutral-900 bg-white shadow-[0_12px_0_rgba(0,0,0,0.15)] p-4 flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
                msg.role === "assistant"
                  ? "bg-[#E8F0FE] text-neutral-900"
                  : "bg-[#2D2A7A] text-white ml-auto"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "assistant" && msg.actions?.length ? (
              <div className="flex flex-wrap gap-2">
                {msg.actions.map((action, i) => {
                  if (action.type === "link") {
                    return (
                      <Link
                        key={i}
                        href={action.href}
                        className="text-xs rounded-xl border-2 border-neutral-900 bg-white px-3 py-1 shadow hover:-translate-y-[1px] transition"
                      >
                        {action.label}
                      </Link>
                    );
                  }

                  if (action.type === "intent") {
                    return (
                      <button
                        key={i}
                        onClick={() => handleIntent(action.intent)}
                        className="text-xs rounded-xl border-2 border-neutral-900 bg-white px-3 py-1 shadow hover:-translate-y-[1px] transition"
                      >
                        {action.label}
                      </button>
                    );
                  }

                  // dismiss
                  return (
                    <button
                      key={i}
                      onClick={() => dismissAssistantMessage(index)}
                      className="text-xs rounded-xl border-2 border-neutral-900 bg-white px-3 py-1 shadow"
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-neutral-500 animate-pulse">
            Assistant is thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          className="flex-1 rounded-xl border-2 border-neutral-900 px-3 py-2 text-sm focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#2D2A7A] text-white px-4 flex items-center justify-center hover:bg-[#231f63] disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
