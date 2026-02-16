
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Intent = "create_reminder" | "create_contact" | "log_interaction";

type Action =
  | { type: "link"; label: string; href: string }
  | { type: "intent"; label: string; intent: Intent }
  | { type: "dismiss"; label: string };

function defaultActions(): Action[] {
  return [
    { type: "intent", label: "Create reminder", intent: "create_reminder" },
    { type: "intent", label: "Add contact", intent: "create_contact" },
    { type: "intent", label: "Log interaction", intent: "log_interaction" },
    { type: "dismiss", label: "Close" },
  ];
}

function friendlyOpenAIError(err: any) {
  const msg = String(err?.message ?? "");
  const status = err?.status ?? err?.response?.status;

  if (status === 401) {
    return "Your OpenAI key looks invalid (401). Recreate it and update .env.local, then restart npm run dev.";
  }
  if (status === 429) {
    return "OpenAI quota/billing limit (429). Your code is fine—your API account needs billing/credits, or use the free local assistant fallback.";
  }
  if (status === 404) {
    return "Model not found/available (404). Try changing the model name.";
  }
  return `OpenAI error: ${msg || "unknown error"}`;
}

export async function POST(req: Request) {
  try {
    // ✅ verifica env
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          message:
            "Missing OPENAI_API_KEY. Add it in .env.local and restart the server.",
          actions: defaultActions(),
        },
        { status: 200 }
      );
    }

    // ⚠️ crea el cliente dentro del handler (evita edge/build issues)
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const body = await req.json().catch(() => ({}));
    const userMessage = String(body?.message ?? "").trim();

    if (!userMessage) {
      return NextResponse.json(
        { message: "Tell me what you want to do 🙂", actions: defaultActions() },
        { status: 200 }
      );
    }

    const system = `
You are a helpful assistant inside a web app called MyCircle.
The app manages Contacts, Interactions, and Reminders.
Your job:
- Reply in short, friendly, practical messages.
- Suggest next actions.
- When it makes sense, propose 1-3 actions among:
  - create_reminder
  - create_contact
  - log_interaction

Return ONLY JSON with this exact shape:
{
  "message": string,
  "actions": Array<
    | {"type":"intent","label":string,"intent":"create_reminder"|"create_contact"|"log_interaction"}
    | {"type":"link","label":string,"href":string}
    | {"type":"dismiss","label":string}
  >
}

No extra keys. No markdown. No explanations.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          message:
            "I can help with reminders, contacts, or interactions. What do you need?",
          actions: defaultActions(),
        },
        { status: 200 }
      );
    }

    const message =
      typeof parsed?.message === "string"
        ? parsed.message
        : "How can I help you today?";

    const actions: Action[] = Array.isArray(parsed?.actions)
      ? parsed.actions
      : defaultActions();

    return NextResponse.json({ message, actions }, { status: 200 });
  } catch (err: any) {
    console.error("assistant/chat error:", err);
    return NextResponse.json(
      {
        message: friendlyOpenAIError(err),
        actions: defaultActions(),
      },
      { status: 200 }
    );
  }
}
