import { getContactOptions } from "@/config/contact";

export default function ContactOptions({ variant = "cards" }) {
  const options = getContactOptions();
  const compact = variant === "compact";
  const activeClass = "transition duration-200 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  const cardClass = "transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <ul className={compact ? "mt-5 space-y-3" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
      {options.map(({ label, detail, href, icon: Icon, external }) => {
        const className = compact
          ? `group inline-flex min-h-10 min-w-0 items-center gap-3 rounded-lg text-sm text-muted ${href ? activeClass : "cursor-default"}`
          : `group flex min-h-32 items-start gap-4 rounded-2xl border border-line p-5 sm:p-6 ${
            href
              ? `${cardClass} bg-surface hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg motion-reduce:hover:translate-y-0`
              : "cursor-default bg-background/60"
          }`;
        const content = (
          <>
            <span className={compact
              ? "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white"
              : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white"}
            >
              <Icon size={compact ? 16 : 20} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={`block font-semibold text-foreground ${compact ? "" : "text-base"}`}>{label}</span>
              <span className={`block text-muted ${compact ? "mt-0.5 break-all text-xs" : "mt-2 break-words text-sm leading-5"}`}>{detail}</span>
            </span>
          </>
        );

        return (
          <li key={label}>
            {href ? (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`${label}: ${detail}`}
                className={className}
              >
                {content}
              </a>
            ) : (
              <div
                role="group"
                aria-label={`${label}, contact information not configured`}
                aria-disabled="true"
                className={className}
              >
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
