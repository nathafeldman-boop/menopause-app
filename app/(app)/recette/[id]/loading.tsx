import { Skeleton } from "@/components/ui/skeleton";

export default function RecetteResultLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div>
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <Skeleton className="h-10 w-48 rounded-full" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}
