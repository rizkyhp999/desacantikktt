const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.dataMaster.findMany();
  const validMaster = master.filter(m => String(m.data["204"] || "").trim() === "1" && String(m.data["1001"] || "").trim() === "1");
  
  const repeats = await prisma.dataPerulangan.findMany();

  const result = [];
  let idx = 1;

  validMaster.forEach((m) => {
    const md = m.data || {};
    const rMatch = repeats.find(r => r.idDokumen === m.idDokumen && (r.data["1009"] !== undefined || r.data["1015"] !== undefined));
    const rd = rMatch ? (rMatch.data || {}) : {};

    const v1009 = parseFloat(String(rd["1009"] ?? md["1009"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_a = parseFloat(String(md["1010_a"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_b = parseFloat(String(md["1010_b"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_c = parseFloat(String(md["1010_c"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_d = parseFloat(String(md["1010_d"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_e = parseFloat(String(md["1010_e"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1010_f = parseFloat(String(rd["1010_f"] ?? md["1010_f"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1011 = parseFloat(String(rd["1011"] ?? md["1011"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1012 = parseFloat(String(md["1012"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1013 = parseFloat(String(md["1013"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1014 = parseFloat(String(md["1014"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1015 = parseFloat(String(rd["1015"] ?? md["1015"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
    const v1016 = parseFloat(String(rd["1016"] ?? md["1016"] ?? "0").replace(/[^0-9.]/g, "")) || 0;

    if (v1009 > 0 || v1015 > 0 || v1016 > 0) {
      result.push({
        responden: `Responden ${idx++}`,
        idDokumen: m.idDokumen,
        v1009,
        v1010_a,
        v1010_b,
        v1010_c,
        v1010_d,
        v1010_e,
        v1010_f,
        v1011,
        v1012,
        v1013,
        v1014,
        v1015,
        v1016,
      });
    }
  });

  console.log(JSON.stringify(result, null, 2));
}

main().finally(() => prisma.$disconnect());
