"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice, getProductId } from "@/lib/utils";
import ProductImage from "@/components/products/ProductImage";

export default function ProductCard({ product }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-line bg-surface"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: "0 16px 40px rgba(40,37,31,0.10)" }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Link href={`/items/${getProductId(product)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#eee7dc] dark:bg-[#332f28]">
          <ProductImage
            src={product.image}
            alt={product.title || "Modest fashion product"}
            absolute
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            imageClass="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          {product.category && (
            <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand backdrop-blur">
              {product.category}
            </span>
          )}
        </div>
        <div className="p-3.5 sm:p-4">
          <p className="line-clamp-1 min-h-5 text-sm font-semibold leading-5 group-hover:text-brand sm:text-base">
            {product.title}
          </p>
          <p className="mt-2 text-sm font-bold text-brand">{formatPrice(product.price)}</p>
          <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted">
            View details <ArrowUpRight size={14} />
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
