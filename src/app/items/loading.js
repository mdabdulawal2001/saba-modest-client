import { ProductGridSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <main className="site-container flex-1 py-10 sm:py-14">
      <div className="skeleton mb-3 h-4 w-24 rounded" />
      <div className="skeleton mb-4 h-10 w-64 rounded" />
      <div className="skeleton mb-8 h-20 rounded-3xl" />
      <ProductGridSkeleton />
    </main>
  );
}
