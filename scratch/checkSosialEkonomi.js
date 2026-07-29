const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("Total valid members:", validRepeats.length);

  const keys501 = {};
  const keys502 = {};
  const keys503 = {};
  const keys505 = {};
  const keys506 = {};
  const keys507 = {};

  validRepeats.forEach(r => {
    const d = r.data || {};
    const v501 = String(d["501"] || "").trim();
    const v502 = String(d["502"] || "").trim();
    const v503 = String(d["503"] || "").trim();
    const v505 = String(d["505"] || d["505_a"] || "").trim();

    if (v501) keys501[v501] = (keys501[v501] || 0) + 1;
    if (v502) keys502[v502] = (keys502[v502] || 0) + 1;
    if (v503) keys503[v503] = (keys503[v503] || 0) + 1;
    if (v505) keys505[v505] = (keys505[v505] || 0) + 1;

    // Scan all keys starting with 506 and 507
    Object.keys(d).forEach(k => {
      if (k.startsWith("506")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") {
          keys506[k] = (keys506[k] || 0) + 1;
        }
      }
      if (k.startsWith("507")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") {
          keys507[k] = (keys507[k] || 0) + 1;
        }
      }
    });
  });

  console.log("\n501 Partisipasi Sekolah:", keys501);
  console.log("502 Ijazah Tertinggi:", keys502);
  console.log("503 Pekerjaan Utama (Top 10):", Object.entries(keys503).sort((a,b)=>b[1]-a[1]).slice(0, 10));
  console.log("505 Rekening Bank / Tabungan:", keys505);
  console.log("506 Keys Disabilitas:", keys506);
  console.log("507 Keys Penyakit Kronis:", keys507);
}

main().finally(() => prisma.$disconnect());
