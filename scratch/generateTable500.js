const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  const empty501_505 = [];

  validRepeats.forEach(r => {
    const d = r.data || {};
    const nama = d["402"] || d["401"] || "TANPA NAMA";
    const id = r.idDokumen || "";

    const v501 = String(d["501"] || "").trim();
    const v505 = String(d["505"] || d["505_a"] || "").trim();

    if (!v501 || !v505) {
      empty501_505.push({
        id,
        nama,
        v501: v501 || "KOSONG",
        v505: v505 || "KOSONG"
      });
    }
  });

  console.log(`### Daftar Warga dengan Data 501 (Partisipasi Sekolah) & 505 (Rekening Bank) Masih Kosong (${empty501_505.length} Warga):\n`);
  console.log("| No | Nama Warga | ID Dokumen / Lokasi | 501 (Sekolah) | 505 (Rekening Bank) |");
  console.log("|---|---|---|---|---|");
  empty501_505.forEach((w, idx) => {
    console.log(`| ${idx + 1} | ${w.nama} | \`${w.id.slice(-35)}\` | ${w.v501} | ${w.v505} |`);
  });
}

main().finally(() => prisma.$disconnect());
