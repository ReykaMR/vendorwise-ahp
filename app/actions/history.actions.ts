"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { historyRepository } from "@/repositories/history.repository";

export type HistoryListItem = {
  id: string;
  label: string;
  createdAt: Date;
  criteriaCr: number | null;
  supplierCount: number;
  rankingCount: number;
};

export async function getHistoryList(): Promise<HistoryListItem[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const records = await historyRepository.findByUser(session.user.id);

  return records.map((r) => {
    const data = r.data as Record<string, unknown>;
    const criteriaResult = data?.criteriaResult as Record<
      string,
      unknown
    > | null;
    const consistency = criteriaResult?.consistency as Record<
      string,
      unknown
    > | null;
    const ranking = data?.ranking as Array<Record<string, unknown>> | null;
    const supplierResults = data?.supplierResults as Array<
      Record<string, unknown>
    > | null;

    return {
      id: r.id,
      label: r.label ?? "Perhitungan",
      createdAt: r.createdAt,
      criteriaCr: (consistency?.cr as number) ?? null,
      supplierCount: supplierResults?.length ?? 0,
      rankingCount: ranking?.length ?? 0,
    };
  });
}

export async function getHistoryDetail(historyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const record = await historyRepository.findById(historyId, session.user.id);
  if (!record) return null;

  return {
    id: record.id,
    label: record.label,
    createdAt: record.createdAt,
    data: record.data as Record<string, unknown>,
  };
}

export async function deleteHistory(historyId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Tidak terautentikasi" };

    await historyRepository.delete(historyId, session.user.id);
    revalidatePath("/history");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus riwayat" };
  }
}
