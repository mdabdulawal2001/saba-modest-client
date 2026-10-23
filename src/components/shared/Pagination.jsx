import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  return pages.flatMap((page, index) => {
    if (index === 0) return [page];
    const previous = pages[index - 1];
    return [...(page - previous > 1 ? ["ellipsis"] : []), page];
  });
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  label,
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label={label} className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        className="button-secondary inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold disabled:cursor-not-allowed sm:px-4"
      >
        <ChevronLeft size={17} /> <span>Previous</span>
      </button>
      <ul className="flex items-center gap-1" aria-label="Page numbers">
        {getPageItems(currentPage, totalPages).map((item, index) => (
          <li key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <span aria-hidden="true" className="grid min-h-10 min-w-6 place-items-center text-sm text-muted">…</span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(item)}
                disabled={disabled || item === currentPage}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={`grid min-h-10 min-w-10 place-items-center rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  item === currentPage
                    ? "button-primary"
                    : "button-secondary"
                } disabled:cursor-default`}
              >
                {item}
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        className="button-secondary inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold disabled:cursor-not-allowed sm:px-4"
      >
        <span>Next</span> <ChevronRight size={17} />
      </button>
    </nav>
  );
}
