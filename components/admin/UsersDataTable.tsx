"use client";

import { useState } from "react";
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
import { MoreHorizontal, Pencil, Trash, KeyRound } from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { User } from "@/app/generated/prisma/client";

type UserWithRole = Pick<User, "id" | "name" | "email" | "role" | "createdAt">;

type UsersDataTableProps = {
  users: UserWithRole[];
};

export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

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

  return (
    <>
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
            {users.map((user) => (
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
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleResetPassword(user)}
                      >
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
