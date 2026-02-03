import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseRouteClient(request: NextRequest) {
	// Route handlers cannot use NextResponse.next().
	// We create a normal response and let Supabase attach refreshed cookies to it.
	const response = new NextResponse();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					// Do NOT mutate request.cookies in route handlers.
					// Just set cookies on the outgoing response.
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	return { supabase, response };
}
