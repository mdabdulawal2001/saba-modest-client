"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { siteConfig } from "@/config/site";
import { createProduct } from "@/lib/api";
import { getProductId } from "@/lib/utils";
import { ErrorState } from "@/components/shared/States";

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-line bg-background px-4 text-sm";

export default function AddProductForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const image = String(form.get("image") || "").trim();
    if (image) {
      try {
        const parsed = new URL(image);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        setError("Enter an absolute HTTP or HTTPS image URL, or leave the field blank.");
        return;
      }
    }

    const product = {
      title: String(form.get("title") || "").trim(),
      shortDescription: String(form.get("shortDescription") || "").trim(),
      description: String(form.get("description") || "").trim(),
      price: Number(form.get("price")),
      category: String(form.get("category") || ""),
      stock: Number(form.get("stock")),
      image,
      sizes: String(form.get("sizes") || "").split(",").map((size) => size.trim()).filter(Boolean),
      featured: form.get("featured") === "on",
    };

    submitting.current = true;
    setBusy(true);
    try {
      const created = await createProduct(product);
      toast.success("Your product has been added.");
      const id = getProductId(created);
      router.replace(id ? `/items/${id}` : "/items/manage");
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} autoComplete="off" className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold sm:col-span-2">
          Product title <span className="text-brand">*</span>
          <input name="title" required maxLength={200} defaultValue="" autoComplete="off" className={fieldClass} placeholder="e.g. Embroidered three-piece set" />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Short description <span className="text-brand">*</span>
          <input name="shortDescription" required maxLength={200} defaultValue="" autoComplete="off" className={fieldClass} placeholder="A short introduction (up to 200 characters)" />
        </label>
        <label className="text-sm font-semibold">
          Price (BDT) <span className="text-brand">*</span>
          <input name="price" type="number" min="0.01" max="10000000" step="0.01" required defaultValue="" className={fieldClass} placeholder="0" />
        </label>
        <label className="text-sm font-semibold">
          Category <span className="text-brand">*</span>
          <select name="category" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select category</option>
            {siteConfig.categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Stock <span className="text-brand">*</span>
          <input name="stock" type="number" min="0" max="10000000" step="1" required defaultValue="" className={fieldClass} placeholder="0" />
        </label>
        <label className="text-sm font-semibold">
          Sizes
          <input name="sizes" maxLength={600} defaultValue="" className={fieldClass} placeholder="S, M, L, XL" />
          <span className="mt-1 block text-xs font-normal text-muted">Separate sizes with commas.</span>
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Image URL
          <input name="image" type="url" maxLength={2048} defaultValue="" className={fieldClass} placeholder="https://…" />
          <span className="mt-1 block text-xs font-normal text-muted">Use a publicly accessible HTTP or HTTPS image URL.</span>
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Product description <span className="text-brand">*</span>
          <textarea name="description" required maxLength={5000} rows={6} defaultValue="" className={`${fieldClass} py-3`} placeholder="Share the details shoppers should know about this piece." />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
          <input name="featured" type="checkbox" className="h-4 w-4 accent-[#7b3f35]" />
          Request this product to be featured
        </label>
      </div>
      {error && <div className="mt-5"><ErrorState message={error} /></div>}
      <button type="submit" disabled={busy} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 sm:w-auto">
        {busy ? "Adding product…" : "Add product"}
      </button>
    </form>
  );
}
