const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDocId = '65030000000000-DC2026BB-6410020912870001-21-3';
  
  const repeatItem = await prisma.dataPerulangan.findFirst({
    where: { idDokumen: targetDocId }
  });
  
  if (!repeatItem) {
    console.error('Target document perulangan not found!');
    return;
  }

  const updatedData = {
    ...repeatItem.data,
    '1009': '43200000',
    '1010_f': '310000',
    '1011': '29760000',
    '1015': '29760000',
    '1016': '13440000',
  };

  await prisma.dataPerulangan.updateMany({
    where: { idDokumen: targetDocId },
    data: { data: updatedData }
  });

  console.log('Successfully updated Responden 1 dataPerulangan to full Rupiah values:');
  console.log(updatedData);
}

main().catch(console.error).finally(() => prisma.$disconnect());
