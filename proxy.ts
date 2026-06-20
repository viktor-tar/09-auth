import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

async function refreshSession(req: NextRequest) {
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!res.ok) return null;

    const setCookie = res.headers.get("set-cookie");

    return {
      ok: true,
      setCookie,
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ FIX: correct Next.js middleware cookie API usage style
  const cookieStore = req.cookies;

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = Boolean(accessToken || refreshToken);

  // try refresh session if accessToken missing
  if (!accessToken && refreshToken) {
    const refreshed = await refreshSession(req);

    if (refreshed?.ok) {
      isAuthenticated = true;

      const response = NextResponse.next();

      // forward new cookies if exist
      if (refreshed.setCookie) {
        response.headers.set("set-cookie", refreshed.setCookie);
      }

      return response;
    }
  }

  // block private routes
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // block auth pages for logged users
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
