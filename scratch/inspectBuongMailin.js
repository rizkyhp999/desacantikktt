const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");

  console.log("--- AUDIT FIELD 1102 UNTUK 12 KK PELAKU USAHA TANGKAP ---");
  validMaster.forEach((m, idx) => {
    const d = m.data || {};
    console.log(`Responden ${idx+1} [ID: ${m.idDokumen}]:`);
    console.log(`  1101 (Anggota Kelompok): ${d["1101"]}`);
    console.log(`  1102 (Nama Kelompok): ${d["1102"]}`);
  });
}

main().finally(() => prisma.$disconnect());
