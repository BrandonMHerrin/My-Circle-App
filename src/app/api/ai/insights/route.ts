import { listContacts } from "@/lib/contact.service";
import { listReminders } from "@/lib/reminder.service";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";
import { mergeCookies } from "@/lib/supabase/merge-cookies";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { insightSchema } from "@/lib/validation/insight.schema";

export async function GET(req: NextRequest) {
  // if no OPENAI_API_KEY, return early with error
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: {
          message: "OpenAI API key not configured",
        },
      }),
      { status: 500 },
    );
  }

  const { supabase, response } = createSupabaseRouteClient(req);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return new Response(
      JSON.stringify({ error: { message: "Unauthorized" } }),
      { status: 401 },
    );
  }

  try {
    // fetch all contacts for the user
    const { data } = await listContacts(supabase, user.id, {
      limit: 1000,
      offset: 0,
    });

    // if no contacts, return early
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          insights: [],
          message: "No contacts found. Add contacts to get insights.",
        }),
        { status: 200 },
      );
    }
    // fetch all user interactions for the contacts
    const interactionsRes = await supabase
      .from("interactions")
      .select("*")
      .eq("user_id", user.id)
      .in(
        "contact_id",
        data.map((c) => c.id),
      );

    if (interactionsRes.error) {
      throw interactionsRes.error;
    }

    const interactions = interactionsRes.data || [];

    // fetch all user reminders from reminderService
    const reminders = await listReminders(supabase, user.id, {
      limit: 1000,
      offset: 0,
      sort: "reminder_date",
      order: "asc",
      upcoming: true,
    });

    // Data summary for llm to generate insights on
    const summary = {
      total_contacts: data.length,
      total_interactions: interactions.length,
      total_reminders: reminders.data.length,
      contacts: data.map((c) => {
        const contactInteractions = interactions
          .filter((i) => i.contact_id === c.id)
          .map((i) => ({
            id: i.id,
            type: i.type,
            date: i.interaction_date,
            notes: i.notes,
          }));
        const sorted = contactInteractions
          .filter((i) => i.date)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        return {
          id: c.id,
          name: `${c.fname} ${c.lname}`,
          relationship: c.relationship,
          birthday: c.dob ? c.dob.slice(5) : null,
          last_interaction_date: sorted[0]?.date ?? null,
          interactions: contactInteractions,
        };
      }),
      reminders: reminders.data.map((r) => ({
        id: r.id,
        contact_id: r.contact_id,
        contact_name: r.contact
          ? `${r.contact.fname} ${r.contact.lname}`
          : null,
        type: r.reminder_type,
        date: r.reminder_date,
        message: r.message,
      })),
    };

    const { output } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: insightSchema }),
      system: `You are a relationship management assistant. Analyze the user's contact data to identify actionable insights. Rules:
- Flag contacts with no interaction in 30+ days as neglected
- Flag contacts with zero interactions
- Identify upcoming birthdays (within 30 days) that have no reminder set
- Note imbalanced interaction types (e.g. only calls, no in-person)
- Include the contact_id in the payload for any actionable insight
- Return 3-5 insights, ordered by priority (high first)`,
      prompt: `Today's date is ${new Date().toISOString().slice(0, 10)}.\n\nHere is the user's data:\n\n${JSON.stringify(summary, null, 2)}`,
    });

    const res = NextResponse.json(output, { status: 200 });
    return mergeCookies(response, res);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to fetch insights",
          details: message,
        },
      }),
      { status: 500 },
    );
  }
}
