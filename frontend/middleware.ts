import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route patterns
const CITIZEN_ROUTES = /^\/citizen(\/|$)/;
const ADMIN_ROUTES = /^\/admin(\/|$)/;

// Public routes that don't need auth
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/complaints"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
        // Exception: /complaints is public
        if (pathname === "/complaints") return NextResponse.next();
        if (!CITIZEN_ROUTES.test(pathname) && !ADMIN_ROUTES.test(pathname)) {
            return NextResponse.next();
        }
    }

    // Check for auth token in cookies (zustand persists to localStorage, 
    // but for middleware we check a cookie that the auth store should set)
    const authToken = request.cookies.get("suvidha-auth-token")?.value;

    // If no auth token and trying to access protected route
    if (!authToken) {
        if (CITIZEN_ROUTES.test(pathname) || ADMIN_ROUTES.test(pathname)) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files and API
        "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|api).*)",
    ],
};
