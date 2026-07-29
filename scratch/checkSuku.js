const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));
  
  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("Total valid members:", validRepeats.length);
  
  const count408 = {};
  const count413 = {};

  validRepeats.forEach(r => {
    const d = r.data || {};
    const v408 = String(d["408"] || "").trim();
    const v413 = String(d["413"] || "").trim();
    if (v408) count408[v408] = (count408[v408] || 0) + 1;
    if (v413) count413[v413] = (count413[v413] || 0) + 1;
  });

  console.log("408 Status Perkawinan:", count408);
  console.log("413 Suku breakdown:", count413);
}

main().finally(() => prisma.$disconnect());
