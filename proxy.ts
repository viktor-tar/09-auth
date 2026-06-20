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

    // 🔥 IMPORTANT FIX: get new cookies from backend
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

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

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

      // 🔥 IMPORTANT FIX: forward new cookies
      if (refreshed.setCookie) {
        response.headers.set("set-cookie", refreshed.setCookie);
      }

      return response;
    }
  }

  // not logged in → block private
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // logged in → block auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
