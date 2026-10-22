import AddProductForm from "@/components/products/AddProductForm";
import ManagementShell from "@/components/layout/ManagementShell";

export const metadata = {
  title: "Add a product",
  description: "Create a SABA MODEST product listing.",
};

export default function AddProductPage() {
  return (
    <ManagementShell title="Add a product" description="Share a modest-fashion piece with the SABA MODEST catalog. You can manage only products associated with your account.">
      <AddProductForm />
    </ManagementShell>
  );
}
