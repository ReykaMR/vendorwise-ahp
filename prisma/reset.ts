import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("Mereset data aplikasi...");
  console.log("  (User dan data akun NextAuth dipertahankan)");

  await prisma.calculationHistory.deleteMany();
  await prisma.supplierPriority.deleteMany();
  await prisma.criteriaPriority.deleteMany();
  await prisma.supplierComparison.deleteMany();
  await prisma.criteriaComparison.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.criteria.deleteMany();

  console.log("✓ Data aplikasi dihapus");
  console.log("Reset selesai.");
}

main()
  .catch((e) => {
    console.error("Reset gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
