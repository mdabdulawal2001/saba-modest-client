import { normalizeCategory } from "@/lib/utils";

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
  let payload;
  try {
    payload = await request(`/api/products${query ? `?${query}` : ""}`);
  } catch (error) {
    // Some backend deployments still validate categories against a fixed list.
    // Keep the existing category query for supported values, but handle dynamic
    // product categories locally when the backend rejects the category value.
    if (
      !params.category
      || !/category must be one of/i.test(error.message)
    ) {
      throw error;
    }

    const { category, ...otherFilters } = params;
    const page = Math.max(1, Number.parseInt(otherFilters.page, 10) || 1);
    const limit = Math.max(1, Number.parseInt(otherFilters.limit, 10) || 50);
    const firstPage = await getProducts({ ...otherFilters, page: 1, limit: 50 });
    const totalPages = Math.max(
      1,
      Number(firstPage.pagination?.totalPages)
        || Math.ceil((Number(firstPage.pagination?.total) || firstPage.items.length) / 50),
    );
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        getProducts({ ...otherFilters, page: index + 2, limit: 50 }),
      ),
    );
    const allItems = [firstPage.items, ...remainingPages.map(({ items }) => items)].flat();
    const normalizedCategory = normalizeCategory(category);
    const matchingItems = allItems.filter(
      (product) => normalizeCategory(product?.category) === normalizedCategory,
    );
    const start = (page - 1) * limit;

    return {
      items: matchingItems.slice(start, start + limit),
      pagination: {
        ...(firstPage.pagination || {}),
        page,
        limit,
        total: matchingItems.length,
        totalPages: Math.ceil(matchingItems.length / limit),
      },
    };
  }

  return {
    items: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
    pagination: payload?.meta?.pagination,
  };
}

export async function getProductCategories() {
  const limit = 50;
  const firstPage = await getProducts({ page: 1, limit });
  const reportedPages = Number(firstPage.pagination?.totalPages);
  const total = Number(firstPage.pagination?.total);
  const totalPages = Math.max(
    1,
    Number.isFinite(reportedPages) && reportedPages > 0
      ? reportedPages
      : Math.ceil((Number.isFinite(total) ? total : 0) / limit),
  );
  const categories = new Map();

  const addCategories = (products) => {
    products.forEach((product) => {
      if (typeof product?.category !== "string") return;
      const name = product.category.trim();
      const key = normalizeCategory(name);
      if (!key) return;

      const category = categories.get(key) || { name, count: 0 };
      category.count += 1;
      categories.set(key, category);
    });
  };

  addCategories(firstPage.items);
  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getProducts({ page: index + 2, limit }),
    ),
  );
  remainingPages.forEach(({ items }) => addCategories(items));

  return [...categories.values()];
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
