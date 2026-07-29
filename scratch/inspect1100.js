const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metadata.findMany({
    where: {
      parameter: {
        in: ["1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108"]
      }
    }
  });

  console.log("--- METADATA SERI 1100 ---");
  meta.forEach(m => {
    console.log(`Param ${m.parameter}: ${m.label}`);
    if (m.options) console.log(`  Options: ${m.options}`);
  });

  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");

  const repeats = await prisma.dataPerulangan.findMany();

  console.log("\n--- VALUES IN MASTER DATA ---");
  const counts = {};
  validMaster.forEach(m => {
    const d = m.data || {};
    ["1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108"].forEach(p => {
      if (d[p] !== undefined) {
        if (!counts[p]) counts[p] = {};
        const val = String(d[p]).trim();
        counts[p][val] = (counts[p][val] || 0) + 1;
      }
    });
  });
  console.log("Master counts:", JSON.stringify(counts, null, 2));

  console.log("\n--- VALUES IN REPEAT DATA ---");
  const repeatCounts = {};
  repeats.forEach(r => {
    const d = r.data || {};
    ["1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108"].forEach(p => {
      if (d[p] !== undefined) {
        if (!repeatCounts[p]) repeatCounts[p] = {};
        const val = String(d[p]).trim();
        repeatCounts[p][val] = (repeatCounts[p][val] || 0) + 1;
      }
    });
  });
  console.log("Repeat counts:", JSON.stringify(repeatCounts, null, 2));
}

main().finally(() => prisma.$disconnect());
