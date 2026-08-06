const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const repeat = await prisma.dataPerulangan.findMany();

  console.log("Total Master:", master.length);
  console.log("Total Repeat:", repeat.length);

  const master405bCounts = {};
  master.forEach((m) => {
    const v = String(m.data["405_b"] || m.data["405b"] || "kosong").trim();
    master405bCounts[v] = (master405bCounts[v] || 0) + 1;
  });
  console.log("Master 405_b counts:", master405bCounts);

  const repeat405bCounts = {};
  repeat.forEach((r) => {
    const v = String(r.data["405_b"] || r.data["405b"] || "kosong").trim();
    repeat405bCounts[v] = (repeat405bCounts[v] || 0) + 1;
  });
  console.log("Perulangan 405_b counts:", repeat405bCounts);

  await prisma.$disconnect();
}

main().catch(console.error);
