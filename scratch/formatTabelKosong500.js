const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("Total valid repeat members:", validRepeats.length);

  const missingList = [];

  validRepeats.forEach(r => {
    const d = r.data || {};
    const nama = d["402"] || d["401"] || "TANPA NAMA";
    const id = r.idDokumen || "";

    const v501 = String(d["501"] || "").trim();
    const v505 = String(d["505"] || d["505_a"] || "").trim();

    // 506 check
    let v506 = [];
    Object.keys(d).forEach(k => {
      if (k.startsWith("506")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") v506.push(`${k}:${val}`);
      }
    });

    // 507 check
    let v507 = [];
    Object.keys(d).forEach(k => {
      if (k.startsWith("507")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") v507.push(`${k}:${val}`);
      }
    });

    if (!v501 || !v505 || v506.length === 0 || v507.length === 0) {
      missingList.push({
        id,
        nama,
        v501: v501 || "KOSONG",
        v505: v505 || "KOSONG",
        v506: v506.length > 0 ? v506.join(",") : "KOSONG",
        v507: v507.length > 0 ? v507.join(",") : "KOSONG"
      });
    }
  });

  console.log(`Jumlah warga dengan data 501/505/506/507 belum lengkap: ${missingList.length}`);
  console.log("\n--- TABEL RINCIAN WARGA ---");
  missingList.forEach((w, idx) => {
    console.log(`${idx+1}\t${w.nama}\t${w.id}\t501:${w.v501}\t505:${w.v505}\t506:${w.v506}\t507:${w.v507}`);
  });
}

main().finally(() => prisma.$disconnect());
