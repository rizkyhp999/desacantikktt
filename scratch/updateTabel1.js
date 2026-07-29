const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { id: "65030300060001-DC2026BB-6504043011170001-27-2", "309": "1", "305_b": "1", "306_a": "3", "306_b": "2" },
  { id: "65030300060001-DC2026BB-6473021709700009-75-2", "309": "1", "305_b": "2", "306_a": "1", "306_b": "1" },
  { id: "65030300060003-DC2026BB-6504012507670001-23-5", "309": "1", "305_b": "2", "306_a": "3", "306_b": "2" },
  { id: "65030300060005-DC2026BB-6410020703710002-75-3", "309": "1", "305_b": "2", "306_a": "3", "306_b": "2" },
  { id: "65030300060005-DC2026BB-5308145112960001-26-2", "309": "1", "305_b": "1", "306_a": "1", "306_b": "1" },
  { id: "65030300060005-DC2026BB-5308140409950001-26-2", "309": "1", "305_b": "1", "306_a": "1", "306_b": "1" },
  { id: "65030300060002-DC2026BB-6404115704690001-69-9", "309": "1", "305_b": "1", "306_a": "3", "306_b": "1" },
];

async function main() {
  console.log("Memulai pembaruan Tabel 1 (Perumahan)...");
  let updatedCount = 0;

  for (const item of updates) {
    const record = await prisma.dataMaster.findFirst({
      where: { idDokumen: item.id }
    });

    if (record) {
      const currentData = (record.data || {});
      currentData["309"] = item["309"];
      currentData["305_b"] = item["305_b"];
      currentData["306_a"] = item["306_a"];
      currentData["306_b"] = item["306_b"];

      await prisma.dataMaster.update({
        where: { id: record.id },
        data: { data: currentData }
      });
      updatedCount++;
      console.log(`[BERHASIL] Updated ID Dokumen: ${item.id}`);
    } else {
      console.log(`[GAGAL] ID Dokumen tidak ditemukan: ${item.id}`);
    }
  }

  console.log(`\nSelesai. Total ${updatedCount} dari ${updates.length} record master berhasil diperbarui.`);
}

main().finally(() => prisma.$disconnect());
