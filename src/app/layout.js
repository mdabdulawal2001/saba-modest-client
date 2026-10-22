import { Suspense } from "react";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/providers/Providers";
import { NavbarSkeleton } from "@/components/shared/Skeletons";

export const metadata = {
  title: {
    default: `${siteConfig.name} | Modest Fashion`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Thoughtfully selected modest fashion and three-piece outfits for everyday elegance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <Suspense fallback={<NavbarSkeleton />}>
            <Navbar />
          </Suspense>
          <div className="flex min-h-[calc(100dvh-5rem)] flex-1 flex-col">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
