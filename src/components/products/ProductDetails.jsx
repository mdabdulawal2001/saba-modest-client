import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductImage from "@/components/products/ProductImage";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/utils";

export default function ProductDetails({ product, relatedProducts = [], relatedError = "" }) {
  return (
    <main className="site-container flex-1 py-8 sm:py-12">
      <Link href="/items" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft size={16} /> Back to the collection
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] max-h-[760px] overflow-hidden rounded-[1.8rem] bg-section-alt">
          <ProductImage
            src={product.image}
            alt={product.title}
            absolute
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center py-2 lg:py-8">
          <span className="w-fit rounded-full bg-brand/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            {product.category}
          </span>
          <h1 className="display-font mt-5 text-4xl leading-tight sm:text-5xl">{product.title}</h1>
          {product.shortDescription && <p className="mt-4 text-base leading-7 text-muted">{product.shortDescription}</p>}
          <p className="mt-5 text-2xl font-bold text-brand">{formatPrice(product.price)}</p>
          <div className="my-7 h-px bg-line" />
          {product.description && (
            <div>
              <h2 className="text-sm font-bold">About this piece</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{product.description}</p>
            </div>
          )}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mt-7">
              <h2 className="text-sm font-bold">Available sizes</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => <li key={size} className="rounded-full border border-line px-4 py-2 text-sm">{size}</li>)}
              </ul>
            </div>
          )}
          {Number.isFinite(Number(product.stock)) && (
            <p className="mt-7 text-sm text-muted">
              {product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}
            </p>
          )}
          <p className="mt-8 max-w-md text-xs leading-5 text-muted">
            Browse the collection for more styles. SABA MODEST does not process orders or payments through this page.
          </p>
        </div>
      </div>
      <section className="mt-16 border-t border-line pt-12 sm:mt-20" aria-labelledby="related-heading">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">More to discover</p>
            <h2 id="related-heading" className="display-font mt-3 text-3xl sm:text-4xl">
              {product.category ? `More from ${product.category}` : "Related pieces"}
            </h2>
          </div>
          <Link href="/items" className="hidden text-sm font-semibold text-brand hover:underline sm:block">Shop all</Link>
        </div>
        {relatedError ? (
          <p role="status" className="text-sm text-muted">
            Related pieces could not be loaded. {relatedError}
          </p>
        ) : relatedProducts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {relatedProducts.map((item) => <ProductCard key={item._id ?? item.id} product={item} />)}
          </div>
        ) : (
          <p className="text-sm text-muted">There are no other pieces in this category yet.</p>
        )}
      </section>
    </main>
  );
}
