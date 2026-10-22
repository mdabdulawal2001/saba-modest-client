import AuthPanel from "@/components/auth/AuthPanel";
import { getSafeCallbackUrl } from "@/lib/utils";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your SABA MODEST account.",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return (
    <main className="site-container flex flex-1 items-center justify-center py-8">
      <AuthPanel
        mode="login"
        callbackUrl={getSafeCallbackUrl(params?.callbackUrl, "/")}
        googleCallbackUrl={getSafeCallbackUrl(params?.callbackUrl, "/items")}
        oauthError={params?.oauthError === "google"}
      />
    </main>
  );
}
