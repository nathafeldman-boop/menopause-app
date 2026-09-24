import { Skeleton } from "@/components/ui/skeleton";

export default function RepasLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-4 w-20" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
