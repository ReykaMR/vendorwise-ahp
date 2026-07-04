"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  ChevronDown,
  ChevronRight,
  FileText,
  ListTree,
  Plus,
} from "lucide-react";
import { DeleteCriteriaDialog } from "./DeleteCriteriaDialog";
import { Prisma } from "@/app/generated/prisma/client";

type CriteriaNode = Pick<
  Prisma.CriteriaModel,
  "id" | "name" | "description" | "level" | "parentId"
> & { children: CriteriaNode[] };

type CriteriaTreeProps = {
  nodes: CriteriaNode[];
  role?: "ADMIN" | "USER";
};

function TreeNode({
  node,
  depth,
  onEdit,
  onDelete,
  isAdmin,
}: {
  node: CriteriaNode;
  depth: number;
  onEdit: (id: string) => void;
  onDelete: (node: CriteriaNode) => void;
  isAdmin: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <>
      <TableRow className="hover:bg-teal-50/50">
        <TableCell>
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 24}px` }}
          >
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-teal-500 hover:text-teal-700"
            >
              {hasChildren ? (
                expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <FileText className="h-4 w-4 text-teal-400" />
              )}
            </button>
            <span className="font-medium">{node.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
            Level {node.level}
          </span>
        </TableCell>
        <TableCell className="text-gray-500 text-sm max-w-xs truncate">
          {node.description || "-"}
        </TableCell>
        {isAdmin && (
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(node.id)}>
                  <Pencil className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete(node)}
                >
                  <Trash className="h-4 w-4" /> Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
      </TableRow>
      {hasChildren && expanded && (
        <>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))}
        </>
      )}
    </>
  );
}

export function CriteriaTree({ nodes, role = "USER" }: CriteriaTreeProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<CriteriaNode | null>(null);

  const handleEdit = (id: string) => {
    router.push(`/criteria/${id}/edit`);
  };

  const handleDelete = (node: CriteriaNode) => {
    setSelectedNode(node);
    setDeleteDialogOpen(true);
  };

  const isAdmin = role === "ADMIN";

  return (
    <>
      {nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-16">
          <ListTree className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-500">
            Belum ada kriteria
          </h3>
          <p className="mt-1 text-center text-sm text-gray-400">
            Tambah kriteria penilaian pertama Anda untuk memulai perbandingan
            AHP.
          </p>
          {isAdmin && (
            <button
              onClick={() => router.push("/criteria/new")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Kriteria
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-md border border-teal-100">
          <Table>
            <TableHeader className="bg-teal-50">
              <TableRow>
                <TableHead className="text-teal-800">Nama</TableHead>
                <TableHead className="text-teal-800">Level</TableHead>
                <TableHead className="text-teal-800">Deskripsi</TableHead>
                {isAdmin && <TableHead className="w-16"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteCriteriaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        criteria={selectedNode}
      />
    </>
  );
}
