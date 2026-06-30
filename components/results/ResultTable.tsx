"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";

type ResultTableProps = {
  ranking: {
    supplierId: string;
    supplierName: string;
    totalScore: number;
  }[];
};

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
}

function getRankClass(rank: number) {
  switch (rank) {
    case 1:
      return "bg-yellow-50";
    case 2:
      return "bg-gray-50";
    case 3:
      return "bg-amber-50";
    default:
      return "";
  }
}

export function ResultTable({ ranking }: ResultTableProps) {
  if (ranking.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-50">
            <TableHead className="w-16 text-center font-semibold text-teal-800">
              Peringkat
            </TableHead>
            <TableHead className="font-semibold text-teal-800">
              Nama Pemasok
            </TableHead>
            <TableHead className="w-40 text-right font-semibold text-teal-800">
              Skor Akhir
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranking.map((item, index) => {
            const rank = index + 1;
            return (
              <TableRow key={item.supplierId} className={getRankClass(rank)}>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getRankIcon(rank)}
                    <span className="font-bold text-gray-700">{rank}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                  {item.supplierName}
                </TableCell>
                <TableCell className="text-right font-semibold text-teal-700">
                  {(item.totalScore * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
