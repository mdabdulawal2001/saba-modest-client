import ManageProducts from "@/components/products/ManageProducts";
import ManagementShell from "@/components/layout/ManagementShell";

export const metadata = {
  title: "My Products",
  description: "View and manage your SABA MODEST product listings.",
};

export default function ManageProductsPage() {
  return (
    <ManagementShell title="My Products" description="Review and manage products created by your account.">
      <ManageProducts />
    </ManagementShell>
  );
}
