"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ compact = false }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Change theme"}
      title="Change theme"
      className={`button-secondary inline-flex h-10 items-center justify-center gap-2 rounded-full ${compact ? "w-10" : "min-w-10 px-3"}`}
    >
      {mounted && isDark ? <Sun size={17} /> : <Moon size={17} />}
      {!compact && <span className="sr-only sm:not-sr-only sm:text-xs">Theme</span>}
    </button>
  );
}
