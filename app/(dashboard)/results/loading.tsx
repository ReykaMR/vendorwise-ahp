import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-1 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
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
      <div className="rounded-lg border border-gray-200 bg-white">
        <Skeleton className="mx-auto my-4 h-5 w-40" />
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between border-b px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
