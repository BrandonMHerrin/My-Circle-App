import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { contactsListQuerySchema, contactCreateSchema } from "@/lib/validation/contact.schema";
import { listContacts, createContact } from "@/lib/contact.service";
import { mergeCookies } from "@/lib/supabase/merge-cookies";

function zodToJson(err: ZodError) {
    return { error: { message: "Validation failed", details: err.flatten() } };
}


export async function GET(req: NextRequest) {
    const { supabase, response } = createSupabaseRouteClient(req);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const parsed = contactsListQuerySchema.safeParse({
        limit: url.searchParams.get("limit"),
        offset: url.searchParams.get("offset"),
        search: url.searchParams.get("search") ?? undefined,
        relationship: url.searchParams.get("relationship") ?? undefined,
        });

    if (!parsed.success) {
        return NextResponse.json(zodToJson(parsed.error), { status: 400 });
    }

    const { limit, offset, search, relationship } = parsed.data;
    const { data, count } = await listContacts(supabase as any, user.id, {
        limit,
        offset,
        search,
        relationship,
    });

    const res = NextResponse.json(
        { data, pagination: { limit, offset, total: count } },
        { status: 200 }
    );

    return mergeCookies(response, res);

    } catch (e: any) {
    return NextResponse.json(
        { error: { message: "Failed to list contacts", details: e?.message ?? String(e) } },
        { status: 500 }
    );
    }
}

export async function POST(req: NextRequest) {
    const { supabase, response } = createSupabaseRouteClient(req);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    try {
    const body = await req.json();
    const parsed = contactCreateSchema.parse(body);

    const created = await createContact(supabase as any, user.id, {
        ...parsed,
        email: parsed.email ?? null,
        phone: parsed.phone ?? null,
        relationship: parsed.relationship ?? null,
        dob: parsed.dob ?? null,
        notes: parsed.notes ?? null,
    });

    const res = NextResponse.json({ data: created }, { status: 201 });
    return mergeCookies(response, res);

    } catch (e: any) {
    if (e instanceof ZodError) {
        return NextResponse.json(zodToJson(e), { status: 400 });
    }
    return NextResponse.json(
        { error: { message: "Failed to create contact", details: e?.message ?? String(e) } },
        { status: 500 }
    );
    }
}
