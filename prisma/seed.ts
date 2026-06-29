// Seed an initial admin committee user (and a demo institute) so the portal is
// usable on first run. Run with:  npm run db:seed
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@iitmipu.ac.in";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "JAC Administrator",
      email,
      passwordHash,
      role: "admin",
    },
  });

  // A demo institute so the dashboard isn't empty on first launch.
  const count = await prisma.institute.count();
  if (count === 0) {
    await prisma.institute.create({
      data: {
        name: "Demo Institute of Technology & Management",
        address: "Sector 16C, Dwarka, New Delhi - 110078",
        district: "South West Delhi",
        telephone: "011-00000000",
        website: "https://example.edu.in",
        email: "info@example.edu.in",
        societyName: "Demo Educational Society",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`  Admin login: ${admin.email} / ${password}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
