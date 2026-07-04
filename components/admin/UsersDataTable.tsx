"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  KeyRound,
  Search,
  Users,
  Plus,
} from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { User } from "@/app/generated/prisma/client";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

type UserWithRole = Pick<User, "id" | "name" | "email" | "role" | "createdAt">;

type UsersDataTableProps = {
  users: UserWithRole[];
};

export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEdit = (user: UserWithRole) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleDelete = (user: UserWithRole) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: UserWithRole) => {
    setSelectedUser(user);
    setResetDialogOpen(true);
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-16">
        <Users className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-500">
          Belum ada pengguna
        </h3>
        <p className="mt-1 text-center text-sm text-gray-400">
          Tambah pengguna baru untuk mulai menggunakan VendorWise AHP.
        </p>
        <button
          onClick={() => router.push("/admin/users/new")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            placeholder="Cari pengguna..."
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className="text-sm text-gray-400 ml-auto">
          {filtered.length} dari {users.length} pengguna
        </p>
      </div>

      <div className="rounded-md border border-teal-100">
        <Table>
          <TableHeader className="bg-teal-50">
            <TableRow>
              <TableHead className="text-teal-800">Nama</TableHead>
              <TableHead className="text-teal-800">Email</TableHead>
              <TableHead className="text-teal-800">Peran</TableHead>
              <TableHead className="text-teal-800">Terdaftar</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  Tidak ada pengguna yang cocok
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-teal-100 text-teal-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleResetPassword(user)}
                        >
                          <KeyRound className="h-4 w-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash className="h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
      />

      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        user={selectedUser}
      />
    </>
  );
}
