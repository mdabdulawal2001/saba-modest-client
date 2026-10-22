import AuthPanel from "@/components/auth/AuthPanel";
import { getSafeCallbackUrl } from "@/lib/utils";

export const metadata = {
  title: "Create an account",
  description: "Create your SABA MODEST account.",
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  return (
    <main className="site-container flex flex-1 items-center justify-center py-8">
      <AuthPanel
        mode="register"
        callbackUrl={getSafeCallbackUrl(params?.callbackUrl, "/")}
        googleCallbackUrl={getSafeCallbackUrl(params?.callbackUrl, "/items")}
      />
    </main>
  );
}
