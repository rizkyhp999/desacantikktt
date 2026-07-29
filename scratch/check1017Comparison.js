const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");
  const repeats = await prisma.dataPerulangan.findMany();

  console.log("--- PERBANDINGAN FORMULA 1009, 1015, 1016 & 1017 PER RESPONDEN ---");
  let idx = 1;

  validMaster.forEach((m) => {
    const md = m.data || {};
    const rMatch = repeats.find(r => r.idDokumen === m.idDokumen && (r.data["1009"] !== undefined || r.data["1015"] !== undefined));
    const rd = rMatch ? (rMatch.data || {}) : {};

    const v1007 = parseFloat(String(md["1007"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1008_a = parseFloat(String(md["1008_a"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1008_b = parseFloat(String(md["1008_b"] ?? "0").replace(/[^0-9.]/g, "")) || 0;

    // 1009 = 1008_b * 1007
    const calc1009 = v1008_b * v1007;

    const v1010_c = parseFloat(String(md["1010_c"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_d = parseFloat(String(md["1010_d"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_e = parseFloat(String(md["1010_e"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_f = v1010_c + v1010_d + v1010_e; // atau dari data
    const v1011 = v1010_f * v1007;
    const v1013 = parseFloat(String(md["1013"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1014 = parseFloat(String(md["1014"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1015 = v1011 + v1013 + v1014;
    const calc1016 = calc1009 - v1015;

    const v1017 = parseFloat(String(md["1017"] ?? rd["1017"] ?? "0").replace(/[^0-9.]/g, "")) || 0;

    if (v1007 > 0 || calc1009 > 0 || v1017 > 0) {
      console.log(`Responden ${idx++}:`);
      console.log(`  Trip(1007): ${v1007} | Vol/Trip(1008a): ${v1008_a}kg | Nilai/Trip(1008b): Rp${v1008_b.toLocaleString('id-ID')}`);
      console.log(`  1009 (1008b * 1007): Rp${calc1009.toLocaleString('id-ID')}`);
      console.log(`  Rincian 1015: 1010c(BBM)=Rp${v1010_c.toLocaleString('id-ID')}, 1010d(Air)=Rp${v1010_d.toLocaleString('id-ID')}, 1010e(Umpan)=Rp${v1010_e.toLocaleString('id-ID')} => 1010f(Biaya/Trip)=Rp${v1010_f.toLocaleString('id-ID')}`);
      console.log(`  1011(Biaya/Thn)=Rp${v1011.toLocaleString('id-ID')}, 1013=Rp${v1013.toLocaleString('id-ID')}, 1014=Rp${v1014.toLocaleString('id-ID')} => Total 1015=Rp${v1015.toLocaleString('id-ID')}`);
      console.log(`  1016 (1009 - 1015): Rp${calc1016.toLocaleString('id-ID')}`);
      console.log(`  1017 (Pendapatan Terdaftar): Rp${v1017.toLocaleString('id-ID')}`);
    }
  });
}

main().finally(() => prisma.$disconnect());
