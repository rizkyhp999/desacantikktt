const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");

  console.log(`--- TOTAL KK DI DESA BUONG BARU (204=1): ${validMaster.length} KK ---`);

  const rekap1118All = {
    a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0
  };

  let totalMenerimaBansos = 0;

  validMaster.forEach(m => {
    const d = m.data || {};
    let receivesAny = false;

    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"].forEach((sub) => {
      const val = String(d[`1118_${sub}`] || "").trim();
      if (val === "1" || (sub === "d" && val.length > 1 && val !== "2" && val !== "Tidak") || (sub === "k" && val.length > 1 && val !== "0" && val !== "-")) {
        rekap1118All[sub]++;
        receivesAny = true;
      }
    });

    if (receivesAny) totalMenerimaBansos++;
  });

  console.log("--- REKAP PENERIMAAN BANSOS/SUBSIDI 1118 SELURUH KK DESA BUONG BARU ---");
  console.log(`Total KK Menerima Minimal 1 Bansos: ${totalMenerimaBansos} KK dari ${validMaster.length} KK (${Math.round(totalMenerimaBansos/validMaster.length*100)}%)`);
  console.log(JSON.stringify(rekap1118All, null, 2));
}

main().finally(() => prisma.$disconnect());
