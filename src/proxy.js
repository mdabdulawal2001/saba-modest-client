import { NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function proxy(request) {
  const cookie = request.headers.get("cookie");
  let session;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      cache: "no-store",
      headers: cookie ? { cookie } : {},
    });

    if (!response.ok) {
      return new NextResponse("Authentication service is temporarily unavailable.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    session = await response.json();
  } catch {
    return new NextResponse("Authentication service is temporarily unavailable.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (session?.user) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/items/add/:path*", "/items/manage/:path*", "/items/edit/:path*"],
};
