const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");
  const validDocIds = new Set(validMaster.map(m => m.idDokumen));

  let totalUsahaIkan = 0; // 1001 === "1"
  let totalTrip1007 = 0; // sum 1007
  let totalVolume1008a = 0; // sum 1008_a
  let totalNilai1008b = 0; // sum 1008_b

  const docIdsUsahaIkan = new Set();

  validMaster.forEach(m => {
    const d = m.data || {};
    const v1001 = String(d["1001"] || "").trim();
    if (v1001 === "1") {
      totalUsahaIkan++;
      docIdsUsahaIkan.add(m.idDokumen);

      const trip = parseFloat(d["1007"]) || 0;
      const vol = parseFloat(d["1008_a"]) || 0;
      const nilai = parseFloat(d["1008_b"]) || 0;

      totalTrip1007 += trip;
      totalVolume1008a += vol;
      totalNilai1008b += nilai;
    }
  });

  // DataPerulangan for 1009 and 1016
  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeatsIkan = repeats.filter(r => docIdsUsahaIkan.has(r.idDokumen));

  const jenisIkanMap = {};
  const pemasaranMap = {};

  validRepeatsIkan.forEach(r => {
    const d = r.data || {};
    const ikan = String(d["1009"] || d["1002"] || "").trim();
    const pasar = String(d["1016"] || d["1015"] || "").trim();

    if (ikan) jenisIkanMap[ikan] = (jenisIkanMap[ikan] || 0) + 1;
    if (pasar) pemasaranMap[pasar] = (pemasaranMap[pasar] || 0) + 1;
  });

  console.log("Total Rumah Tangga Usaha Penangkapan Ikan (1001=1):", totalUsahaIkan);
  console.log("Total Trip Penangkapan Ikan (1007):", totalTrip1007);
  console.log("Total Volume Hasil Tangkapan (1008_a):", totalVolume1008a, "Kg");
  console.log("Total Nilai Produksi (1008_b): Rp", totalNilai1008b.toLocaleString('id-ID'));
  console.log("\nJenis Ikan Tangkapan (1009):", jenisIkanMap);
  console.log("Tujuan Pemasaran Hasil (1016):", pemasaranMap);
}

main().finally(() => prisma.$disconnect());
