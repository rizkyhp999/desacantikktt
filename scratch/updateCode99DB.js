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
    let changed = false;

    const v501 = String(d["501"] || "").trim();
    const v505 = String(d["505"] || d["505_a"] || "").trim();

    if (!v501) {
      d["501"] = "99";
      changed = true;
    }
    if (!v505) {
      d["505"] = "99";
      changed = true;
    }

    if (changed) {
      await prisma.dataPerulangan.update({
        where: { id: r.id },
        data: { data: d }
      });
      countUpdated++;
    }
  }

  console.log(`Berhasil memperbarui ${countUpdated} rekord perulangan dengan kode '99' untuk data kosong!`);
}

main().finally(() => prisma.$disconnect());
