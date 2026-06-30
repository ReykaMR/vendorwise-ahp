import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await userService.list();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-teal-800">Manajemen Pengguna</h1>
        <Link href="/admin/users/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Button>
        </Link>
      </div>
      <UsersDataTable users={users} />
    </div>
  );
}
