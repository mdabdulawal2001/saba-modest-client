"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient, GOOGLE_LOGIN_PENDING_KEY } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/utils";

export default function GoogleLoginButton({ callbackUrl = "/items", disabled = false }) {
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    if (busy || disabled) return;
    setBusy(true);
    const destination = getSafeCallbackUrl(callbackUrl);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${destination}`,
        errorCallbackURL: `${window.location.origin}/login?oauthError=google&callbackUrl=${encodeURIComponent(destination)}`,
      });
      if (result.error) throw new Error(result.error.message || "Google sign-in could not start.");
      if (!result.data?.url) throw new Error("Google sign-in did not return a redirect URL. Please try again.");
      window.sessionStorage.setItem(GOOGLE_LOGIN_PENDING_KEY, String(Date.now()));
      window.location.assign(result.data.url);
    } catch (error) {
      window.sessionStorage.removeItem(GOOGLE_LOGIN_PENDING_KEY);
      toast.error(error.message || "Google sign-in could not start.");
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <button
        type="button"
        onClick={signIn}
        disabled={busy || disabled}
        className="button-secondary mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full text-sm font-semibold disabled:cursor-not-allowed"
      >
        <FcGoogle aria-hidden="true" size={20} />
        {busy ? "Connecting to Google…" : "Continue with Google"}
      </button>
    </div>
  );
}
