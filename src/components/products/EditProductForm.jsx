"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getProductById, updateProduct } from "@/lib/api";
import { siteConfig } from "@/config/site";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { FormSkeleton } from "@/components/shared/Skeletons";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-line bg-background px-3 text-sm";

function productOwnerId(product) {
  const creator = product?.createdBy;
  return String(creator?._id ?? creator?.id ?? creator ?? "");
}

export default function EditProductForm({ id }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const sessionUserId = session?.user?.id;
  const [product, setProduct] = useState(null);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [pendingData, setPendingData] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProduct = useCallback(
    () => getProductById(id)
      .then((item) => {
        if (productOwnerId(item) !== String(sessionUserId || "")) {
          setError("You do not have permission to edit this product.");
          return;
        }
        setProduct(item);
      })
      .catch((requestError) => {
        setError(requestError.message || "Could not load this product.");
      })
      .finally(() => {
        setLoading(false);
      }),
    [id, sessionUserId],
  );

  useEffect(() => {
    if (!sessionPending) startTransition(() => setSessionResolved(true));
  }, [sessionPending]);

  useEffect(() => {
    if (!sessionResolved) return;
    if (!sessionUserId) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/items/edit/${id}`)}`);
      return;
    }
    loadProduct();
  }, [id, loadProduct, router, sessionResolved, sessionUserId]);

  const submit = (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const image = String(values.get("image") || "").trim();
    if (image) {
      try {
        const parsed = new URL(image);
        if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) {
          throw new Error();
        }
      } catch {
        setError("Enter a valid image URL, or leave the field blank.");
        return;
      }
    }
    setError("");
    setPendingData({
      title: String(values.get("title")).trim(),
      shortDescription: String(values.get("shortDescription")).trim(),
      description: String(values.get("description")).trim(),
      price: Number(values.get("price")),
      category: String(values.get("category")),
      stock: Number(values.get("stock")),
      image,
      sizes: String(values.get("sizes") || "").split(",").map((size) => size.trim()).filter(Boolean),
      featured: values.get("featured") === "on",
    });
    setConfirmationMessage(`Confirm the updated details for “${product.title}”.`);
    setConfirmationOpen(true);
  };

  const saveChanges = async () => {
    if (!pendingData) return;
    setSaving(true);
    setError("");
    try {
      await updateProduct(id, pendingData);
      setConfirmationOpen(false);
      setPendingData(null);
      toast.success("Product details updated.");
      router.replace("/items/manage");
    } catch (requestError) {
      const message = requestError.message || "The product could not be updated.";
      setError(message);
      setConfirmationMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!sessionResolved || loading) return <FormSkeleton fields={7} />;
  if (error && !product) return <ErrorState message={error} onRetry={() => {
    setError("");
    setLoading(true);
    loadProduct();
  }} />;
  if (!product) {
    return <EmptyState title="Product unavailable" message="This product is not available to edit." actionHref="/items/manage" actionLabel="Back to My Products" />;
  }

  return (
    <>
      <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-2 sm:p-7">
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200 sm:col-span-2">{error}</p>}
        <label className="text-sm font-semibold">Title<input name="title" required maxLength={200} defaultValue={product.title} className={inputClass} /></label>
        <label className="text-sm font-semibold">Short description<input name="shortDescription" required maxLength={200} defaultValue={product.shortDescription} className={inputClass} /></label>
        <label className="text-sm font-semibold">Price (BDT)<input name="price" required type="number" min="0.01" max="10000000" step="0.01" defaultValue={product.price} className={inputClass} /></label>
        <label className="text-sm font-semibold">Category<select name="category" defaultValue={product.category} className={inputClass}>{siteConfig.categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="text-sm font-semibold">Stock<input name="stock" required type="number" min="0" max="10000000" defaultValue={product.stock} className={inputClass} /></label>
        <label className="text-sm font-semibold">Sizes<input name="sizes" defaultValue={(product.sizes || []).join(", ")} className={inputClass} /></label>
        <label className="text-sm font-semibold sm:col-span-2">Image URL<input name="image" type="url" defaultValue={product.image || ""} className={inputClass} /></label>
        <label className="text-sm font-semibold sm:col-span-2">Description<textarea name="description" required maxLength={5000} rows={5} defaultValue={product.description} className={`${inputClass} py-3`} /></label>
        <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2"><input name="featured" type="checkbox" defaultChecked={Boolean(product.featured)} /> Featured product</label>
        <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => router.push("/items/manage")} className="button-secondary min-h-11 rounded-full px-5 text-sm font-semibold">Cancel</button>
          <button type="submit" className="button-primary min-h-11 rounded-full px-5 text-sm font-semibold">Review changes</button>
        </div>
      </form>
      <ConfirmDialog
        open={confirmationOpen}
        title="Save these product changes?"
        message={confirmationMessage}
        confirmLabel="Save changes"
        tone="primary"
        busy={saving}
        onConfirm={saveChanges}
        onClose={() => {
          if (!saving) {
            setConfirmationOpen(false);
            setPendingData(null);
          }
        }}
      />
    </>
  );
}
