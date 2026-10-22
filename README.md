# SABA MODEST storefront

A responsive modest-fashion storefront built with Next.js App Router, Tailwind CSS v4, Better Auth, and the SABA MODEST REST API.

## Local development

1. Install dependencies with `npm install`.
2. Set the frontend API origin in `.env.local`:

   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
   ```

   The Better Auth URL is the frontend origin served by Next.js; the same-origin route handler forwards auth calls and cookies to the backend. The Google flag controls whether the Google sign-in button is shown. Enable it only when both Google OAuth credentials are configured on the backend.
3. Start the backend and frontend, then run `npm run dev`.
4. Open `http://localhost:3000`.

The backend owns all authentication, session validation, product persistence, and product ownership checks. Next.js forwards auth and browser-side product requests to the configured backend, while server-rendered public catalog requests go directly to it. The frontend does not contain authentication secrets.

## Available routes

- `/` — home and featured catalog
- `/items` — searchable, filterable catalog
- `/items/[id]` — product details
- `/about` — brand information
- `/login` and `/register` — Better Auth email/password and optional Google sign-in
- `/items/add` — authenticated product creation
- `/items/manage` — authenticated management of the current user's own products
- `/items/edit/[id]` — authenticated, confirmed editing for the current user's product

## Contact details

Official contact destinations are intentionally left blank in `src/config/contact.js`; the storefront does not reuse contact information from the unrelated reference project. Supply the SABA MODEST Messenger URL, Facebook page URL, WhatsApp number in international format, phone number, and email address there. Until provided, the UI identifies each value as not configured instead of displaying or linking to invented details.

The shop and home-page category cards use the backend-supported categories `Casual`, `Premium`, and `Party Wear`. The remaining three cards are clearly marked as coming soon and show an empty result rather than invented products.

## Checks

- `npm run lint`
- `npm run build`
