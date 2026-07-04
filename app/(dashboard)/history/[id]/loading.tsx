import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
