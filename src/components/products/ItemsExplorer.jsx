"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "@/components/products/ProductCard";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import Pagination from "@/components/shared/Pagination";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/api";

const PAGE_SIZE = 12;
const backendCategories = new Set(siteConfig.categories.map((category) => normalizeCategory(category)));

function normalizeCategory(category) {
  return String(category || "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function buildQuery(filters, page, currentSearchParams) {
  const query = new URLSearchParams(currentSearchParams.toString());
  [...Object.keys(filters), "page"].forEach((key) => query.delete(key));
  const values = page > 1 ? { ...filters, page: String(page) } : filters;
  Object.entries(values).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

function filtersFromSearchParams(searchParams) {
  const category = siteConfig.categoryCards.find(
    ({ name }) => normalizeCategory(name) === normalizeCategory(searchParams.get("category")),
  )?.name || "";
  const sort = searchParams.get("sort");

  return {
    search: (searchParams.get("search") || "").slice(0, 100),
    category,
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: ["price_asc", "price_desc"].includes(sort) ? sort : "",
  };
}

function filtersMatch(left, right) {
  return Object.keys(left).every((key) => left[key] === right[key]);
}

export default function ItemsExplorer({
  initialItems,
  initialFilters,
  initialError,
  initialPagination,
  initialPage = 1,
}) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState(initialError);
  const [pagination, setPagination] = useState(initialPagination);
  const [page, setPage] = useState(initialPage);
  const [isPending, setIsPending] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(initialFilters.search);
  const requestId = useRef(0);
  const requestedSearch = useRef(initialFilters.search);
  const lastObservedQuery = useRef(queryString);
  const currentState = useRef({ filters: initialFilters, page: initialPage });
  const serverSnapshot = useRef({ initialItems, initialFilters, initialError, initialPagination, initialPage });

  useEffect(() => {
    const previous = serverSnapshot.current;
    if (
      previous.initialItems === initialItems
      && previous.initialFilters === initialFilters
      && previous.initialError === initialError
      && previous.initialPagination === initialPagination
      && previous.initialPage === initialPage
    ) {
      return;
    }

    serverSnapshot.current = { initialItems, initialFilters, initialError, initialPagination, initialPage };
    const refreshedPage = Math.max(1, Number(initialPage) || 1);
    requestId.current += 1;
    requestedSearch.current = initialFilters.search;
    lastObservedQuery.current = queryString;
    currentState.current = { filters: initialFilters, page: refreshedPage };
    setItems(initialItems);
    setFilters(initialFilters);
    setError(initialError);
    setPagination(initialPagination);
    setPage(refreshedPage);
    setDebouncedSearch(initialFilters.search);
    setIsPending(false);
  }, [initialError, initialFilters, initialItems, initialPage, initialPagination, queryString]);

  const fetchPage = useCallback(async (
    nextFilters,
    nextPage,
    { scroll = true, history = "replace", syncUrl = true } = {},
  ) => {
    const currentRequest = ++requestId.current;
    requestedSearch.current = nextFilters.search;
    setIsPending(true);
    setError("");
    const query = buildQuery(nextFilters, nextPage, searchParams);
    if (syncUrl) {
      const nextUrl = query ? `/items?${query}` : "/items";
      if (history === "push") {
        window.history.pushState(null, "", nextUrl);
      } else {
        window.history.replaceState(null, "", nextUrl);
      }
    }

    try {
      if (nextFilters.category && !backendCategories.has(normalizeCategory(nextFilters.category))) {
        if (currentRequest !== requestId.current) return;
        setItems([]);
        setPagination({ page: 1, total: 0, totalPages: 0, limit: PAGE_SIZE });
        setPage(1);
        currentState.current = { filters: nextFilters, page: 1 };
      } else {
        const result = await getProducts({
          ...nextFilters,
          page: nextPage,
          limit: PAGE_SIZE,
        });
        if (currentRequest !== requestId.current) return;
        setItems(result.items);
        setPagination(result.pagination || { page: nextPage, total: result.items.length, totalPages: 1 });
        setPage(nextPage);
        currentState.current = { filters: nextFilters, page: nextPage };
      }

      if (scroll) {
        requestAnimationFrame(() => {
          const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
          document.getElementById("shop-results")?.scrollIntoView({ behavior, block: "start" });
        });
      }
    } catch (requestError) {
      if (currentRequest !== requestId.current) return;
      setError(requestError.message);
      toast.error(requestError.message);
    } finally {
      if (currentRequest === requestId.current) setIsPending(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (queryString === lastObservedQuery.current) return;
    lastObservedQuery.current = queryString;

    const params = new URLSearchParams(queryString);
    const nextFilters = filtersFromSearchParams(params);
    const requestedPage = Math.max(1, Number.parseInt(params.get("page"), 10) || 1);
    const { filters: currentFilters, page: currentPage } = currentState.current;
    if (filtersMatch(currentFilters, nextFilters) && currentPage === requestedPage) return;

    setFilters(nextFilters);
    setDebouncedSearch(nextFilters.search);
    setPage(requestedPage);
    requestedSearch.current = nextFilters.search;

    if (filtersMatch(initialFilters, nextFilters)) {
      requestId.current += 1;
      const restoredPage = Math.max(1, Number(initialPage) || 1);
      currentState.current = { filters: nextFilters, page: restoredPage };
      if (restoredPage !== requestedPage) {
        const query = buildQuery(nextFilters, restoredPage, params);
        const nextUrl = query ? `/items?${query}` : "/items";
        window.history.replaceState(null, "", nextUrl);
      }
      startTransition(() => {
        setItems(initialItems);
        setPagination(initialPagination);
        setError(initialError);
        setPage(restoredPage);
        setIsPending(false);
      });
      return;
    }

    currentState.current = { filters: nextFilters, page: requestedPage };
    startTransition(() => {
      fetchPage(nextFilters, requestedPage, { scroll: false, syncUrl: false });
    });
  }, [
    fetchPage,
    initialError,
    initialFilters,
    initialItems,
    initialPage,
    initialPagination,
    queryString,
  ]);

  useEffect(() => {
    if (debouncedSearch === requestedSearch.current) return;
    const timer = window.setTimeout(() => {
      fetchPage({ ...filters, search: debouncedSearch }, 1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, filters, fetchPage]);

  useEffect(() => () => {
    requestId.current += 1;
  }, []);

  const updateImmediateFilter = (name, value) => {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    if (name === "search") {
      setDebouncedSearch(value);
      setPage(1);
      currentState.current = { filters: nextFilters, page: 1 };
      return;
    }
    setPage(1);
    currentState.current = { filters: nextFilters, page: 1 };
    fetchPage(nextFilters, 1, { history: name === "category" ? "push" : "replace" });
  };

  const applyPriceFilters = () => {
    setPage(1);
    currentState.current = { filters, page: 1 };
    fetchPage(filters, 1);
  };

  const resetFilters = () => {
    const reset = { search: "", category: "", minPrice: "", maxPrice: "", sort: "" };
    setFilters(reset);
    setDebouncedSearch("");
    setPage(1);
    currentState.current = { filters: reset, page: 1 };
    fetchPage(reset, 1, { history: filters.category ? "push" : "replace" });
  };

  const changePage = (nextPage) => {
    const totalPages = Number(pagination?.totalPages) || 0;
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    currentState.current = { filters, page: nextPage };
    fetchPage(filters, nextPage);
  };

  const hasFilters = Object.values(filters).some(Boolean);
  const total = Number(pagination?.total) || 0;
  const totalPages = Number(pagination?.totalPages) || 0;

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1.6fr)_1fr_1fr_1fr_1fr]">
          <label className="relative block sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search products</span>
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={filters.search}
              onChange={(event) => updateImmediateFilter("search", event.target.value)}
              maxLength={100}
              placeholder="Search styles"
              className="min-h-12 w-full rounded-full border border-line bg-background pl-11 pr-4 text-sm outline-none focus:border-brand"
            />
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select
              value={filters.category}
              onChange={(event) => updateImmediateFilter("category", event.target.value)}
              className="min-h-12 w-full rounded-full border border-line bg-background px-4 text-sm text-foreground"
            >
              <option value="">All categories</option>
              {siteConfig.categoryCards.map(({ name }) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Minimum price in BDT</span>
            <input
              type="number"
              min="0"
              step="1"
              value={filters.minPrice}
              onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))}
              onBlur={applyPriceFilters}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyPriceFilters();
                }
              }}
              placeholder="Min ৳"
              className="min-h-12 w-full rounded-full border border-line bg-background px-4 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Maximum price in BDT</span>
            <input
              type="number"
              min="0"
              step="1"
              value={filters.maxPrice}
              onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
              onBlur={applyPriceFilters}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyPriceFilters();
                }
              }}
              placeholder="Max ৳"
              className="min-h-12 w-full rounded-full border border-line bg-background px-4 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Sort products</span>
            <select
              value={filters.sort}
              onChange={(event) => updateImmediateFilter("sort", event.target.value)}
              className="min-h-12 w-full rounded-full border border-line bg-background px-4 text-sm"
            >
              <option value="">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </label>
        </div>
        {hasFilters && (
          <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
            <X size={14} /> Reset filters
          </button>
        )}
      </div>

      <div id="shop-results" className="mb-4 flex scroll-mt-28 items-center justify-between">
        <p aria-live="polite" className="text-sm text-muted">
          {total} {total === 1 ? "piece" : "pieces"} · Page {page} of {Math.max(totalPages, 1)}
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchPage(filters, page, { scroll: false })} />
      ) : isPending ? (
        <ProductGridSkeleton />
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => <ProductCard key={product._id ?? product.id} product={product} />)}
        </div>
      ) : (
        <EmptyState
          title={hasFilters ? "No matching styles" : "The catalog is just getting started"}
          message={hasFilters ? "There are no pieces in this selection yet. Try a different search or clear your filters." : "No products are available in the catalog yet. Check back soon for new arrivals."}
          actionLabel={hasFilters ? "Clear filters" : undefined}
          onAction={hasFilters ? resetFilters : undefined}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={changePage}
        disabled={isPending}
        label="Shop pages"
      />
    </div>
  );
}
