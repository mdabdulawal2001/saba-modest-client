import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { ArrowRight, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ContactSection from "@/components/home/ContactSection";
import Reveal from "@/components/shared/Reveal";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import { siteConfig } from "@/config/site";
import { getProductCategories } from "@/lib/api";

export const metadata = {
  title: "Modest Fashion, Thoughtfully Chosen",
  description: siteConfig.description,
};

const values = [
  {
    icon: Leaf,
    title: "Thoughtful choices",
    text: "A considered selection of modest pieces, with comfort and personal style in mind.",
  },
  {
    icon: Sparkles,
    title: "Details that feel special",
    text: "From everyday layers to occasion-ready looks, discover pieces with a little extra care.",
  },
  {
    icon: HeartHandshake,
    title: "A more personal way to shop",
    text: "A clear, simple catalog helps you find the details you need before choosing what feels right.",
  },
];

async function CategorySection() {
  await connection();
  let categories = [];
  try {
    categories = await getProductCategories();
  } catch (error) {
    console.error("Could not load product categories:", error);
  }
  const categoryCards = categories.slice(0, 6).map((category, index) => ({
    ...category,
    image: siteConfig.categoryImages[index],
  }));

  return (
      <section className="site-container py-16 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">Find your feel</p>
            <h2 className="display-font mt-3 text-3xl sm:text-4xl">Shop by category</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            Browse a collection shaped around the way you want to feel, from laid-back days to special plans.
          </p>
        </div>
        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryCards.map((category, index) => (
            <Link
              href={`/items?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group relative isolate flex min-h-64 overflow-hidden rounded-3xl bg-[#473b32] transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:min-h-80"
            >
              <Image
                src={category.image}
                alt={`Explore ${category.name.toLowerCase()} modest fashion`}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 33vw"
                className="absolute inset-0 -z-20 object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="mt-auto flex w-full items-end justify-between p-5 text-white sm:p-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/75">0{index + 1}</span>
                  <h3 className="display-font mt-2 text-2xl">{category.name}</h3>
                  <p className="mt-1 text-xs text-white/80">
                    {`${category.count} ${category.count === 1 ? "piece" : "pieces"}`}
                  </p>
                </div>
                <span className="button-overlay grid h-10 w-10 place-items-center rounded-full transition-colors group-hover:border-[#7d3e35] group-hover:bg-[#7d3e35] group-hover:text-white">
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
        {!categoryCards.length && (
          <p className="mt-8 text-sm text-muted">Categories will appear here when products are available.</p>
        )}
      </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <Suspense fallback={
        <section className="site-container py-16 sm:py-20" aria-label="Loading categories">
          <div className="skeleton mb-4 h-8 w-56 rounded" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton min-h-64 rounded-3xl sm:min-h-80" />)}
          </div>
        </section>
      }>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<section className="border-y border-line bg-surface py-16 sm:py-20"><div className="site-container"><ProductGridSkeleton count={8} /></div></section>}>
        <FeaturedProducts />
      </Suspense>

      <section className="site-container py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">The SABA MODEST point of view</p>
          <h2 className="display-font mt-3 text-3xl sm:text-4xl">Style that feels like you</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            A welcoming place to discover modest fashion, with thoughtful choices at the heart of every visit.
          </p>
        </div>
        <Reveal className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-line bg-surface p-6 sm:p-7">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand"><Icon size={22} /></div>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="wardrobe-section border-y border-line">
        <div className="site-container grid gap-8 py-14 sm:py-18">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">A wardrobe, your way</p>
            <h2 className="display-font mt-3 text-3xl leading-tight sm:text-4xl">Discover pieces that make getting dressed feel easy.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              Take a look through the current SABA MODEST catalog and find a style that feels like your own.
            </p>
          </div>
          <Link href="/items" className="button-primary inline-flex min-h-12 w-fit shrink-0 items-center gap-2 rounded-full px-6 text-sm font-semibold">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
