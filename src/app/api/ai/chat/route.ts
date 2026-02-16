import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getTools } from "@/lib/ai/tools";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseRouteClient(req);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      message,
      history = [],
      context = { currentPage: "unknown" },
    } = body;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      tools: getTools(supabase, user.id) as any,
      messages: [...history, { role: "user", content: message }],
      // Use stopWhen as maxSteps equivalent in this SDK version
      stopWhen: (step: any) => step.steps.length >= 5,
      system: `

You are an AI CRM assistant.

Rules:
- NEVER invent or guess data.
- ALWAYS use tools to read or modify database data (especially for counting or listing).
- When asked for relationship advice or activity suggestions with a contact, ALWAYS use get_contact_insights first to understand the context.
- ALWAYS use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ) for dates when calling tools.
- BE PROACTIVE: If a tool has optional filters, use sensible defaults (like fetching all active items) rather than asking the user for clarification.
- BE PROACTIVE: If the user says "yes" or "ok" to a suggestion to create a reminder, ask for ANY missing mandatory details (like a message or date) in a single message, then execute the tool.
- If the user asks for "contacts", "reminders", or "interactions" without specifics, fetch them all first.
- If information is missing, ask a clarification question.
- Keep responses concise.
- After completing an action, confirm clearly what was done.
- Use markdown for lists and bold text.
- The user is currently on the ${context.currentPage} page.

      `,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of result.fullStream) {
            // Send original part as a JSON line
            controller.enqueue(encoder.encode(JSON.stringify(part) + "\n"));

            // If it's a tool-result, generate a UI action
            if (part.type === 'tool-result') {
              const toolResult = (part as any).output;
              const toolName = (part as any).toolName;

              console.log(`[AI TOOL RESULT] ${toolName}:`, JSON.stringify(toolResult, null, 2));

              let action = null;
              if (toolName === "create_contact" && toolResult?.contact?.id) {
                action = { type: "link", label: "View Contact", href: `/contacts/${toolResult.contact.id}/edit` };
              } else if (toolName === "create_reminder" && toolResult?.reminder?.id) {
                action = { type: "link", label: "View Reminder", href: `/reminders/${toolResult.reminder.id}/edit` };
              } else if (toolName === "log_interaction" && toolResult?.interaction?.id) {
                action = { type: "link", label: "View Interaction", href: `/interactions/${toolResult.interaction.id}/edit` };
              }

              if (action) {
                controller.enqueue(encoder.encode(JSON.stringify({ type: "action", action }) + "\n"));
              }
            }
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
