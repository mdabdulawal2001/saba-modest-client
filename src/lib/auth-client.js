"use client";

import { createAuthClient } from "better-auth/react";

export const GOOGLE_LOGIN_PENDING_KEY = "saba-modest:google-login-pending";

const baseURL = (
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});
