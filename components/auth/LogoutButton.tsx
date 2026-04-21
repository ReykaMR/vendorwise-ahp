"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      className="text-teal-700 hover:text-teal-900 hover:bg-teal-50"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Keluar
    </Button>
  );
}
