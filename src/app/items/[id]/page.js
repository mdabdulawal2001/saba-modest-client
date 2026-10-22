import { cache } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { ErrorState } from "@/components/shared/States";
import { ApiError, getProductById, getProducts } from "@/lib/api";
import { isValidProductId } from "@/lib/utils";

const loadProduct = cache(getProductById);
const RELATED_PAGE_SIZE = 50;
const RELATED_PRODUCT_LIMIT = 4;

async function loadRelatedProducts(product) {
  const category = String(product.category || "").trim();
  if (!category) return [];

  const categoryKey = category.toLocaleLowerCase();
  const currentId = String(product._id ?? product.id ?? "");
  const seen = new Set([currentId]);
  const relatedProducts = [];
  let totalPages = 1;

  for (let page = 1; page <= totalPages && relatedProducts.length < RELATED_PRODUCT_LIMIT; page += 1) {
    const result = await getProducts({ page, limit: RELATED_PAGE_SIZE });
    if (page === 1 && Number.isSafeInteger(result.pagination?.totalPages)) {
      totalPages = Math.max(1, result.pagination.totalPages);
    }

    for (const item of result.items) {
      const id = String(item._id ?? item.id ?? "");
      if (
        !id
        || seen.has(id)
        || String(item.category || "").trim().toLocaleLowerCase() !== categoryKey
      ) {
        continue;
      }

      seen.add(id);
      relatedProducts.push(item);
      if (relatedProducts.length === RELATED_PRODUCT_LIMIT) break;
    }

    if (!result.items.length) break;
  }

  return relatedProducts;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!isValidProductId(id)) return { title: "Product not found" };

  try {
    const product = await loadProduct(id);
    return {
      title: product.title || "Product details",
      description: product.shortDescription || product.description || "Product details from SABA MODEST.",
    };
  } catch {
    return { title: "Product details" };
  }
}

async function ProductPageContent({ params }) {
  const { id } = await params;
  if (!isValidProductId(id)) notFound();

  let product;
  let requestError;
  try {
    product = await loadProduct(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    requestError = error;
  }

  if (requestError) {
    return (
      <main className="site-container flex-1 py-12">
        <ErrorState message={requestError.message} />
      </main>
    );
  }

  let relatedProducts = [];
  let relatedError = "";
  if (String(product.category || "").trim()) {
    try {
      relatedProducts = await loadRelatedProducts(product);
    } catch (error) {
      relatedError = error.message;
    }
  }

  return <ProductDetails product={product} relatedProducts={relatedProducts} relatedError={relatedError} />;
}

export default function ProductPage({ params }) {
  return <ProductPageContent params={params} />;
}
