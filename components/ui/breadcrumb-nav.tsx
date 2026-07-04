"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  criteria: "Kriteria",
  suppliers: "Pemasok",
  comparison: "Perbandingan",
  results: "Hasil",
  history: "Riwayat",
  settings: "Pengaturan",
  profile: "Profil",
  admin: "Admin",
  users: "Pengguna",
  new: "Tambah",
  edit: "Ubah",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== "(dashboard)");

  if (segments.length === 1) return null;

  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  let current = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.startsWith("(") || seg.startsWith("[")) continue;

    current += `/${seg}`;
    const label = seg.length > 20 ? seg.slice(0, 20) + "…" : seg;

    crumbs.push({
      label: LABEL_MAP[seg] || label.charAt(0).toUpperCase() + label.slice(1),
      href: i < segments.length - 1 ? current : undefined,
    });
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 shrink-0 text-gray-300" />
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="truncate hover:text-teal-700 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-teal-700">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
