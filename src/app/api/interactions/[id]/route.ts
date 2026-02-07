import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { interactionCreateSchema } from "@/lib/validation/interaction.schema";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  if (!id || !isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
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
      updated_at
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ interaction: data });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  if (!id || !isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

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
    .update({
      contact_id: payload.contact_id,
      interaction_date: payload.interaction_date,
      type: payload.type,
      notes: payload.notes,
      location: payload.location ?? null,
      duration_minutes: payload.duration_minutes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ interaction: data });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  if (!id || !isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("interactions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
