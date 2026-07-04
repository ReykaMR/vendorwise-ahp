import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { MobileSidebar } from "./MobileSidebar";
import { UserNav } from "./UserNav";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

export async function AppTopbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role || "USER";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-teal-100 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 px-4 lg:px-6">
      <div className="flex items-center gap-2 min-w-0">
        <MobileSidebar role={role} />
        <div className="hidden min-w-0 lg:block">
          <BreadcrumbNav />
        </div>
        <h1 className="text-lg font-semibold text-teal-800 lg:hidden">
          VendorWise AHP
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <UserNav user={user!} />
      </div>
    </header>
  );
}
