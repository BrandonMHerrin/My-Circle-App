"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, Sparkles, ExternalLink, X } from "lucide-react";
import { usePathname } from 'next/navigation'
import { useAuth } from "@/app/providers/session-provider";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface AssistantChatProps {
  onClose?: () => void;
}

type Intent = "create_reminder" | "create_contact" | "log_interaction";

type LinkAction = { type: "link"; label: string; href: string };
type IntentAction = { type: "intent"; label: string; intent: Intent };
type DismissAction = { type: "dismiss"; label: string };

type Action = LinkAction | IntentAction | DismissAction;

type Message = {
  id: string;
  role: "assistant" | "user" | "tool";
  content: string;
  actions?: Action[];
  toolCalls?: any[];
  toolResults?: any[];
};

export default function AssistantChat({ onClose }: AssistantChatProps) {
  const { user } = useAuth();
  const userName = user?.user_metadata.full_name || "there";
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pageContext: Record<string, string> = {
    "/dashboard": "You're on your dashboard.",
    "/reminders": "Want to create a reminder?",
    "/contacts": "Managing your contacts today?",
    "/interactions": "What activity do you want to log?"
  };

  useEffect(() => {
    if (messages.length === 0) {
      const contextMessage = pageContext[pathname] ?? "";
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi ${userName} 👋 I'm your assistant. ${contextMessage}`,
        },
      ]);
    }
  }, [userName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim()
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "" }
    ]);

    try {
      // Map history correctly for AI SDK multi-turn following the sequence:
      // Assistant (Calls) -> Tool (Results) -> Assistant (Text)
      // We use the "parts" based format for maximum compatibility with SDK v6 validation
      const history = currentMessages.flatMap((m) => {
        if (m.role === "user") return [{ role: "user", content: m.content }];
        if (m.role === "assistant") {
          const result: any[] = [];

          // Only include tool calls that have matching results to avoid "Missing Tool Results" error
          const validToolCalls = (m.toolCalls || []).filter(tc =>
            (m.toolResults || []).some(tr => tr.toolCallId === tc.toolCallId)
          );

          if (validToolCalls.length > 0) {
            // 1. Assistant message with tool calls
            result.push({
              role: "assistant",
              content: [
                { type: "text", text: "" },
                ...validToolCalls.map(tc => ({
                  type: "tool-call",
                  toolCallId: tc.toolCallId,
                  toolName: tc.toolName,
                  input: tc.input || tc.args || {}
                }))
              ]
            });

            // 2. Tool result message
            result.push({
              role: "tool",
              content: (m.toolResults || [])
                .filter(tr => validToolCalls.some(tc => tc.toolCallId === tr.toolCallId))
                .map(tr => ({
                  type: "tool-result",
                  toolCallId: tr.toolCallId,
                  toolName: tr.toolName,
                  output: {
                    type: "json",
                    value: tr.output || tr.result || {}
                  }
                }))
            });

            // 3. Final assistant text (if any)
            if (m.content) {
              result.push({ role: "assistant", content: m.content });
            }
          } else {
            // Simple assistant message with only text (or orphaned calls that we skip)
            result.push({ role: "assistant", content: m.content || "" });
          }

          return result;
        }
        return [];
      });

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history,
          context: { currentPage: pathname }
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const part = JSON.parse(line);

            if (part.type === "text-delta" && part.text) {
              assistantContent += part.text;
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
              );
            } else if (part.type === "tool-call") {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMsgId ? {
                  ...m,
                  toolCalls: [...(m.toolCalls || []), part]
                } : m)
              );
            } else if (part.type === "tool-result") {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMsgId ? {
                  ...m,
                  toolResults: [...(m.toolResults || []), part]
                } : m)
              );
            } else if (part.type === "action") {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMsgId ? {
                  ...m,
                  actions: [...(m.actions || []), part.action]
                } : m)
              );
            }
          } catch (e) {
            console.error("Failed to parse stream part", e);
          }
        }
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          content: "Oops 😅 something went wrong."
        }
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

  return (
    <div className="rounded-3xl border-2 border-neutral-900 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.1)] p-4 flex flex-col h-[500px] w-[380px] transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2D2A7A] flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Online</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "assistant"
                  ? "bg-[#F3F4F6] text-neutral-800 border border-neutral-200"
                  : "bg-[#2D2A7A] text-white"
                  }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-[#2D2A7A]">{children}</strong>,
                    }}
                  >
                    {msg.content || (loading ? "..." : "")}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>

              {msg.role === "assistant" && msg.actions?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      {action.type === "link" ? (
                        <Link
                          href={action.href}
                          className="flex items-center gap-1.5 text-xs rounded-lg border border-neutral-900 bg-white px-3 py-1.5 font-bold shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                          {action.label}
                          <ExternalLink size={12} />
                        </Link>
                      ) : (
                        <button
                          onClick={() => action.type === "intent" ? handleIntent(action.intent) : null}
                          className="flex items-center gap-1.5 text-xs rounded-lg border border-neutral-900 bg-white px-3 py-1.5 font-bold shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                          {action.label}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium italic ml-2">
            <Sparkles size={10} className="animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-4"
      >
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you today?"
            className="w-full rounded-2xl border-2 border-neutral-900 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2A7A]/20 transition-all placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1.5 h-10 w-10 rounded-xl bg-[#2D2A7A] text-white flex items-center justify-center hover:bg-[#231f63] disabled:opacity-40 disabled:grayscale transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
