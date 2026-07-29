const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");

  const meta = await prisma.metadata.findMany();
  const metaMap = {};
  meta.forEach(m => metaMap[m.parameter] = { label: m.label, options: m.options });

  console.log("--- 1102 (NAMA KELOMPOK) FOR 12 FISHING HH ---");
  validMaster.forEach((m, idx) => {
    const d = m.data || {};
    console.log(`Responden ${idx+1}: 1101=${d["1101"]}, 1102=${d["1102"]}`);
  });

  console.log("\n--- ALL KEYS STARTING WITH 1103 OR 1107 IN MASTER DATA ---");
  const keysFound = new Set();
  validMaster.forEach(m => {
    Object.keys(m.data || {}).forEach(k => {
      if (k.startsWith("1103") || k.startsWith("1107")) {
        keysFound.add(k);
      }
    });
  });
  console.log("Keys found:", Array.from(keysFound));

  Array.from(keysFound).sort().forEach(k => {
    console.log(`\nParam [${k}]: Label="${metaMap[k]?.label || 'No label'}", Options="${metaMap[k]?.options || '-'}"`);
    validMaster.forEach((m, idx) => {
      const d = m.data || {};
      if (d[k] !== undefined) {
        console.log(`  Responden ${idx+1}: ${d[k]}`);
      }
    });
  });
}

main().finally(() => prisma.$disconnect());
