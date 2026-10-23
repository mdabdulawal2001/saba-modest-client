"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  onConfirm,
  onClose,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        document.querySelector("#dialog-cancel")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
            <AlertTriangle size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-dialog-title" className="text-lg font-semibold">
                {title}
              </h2>
              <button
                type="button"
                aria-label="Close dialog"
                disabled={busy}
                onClick={onClose}
                className="button-quiet rounded-lg p-1 text-muted"
              >
                <X size={18} />
              </button>
            </div>
            <p id="confirm-dialog-message" className="mt-2 text-sm leading-6 text-muted">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            id="dialog-cancel"
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={onClose}
            className="button-secondary min-h-11 rounded-full px-5 text-sm font-semibold"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold ${
              tone === "primary" ? "button-primary" : "button-danger"
            }`}
          >
            {busy && <LoaderCircle size={16} className="animate-spin" />}
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
