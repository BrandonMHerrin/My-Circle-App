import type { SupabaseClient } from "@supabase/supabase-js";
import type {
	Reminder,
	ReminderStatus,
	ReminderType,
} from "@/lib/reminder.types";

type ListParams = {
	limit: number;
	offset: number;
	status?: ReminderStatus;
	type?: ReminderType;
	contact_id?: string;
	start?: string;
	end?: string;
	sort: "reminder_date" | "created_at";
	order: "asc" | "desc";
	upcoming?: boolean;
};

export async function listReminders(
	supabase: SupabaseClient,
	userId: string,
	params: ListParams,
) {
	let q = supabase
		.from("reminders")
		.select(
			`
      *,
      contact:contacts (
        id, fname, lname, email, phone, relationship, dob
      )
    `,
			{ count: "exact" },
		)
		.eq("user_id", userId);

	if (params.status) q = q.eq("status", params.status);
	if (params.type) q = q.eq("reminder_type", params.type);
	if (params.contact_id) q = q.eq("contact_id", params.contact_id);

	if (params.start) q = q.gte("reminder_date", params.start);
	if (params.end) q = q.lte("reminder_date", params.end);

	// upcoming convenience filter:
	// - due at or after now
	// - exclude dismissed/completed
	if (params.upcoming) {
		const now = new Date().toISOString();
		q = q.gte("reminder_date", now).not("status", "in", "(dismissed,completed)");
	}

	q = q.order(params.sort, { ascending: params.order === "asc" });

	const from = params.offset;
	const to = params.offset + params.limit - 1;

	const { data, error, count } = await q.range(from, to);
	if (error) throw error;

	return { data: (data ?? []) as Reminder[], count: count ?? 0 };
}

export async function createReminder(
	supabase: SupabaseClient,
	userId: string,
	input: {
		contact_id: string | null;
		reminder_type: ReminderType;
		message?: string | null;
		reminder_date: string;
	},
) {
	const { data, error } = await supabase
		.from("reminders")
		.insert({
			user_id: userId,
			contact_id: input.contact_id,
			reminder_type: input.reminder_type,
			status: "active",
			message: input.message ?? null,
			reminder_date: input.reminder_date,
		})
		.select(
			`
      *,
      contact:contacts (
        id, fname, lname, email, phone, relationship, dob
      )
    `,
		)
		.single();

	if (error) throw error;
	return data as Reminder;
}

export async function patchReminder(
	supabase: SupabaseClient,
	userId: string,
	id: string,
	patch: Record<string, any>,
) {
	const { data, error } = await supabase
		.from("reminders")
		.update(patch)
		.eq("id", id)
		.eq("user_id", userId)
		.select(
			`
      *,
      contact:contacts (
        id, fname, lname, email, phone, relationship, dob
      )
    `,
		)
		.maybeSingle();

	if (error) throw error;
	return (data ?? null) as Reminder | null;
}

export async function deleteReminder(
	supabase: SupabaseClient,
	userId: string,
	id: string,
) {
	const { error, count } = await supabase
		.from("reminders")
		.delete({ count: "exact" })
		.eq("id", id)
		.eq("user_id", userId);

	if (error) throw error;
	return { deletedCount: count ?? 0 };
}
