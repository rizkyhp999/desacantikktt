const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const masterItems = await prisma.dataMaster.findMany();
  const repeatItems = await prisma.dataPerulangan.findMany();

  const validMasterItems = masterItems.filter((m) => {
    const d = m.data;
    return String(d["204"] || "").trim() === "1";
  });
  const validDocIds = new Set(validMasterItems.map((m) => m.idDokumen));

  const validMembers = repeatItems.filter((r) => {
    if (!validDocIds.has(r.idDokumen)) return false;
    const d = r.data;
    const val401 = String(d["401"] || "").trim();
    return val401 !== "" && val401 !== "null" && val401 !== "undefined";
  });

  console.log("Total Valid Master (Keluarga):", validMasterItems.length);
  console.log("Total Valid Members (Penduduk):", validMembers.length);

  // Penduduk breakdown
  const pend = { 1: 0, 2: 0, 3: 0, 4: 0, lainnya: 0 };
  validMembers.forEach((r) => {
    const d = r.data;
    const v = String(d["405_b"] || d["405b"] || "").trim();
    if (v === "1" || v === "2" || v === "3" || v === "4") {
      pend[v]++;
    } else {
      pend.lainnya++;
    }
  });

  // Map doc -> repeat items
  const docRepeatMap = new Map();
  repeatItems.forEach((r) => {
    if (!docRepeatMap.has(r.idDokumen)) docRepeatMap.set(r.idDokumen, []);
    docRepeatMap.get(r.idDokumen).push(r);
  });

  // Keluarga breakdown (based on KRT or first member of doc)
  const kel = { 1: 0, 2: 0, 3: 0, 4: 0, lainnya: 0 };
  validMasterItems.forEach((m) => {
    const members = docRepeatMap.get(m.idDokumen) || [];
    const krt = members.find((r) => String(r.data["401"] || "").trim() === "1") || members[0];
    if (krt) {
      const v = String(krt.data["405_b"] || krt.data["405b"] || "").trim();
      if (v === "1" || v === "2" || v === "3" || v === "4") {
        kel[v]++;
      } else {
        kel.lainnya++;
      }
    } else {
      kel.lainnya++;
    }
  });

  console.log("Penduduk 405_b breakdown:", pend);
  console.log("Keluarga 405_b breakdown:", kel);

  await prisma.$disconnect();
}

main().catch(console.error);
