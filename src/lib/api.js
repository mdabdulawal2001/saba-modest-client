const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request(path, options = {}) {
  let response;
  const requestUrl = typeof window === "undefined" ? `${API_BASE_URL}${path}` : path;

  try {
    response = await fetch(requestUrl, {
      ...options,
      cache: "no-store",
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new ApiError(
      `Could not reach the SABA MODEST service. ${error.message || "Check the API connection."}`,
      { code: "NETWORK_ERROR" },
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let payload = null;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else if (!response.ok) {
    payload = { error: { message: "The service returned an unexpected response." } };
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.error?.message || payload?.message || "The request could not be completed.",
      {
        status: response.status,
        code: payload?.error?.code,
      },
    );
  }

  return payload;
}

async function requestData(path, options = {}) {
  const payload = await request(path, options);
  return payload?.data ?? payload;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  return query.toString();
}

export async function getProducts(params = {}) {
  const query = buildQuery({ page: 1, limit: 50, ...params });
  const payload = await request(`/api/products${query ? `?${query}` : ""}`);

  return {
    items: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
    pagination: payload?.meta?.pagination,
  };
}

export async function getCategoryCounts(categories) {
  return Promise.all(
    categories.map(async (category) => {
      const result = await getProducts({ category, page: 1, limit: 1 });
      return { category, count: Number(result.pagination?.total) || 0 };
    }),
  );
}

export async function getProductById(id) {
  return requestData(`/api/products/${encodeURIComponent(id)}`);
}

export async function getMyProducts({ page = 1, limit = 50 } = {}) {
  const query = buildQuery({ page, limit });
  const payload = await request(`/api/products/mine?${query}`);

  return {
    items: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
    pagination: payload?.meta?.pagination,
  };
}

export function createProduct(data) {
  return requestData("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return requestData(`/api/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return requestData(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
