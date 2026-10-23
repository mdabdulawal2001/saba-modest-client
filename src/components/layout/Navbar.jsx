"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Menu,
  PackagePlus,
  ShoppingBag,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient, GOOGLE_LOGIN_PENDING_KEY } from "@/lib/auth-client";
import { siteConfig } from "@/config/site";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ThemeToggle from "@/components/shared/ThemeToggle";
import UserAvatar from "@/components/layout/UserAvatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuToggleRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest("[data-profile-menu]")) setProfileOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  useEffect(() => {
    const pendingLogin = window.sessionStorage.getItem(GOOGLE_LOGIN_PENDING_KEY);
    if (!pendingLogin) return;

    const loginFailed = pathname === "/login"
      && new URLSearchParams(window.location.search).get("oauthError") === "google";
    if (loginFailed) {
      window.sessionStorage.removeItem(GOOGLE_LOGIN_PENDING_KEY);
      return;
    }

    const startedAt = Number(pendingLogin);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt > 10 * 60 * 1000) {
      window.sessionStorage.removeItem(GOOGLE_LOGIN_PENDING_KEY);
      return;
    }
    if (isPending || !session?.user) return;

    window.sessionStorage.removeItem(GOOGLE_LOGIN_PENDING_KEY);
    toast.success("Google login successful!");
  }, [isPending, pathname, session?.user]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
      if (event.key === "Tab" && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll(
          'a[href], button:not([disabled])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const closeAtDesktopBreakpoint = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeAtDesktopBreakpoint);
    mobileMenuRef.current?.querySelector("button")?.focus();
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeAtDesktopBreakpoint);
    };
  }, [closeMobileMenu, mobileOpen]);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMobileOpen(false);
    setProfileOpen(false);
  }

  const signOut = async () => {
    setLogoutBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message || "Sign out failed.");
      toast.success("You have signed out.");
      setLogoutOpen(false);
      setProfileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not sign out.");
    } finally {
      setLogoutBusy(false);
    }
  };

  const user = session?.user;
  const links = [
    ...siteConfig.navigation,
    ...(user ? [{ label: "My Products", href: "/items/manage" }] : []),
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/items") return pathname === "/items";
    if (href === "/items/manage") {
      return pathname === href || pathname.startsWith("/items/manage/") || pathname.startsWith("/items/edit/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 pt-3">
        <nav
          aria-label="Main navigation"
          className="site-container navbar-container flex min-h-[68px] items-center justify-between gap-3 rounded-2xl border border-line/80 bg-surface/90 shadow-[0_12px_36px_rgba(23,59,131,0.10)] backdrop-blur-xl"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1.5" aria-label={`${siteConfig.name} home`}>
            <Image src={siteConfig.logo} alt={siteConfig.logoAlt} width={44} height={44} priority />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-[0.12em] text-brand sm:text-base">
                {siteConfig.name}
              </span>
              <span className="hidden text-[9px] tracking-[0.13em] text-muted sm:block">
                MODEST STYLE, THOUGHTFULLY CHOSEN
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-brand/10 text-brand"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            {isPending ? (
              <div className="hidden h-10 w-24 animate-pulse rounded-full bg-line sm:block" aria-label="Loading account" />
            ) : user ? (
              <div className="relative hidden sm:block" data-profile-menu>
                <button
                  type="button"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((value) => !value)}
                  className="button-secondary inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold"
                >
                  <UserAvatar user={user} className="h-8 w-8 text-xs" />
                  <span className="max-w-28 truncate">{user.name || "Account"}</span>
                  <ChevronDown size={15} className={profileOpen ? "rotate-180 transition" : "transition"} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-line bg-surface p-2 shadow-xl">
                    <Link href="/items/manage" onClick={() => setProfileOpen(false)} className="button-quiet flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm">
                      <ShoppingBag size={16} /> My Products
                    </Link>
                    <Link href="/items/add" onClick={() => setProfileOpen(false)} className="button-quiet flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm">
                      <PackagePlus size={16} /> Add a product
                    </Link>
                    <button
                      type="button"
                      onClick={() => setLogoutOpen(true)}
                      className="button-quiet flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-700 dark:text-red-300"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="button-quiet rounded-full px-3 py-2 text-sm font-semibold">
                  Sign in
                </Link>
                <Link href="/register" className="button-primary rounded-full px-4 py-2.5 text-sm font-semibold">
                  Join us
                </Link>
              </div>
            )}
            <button
              type="button"
              ref={menuToggleRef}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((value) => !value)}
              className="button-secondary grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMobileMenu}
                className="fixed inset-0 z-[90] cursor-default bg-black/45 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              />
              <motion.aside
                ref={mobileMenuRef}
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="fixed inset-y-0 right-0 z-[91] flex w-[min(68vw,320px)] flex-col overflow-hidden border-l border-line bg-surface shadow-2xl lg:hidden"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex h-[76px] min-h-[76px] shrink-0 items-center justify-between border-b border-line bg-section-alt px-4">
                  <Link href="/" onClick={closeMobileMenu} className="flex min-w-0 items-center gap-1.5">
                    <Image src={siteConfig.logo} alt="" width={42} height={42} />
                    <span className="truncate text-sm font-extrabold tracking-[0.1em] text-brand">{siteConfig.name}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeMobileMenu}
                    className="button-secondary grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted shadow-sm"
                  >
                    <X size={19} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-surface px-4 py-5">
                  {!isPending && user && (
                    <div className="mb-4 flex flex-col items-center rounded-2xl border border-line bg-section-alt px-3 py-4 text-center">
                      <UserAvatar user={user} className="h-16 w-16 text-xl" />
                      <p className="mt-3 max-w-full truncate text-sm font-bold">{user.name?.trim() || "User"}</p>
                      {user.email && <p className="mt-1 max-w-full truncate text-xs text-muted">{user.email}</p>}
                    </div>
                  )}
                  <nav aria-label="Mobile navigation links" className="grid gap-1.5">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive(link.href) ? "border border-brand/20 bg-brand/10 text-brand shadow-sm" : "text-muted hover:bg-brand/5 hover:text-brand"
                        }`}
                      >
                        {link.label}
                        {isActive(link.href) && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />}
                      </Link>
                    ))}
                  </nav>
                  <div className="my-4 h-px bg-line" />
                  {isPending ? (
                    <div className="skeleton h-10 rounded-xl" aria-label="Loading account" />
                  ) : user ? (
                    <div className="grid gap-2">
                      <Link href="/items/add" onClick={closeMobileMenu} className="button-quiet rounded-xl px-4 py-3 text-sm font-medium text-muted">Add a product</Link>
                      <button type="button" onClick={() => { closeMobileMenu(); setLogoutOpen(true); }} className="button-secondary flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-700 shadow-sm dark:text-red-300">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Link href="/login" onClick={closeMobileMenu} className="button-secondary rounded-xl px-4 py-3 text-center text-sm font-semibold">Sign in</Link>
                      <Link href="/register" onClick={closeMobileMenu} className="button-primary rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-sm">Join us</Link>
                    </div>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>
      <ConfirmDialog
        open={logoutOpen}
        title="Sign out of SABA MODEST?"
        message="You can sign in again whenever you are ready."
        confirmLabel="Sign out"
        busy={logoutBusy}
        onConfirm={signOut}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
