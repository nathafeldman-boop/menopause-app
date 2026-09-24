import { Skeleton } from "@/components/ui/skeleton";

export default function ApercuLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-full" />
    </div>
  );
}
