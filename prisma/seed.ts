import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  console.log("Memulai seeding...");

  // ── User ──────────────────────────────────────────────
  const userEmail = process.env.SEED_USER_EMAIL || "user@vendorwise.com";
  const userPassword = process.env.SEED_USER_PASSWORD || "user123456";

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: "Demo User",
      email: userEmail,
      password: await bcrypt.hash(userPassword, 10),
      role: "USER",
    },
  });
  console.log(`✓ User: ${user.email} (${user.role})`);

  // ── Criteria ──────────────────────────────────────────
  const criteriaData = [
    { name: "Harga", description: "Biaya bahan baku per unit" },
    { name: "Kualitas", description: "Kualitas bahan baku yang ditawarkan" },
    { name: "Pengiriman", description: "Ketepatan waktu pengiriman" },
    { name: "Pelayanan", description: "Responsivitas dan dukungan pemasok" },
  ];

  const criteriaIds: Record<string, string> = {};

  for (const c of criteriaData) {
    const existing = await prisma.criteria.findFirst({
      where: { name: c.name, parentId: null },
    });

    if (existing) {
      criteriaIds[c.name] = existing.id;
    } else {
      const created = await prisma.criteria.create({
        data: { name: c.name, description: c.description, level: 0 },
      });
      criteriaIds[c.name] = created.id;
    }
  }

  console.log(`✓ ${criteriaData.length} kriteria utama`);

  // ── Sub-criteria samples ──────────────────────────────
  const subCriteriaData: {
    parent: string;
    name: string;
    description: string;
  }[] = [
    {
      parent: "Kualitas",
      name: "Standar Mutu",
      description: "Kesesuaian dengan spesifikasi",
    },
    {
      parent: "Kualitas",
      name: "Ketahanan",
      description: "Daya tahan bahan baku",
    },
    {
      parent: "Pengiriman",
      name: "Ketepatan Waktu",
      description: "Persentase pengiriman tepat waktu",
    },
    {
      parent: "Pengiriman",
      name: "Kelengkapan",
      description: "Kesesuaian jumlah kiriman",
    },
  ];

  for (const sc of subCriteriaData) {
    const parentId = criteriaIds[sc.parent];
    if (!parentId) continue;

    const exists = await prisma.criteria.findFirst({
      where: { name: sc.name, parentId },
    });

    if (!exists) {
      await prisma.criteria.create({
        data: {
          name: sc.name,
          description: sc.description,
          level: 1,
          parentId,
        },
      });
    }
  }

  console.log(`✓ ${subCriteriaData.length} sub-kriteria`);

  // ── Suppliers ─────────────────────────────────────────
  const supplierData = [
    {
      name: "PT. Bahan Prima",
      address: "Jakarta",
      contactPerson: "Budi",
      phone: "021-1234567",
      email: "budi@bahanprima.com",
    },
    {
      name: "CV. Suplai Nusantara",
      address: "Surabaya",
      contactPerson: "Siti",
      phone: "031-7654321",
      email: "siti@suplainusa.com",
    },
    {
      name: "UD. Makmur Jaya",
      address: "Bandung",
      contactPerson: "Agus",
      phone: "022-9876543",
      email: "agus@makmurjaya.com",
    },
    {
      name: "PT. Andalan Bersama",
      address: "Semarang",
      contactPerson: "Dewi",
      phone: "024-5551234",
      email: "dewi@andalan.com",
    },
  ];

  for (const s of supplierData) {
    const existing = await prisma.supplier.findFirst({
      where: { name: s.name },
    });

    if (!existing) {
      await prisma.supplier.create({ data: s });
    }
  }

  console.log(`✓ ${supplierData.length} pemasok`);

  // ── Summary ───────────────────────────────────────────
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.criteria.count(),
    prisma.supplier.count(),
  ]);

  console.log(`\nRingkasan:`);
  console.log(`  Pengguna:  ${counts[0]}`);
  console.log(`  Kriteria:  ${counts[1]}`);
  console.log(`  Pemasok:   ${counts[2]}`);
  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error("Seeding gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
