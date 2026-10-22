export function formatPrice(value) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function getProductId(product) {
  return product?._id ?? product?.id ?? "";
}

export function getSafeCallbackUrl(value, fallback = "/items") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://saba-modest.invalid");
    if (
      url.origin !== "https://saba-modest.invalid" ||
      !url.pathname.startsWith("/") ||
      url.pathname.startsWith("//") ||
      url.pathname.includes("\\")
    ) {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function isValidProductId(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}
