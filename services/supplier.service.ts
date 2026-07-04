import { supplierRepository } from "@/repositories/supplier.repository";

export const supplierService = {
  async list() {
    return supplierRepository.findMany();
  },

  async getById(id: string) {
    return supplierRepository.findById(id);
  },

  async findByName(name: string) {
    const suppliers = await supplierRepository.findMany();
    return (
      suppliers.find((s) => s.name.toLowerCase() === name.toLowerCase()) || null
    );
  },

  async create(data: {
    name: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  }) {
    const existing = await this.findByName(data.name);
    if (existing) {
      throw new Error("Nama pemasok sudah ada");
    }

    const cleanData = {
      name: data.name,
      address: data.address || undefined,
      contactPerson: data.contactPerson || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
    };
    return supplierRepository.create(cleanData);
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
    if (data.name) {
      const existing = await this.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error("Nama pemasok sudah ada");
      }
    }

    const cleanData: Record<string, string> = {};
    if (data.name) cleanData.name = data.name;
    if (data.address !== undefined) cleanData.address = data.address;
    if (data.contactPerson !== undefined)
      cleanData.contactPerson = data.contactPerson;
    if (data.phone !== undefined) cleanData.phone = data.phone;
    if (data.email !== undefined) cleanData.email = data.email;
    return supplierRepository.update(id, cleanData);
  },

  async delete(id: string) {
    return supplierRepository.delete(id);
  },
};
