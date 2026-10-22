import { FormSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return <main className="site-container flex-1 py-10"><div className="mx-auto max-w-md"><FormSkeleton fields={2} /></div></main>;
}
