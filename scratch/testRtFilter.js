const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [masterItems, repeatItems] = await Promise.all([
    prisma.dataMaster.findMany({ select: { idDokumen: true, data: true } }),
    prisma.dataPerulangan.findMany({ select: { idDokumen: true, data: true } })
  ]);

  const validMasterItems = masterItems.filter((m) => {
    const d = m.data || {};
    return String(d["204"] || "").trim() === "1";
  });

  const rtList = ["all", "01", "02", "03", "04", "05"];

  rtList.forEach(rt => {
    const filteredMaster = validMasterItems.filter(m => {
      if (rt === "all") return true;
      const d = m.data || {};
      const valRt = String(d["106_a"] || d["106a"] || "").trim().padStart(2, "0");
      return valRt === rt.padStart(2, "0");
    });

    const docIds = new Set(filteredMaster.map(m => m.idDokumen));

    const filteredMembers = repeatItems.filter(r => {
      if (!docIds.has(r.idDokumen)) return false;
      const d = r.data || {};
      const val401 = String(d["401"] || "").trim();
      return val401 !== "" && val401 !== "null" && val401 !== "undefined";
    });

    console.log(`RT ${rt}: ${filteredMaster.length} KK, ${filteredMembers.length} Penduduk (Jiwa)`);
  });

  await prisma.$disconnect();
}

main().catch(err => console.error(err));
