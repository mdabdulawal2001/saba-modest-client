import Link from "next/link";
import { ArrowLeft, LayoutDashboard, PackagePlus } from "lucide-react";

const links = [
  { href: "/items/manage", label: "My Products", icon: LayoutDashboard },
  { href: "/items/add", label: "Add a product", icon: PackagePlus },
];

export default function ManagementShell({ title, description, children }) {
  return (
    <main className="site-container flex-1 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">Your SABA MODEST space</p>
        <h1 className="display-font mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      </div>
      <div className="grid items-stretch gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside aria-label="Product management" className="flex flex-col rounded-2xl border border-line bg-surface p-2">
          <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} aria-current={["My Products", "Edit product"].includes(title) && href.endsWith("manage") || title === "Add a product" && href.endsWith("add") ? "page" : undefined} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-muted hover:bg-background hover:text-brand lg:justify-start ${["My Products", "Edit product"].includes(title) && href.endsWith("manage") || title === "Add a product" && href.endsWith("add") ? "bg-brand/10 text-brand" : ""}`}>
                <Icon size={17} /> {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-auto hidden min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted hover:bg-background hover:text-brand lg:flex"
          >
            <ArrowLeft size={17} /> Back to Home
          </Link>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
