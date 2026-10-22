import ManagementShell from "@/components/layout/ManagementShell";

export default function Loading() {
  return (
    <ManagementShell title="Add a product" description="Share a modest-fashion piece with the SABA MODEST catalog. You can manage only products associated with your account.">
      <div aria-label="Loading product form" className="animate-pulse rounded-3xl border border-line bg-surface p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><div className="skeleton mb-2 h-3 w-28 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div className="sm:col-span-2"><div className="skeleton mb-2 h-3 w-36 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div><div className="skeleton mb-2 h-3 w-24 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div><div className="skeleton mb-2 h-3 w-24 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div><div className="skeleton mb-2 h-3 w-16 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div><div className="skeleton mb-2 h-3 w-16 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div className="sm:col-span-2"><div className="skeleton mb-2 h-3 w-24 rounded" /><div className="skeleton h-12 rounded-xl" /></div>
          <div className="sm:col-span-2"><div className="skeleton mb-2 h-3 w-36 rounded" /><div className="skeleton h-36 rounded-xl" /></div>
          <div className="skeleton h-5 w-48 rounded sm:col-span-2" />
        </div>
        <div className="skeleton mt-7 h-12 w-full rounded-full sm:w-36" />
      </div>
    </ManagementShell>
  );
}
