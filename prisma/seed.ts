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

  // Seed the host institute so the dashboard isn't empty on first launch.
  const count = await prisma.institute.count();
  if (count === 0) {
    await prisma.institute.create({
      data: {
        name: "Institute of Information Technology & Management (IITM)",
        address: "D-29, Institutional Area, Janakpuri, New Delhi-110058",
        district: "West Delhi",
        telephone: "011-28525882",
        website: "https://www.iitmipu.ac.in",
        email: "director@iitmipu.ac.in",
        societyName: "Affiliated to GGSIPU · NAAC Accredited · ISO 9001 & 10002",
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
