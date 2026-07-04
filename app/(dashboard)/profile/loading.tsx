import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      {[1, 2].map((card) => (
        <div
          key={card}
          className="rounded-lg border border-teal-100/50 bg-white p-6 shadow-lg"
        >
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-1 h-3 w-56" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((field) => (
              <div key={field}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-1 h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 h-10 w-36 rounded-md" />
        </div>
      ))}
    </div>
  );
}
