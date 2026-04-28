import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get("user_id")?.value;
  const role = request.cookies.get("role")?.value;
  const isLoggedIn = !!userId && !!role;

  // ── Kalau sudah login dan buka /login → redirect sesuai role
  if (isLoggedIn && pathname === "/login") {
    if (role === "1") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.redirect(new URL("/user/explore", request.url));
  }

  // ── Kalau belum login → paksa ke /login
  if (!isLoggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── User (role=2) coba akses halaman admin → tolak ke /user/explore
  if (isLoggedIn && role === "2") {
    const adminRoutes = ["/books", "/members", "/reports"];
    const isAdminPage =
      pathname === "/" || adminRoutes.some((r) => pathname.startsWith(r));
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/user/explore", request.url));
    }
  }

  // ── Admin (role=1) coba akses halaman user → tolak ke /
  if (isLoggedIn && role === "1" && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Semua halaman kecuali static files & api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
