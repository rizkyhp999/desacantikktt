const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");
  const docIds = new Set(validMaster.filter(m => String(m.data["1001"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => docIds.has(r.idDokumen));

  let total1009 = 0;
  let total1015 = 0;
  let total1016 = 0;

  console.log("--- Rincian 1009, 1015, dan 1016 ---");
  validRepeats.forEach((r, idx) => {
    const d = r.data || {};
    const v1009 = parseFloat(String(d["1009"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const v1015 = parseFloat(String(d["1015"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const v1016 = parseFloat(String(d["1016"] || "0").replace(/[^0-9.]/g, "")) || 0;

    if (v1009 > 0 || v1015 > 0 || v1016 > 0) {
      total1009 += v1009;
      total1015 += v1015;
      total1016 += v1016;
      console.log(`[Responden ${idx+1} Doc: ${r.idDokumen.slice(-10)}] 1009(Tangkapan): Rp${v1009.toLocaleString('id-ID')} | 1015(Pengeluaran): Rp${v1015.toLocaleString('id-ID')} | 1016(Pendapatan): Rp${v1016.toLocaleString('id-ID')}`);
    }
  });

  console.log("\n--- TOTAL KESELURUHAN ---");
  console.log("Total Nilai Tangkapan (1009): Rp", total1009.toLocaleString('id-ID'));
  console.log("Total Pengeluaran (1015): Rp", total1015.toLocaleString('id-ID'));
  console.log("Total Pendapatan (1016): Rp", total1016.toLocaleString('id-ID'));
}

main().finally(() => prisma.$disconnect());
