const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  let countUpdated = 0;

  for (const r of validRepeats) {
    const d = { ...(r.data || {}) };
    const v501 = String(d["501"] || "").trim();

    if (!v501) {
      let age = null;
      const val411 = String(d["411"] || "").trim();
      const val405 = String(d["405"] || "").trim();

      if (val411 && !isNaN(parseInt(val411))) {
        age = parseInt(val411);
      } else if (val405) {
        const match = val405.match(/\b(19\d\d|20\d\d)\b/);
        if (match) {
          const year = parseInt(match[1]);
          age = 2026 - year;
        }
      }

      if (age !== null && age < 6) {
        d["501"] = "0"; // Set Tidak / Belum Pernah Sekolah
        await prisma.dataPerulangan.update({
          where: { id: r.id },
          data: { data: d }
        });
        countUpdated++;
        console.log(`Updated [${d["402"] || d["401"]}] (Umur: ${age} thn) -> 501 = 0 (Belum Sekolah)`);
      }
    }
  }

  console.log(`\nBERHASIL MEMPERBARUI ${countUpdated} REKORD PERULANGAN DI POSTGRESQL!`);
}

main().finally(() => prisma.$disconnect());
