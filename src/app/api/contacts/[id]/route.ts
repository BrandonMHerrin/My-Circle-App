import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import {
	contactIdSchema,
	contactUpdateSchema,
} from "@/lib/validation/contact.schema";
import {
	getContactById,
	updateContact,
	deleteContact,
} from "@/lib/contact.service";

function zodToJson(err: ZodError) {
	return { error: { message: "Validation failed", details: err.flatten() } };
}

function mergeCookies(from: NextResponse, to: NextResponse) {
	from.cookies.getAll().forEach((c) => to.cookies.set(c));
	return to;
}

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params;

	const { supabase, response } = createSupabaseRouteClient(req);

	const { data: userData } = await supabase.auth.getUser();
	const user = userData?.user;

	if (!user) {
		return NextResponse.json(
			{ error: { message: "Unauthorized" } },
			{ status: 401 },
		);
	}

	const idParsed = contactIdSchema.safeParse(id);
	if (!idParsed.success)
		return NextResponse.json(zodToJson(idParsed.error), { status: 400 });

	try {
		const contact = await getContactById(
			supabase as any,
			user.id,
			idParsed.data,
		);
		if (!contact)
			return NextResponse.json(
				{ error: { message: "Contact not found" } },
				{ status: 404 },
			);

		const res = NextResponse.json({ data: contact }, { status: 200 });
		return mergeCookies(response, res);
	} catch (e: any) {
		return NextResponse.json(
			{
				error: {
					message: "Failed to get contact",
					details: e?.message ?? String(e),
				},
			},
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params;
    
	const { supabase, response } = createSupabaseRouteClient(req);

	const { data: userData } = await supabase.auth.getUser();
	const user = userData?.user;

	if (!user) {
		return NextResponse.json(
			{ error: { message: "Unauthorized" } },
			{ status: 401 },
		);
	}

	const idParsed = contactIdSchema.safeParse(id);
	if (!idParsed.success)
		return NextResponse.json(zodToJson(idParsed.error), { status: 400 });

	try {
		const body = await req.json();
		const patch = contactUpdateSchema.parse(body);

		const updated = await updateContact(
			supabase as any,
			user.id,
			idParsed.data,
			patch,
		);
		if (!updated)
			return NextResponse.json(
				{ error: { message: "Contact not found" } },
				{ status: 404 },
			);

		const res = NextResponse.json({ data: updated }, { status: 200 });
		return mergeCookies(response, res);
	} catch (e: any) {
		if (e instanceof ZodError)
			return NextResponse.json(zodToJson(e), { status: 400 });

		return NextResponse.json(
			{
				error: {
					message: "Failed to update contact",
					details: e?.message ?? String(e),
				},
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = await params;
	const { supabase, response } = createSupabaseRouteClient(req);

	const { data: userData } = await supabase.auth.getUser();
	const user = userData?.user;

	if (!user) {
		return NextResponse.json(
			{ error: { message: "Unauthorized" } },
			{ status: 401 },
		);
	}

	const idParsed = contactIdSchema.safeParse(id);
	if (!idParsed.success)
		return NextResponse.json(zodToJson(idParsed.error), { status: 400 });

	try {
		const { deletedCount } = await deleteContact(
			supabase as any,
			user.id,
			idParsed.data,
		);
		if (deletedCount === 0)
			return NextResponse.json(
				{ error: { message: "Contact not found" } },
				{ status: 404 },
			);

		const res = NextResponse.json({ success: true }, { status: 200 });
		return mergeCookies(response, res);
	} catch (e: any) {
		return NextResponse.json(
			{
				error: {
					message: "Failed to delete contact",
					details: e?.message ?? String(e),
				},
			},
			{ status: 500 },
		);
	}
}
