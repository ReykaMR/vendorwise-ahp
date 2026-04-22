"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Package2 } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import Link from "next/link";
import { useSidebar } from "@/hooks/useSidebar";

interface MobileSidebarProps {
  role?: "ADMIN" | "USER";
}

export function MobileSidebar({ role = "USER" }: MobileSidebarProps) {
  const { isOpen, setIsOpen, toggle } = useSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-teal-700 hover:bg-teal-50"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">
          Menu Navigasi VendorWise AHP
        </SheetTitle>
        {/* Header Sheet */}
        <div className="flex h-16 items-center border-b border-teal-100 px-4">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
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
          <SidebarNav role={role} onItemClick={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
