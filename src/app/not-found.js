import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="site-container flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">404 · Not found</p>
      <h1 className="display-font mt-4 text-4xl sm:text-5xl">We couldn’t find that page.</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">The page or product may have moved, or the address may not be valid.</p>
      <Link href="/items" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:opacity-90">
        <ArrowLeft size={16} /> Back to the collection
      </Link>
    </main>
  );
}
