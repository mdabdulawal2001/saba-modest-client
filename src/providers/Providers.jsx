"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            background: "var(--toast-background)",
            color: "var(--toast-foreground)",
            border: "1px solid var(--toast-border)",
            fontSize: "14px",
          },
        }}
      />
    </ThemeProvider>
  );
}
