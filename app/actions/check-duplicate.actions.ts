"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { criteriaRepository } from "@/repositories/criteria.repository";
import { supplierService } from "@/services/supplier.service";

export async function checkCriteriaName(
  name: string,
  parentId?: string,
  excludeId?: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { duplicate: false };

  const existing = await criteriaRepository.findByNameAndParent(
    name,
    parentId || null,
  );
  if (!existing) return { duplicate: false };

  if (excludeId && existing.id === excludeId) return { duplicate: false };

  return { duplicate: true, message: "Nama kriteria sudah ada di level ini" };
}

export async function checkSupplierName(name: string, excludeId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { duplicate: false };

  const existing = await supplierService.findByName(name);
  if (!existing) return { duplicate: false };

  if (excludeId && existing.id === excludeId) return { duplicate: false };

  return { duplicate: true, message: "Nama pemasok sudah ada" };
}
