import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import ContactOptions from "@/components/shared/ContactOptions";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="site-container grid items-start gap-x-10 gap-y-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src={siteConfig.logo} alt="" width={48} height={48} />
            <span className="text-sm font-extrabold tracking-[0.14em] text-brand">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-left text-sm leading-7 text-muted">
            Thoughtfully selected modest fashion and three-piece outfits, made easier to discover and enjoy.
          </p>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li><Link className="transition hover:text-brand hover:underline" href="/items">Shop all</Link></li>
            <li><Link className="transition hover:text-brand hover:underline" href="/about">About us</Link></li>
            <li><Link className="transition hover:text-brand hover:underline" href="/login">Sign in</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">For sellers</h2>
          <Link href="/items/add" className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-brand">
            Share a product <ArrowUpRight size={15} />
          </Link>
          <p className="mt-3 max-w-xs text-xs leading-6 text-muted">
            Sign in to create and manage your own product listings.
          </p>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">Contact</h2>
          <ContactOptions variant="compact" />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="site-container flex flex-col gap-2 py-5 text-center text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© {siteConfig.name}. All rights reserved.</span>
          <span>{siteConfig.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
