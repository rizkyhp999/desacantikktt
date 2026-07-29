const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masterItems = await prisma.dataMaster.findMany({
    select: { data: true },
    take: 5
  });

  masterItems.forEach((item, idx) => {
    const d = item.data || {};
    console.log(`Item ${idx}: 106a=${d["106a"]}, 106_a=${d["106_a"]}, 106=${d["106"]}`);
  });

  await prisma.$disconnect();
}

main().catch(err => console.error(err));
