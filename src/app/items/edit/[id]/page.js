import { Suspense } from "react";
import ManagementShell from "@/components/layout/ManagementShell";
import EditProductForm from "@/components/products/EditProductForm";
import { FormSkeleton } from "@/components/shared/Skeletons";

export const metadata = {
  title: "Edit product",
  description: "Update a SABA MODEST product listing.",
};

function EditProductFallback() {
  return (
    <ManagementShell
      title="Edit product"
      description="Review the current details, update this listing, and confirm your changes before saving."
    >
      <FormSkeleton fields={7} />
    </ManagementShell>
  );
}

async function EditProductContent({ params }) {
  const { id } = await params;
  return (
    <ManagementShell title="Edit product" description="Review the current details, update this listing, and confirm your changes before saving.">
      <EditProductForm id={id} />
    </ManagementShell>
  );
}

export default function EditProductPage({ params }) {
  return (
    <Suspense fallback={<EditProductFallback />}>
      <EditProductContent params={params} />
    </Suspense>
  );
}
