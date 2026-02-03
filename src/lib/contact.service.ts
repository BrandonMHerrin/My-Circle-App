import type { SupabaseClient } from "@supabase/supabase-js";

export async function listContacts(
	supabase: SupabaseClient,
	userId: string,
	params: {
		limit: number;
		offset: number;
		search?: string;
		relationship?: string;
	},
) {
	let query = supabase
		.from("contacts")
		.select("*", { count: "exact" })
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (params.relationship) {
		query = query.eq("relationship_type", params.relationship);
	}

	if (params.search) {
		const s = params.search.replace(/%/g, "\\%").replace(/_/g, "\\_");
		query = query.or(
			`fname.ilike.%${s}%,lname.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`,
		);
	}

	const from = params.offset;
	const to = params.offset + params.limit - 1;

	const { data, error, count } = await query.range(from, to);

	if (error) throw error;

	return { data: data ?? [], count: count ?? 0 };
}

export async function getContactById(
	supabase: SupabaseClient,
	userId: string,
	id: string,
) {
	const { data, error } = await supabase
		.from("contacts")
		.select("*")
		.eq("id", id)
		.eq("user_id", userId)
		.maybeSingle();

	if (error) throw error;
	return data ?? null;
}

export async function createContact(
	supabase: SupabaseClient,
	userId: string,
	input: any,
) {
	const { data, error } = await supabase
		.from("contacts")
		.insert({ ...input, user_id: userId })
		.select("*")
		.single();

	if (error) throw error;
	return data;
}

export async function updateContact(
	supabase: SupabaseClient,
	userId: string,
	id: string,
	patch: any,
) {
	const { data, error } = await supabase
		.from("contacts")
		.update(patch)
		.eq("id", id)
		.eq("user_id", userId)
		.select("*")
		.maybeSingle();

	if (error) throw error;
	return data ?? null;
}

export async function deleteContact(
	supabase: SupabaseClient,
	userId: string,
	id: string,
) {
	const { error, count } = await supabase
		.from("contacts")
		.delete({ count: "exact" })
		.eq("id", id)
		.eq("user_id", userId);

	if (error) throw error;
	return { deletedCount: count ?? 0 };
}
