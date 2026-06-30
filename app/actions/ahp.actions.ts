"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { ahpService, type AHPResult } from "@/services/ahp.service";

export type CalculateAHPState = {
  success?: boolean;
  data?: AHPResult;
  error?: string;
};

export async function calculateAHP(): Promise<CalculateAHPState> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Tidak terautentikasi" };
    }

    const result = await ahpService.calculateAll(session.user.id);

    revalidatePath("/results");
    revalidatePath("/dashboard");

    return { success: true, data: result };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghitung AHP",
    };
  }
}

export async function getResults(): Promise<CalculateAHPState> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Tidak terautentikasi" };
    }

    const result = await ahpService.getLastResults(session.user.id);
    return { success: true, data: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal memuat hasil AHP",
    };
  }
}
