const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validDocIds = new Set(master.filter(m => String(m.data["204"] || "").trim() === "1").map(m => m.idDokumen));

  const repeats = await prisma.dataPerulangan.findMany();
  const validRepeats = repeats.filter(r => validDocIds.has(r.idDokumen) && String(r.data["401"] || "").trim() !== "");

  console.log("Total valid members (204=1):", validRepeats.length);

  const empty501 = [];
  const empty505 = [];
  const empty506 = [];
  const empty507 = [];

  validRepeats.forEach(r => {
    const d = r.data || {};
    const nama = d["401"] || "TANPA NAMA";
    const id = r.idDokumen || "";

    const v501 = String(d["501"] || "").trim();
    const v505 = String(d["505"] || d["505_a"] || "").trim();

    if (!v501) empty501.push({ id, nama });
    if (!v505) empty505.push({ id, nama });

    // 506
    let has506 = false;
    Object.keys(d).forEach(k => {
      if (k.startsWith("506")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") has506 = true;
      }
    });
    if (!has506) empty506.push({ id, nama });

    // 507
    let has507 = false;
    Object.keys(d).forEach(k => {
      if (k.startsWith("507")) {
        const val = String(d[k]).trim();
        if (val && val !== "0" && val !== "2" && val !== "false") has507 = true;
      }
    });
    if (!has507) empty507.push({ id, nama });
  });

  console.log("Empty 501 count:", empty501.length);
  console.log("Empty 505 count:", empty505.length);
  console.log("Empty 506 count:", empty506.length);
  console.log("Empty 507 count:", empty507.length);

  console.log("\nSample empty 501:", empty501.slice(0, 10));
  console.log("\nSample empty 505:", empty505.slice(0, 10));
}

main().finally(() => prisma.$disconnect());
