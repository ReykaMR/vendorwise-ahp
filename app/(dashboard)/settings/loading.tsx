import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-4 w-64" />
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="rounded-lg border border-teal-100/50 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
