import { isPublicRoute } from "./app/auth/routes";
import { getSession } from "./app/auth/session";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	const { user, response } = await getSession(request);
	const pathname = request.nextUrl.pathname;

	if (!user && !isPublicRoute(pathname)) {
        //Added this so we can also see a response on the frontend in addtion to being redirected.
		if (pathname.startsWith("/api/")) {
			return NextResponse.json(
				{ error: { message: "Unauthorized" } },
				{ status: 401 },
			);
		}

		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
