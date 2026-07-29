const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metadata.findMany();
  const meta1000 = meta.filter(m => m.parameter.startsWith("10") || m.label.toLowerCase().includes("ikan") || m.label.toLowerCase().includes("tangkap"));
  console.log("Metadata 1000 / Perikanan Tangkap:", meta1000);
}

main().finally(() => prisma.$disconnect());
