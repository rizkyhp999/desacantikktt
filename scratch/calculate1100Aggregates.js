const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");

  const kelompokCount = {};
  const manfaatCount = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
  const saranaCount = {};

  ["a", "b", "c", "d", "e", "f", "g", "h", "i"].forEach(k => {
    saranaCount[k] = { total: 0, milikSendiri: 0, sewa: 0, milikBersama: 0 };
  });

  validMaster.forEach(m => {
    const d = m.data || {};
    const isMember = String(d["1101"] || "").trim() === "1";
    const namaKlp = isMember ? (String(d["1102"] || "Kelompok Nelayan").trim() || "Kelompok Nelayan") : "Tidak Tergabung";
    kelompokCount[namaKlp] = (kelompokCount[namaKlp] || 0) + 1;

    ["a", "b", "c", "d", "e", "f", "g"].forEach(k => {
      if (String(d[`1103_${k}`] || "").trim() === "1") {
        manfaatCount[k]++;
      }
    });

    ["a", "b", "c", "d", "e", "f", "g", "h", "i"].forEach(k => {
      const penguasaan = String(d[`1107_${k}_i`] || "").trim();
      const kepemilikan = String(d[`1107_${k}_ii`] || "").trim();
      if (penguasaan === "1") {
        saranaCount[k].total++;
        if (kepemilikan === "1") saranaCount[k].milikSendiri++;
        else if (kepemilikan === "2") saranaCount[k].sewa++;
        else if (kepemilikan === "4") saranaCount[k].milikBersama++;
      }
    });
  });

  console.log("--- REKAP 1102 (KELOMPOK) ---");
  console.log(JSON.stringify(kelompokCount, null, 2));

  console.log("\n--- REKAP 1103 (MANFAAT) ---");
  console.log(JSON.stringify(manfaatCount, null, 2));

  console.log("\n--- REKAP 1107 (SARANA) ---");
  console.log(JSON.stringify(saranaCount, null, 2));
}

main().finally(() => prisma.$disconnect());
