"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/States";

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="site-container flex-1 py-12">
      <ErrorState message={error.message} onRetry={reset} />
    </main>
  );
}
