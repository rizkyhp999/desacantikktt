const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDocId = '65030300060001-DC2026BB-6410022307880001-24-40';
  
  const masterDoc = await prisma.dataMaster.findFirst({ where: { idDokumen: targetDocId } });
  const repeatDoc = await prisma.dataPerulangan.findFirst({ where: { idDokumen: targetDocId } });
  
  if (!masterDoc || !repeatDoc) {
    console.error('Target document Responden 3 not found!');
    return;
  }

  // Update Master Data
  const updatedMasterData = {
    ...masterDoc.data,
    '1007': '1',
    '1008_a': '1',
    '1008_b': '100000',
    '1009': '100000',
    '1010_c': '0',
    '1010_d': '0',
    '1010_e': '50000',
    '1010_f': '50000',
    '1011': '50000',
    '1015': '50000',
    '1016': '50000',
    '1017': '50000',
  };

  // Update Repeat Data
  const updatedRepeatData = {
    ...repeatDoc.data,
    '1009': '100000',
    '1010_f': '50000',
    '1011': '50000',
    '1015': '50000',
    '1016': '50000',
  };

  await prisma.dataMaster.updateMany({
    where: { idDokumen: targetDocId },
    data: { data: updatedMasterData }
  });

  await prisma.dataPerulangan.updateMany({
    where: { idDokumen: targetDocId },
    data: { data: updatedRepeatData }
  });

  console.log('Successfully updated Responden 3 (Trip = 1) in DataMaster and DataPerulangan:');
  console.log('Updated Master:', updatedMasterData);
  console.log('Updated Repeat:', updatedRepeatData);
}

main().catch(console.error).finally(() => prisma.$disconnect());
