import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  console.log("Memulai setup database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@vendorwise.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (adminPassword.length < 8) {
    console.error("ADMIN_PASSWORD minimal 8 karakter");
    process.exit(1);
  }

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin VendorWise",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin user: ${adminUser.email} (${adminUser.role})`);
  console.log("Setup selesai.");
}

main()
  .catch((e) => {
    console.error("Setup gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
