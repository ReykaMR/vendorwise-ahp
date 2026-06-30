"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Package,
  UserCog,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ("ADMIN" | "USER")[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Kriteria",
    href: "/criteria",
    icon: BarChart3,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Pemasok",
    href: "/suppliers",
    icon: Package,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Perbandingan",
    href: "/comparison/criteria",
    icon: Settings,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Hasil AHP",
    href: "/results",
    icon: BarChart3,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Manajemen Pengguna",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Profil",
    href: "/profile",
    icon: UserCog,
    roles: ["ADMIN", "USER"],
  },
];

type SidebarNavProps = {
  role?: "ADMIN" | "USER";
  onItemClick?: () => void;
};

export function SidebarNav({ role = "USER", onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <nav className="flex flex-col gap-1 p-2">
      {filteredItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-teal-100 text-teal-900"
                : "text-gray-700 hover:bg-teal-50 hover:text-teal-900",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
