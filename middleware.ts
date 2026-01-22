import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ["placeholder"];
const publicRoutes = ['/authentication', '/', '/dashboard'];

export async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = protectedRoutes.includes(path);

    // Check if the user is trying to access a protected route (e.g., /dashboard)

    const session = (await cookies()).get("session")?.value
    const token = req.cookies.get('auth_token'); // Retrieve the auth token from cookies

    // If no token is found, redirect to the login page
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isProtectedRoute && session && !req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}