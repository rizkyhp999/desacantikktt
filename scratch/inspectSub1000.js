const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metadata.findMany();
  const meta1000 = meta.filter(m => m.parameter.startsWith("10"));
  console.log("--- METADATA SERI 1000 ---");
  meta1000.forEach(m => {
    console.log(`${m.parameter}: ${m.label} ${m.options ? `[${m.options}]` : ''}`);
  });

  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");
  const docIds = new Set(validMaster.map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => docIds.has(r.idDokumen));

  console.log("\n--- RAW DATA PERULANGAN PERISIAN 1000 ---");
  validRepeats.forEach((r, idx) => {
    const d = r.data || {};
    const hasData = Object.keys(d).some(k => k.startsWith("10") && d[k] && d[k] !== "0");
    if (hasData) {
      console.log(`\nResponden ${idx+1}:`);
      Object.keys(d).sort().forEach(k => {
        if (k.startsWith("10") && d[k] !== undefined) {
          console.log(`  ${k}: ${d[k]}`);
        }
      });
    }
  });

  console.log("\n--- RAW DATA MASTER RUMAH TANGGA PERIKANAN ---");
  validMaster.forEach((m, idx) => {
    const d = m.data || {};
    console.log(`\nKK Responden ${idx+1}:`);
    Object.keys(d).sort().forEach(k => {
      if (k.startsWith("10") && d[k] !== undefined) {
        console.log(`  ${k}: ${d[k]}`);
      }
    });
  });
}

main().finally(() => prisma.$disconnect());
