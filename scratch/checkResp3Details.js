const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDocId = '65030300060001-DC2026BB-6410022307880001-24-40';
  
  const masterDoc = await prisma.dataMaster.findFirst({ where: { idDokumen: targetDocId } });
  const repeatDoc = await prisma.dataPerulangan.findFirst({ where: { idDokumen: targetDocId } });

  console.log('=== RESPONDEN 3 MASTER DATA ===');
  if (masterDoc) {
    Object.keys(masterDoc.data).filter(k => k.startsWith('10')).forEach(k => {
      console.log(`  ${k}: ${JSON.stringify(masterDoc.data[k])}`);
    });
  }

  console.log('\n=== RESPONDEN 3 REPEAT DATA ===');
  if (repeatDoc) {
    Object.keys(repeatDoc.data).filter(k => k.startsWith('10')).forEach(k => {
      console.log(`  ${k}: ${JSON.stringify(repeatDoc.data[k])}`);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
