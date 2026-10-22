import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { getProducts } from "@/lib/api";

export default async function FeaturedProducts() {
  await connection();
  let products = [];
  let error = "";
  try {
    const [featuredResult, allResult] = await Promise.all([
      getProducts({ featured: true, limit: 50 }),
      getProducts({ limit: 50 }),
    ]);
    const uniqueProducts = new Map();
    [...featuredResult.items, ...allResult.items].forEach((product) => {
      const id = product._id ?? product.id;
      if (id && !uniqueProducts.has(String(id))) uniqueProducts.set(String(id), product);
    });
    products = [...uniqueProducts.values()].slice(0, 8);
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <section className="border-y border-line bg-surface">
      <div className="site-container py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">A few favorites</p>
            <h2 className="display-font mt-3 text-3xl sm:text-4xl">Featured pieces</h2>
          </div>
          <Link href="/items" className="hidden items-center gap-2 text-sm font-semibold text-brand hover:underline sm:flex">
            Shop all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8">
          {error ? (
            <ErrorState message={error} />
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <EmptyState
              title="New finds are on their way"
              message="There are no featured pieces in the catalog just yet. Explore all products as the collection grows."
              actionHref="/items"
              actionLabel="Browse the catalog"
            />
          )}
        </div>
        <Link href="/items" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand sm:hidden">
          Shop all <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
