const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masters = await prisma.dataMaster.findMany({ select: { idDokumen: true, data: true } });
  const repeats = await prisma.dataPerulangan.findMany({ select: { idDokumen: true, data: true } });
  
  const fishingDocs = masters.filter(m => String(m.data['1001'] || '').trim() === '1');
  console.log('Total fishing docs:', fishingDocs.length);
  
  for (let i = 0; i < Math.min(3, fishingDocs.length); i++) {
    const doc = fishingDocs[i];
    const rMatch = repeats.find(r => r.idDokumen === doc.idDokumen && r.data['1009'] !== undefined);
    console.log(`\n--- Responden ${i+1} (${doc.idDokumen}) ---`);
    console.log('Master data fields 1001-1017:');
    Object.keys(doc.data).filter(k => k.startsWith('10')).forEach(k => {
      console.log(`  ${k}: ${JSON.stringify(doc.data[k])}`);
    });
    if (rMatch) {
      console.log('Perulangan data fields:');
      Object.keys(rMatch.data).filter(k => k.startsWith('10')).forEach(k => {
        console.log(`  ${k}: ${JSON.stringify(rMatch.data[k])}`);
      });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
