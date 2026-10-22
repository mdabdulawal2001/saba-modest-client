import Link from "next/link";
import { AlertCircle, ArrowRight, PackageOpen } from "lucide-react";

export function EmptyState({
  title = "Nothing to show yet",
  message = "Try changing your filters or check back soon.",
  actionHref,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <PackageOpen className="mx-auto text-brand" size={30} />
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {actionLabel} <ArrowRight size={16} />
        </Link>
      ) : actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {actionLabel} <ArrowRight size={16} />
        </button>
      ) : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
      <AlertCircle className="mx-auto" size={28} />
      <h2 className="mt-3 font-semibold">We couldn’t load this right now</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 opacity-80">
        {message || "Please try again in a moment."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full border border-current px-5 py-2.5 text-sm font-semibold hover:bg-white/60 dark:hover:bg-black/20"
        >
          Try again
        </button>
      )}
    </div>
  );
}
