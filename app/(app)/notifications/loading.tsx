import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-7 w-40" />
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
