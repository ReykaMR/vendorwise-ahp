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
  Search,
  Package,
  Plus,
} from "lucide-react";
import { DeleteSupplierDialog } from "./DeleteSupplierDialog";
import { Prisma } from "@/app/generated/prisma/client";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

type SupplierItem = Pick<
  Prisma.SupplierModel,
  "id" | "name" | "address" | "contactPerson" | "phone" | "email"
>;

type SuppliersDataTableProps = {
  suppliers: SupplierItem[];
  role?: "ADMIN" | "USER";
};

export function SuppliersDataTable({
  suppliers,
  role = "USER",
}: SuppliersDataTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(
    null,
  );

  const filtered = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.contactPerson || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (s.email || "").toLowerCase().includes(search.toLowerCase()),
      ),
    [suppliers, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEdit = (supplier: SupplierItem) => {
    router.push(`/suppliers/${supplier.id}/edit`);
  };

  const handleDelete = (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const isAdmin = role === "ADMIN";
  const colCount = isAdmin ? 5 : 4;

  if (suppliers.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-16">
          <Package className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-500">
            Belum ada pemasok
          </h3>
          <p className="mt-1 text-center text-sm text-gray-400">
            Daftarkan pemasok bahan baku untuk memulai penilaian AHP.
          </p>
          {isAdmin && (
            <button
              onClick={() => router.push("/suppliers/new")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Pemasok
            </button>
          )}
        </div>
        <DeleteSupplierDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          supplier={selectedSupplier}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            placeholder="Cari pemasok..."
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className="text-sm text-gray-400 ml-auto">
          {filtered.length} dari {suppliers.length} pemasok
        </p>
      </div>

      <div className="rounded-md border border-teal-100">
        <Table>
          <TableHeader className="bg-teal-50">
            <TableRow>
              <TableHead className="text-teal-800">Nama</TableHead>
              <TableHead className="text-teal-800">Kontak Person</TableHead>
              <TableHead className="text-teal-800">Telepon</TableHead>
              <TableHead className="text-teal-800">Email</TableHead>
              {isAdmin && <TableHead className="w-16"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  className="text-center text-gray-500 py-8"
                >
                  Tidak ada pemasok yang cocok
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson || "-"}</TableCell>
                  <TableCell>{supplier.phone || "-"}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(supplier)}
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(supplier)}
                          >
                            <Trash className="h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
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

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        supplier={selectedSupplier}
      />
    </>
  );
}
