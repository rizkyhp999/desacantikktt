const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMasterMap = new Map();
  master.forEach(m => {
    if (String(m.data["204"] || "").trim() === "1") {
      validMasterMap.set(m.idDokumen, m.data["105"] || m.data["201"] || "Kepala Keluarga Tidak Diketahui");
    }
  });

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validMasterMap.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("=== DAFTAR ANOMALI PENDUDUK DENGAN STATUS NIKAH (408) KOSONG ===");
  const missing408 = [];

  validRepeats.forEach(r => {
    const d = r.data || {};
    const val408 = String(d["408"] || "").trim();
    if (!val408) {
      missing408.push({
        idDokumen: r.idDokumen,
        noUrut: d["402"] || "-",
        namaWarga: d["401"] || "Tanpa Nama",
        kepalaKeluarga: validMasterMap.get(r.idDokumen),
        umur: d["411"] || "-",
        pekerjaan: d["503"] || "-"
      });
    }
  });

  console.log(`Total warga yang Status Nikah (408)-nya Kosong: ${missing408.length} orang\n`);
  console.table(missing408);
}

main().finally(() => prisma.$disconnect());
