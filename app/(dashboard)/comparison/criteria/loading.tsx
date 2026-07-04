import { Skeleton } from "@/components/ui/skeleton";

export default function CriteriaComparisonLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="flex gap-1 border-b border-gray-200">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-9 w-44 rounded-t-md" />
        ))}
      </div>
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-5 w-56" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-100 border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-r bg-gray-100 px-3 py-3">
                <Skeleton className="h-4 w-16" />
              </th>
              {[1, 2, 3].map((i) => (
                <th key={i} className="border-b bg-gray-100 px-3 py-3">
                  <Skeleton className="mx-auto h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <td className="border-b border-r bg-white px-3 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                {[1, 2, 3].map((col) => (
                  <td key={col} className="border-b bg-white px-3 py-3">
                    <Skeleton className="mx-auto h-8 w-16 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
