const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masterItems = await prisma.dataMaster.findMany({
    select: { idDokumen: true, data: true }
  });

  const rtMap = {};

  masterItems.forEach(item => {
    const d = item.data || {};
    const val106a = d["106a"] || d["106_a"] || d["106"] || "N/A";
    rtMap[val106a] = (rtMap[val106a] || 0) + 1;
  });

  console.log("RT Breakdown in dataMaster:", rtMap);
  await prisma.$disconnect();
}

main().catch(err => console.error(err));
