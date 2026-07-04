import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

type SupplierPublic = Pick<
  Prisma.SupplierModel,
  "id" | "name" | "address" | "contactPerson" | "phone" | "email" | "createdAt"
>;

export const supplierRepository = {
  async findMany(): Promise<SupplierPublic[]> {
    return prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        contactPerson: true,
        phone: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string): Promise<SupplierPublic | null> {
    return prisma.supplier.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        contactPerson: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });
  },

  async create(data: {
    name: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  }) {
    return prisma.supplier.create({ data });
  },

  async update(
    id: string,
    data: {
      name?: string;
      address?: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
    },
  ) {
    return prisma.supplier.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.supplier.delete({ where: { id } });
  },
};
