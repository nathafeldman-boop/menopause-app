import { Skeleton } from "@/components/ui/skeleton";

export default function MealResultLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-80 w-full rounded-2xl" />
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-6 w-48" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}
