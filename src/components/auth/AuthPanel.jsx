"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { authClient } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/utils";

export default function AuthPanel({ mode, callbackUrl = "/items", oauthError = false }) {
  const isRegister = mode === "register";
  const safeDestination = getSafeCallbackUrl(callbackUrl);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace(safeDestination);
      router.refresh();
    }
  }, [router, safeDestination, session?.user]);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    setFormError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const image = String(form.get("image") || "").trim();

    if (isRegister && name.length < 2) {
      setFormError("Please enter a name with at least 2 characters.");
      return;
    }
    if (isRegister && password !== form.get("confirmPassword")) {
      setFormError("Your passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (isRegister && image) {
      try {
        const imageUrl = new URL(image);
        if (!["https:", "http:"].includes(imageUrl.protocol) || imageUrl.username || imageUrl.password) {
          throw new Error();
        }
      } catch {
        setFormError("Enter a valid image URL, or leave this optional field blank.");
        return;
      }
    }

    submitting.current = true;
    setBusy(true);
    try {
      const callbackURL = `${window.location.origin}${safeDestination}`;
      const result = isRegister
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL,
            ...(image ? { image } : {}),
          })
        : await authClient.signIn.email({ email, password, callbackURL });

      if (result.error) throw new Error(result.error.message || (isRegister ? "Registration failed." : "Sign-in failed."));
      if (!result.data) throw new Error("Authentication did not return an account. Please try again.");

      toast.success(isRegister ? "Your account is ready." : "Welcome back.");
      router.replace(safeDestination);
      router.refresh();
    } catch (error) {
      setFormError(error.message || "The request could not be completed.");
      toast.error(error.message || "The request could not be completed.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto my-10 w-full max-w-md px-4 sm:my-14 sm:px-0">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-line bg-surface p-6 shadow-[0_22px_80px_rgba(40,37,31,0.08)] sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative">
          <div className="mb-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
              {isRegister ? <UserRound size={24} /> : <LockKeyhole size={23} />}
            </div>
            <h1 className="display-font mt-4 text-3xl">{isRegister ? "Create your account" : "Welcome back"}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {isRegister ? "Join SABA MODEST and discover pieces chosen with care." : "Sign in to continue to SABA MODEST."}
            </p>
          </div>

          {oauthError && (
            <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200">
              Google sign-in did not complete. You can try again or use your email and password.
            </p>
          )}

          {sessionPending ? (
            <div className="skeleton h-12 rounded-xl" aria-label="Checking your session" />
          ) : session?.user ? (
            <p className="text-center text-sm text-muted">You are signed in. Taking you back to your page…</p>
          ) : (
            <>
              <form onSubmit={submit} className="flex flex-col gap-4">
                {isRegister && (
                  <label className="block text-sm font-semibold">
                    Full name
                    <span className="relative mt-2 block">
                      <UserRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        name="name"
                        type="text"
                        autoComplete="name"
                        minLength={2}
                        maxLength={100}
                        required
                        placeholder="Your name"
                        className="min-h-12 w-full rounded-xl border border-line bg-background pl-11 pr-4 text-sm font-normal"
                      />
                    </span>
                  </label>
                )}
                <label className="block text-sm font-semibold">
                  Email address
                  <span className="relative mt-2 block">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="min-h-12 w-full rounded-xl border border-line bg-background pl-11 pr-4 text-sm font-normal"
                    />
                  </span>
                </label>
                <label className="block text-sm font-semibold">
                  Password
                  <span className="relative mt-2 block">
                    <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete={isRegister ? "new-password" : "current-password"}
                      minLength={8}
                      required
                      placeholder={isRegister ? "At least 8 characters" : "Your password"}
                      className="min-h-12 w-full rounded-xl border border-line bg-background pl-11 pr-12 text-sm font-normal"
                    />
                    <button
                      type="button"
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                      onClick={() => setPasswordVisible((value) => !value)}
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface"
                    >
                      {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </label>
                {isRegister && (
                  <label className="block text-sm font-semibold">
                    Confirm password
                    <span className="relative mt-2 block">
                      <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        name="confirmPassword"
                        type={confirmVisible ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder="Enter your password again"
                        className="min-h-12 w-full rounded-xl border border-line bg-background pl-11 pr-12 text-sm font-normal"
                      />
                      <button
                        type="button"
                        aria-label={confirmVisible ? "Hide password" : "Show password"}
                        onClick={() => setConfirmVisible((value) => !value)}
                        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface"
                      >
                        {confirmVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </span>
                  </label>
                )}
                {isRegister && (
                  <label className="block text-sm font-semibold">
                    Profile image URL <span className="font-normal text-muted">(optional)</span>
                    <span className="relative mt-2 block">
                      <UserRound size={17} className="absolute left-4 top-5 text-muted" />
                      <input
                        name="image"
                        type="url"
                        autoComplete="url"
                        placeholder="https://example.com/your-photo.jpg"
                        className="min-h-14 w-full rounded-xl border border-line bg-background py-3 pl-11 pr-4 text-sm font-normal"
                      />
                    </span>
                    <span className="mt-1.5 block text-xs font-normal leading-5 text-muted">
                      Optional. Your first initial will appear if no image is provided or it cannot be loaded.
                    </span>
                  </label>
                )}
                {formError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200">{formError}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? (isRegister ? "Creating account…" : "Signing in…") : (isRegister ? "Create account" : "Sign in")}
                </button>
              </form>
              <GoogleLoginButton callbackUrl={safeDestination} disabled={busy} />
              <p className="mt-6 text-center text-sm text-muted">
                {isRegister ? "Already have an account?" : "New to SABA MODEST?"}{" "}
                <Link
                  href={`/${isRegister ? "login" : "register"}?callbackUrl=${encodeURIComponent(safeDestination)}`}
                  className="font-semibold text-brand hover:underline"
                >
                  {isRegister ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
