export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <div aria-hidden="true" className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="site-container flex min-h-[68px] items-center justify-between rounded-2xl border border-line bg-surface/90">
        <div className="flex items-center gap-3">
          <div className="skeleton h-11 w-11 rounded-xl" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
        <div className="hidden gap-3 lg:flex">
          <div className="skeleton h-8 w-16 rounded-full" />
          <div className="skeleton h-8 w-16 rounded-full" />
          <div className="skeleton h-8 w-16 rounded-full" />
        </div>
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="animate-pulse space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="skeleton h-8 w-1/2 rounded" />
      {Array.from({ length: fields }, (_, index) => (
        <div key={index}>
          <div className="skeleton mb-2 h-3 w-28 rounded" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
      ))}
      <div className="skeleton h-12 rounded-full" />
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="site-container animate-pulse py-8 sm:py-12">
      <div className="skeleton h-5 w-40 rounded" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="skeleton aspect-[4/5] max-h-[760px] rounded-[1.8rem]" />
        <div className="space-y-5 py-4 lg:py-8">
          <div className="skeleton h-9 w-28 rounded-full" />
          <div className="skeleton h-12 w-3/4 rounded" />
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-px w-full" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-12 w-40 rounded-full" />
        </div>
      </div>
      <section className="mt-16 border-t border-line pt-12 sm:mt-20">
        <div className="mb-7 space-y-3">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-10 w-72 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      </section>
    </div>
  );
}
