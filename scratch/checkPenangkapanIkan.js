const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");
  const validDocIds = new Set(validMaster.map(m => m.idDokumen));

  console.log("Total valid master (204=1):", validMaster.length);

  const keys1000InMaster = {};
  const sample1000Master = [];

  validMaster.forEach(m => {
    const d = m.data || {};
    let has1000 = false;
    const itemData = {};
    Object.keys(d).forEach(k => {
      if (k.startsWith("10")) {
        has1000 = true;
        const val = String(d[k]).trim();
        keys1000InMaster[k] = (keys1000InMaster[k] || 0) + 1;
        itemData[k] = val;
      }
    });
    if (has1000 && sample1000Master.length < 5) {
      sample1000Master.push({ id: m.idDokumen, itemData });
    }
  });

  console.log("\nKeys 1000 di DataMaster:", keys1000InMaster);
  console.log("Sample 1000 Master:", JSON.stringify(sample1000Master, null, 2));

  // Check DataPerulangan
  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen));
  const keys1000InRepeats = {};

  validRepeats.forEach(r => {
    const d = r.data || {};
    Object.keys(d).forEach(k => {
      if (k.startsWith("10")) {
        keys1000InRepeats[k] = (keys1000InRepeats[k] || 0) + 1;
      }
    });
  });

  console.log("\nKeys 1000 di DataPerulangan:", keys1000InRepeats);
}

main().finally(() => prisma.$disconnect());
