import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { getHistoryList } from "@/app/actions/history.actions";
import { HistoryClient } from "./HistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Perhitungan - VendorWise AHP",
  description: "Riwayat semua perhitungan AHP yang pernah dilakukan.",
};

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const items = await getHistoryList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">
          Riwayat Perhitungan
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Semua perhitungan AHP yang pernah Anda lakukan.
        </p>
      </div>
      <HistoryClient items={items} />
    </div>
  );
}
