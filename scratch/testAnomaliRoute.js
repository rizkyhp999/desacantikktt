const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masterItems = await prisma.dataMaster.findMany();
  const repeatItems = await prisma.dataPerulangan.findMany();
  const metadataItems = await prisma.metadata.findMany();

  const varValues = {};
  masterItems.forEach((m) => {
    const d = m.data || {};
    Object.entries(d).forEach(([k, v]) => {
      if (!varValues[k]) varValues[k] = [];
      varValues[k].push({ docId: m.idDokumen, val: v });
    });
  });

  repeatItems.forEach((r) => {
    const d = r.data || {};
    Object.entries(d).forEach(([k, v]) => {
      if (!varValues[k]) varValues[k] = [];
      varValues[k].push({ docId: r.idDokumen, val: v });
    });
  });

  const keys1000 = Object.keys(varValues).filter(k => k.startsWith("10"));
  console.log("Variabel seri 1000 yang berhasil terdeteksi:", keys1000);
  keys1000.forEach(k => {
    console.log(`- Parameter ${k}: ${varValues[k].length} data point`);
  });
}

main().finally(() => prisma.$disconnect());
