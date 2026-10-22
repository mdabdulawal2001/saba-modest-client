import ItemsExplorer from "@/components/products/ItemsExplorer";
import { ErrorState } from "@/components/shared/States";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/api";

const PAGE_SIZE = 12;
const backendCategories = new Set(siteConfig.categories.map((category) => normalizeCategory(category)));

function normalizeCategory(category) {
  return String(category || "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export const metadata = {
  title: "Shop modest fashion",
  description: "Browse SABA MODEST three-piece outfits and modest fashion.",
};

function getInitialFilters(searchParams) {
  const category = siteConfig.categoryCards.find(
    ({ name }) => normalizeCategory(name) === normalizeCategory(searchParams.category),
  )?.name || "";
  const sort = ["price_asc", "price_desc"].includes(searchParams.sort) ? searchParams.sort : "";
  return {
    search: typeof searchParams.search === "string" ? searchParams.search.slice(0, 100) : "",
    category,
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    sort,
  };
}

export default async function ItemsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const filters = getInitialFilters(params);
  const requestedPage = Math.max(1, Number.parseInt(params.page, 10) || 1);
  let result;
  let error = "";

  if (filters.category && !backendCategories.has(normalizeCategory(filters.category))) {
    result = {
      items: [],
      pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 },
    };
  } else {
    try {
      result = await getProducts({
        ...filters,
        page: requestedPage,
        limit: PAGE_SIZE,
        sort: filters.sort || undefined,
      });
      const totalPages = Number(result.pagination?.totalPages) || 0;
      if (requestedPage > Math.max(totalPages, 1)) {
        result = await getProducts({
          ...filters,
          page: Math.max(totalPages, 1),
          limit: PAGE_SIZE,
          sort: filters.sort || undefined,
        });
      }
    } catch (requestError) {
      error = requestError.message;
    }
  }

  return (
    <main className="site-container flex-1 py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">The collection</p>
        <h1 className="display-font mt-3 text-4xl sm:text-5xl">Shop all pieces</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Explore the current SABA MODEST catalog. Search by name and refine by category, price, or order.
        </p>
      </div>
      {error ? (
        <ErrorState message={error} />
      ) : (
        <ItemsExplorer
          initialItems={result?.items || []}
          initialFilters={filters}
          initialError=""
          initialPagination={result?.pagination}
          initialPage={result?.pagination?.page || 1}
        />
      )}
    </main>
  );
}
