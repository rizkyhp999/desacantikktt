const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1");
  const validDocIds = new Set(validMaster.map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("=== ANOMALI / INVENTARISASI DATA KOSONG DESA BUONG BARU ===");

  // 1. ANOMALI DATA MASTER (PERUMAHAN - 188 KK)
  const masterAnomali = [];
  validMaster.forEach(m => {
    const d = m.data || {};
    const namaKK = d["105"] || d["201"] || "Tanpa Nama KK";
    const missingMaster = [];

    if (!String(d["301"] || "").trim()) missingMaster.push("301 (Jenis Bangunan)");
    if (!String(d["302_a"] || "").trim()) missingMaster.push("302a (Status Bangunan)");
    if (!String(d["302_b"] || "").trim()) missingMaster.push("302b (Status Tanah)");
    if (!String(d["304"] || "").trim()) missingMaster.push("304 (Luas Lantai)");
    if (!String(d["305_a"] || "").trim()) missingMaster.push("305a (Bahan Lantai)");
    if (!String(d["305_b"] || "").trim()) missingMaster.push("305b (Kondisi Lantai)");
    if (!String(d["306_a"] || "").trim()) missingMaster.push("306a (Bahan Dinding)");
    if (!String(d["306_b"] || "").trim()) missingMaster.push("306b (Kondisi Dinding)");
    if (!String(d["307_a"] || "").trim()) missingMaster.push("307a (Bahan Atap)");
    if (!String(d["307_b"] || "").trim()) missingMaster.push("307b (Kondisi Atap)");
    if (!String(d["308"] || "").trim()) missingMaster.push("308 (Fasilitas BAB)");
    if (!String(d["309"] || "").trim()) missingMaster.push("309 (Jenis Kloset)");
    if (!String(d["310"] || "").trim()) missingMaster.push("310 (Pembuangan Tinja)");
    if (!String(d["311"] || "").trim()) missingMaster.push("311 (Air Minum Utama)");
    if (!String(d["312"] || "").trim()) missingMaster.push("312 (Sumber Penerangan)");
    if (!String(d["313_b"] || d["313b"] || "").trim()) missingMaster.push("313b (Daya Listrik)");

    if (missingMaster.length > 0) {
      masterAnomali.push({
        idDokumen: m.idDokumen,
        namaKK,
        missingCount: missingMaster.length,
        missingFields: missingMaster.join(", ")
      });
    }
  });

  // 2. ANOMALI DATA PERULANGAN (DEMOGRAFI - 643 JIWA)
  const repeatAnomali = [];
  validRepeats.forEach(r => {
    const d = r.data || {};
    const namaWarga = d["401"] || "Tanpa Nama";
    const idDokumen = r.idDokumen;
    const missingRepeat = [];

    if (!String(d["408"] || "").trim()) missingRepeat.push("408 (Status Perkawinan)");
    if (!String(d["409"] || "").trim()) missingRepeat.push("409 (Jenis Kelamin)");
    if (d["411"] === undefined || d["411"] === null || String(d["411"]).trim() === "") missingRepeat.push("411 (Umur)");
    if (!String(d["412"] || "").trim()) missingRepeat.push("412 (Agama)");
    if (!String(d["413"] || "").trim()) missingRepeat.push("413 (Suku)");
    if (!String(d["502"] || "").trim()) missingRepeat.push("502 (Ijazah Tertinggi)");
    if (!String(d["503"] || "").trim()) missingRepeat.push("503 (Pekerjaan Utama)");
    if (!String(d["504"] || "").trim()) missingRepeat.push("504 (Status Kedudukan)");

    if (missingRepeat.length > 0) {
      repeatAnomali.push({
        idDokumen,
        namaWarga,
        missingCount: missingRepeat.length,
        missingFields: missingRepeat.join(", ")
      });
    }
  });

  console.log(`\n=== 1. SUMMARY PERUMAHAN (DATA MASTER KK) ===`);
  console.log(`Total KK terdaftar: ${validMaster.length} KK`);
  console.log(`Total KK dengan data perumahan parsial/kosong: ${masterAnomali.length} KK`);

  console.log(`\n=== 2. SUMMARY DEMOGRAFI (DATA ANGGOTA KELUARGA) ===`);
  console.log(`Total Penduduk terdaftar: ${validRepeats.length} Jiwa`);
  console.log(`Total Warga dengan data demografi/pekerjaan parsial/kosong: ${repeatAnomali.length} Jiwa`);

  // Ringkasan per Variabel
  const masterStats = {};
  masterAnomali.forEach(a => {
    a.missingFields.split(", ").forEach(f => {
      masterStats[f] = (masterStats[f] || 0) + 1;
    });
  });

  const repeatStats = {};
  repeatAnomali.forEach(a => {
    a.missingFields.split(", ").forEach(f => {
      repeatStats[f] = (repeatStats[f] || 0) + 1;
    });
  });

  console.log("\n--- RINGKASAN VARIABEL PERUMAHAN KOSONG ---");
  console.table(masterStats);

  console.log("\n--- RINGKASAN VARIABEL DEMOGRAFI KOSONG ---");
  console.table(repeatStats);
}

main().finally(() => prisma.$disconnect());
