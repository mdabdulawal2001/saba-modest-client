import Link from "next/link";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";

export const metadata = {
  title: "About SABA MODEST",
  description: "Learn about the modest-fashion focus and shopping experience at SABA MODEST.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="site-container py-14 sm:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">Our point of view</p>
        <h1 className="display-font mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
          Modest fashion, with room to be yourself.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
          SABA MODEST is a place to discover modest fashion and three-piece outfits with a little more ease. We believe getting dressed should feel comfortable, personal, and entirely your own.
        </p>
        <Link href="/items" className="button-primary mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold">
          Explore the collection <ArrowRight size={16} />
        </Link>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="site-container grid gap-10 py-14 sm:py-18 md:grid-cols-2 md:items-center">
          <div className="rounded-[2rem] bg-[#e8ddd1] p-8 dark:bg-[#332f28] sm:p-12">
            <p className="display-font text-3xl leading-snug sm:text-4xl">
              “The best style is the one that lets you feel at home in yourself.”
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-brand">The SABA MODEST spirit</p>
          </div>
          <div>
            <h2 className="display-font text-3xl sm:text-4xl">A thoughtful way to find your next favorite.</h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Our catalog brings together modest styles and three-piece outfits in one easy-to-browse place. Product details are presented clearly, so you can explore available descriptions, sizes, and stock before making your choice.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              We keep the experience simple and customer-first: discover the collection, compare the details, and choose the pieces that fit your own way of dressing.
            </p>
          </div>
        </div>
      </section>

      <section className="site-container grid gap-4 py-14 sm:py-18 md:grid-cols-3">
        {[
          { icon: Leaf, title: "Modest by intention", text: "A focused space for modest fashion and outfits chosen with everyday wear in mind." },
          { icon: Sparkles, title: "Quality in the details", text: "Clear product information helps you understand each listed piece before you decide." },
          { icon: Heart, title: "Here for your experience", text: "A welcoming, straightforward catalog puts discovery and your preferences first." },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border border-line bg-surface p-6">
            <Icon size={23} className="text-brand" />
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
