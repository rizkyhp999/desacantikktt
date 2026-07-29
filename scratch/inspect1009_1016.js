const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");
  const docIds = new Set(validMaster.filter(m => String(m.data["1001"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => docIds.has(r.idDokumen));

  console.log("Found repeat records for fishing HH:", validRepeats.length);

  validRepeats.forEach((r, idx) => {
    const d = r.data || {};
    console.log(`[Item ${idx+1} Doc: ${r.idDokumen.slice(-10)}] 1002:${d["1002"]}, 1003:${d["1003"]}, 1009:${d["1009"]}, 1011:${d["1011"]}, 1015:${d["1015"]}, 1016:${d["1016"]}`);
  });

  const meta = await prisma.metadata.findMany({
    where: { parameter: { in: ["1002", "1003", "1009", "1011", "1015", "1016"] } }
  });
  console.log("\nMetadata:", meta.map(m => ({ param: m.parameter, label: m.label, options: m.options })));
}

main().finally(() => prisma.$disconnect());
