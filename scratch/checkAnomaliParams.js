const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masterItems = await prisma.dataMaster.findMany();
  const metadataItems = await prisma.metadata.findMany();

  const metaMap = {};
  metadataItems.forEach((m) => {
    metaMap[m.parameter] = { label: m.label, options: m.options };
  });

  const varValues = {};
  masterItems.forEach((m) => {
    const d = m.data || {};
    Object.entries(d).forEach(([k, v]) => {
      if (!varValues[k]) varValues[k] = [];
      varValues[k].push({ docId: m.idDokumen, val: v });
    });
  });

  const targetKeys = ["1001", "1007", "1008_a", "1008_b", "1009", "1016"];
  targetKeys.forEach(k => {
    console.log(`Param ${k}:`, {
      existsInMaster: !!varValues[k],
      count: varValues[k] ? varValues[k].length : 0,
      labelInMeta: metaMap[k] ? metaMap[k].label : "TIDAK ADA DI METADATA"
    });
  });
}

main().finally(() => prisma.$disconnect());
