const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMasterMap = new Map();
  
  master.forEach(m => {
    if (String(m.data["204"] || "").trim() === "1") {
      const d = m.data;
      // Cari nama teks di master data
      let namaText = "";
      for (const [k, v] of Object.entries(d)) {
        if (typeof v === 'string' && v.match(/[a-zA-Z]{3,}/) && !k.startsWith("id") && k !== "kode") {
          namaText = v;
          break;
        }
      }
      validMasterMap.set(m.idDokumen, {
        idDokumen: m.idDokumen,
        namaKK: namaText || `Dokumen: ${m.idDokumen.substring(0, 20)}...`,
        data: d
      });
    }
  });

  const repeats = await prisma.dataPerulangan.findMany();

  console.log("=== TABEL 1: PERUMAHAN (309, 305b, 306a, 306b) ===");
  const masterList = [];
  validMasterMap.forEach((val, idDokumen) => {
    const d = val.data;
    const v309 = String(d["309"] || "").trim();
    const v305b = String(d["305_b"] || d["305b"] || "").trim();
    const v306a = String(d["306_a"] || d["306a"] || "").trim();
    const v306b = String(d["306_b"] || d["306b"] || "").trim();

    if (!v309 || !v305b || !v306a || !v306b) {
      masterList.push({
        "No": masterList.length + 1,
        "ID Dokumen": idDokumen,
        "Nama Kepala Keluarga": val.namaKK,
        "309 (Kloset)": v309 || "KOSONG",
        "305b (Kondisi Lantai)": v305b || "KOSONG",
        "306a (Bahan Dinding)": v306a || "KOSONG",
        "306b (Kondisi Dinding)": v306b || "KOSONG",
      });
    }
  });
  console.table(masterList);

  console.log("\n=== TABEL 2: DEMOGRAFI (408, 409, 412, 413) ===");
  const repeatList = [];
  repeats.forEach(r => {
    if (!validMasterMap.has(r.idDokumen)) return;
    const d = r.data || {};
    
    let namaWarga = "";
    for (const [k, v] of Object.entries(d)) {
      if (typeof v === 'string' && v.match(/[a-zA-Z]{3,}/) && k !== "id") {
        namaWarga = v;
        break;
      }
    }
    if (!namaWarga) return;

    const v408 = String(d["408"] || "").trim();
    const v409 = String(d["409"] || "").trim();
    const v412 = String(d["412"] || "").trim();
    const v413 = String(d["413"] || "").trim();

    if (!v408 || !v409 || !v412 || !v413) {
      repeatList.push({
        "No": repeatList.length + 1,
        "ID Dokumen": r.idDokumen,
        "Nama Warga": namaWarga,
        "Nama KK": validMasterMap.get(r.idDokumen).namaKK,
        "408 (Status Nikah)": v408 || "KOSONG",
        "409 (Jenis Kelamin)": v409 || "KOSONG",
        "412 (Agama)": v412 || "KOSONG",
        "413 (Suku)": v413 || "KOSONG",
      });
    }
  });
  console.table(repeatList);
}

main().finally(() => prisma.$disconnect());
