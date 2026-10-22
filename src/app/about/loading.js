export default function Loading() {
  return (
    <main className="flex-1 animate-pulse">
      <section className="site-container py-14 sm:py-20">
        <div className="skeleton h-3 w-36 rounded" />
        <div className="skeleton mt-5 h-20 max-w-3xl rounded" />
        <div className="skeleton mt-6 h-24 max-w-2xl rounded" />
        <div className="skeleton mt-8 h-12 w-48 rounded-full" />
      </section>
      <section className="border-y border-line bg-surface">
        <div className="site-container grid gap-10 py-14 sm:py-18 md:grid-cols-2 md:items-center">
          <div className="skeleton min-h-64 rounded-[2rem]" />
          <div className="space-y-4">
            <div className="skeleton h-16 max-w-lg rounded" />
            <div className="skeleton h-28 rounded" />
            <div className="skeleton h-20 rounded" />
          </div>
        </div>
      </section>
      <section className="site-container grid gap-4 py-14 sm:py-18 md:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item} className="skeleton h-40 rounded-3xl" />)}
      </section>
    </main>
  );
}
