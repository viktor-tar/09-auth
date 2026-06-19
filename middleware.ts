import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  console.log("========== MIDDLEWARE ==========");
  console.log("PATH:", pathname);
  console.log("ACCESS TOKEN EXISTS:", !!accessToken);
  console.log("REFRESH TOKEN EXISTS:", !!refreshToken);
  console.log(
    "COOKIE HEADER:",
    req.headers.get("cookie") ?? "NO COOKIE HEADER",
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthenticated = Boolean(accessToken || refreshToken);

  console.log("IS PRIVATE:", isPrivateRoute);
  console.log("IS PUBLIC:", isPublicRoute);
  console.log("IS AUTHENTICATED:", isAuthenticated);

  // not logged in → block private
  if (!isAuthenticated && isPrivateRoute) {
    console.log("REDIRECTING TO SIGN-IN (NO TOKENS FOUND)");

    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // logged in → block auth pages
  if (isAuthenticated && isPublicRoute) {
    console.log("REDIRECTING TO PROFILE (ALREADY AUTHENTICATED)");

    return NextResponse.redirect(new URL("/profile", req.url));
  }

  console.log("ALLOWING REQUEST");
  console.log("==============================");

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
