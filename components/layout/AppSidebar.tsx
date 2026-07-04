import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { SidebarNav } from "./SidebarNav";
import { Package2 } from "lucide-react";
import Link from "next/link";

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "USER";

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-teal-100 lg:bg-white lg:z-30">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b border-teal-100 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Package2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-teal-800">
            VendorWise AHP
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav role={role} />
      </div>
    </aside>
  );
}
