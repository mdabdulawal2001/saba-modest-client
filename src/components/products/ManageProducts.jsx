"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { deleteProduct, getMyProducts } from "@/lib/api";
import { formatPrice, getProductId } from "@/lib/utils";
import { EmptyState, ErrorState } from "@/components/shared/States";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ProductImage from "@/components/products/ProductImage";
import Pagination from "@/components/shared/Pagination";

function ProductActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onEdit} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:bg-background">
        <Pencil size={14} /> Edit
      </button>
      <button type="button" onClick={onDelete} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30">
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
}

export default function ManageProducts() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const deleteInFlight = useRef(false);
  const pendingPageScroll = useRef(false);

  const loadProducts = useCallback(async (requestedPage = page) => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyProducts({ page: requestedPage, limit: 10 });
      const totalPages = Number(result.pagination?.totalPages) || 0;
      if (requestedPage > Math.max(totalPages, 1)) {
        setPage(Math.max(totalPages, 1));
        return;
      }
      setProducts(result.items);
      setPagination(result.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent("/items/manage")}`);
      return;
    }
    let active = true;
    getMyProducts({ page, limit: 10 })
      .then((result) => {
        if (!active) return;
        const totalPages = Number(result.pagination?.totalPages) || 0;
        if (page > Math.max(totalPages, 1)) {
          setPage(Math.max(totalPages, 1));
          return;
        }
        setProducts(result.items);
        setPagination(result.pagination);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isPending, page, router, session?.user]);

  useEffect(() => {
    if (!loading && pendingPageScroll.current) {
      pendingPageScroll.current = false;
      requestAnimationFrame(() => {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        document.getElementById("listings-results")?.scrollIntoView({ behavior, block: "start" });
      });
    }
  }, [loading]);

  const confirmDelete = async () => {
    if (!deletingProduct || deleteInFlight.current) return;
    deleteInFlight.current = true;
    setDeleteBusy(true);
    try {
      await deleteProduct(getProductId(deletingProduct));
      const remaining = products.filter((product) => getProductId(product) !== getProductId(deletingProduct));
      setProducts(remaining);
      setDeletingProduct(null);
      toast.success("Product deleted.");
      if (!remaining.length && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadProducts(page);
      }
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      deleteInFlight.current = false;
      setDeleteBusy(false);
    }
  };

  const changePage = (nextPage) => {
    const totalPages = Number(pagination?.totalPages) || 0;
    if (loading || nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    pendingPageScroll.current = true;
    setLoading(true);
    setPage(nextPage);
  };

  const itemRows = (mobile) => products.map((product) => {
    const id = getProductId(product);
    return (
      <article key={id} className={`rounded-2xl border border-line bg-surface p-4 ${mobile ? "" : "grid grid-cols-[minmax(220px,1.6fr)_1fr_0.7fr_1.1fr] items-center gap-4 rounded-none border-x-0 border-t-0 p-4 last:border-b-0"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <ProductImage src={product.image} alt="" containerClass="h-14 w-12 shrink-0 rounded-lg" sizes="48px" placeholderLabel="" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{product.title}</h3>
            <p className="mt-1 text-xs text-muted">{product.category}</p>
          </div>
        </div>
        {mobile ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-brand">{formatPrice(product.price)}<span className="ml-2 text-xs font-normal text-muted">· Stock {product.stock}</span></div>
            <ProductActions onEdit={() => setEditingProduct(product)} onDelete={() => setDeletingProduct(product)} />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted">{product.stock} units</p>
            <ProductActions onEdit={() => setEditingProduct(product)} onDelete={() => setDeletingProduct(product)} />
          </>
        )}
      </article>
    );
  });

  return (
    <>
      {isPending || (loading && !error) ? (
        <div role="status" aria-label="Loading your products" className="animate-pulse">
          <span className="sr-only">Loading your products</span>
          <div aria-hidden="true" className="space-y-3 md:hidden">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton h-24 rounded-2xl" />)}
          </div>
          <div aria-hidden="true" className="hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
            <div className="grid grid-cols-[minmax(220px,1.6fr)_1fr_0.7fr_1.1fr] gap-4 border-b border-line bg-background px-4 py-3">
              {[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-3 w-16 rounded" />)}
            </div>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="grid min-h-[88px] grid-cols-[minmax(220px,1.6fr)_1fr_0.7fr_1.1fr] items-center gap-4 border-b border-line px-4 py-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-14 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/3 rounded" />
                  </div>
                </div>
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-9 w-16 rounded-full" />
                  <div className="skeleton h-9 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadProducts} />
      ) : products.length === 0 ? (
        <EmptyState title="No products to manage" message="Your account does not have any product listings yet." actionHref="/items/add" actionLabel="Add your first product" />
      ) : (
        <div>
          <div id="listings-results" className="mb-4 flex scroll-mt-28 items-center justify-between">
            <p className="text-sm text-muted">{pagination?.total ?? products.length} {(pagination?.total ?? products.length) === 1 ? "product" : "products"} · Page {page} of {Math.max(Number(pagination?.totalPages) || 0, 1)}</p>
            <Link href="/items/add" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-4 text-xs font-semibold text-white hover:opacity-90"><Plus size={15} /> Add product</Link>
          </div>
          <div className="space-y-3 md:hidden">{itemRows(true)}</div>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
            <div className="grid grid-cols-[minmax(220px,1.6fr)_1fr_0.7fr_1.1fr] gap-4 border-b border-line bg-background px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              <span>Product</span><span>Price</span><span>Stock</span><span>Actions</span>
            </div>
            {itemRows(false)}
          </div>
          <Pagination
            currentPage={page}
            totalPages={Number(pagination?.totalPages) || 0}
            onPageChange={changePage}
            disabled={loading}
            label="My Products pages"
          />
        </div>
      )}
      <ConfirmDialog
        open={Boolean(editingProduct)}
        title="Edit this product?"
        message={`Continue to the edit page for “${editingProduct?.title || "this product"}”?`}
        confirmLabel="Continue to edit"
        tone="primary"
        onConfirm={() => {
          const id = getProductId(editingProduct);
          setEditingProduct(null);
          router.push(`/items/edit/${encodeURIComponent(id)}`);
        }}
        onClose={() => setEditingProduct(null)}
      />
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="Delete this product?"
        message={`“${deletingProduct?.title || "This product"}” will be removed from your listings. This action cannot be undone.`}
        confirmLabel="Delete product"
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onClose={() => !deleteBusy && setDeletingProduct(null)}
      />
    </>
  );
}
