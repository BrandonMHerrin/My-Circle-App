import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import {
	remindersListQuerySchema,
	reminderCreateSchema,
} from "@/lib/validation/reminder.schema";
import { listReminders, createReminder } from "@/lib/reminder.service";

function zodToJson(err: ZodError) {
	return { error: { message: "Validation failed", details: err.flatten() } };
}

function mergeCookies(from: NextResponse, to: NextResponse) {
	from.cookies.getAll().forEach((c) => to.cookies.set(c));
	return to;
}

export async function GET(req: NextRequest) {
	const { supabase, response } = createSupabaseRouteClient(req);
	const { data: userData } = await supabase.auth.getUser();
	const user = userData?.user;

	if (!user)
		return NextResponse.json(
			{ error: { message: "Unauthorized" } },
			{ status: 401 },
		);

	const url = new URL(req.url);
	const parsed = remindersListQuerySchema.safeParse({
		limit: url.searchParams.get("limit"),
		offset: url.searchParams.get("offset"),
		status: url.searchParams.get("status") ?? undefined,
		type: url.searchParams.get("type") ?? undefined,
		contact_id: url.searchParams.get("contact_id") ?? undefined,
		start: url.searchParams.get("start") ?? undefined,
		end: url.searchParams.get("end") ?? undefined,
		sort: url.searchParams.get("sort") ?? undefined,
		order: url.searchParams.get("order") ?? undefined,
		upcoming: url.searchParams.get("upcoming") ?? undefined,
	});

	if (!parsed.success)
		return NextResponse.json(zodToJson(parsed.error), { status: 400 });

	try {
		const { limit, offset, ...filters } = parsed.data;
		const { data, count } = await listReminders(supabase as any, user.id, {
			limit,
			offset,
			...filters,
		});

		const res = NextResponse.json(
			{ data, pagination: { limit, offset, total: count } },
			{ status: 200 },
		);
		return mergeCookies(response, res);
	} catch (e: any) {
		return NextResponse.json(
			{
				error: {
					message: "Failed to list reminders",
					details: e?.message ?? String(e),
				},
			},
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	const { supabase, response } = createSupabaseRouteClient(req);
	const { data: userData } = await supabase.auth.getUser();
	const user = userData?.user;

	if (!user)
		return NextResponse.json(
			{ error: { message: "Unauthorized" } },
			{ status: 401 },
		);

	try {
		const body = await req.json();
		const input = reminderCreateSchema.parse(body);

		const created = await createReminder(supabase as any, user.id, {
			contact_id: input.contact_id,
			reminder_type: input.reminder_type,
			message: input.message ?? "",
			reminder_date: input.reminder_date || "",
		});

		const res = NextResponse.json({ data: created }, { status: 201 });
		return mergeCookies(response, res);
	} catch (e: any) {
		if (e instanceof ZodError)
			return NextResponse.json(zodToJson(e), { status: 400 });

		return NextResponse.json(
			{
				error: {
					message: "Failed to create reminder",
					details: e?.message ?? String(e),
				},
			},
			{ status: 500 },
		);
	}
}
