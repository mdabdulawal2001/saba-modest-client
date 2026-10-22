import "server-only";
import { revalidatePath } from "next/cache";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const blockedRequestHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "transfer-encoding",
]);

const blockedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
]);

export async function proxyBackendRequest(request) {
  const requestUrl = new URL(request.url);
  const headers = new Headers(request.headers);
  for (const name of blockedRequestHeaders) headers.delete(name);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  try {
    const upstream = await fetch(
      `${API_BASE_URL}${requestUrl.pathname}${requestUrl.search}`,
      {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        cache: "no-store",
        redirect: "manual",
      },
    );

    const responseBody = ["204", "304"].includes(String(upstream.status))
      ? null
      : await upstream.arrayBuffer();
    const isApplicationSuccess = (() => {
      if (!upstream.ok || !responseBody || !(upstream.headers.get("content-type") || "").includes("application/json")) {
        return upstream.ok;
      }
      try {
        return JSON.parse(new TextDecoder().decode(responseBody)).success !== false;
      } catch {
        return false;
      }
    })();

    const isProductCollectionMutation = request.method === "POST"
      && requestUrl.pathname === "/api/products";
    const isProductRecordMutation = ["PATCH", "DELETE"].includes(request.method)
      && /^\/api\/products\/[^/]+$/.test(requestUrl.pathname)
      && requestUrl.pathname !== "/api/products/mine";

    // Product reads use no-store, but the App Router can retain route payloads.
    // Invalidate product routes only after the backend confirms a mutation.
    if (
      (isProductCollectionMutation || isProductRecordMutation)
      && isApplicationSuccess
    ) {
      revalidatePath("/");
      revalidatePath("/items");
      revalidatePath("/items/[id]", "page");
      revalidatePath("/items/manage");
      revalidatePath("/items/edit/[id]", "page");
    }

    const responseHeaders = new Headers();

    for (const [name, value] of upstream.headers) {
      if (name !== "set-cookie" && !blockedResponseHeaders.has(name.toLowerCase())) {
        responseHeaders.append(name, value);
      }
    }

    const cookies = upstream.headers.getSetCookie?.() || [];
    for (const cookie of cookies) responseHeaders.append("set-cookie", cookie);

    return new Response(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "The SABA MODEST service is temporarily unavailable.",
        },
      },
      { status: 502 },
    );
  }
}
