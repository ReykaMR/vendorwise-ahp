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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash, Search } from "lucide-react";
import { DeleteSupplierDialog } from "./DeleteSupplierDialog";
import { Prisma } from "@/app/generated/prisma/client";

type SupplierItem = Pick<
  Prisma.SupplierModel,
  "id" | "name" | "address" | "contactPerson" | "phone" | "email"
>;

type SuppliersDataTableProps = {
  suppliers: SupplierItem[];
};

export function SuppliersDataTable({ suppliers }: SuppliersDataTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(
    null,
  );

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (supplier: SupplierItem) => {
    router.push(`/suppliers/${supplier.id}/edit`);
  };

  const handleDelete = (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            placeholder="Cari pemasok..."
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-teal-100">
        <Table>
          <TableHeader className="bg-teal-50">
            <TableRow>
              <TableHead className="text-teal-800">Nama</TableHead>
              <TableHead className="text-teal-800">Kontak Person</TableHead>
              <TableHead className="text-teal-800">Telepon</TableHead>
              <TableHead className="text-teal-800">Email</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  Tidak ada pemasok ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson || "-"}</TableCell>
                  <TableCell>{supplier.phone || "-"}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(supplier)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Hapus
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

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        supplier={selectedSupplier}
      />
    </>
  );
}
