const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metadata.findMany();
  const targetPrefixes = ["1108", "1109", "1110", "1111", "1116", "1117", "1118"];
  const metaFiltered = meta.filter(m => targetPrefixes.some(p => m.parameter.startsWith(p)));

  console.log("--- METADATA 1108 S.D. 1118 ---");
  metaFiltered.forEach(m => {
    console.log(`[${m.parameter}]: Label="${m.label}" ${m.options ? `| Options="${m.options}"` : ''}`);
  });

  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");

  console.log(`\n--- DATA DISTRIBUTION FOR 12 FISHING HH ---`);
  const keysFound = new Set();
  validMaster.forEach(m => {
    Object.keys(m.data || {}).forEach(k => {
      if (targetPrefixes.some(p => k.startsWith(p))) {
        keysFound.add(k);
      }
    });
  });

  console.log("Keys found in fishing HH:", Array.from(keysFound));

  Array.from(keysFound).sort().forEach(k => {
    const valMap = {};
    validMaster.forEach(m => {
      const d = m.data || {};
      if (d[k] !== undefined) {
        const val = String(d[k]).trim();
        valMap[val] = (valMap[val] || 0) + 1;
      }
    });
    console.log(`Key [${k}]:`, valMap);
  });
}

main().finally(() => prisma.$disconnect());
