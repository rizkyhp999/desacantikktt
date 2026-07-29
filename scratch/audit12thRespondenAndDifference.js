const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");
  const repeats = await prisma.dataPerulangan.findMany();

  console.log(`--- AUDIT 12 KK PELAKU USAHA TANGKAP (1001=1 & 204=1) --- (Total: ${validMaster.length})`);

  validMaster.forEach((m, idx) => {
    const md = m.data || {};
    const rMatch = repeats.find(r => r.idDokumen === m.idDokumen && (r.data["1009"] !== undefined || r.data["1015"] !== undefined));
    const rd = rMatch ? (rMatch.data || {}) : {};

    const trip = parseFloat(String(md["1007"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const volPerTrip = parseFloat(String(md["1008_a"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const nilaiPerTrip = parseFloat(String(md["1008_b"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const v1009_master = md["1009"];
    const v1009_repeat = rd["1009"];
    const v1015_master = md["1015"];
    const v1015_repeat = rd["1015"];
    const v1016_master = md["1016"];
    const v1016_repeat = rd["1016"];
    const v1017_master = md["1017"];
    const v1017_repeat = rd["1017"];

    console.log(`\n[KK Ke-${idx+1}] ID Dokumen: ${m.idDokumen}`);
    console.log(`  Nama KK (402): ${md["402"] || md["nama"] || "-"}, RT/RW: ${md["106_a"]}/${md["106_b"]}`);
    console.log(`  1007 (Trip): ${trip}, 1008_a: ${volPerTrip}, 1008_b: ${nilaiPerTrip}`);
    console.log(`  1009 -> Master: ${v1009_master}, Repeat: ${v1009_repeat}`);
    console.log(`  1015 -> Master: ${v1015_master}, Repeat: ${v1015_repeat}`);
    console.log(`  1016 -> Master: ${v1016_master}, Repeat: ${v1016_repeat}`);
    console.log(`  1017 -> Master: ${v1017_master}, Repeat: ${v1017_repeat}`);
    console.log(`  1010_c: ${md["1010_c"]}, 1010_d: ${md["1010_d"]}, 1010_e: ${md["1010_e"]}, 1013: ${md["1013"]}, 1014: ${md["1014"]}`);
  });
}

main().finally(() => prisma.$disconnect());
