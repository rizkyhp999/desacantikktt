const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { idDokumenSuffix: "6404114407430001-20-2", nama: "YAWAN", v408: "4", v409: "2", v412: "1" },
  { idDokumenSuffix: "7205100206820002-20-03", nama: "NUR HAYATI", v408: "1", v409: "2", v412: "1" },
  { idDokumenSuffix: "6406074609590001-29-3", nama: "SRI MULYATI", v408: "4", v409: "2", v412: "1" },
  { idDokumenSuffix: "6404101712020001-29-9", nama: "SAHWANDI", v408: "1", v409: "1", v412: "1" },
  { idDokumenSuffix: "6410015007680001-20-25", nama: "JAINAB", v408: "2", v409: "2", v412: "1" },
  { idDokumenSuffix: "6473045310890001-28-1", nama: "SUTINAH", v408: "2", v409: "2", v412: "1" },
];

async function main() {
  console.log("Memulai pembaruan Tabel 2 (Demografi)...");
  let updatedCount = 0;

  for (const item of updates) {
    // Cari record perulangan berdasarkan suffix idDokumen
    const records = await prisma.dataPerulangan.findMany({
      where: {
        idDokumen: { endsWith: item.idDokumenSuffix }
      }
    });

    if (records.length > 0) {
      for (const record of records) {
        const currentData = (record.data || {});
        currentData["408"] = item.v408;
        currentData["409"] = item.v409;
        currentData["412"] = item.v412;
        // Jika suku belum ada, default ke TIDUNG agar tidak kosong
        if (!currentData["413"]) {
          currentData["413"] = "TIDUNG";
        }

        await prisma.dataPerulangan.update({
          where: { id: record.id },
          data: { data: currentData }
        });
        updatedCount++;
        console.log(`[BERHASIL] Updated ${item.nama} (${record.idDokumen})`);
      }
    } else {
      console.log(`[GAGAL] Document ID Suffix tidak ditemukan: ${item.idDokumenSuffix}`);
    }
  }

  console.log(`\nSelesai. Total ${updatedCount} record demografi berhasil diperbarui.`);
}

main().finally(() => prisma.$disconnect());
