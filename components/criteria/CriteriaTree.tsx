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
} from "lucide-react";
import { DeleteCriteriaDialog } from "./DeleteCriteriaDialog";
import { Prisma } from "@/app/generated/prisma/client";

type CriteriaNode = Pick<
  Prisma.CriteriaModel,
  "id" | "name" | "description" | "level" | "parentId"
> & { children: CriteriaNode[] };

type CriteriaTreeProps = {
  nodes: CriteriaNode[];
};

function TreeNode({
  node,
  depth,
  onEdit,
  onDelete,
}: {
  node: CriteriaNode;
  depth: number;
  onEdit: (id: string) => void;
  onDelete: (node: CriteriaNode) => void;
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
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(node.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(node)}
              >
                <Trash className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
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
            />
          ))}
        </>
      )}
    </>
  );
}

export function CriteriaTree({ nodes }: CriteriaTreeProps) {
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

  return (
    <>
      <div className="rounded-md border border-teal-100">
        <Table>
          <TableHeader className="bg-teal-50">
            <TableRow>
              <TableHead className="text-teal-800">Nama</TableHead>
              <TableHead className="text-teal-800">Level</TableHead>
              <TableHead className="text-teal-800">Deskripsi</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  Belum ada kriteria. Tambah kriteria pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              nodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteCriteriaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        criteria={selectedNode}
      />
    </>
  );
}
