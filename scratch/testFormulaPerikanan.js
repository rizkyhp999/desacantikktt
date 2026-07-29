const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");

  let totalUsahaIkan = 0;
  let totalTrip1007 = 0;
  let totalVolume1008a = 0;
  let totalNilai1008b = 0;

  validMaster.forEach(m => {
    const d = m.data || {};
    const v1001 = String(d["1001"] || "").trim();
    if (v1001 === "1") {
      totalUsahaIkan++;

      const trip = parseFloat(String(d["1007"] || "0").replace(/[^0-9.]/g, "")) || 0;
      const volPerTrip = parseFloat(String(d["1008_a"] || "0").replace(/[^0-9.]/g, "")) || 0;
      const nilaiPerTrip = parseFloat(String(d["1008_b"] || "0").replace(/[^0-9.]/g, "")) || 0;

      const hhVolume = volPerTrip * trip;
      const hhNilai = nilaiPerTrip * trip;

      totalTrip1007 += trip;
      totalVolume1008a += hhVolume;
      totalNilai1008b += hhNilai;

      console.log(`[KK ${m.idDokumen.slice(-10)}] Trip: ${trip}, Vol/Trip: ${volPerTrip} (Total Vol: ${hhVolume}), Nilai/Trip: Rp${nilaiPerTrip.toLocaleString()} (Total Nilai: Rp${hhNilai.toLocaleString()})`);
    }
  });

  console.log("\n--- REKAPITULASI HASIL RUMUS BARU ---");
  console.log("Total RT Usaha Ikan (1001=1):", totalUsahaIkan);
  console.log("Total Trip (1007):", totalTrip1007);
  console.log("Total Volume Hasil Tangkapan (1008_a * 1007):", totalVolume1008a.toLocaleString('id-ID'), "Kg");
  console.log("Total Nilai Produksi (1008_b * 1007): Rp", totalNilai1008b.toLocaleString('id-ID'));
}

main().finally(() => prisma.$disconnect());
