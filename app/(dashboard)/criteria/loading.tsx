import { Skeleton } from "@/components/ui/skeleton";

export default function CriteriaLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
      <div className="rounded-md border border-teal-100">
        <div className="border-b bg-teal-50 px-4 py-3">
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 border-b px-4 py-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-60" />
          </div>
        ))}
      </div>
    </div>
  );
}
