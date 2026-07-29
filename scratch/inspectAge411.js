const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  let totalUpdated = 0;
  const updatedList = [];

  for (const r of validRepeats) {
    const d = r.data || {};
    const v501 = String(d["501"] || "").trim();

    if (!v501) {
      // Hitung umur
      let age = null;
      
      // Cek parameter 411 (Umur dalam tahun) atau tgl lahir 405 / 411
      const val411 = String(d["411"] || "").trim();
      const val405 = String(d["405"] || "").trim();

      if (val411 && !isNaN(parseInt(val411))) {
        age = parseInt(val411);
      } else if (val405) {
        // format tgl lahir misal 2022-05-10
        const match = val405.match(/\b(19\d\d|20\d\d)\b/);
        if (match) {
          const year = parseInt(match[1]);
          age = 2026 - year;
        }
      }

      if (age !== null && age < 6) {
        totalUpdated++;
        updatedList.push({
          id: r.id,
          nama: d["402"] || d["401"] || "TANPA NAMA",
          age,
          val411,
          val405
        });
      }
    }
  }

  console.log(`Total warga dengan 501 kosong & umur < 6 tahun: ${totalUpdated}`);
  console.log(updatedList);
}

main().finally(() => prisma.$disconnect());
