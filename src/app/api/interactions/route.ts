import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { interactionCreateSchema } from "@/lib/validation/interaction.schema";

export async function GET(req: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "50");
  const page = Number(searchParams.get("page") ?? "1");

  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 50;
  const safePage = Number.isFinite(page) ? Math.max(page, 1) : 1;

  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  const { data, error, count } = await supabase
    .from("interactions")
    .select(
      `
      id,
      user_id,
      contact_id,
      interaction_date,
      type,
      notes,
      location,
      duration_minutes,
      created_at,
      updated_at,
      contact:contacts ( id, fname, lname, email )
    `,
      { count: "exact" }
    )
    .order("interaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({
    interactions: data ?? [],
    page: safePage,
    limit: safeLimit,
    total: count ?? 0,
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json().catch(() => ({}));
  const parsed = interactionCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Validation failed", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const payload = parsed.data;

  const { data, error } = await supabase
    .from("interactions")
    .insert([
      {
        contact_id: payload.contact_id,
        interaction_date: payload.interaction_date,
        type: payload.type,
        notes: payload.notes,
        location: payload.location ?? null,
        duration_minutes: payload.duration_minutes ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ interaction: data }, { status: 201 });
}
