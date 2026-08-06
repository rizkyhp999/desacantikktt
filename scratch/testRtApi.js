const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function computeForRt(rt) {
  const [masterItems, repeatItems] = await Promise.all([
    prisma.dataMaster.findMany({ select: { idDokumen: true, data: true } }),
    prisma.dataPerulangan.findMany({ select: { idDokumen: true, data: true } }),
  ]);

  let validMasterItems = masterItems.filter((m) => {
    const d = m.data;
    return String(d["204"] || "").trim() === "1";
  });

  if (rt !== "all") {
    validMasterItems = validMasterItems.filter((m) => {
      const d = m.data;
      const valRt = String(d["106_a"] || d["106a"] || "").trim().padStart(2, "0");
      return valRt === rt.padStart(2, "0");
    });
  }

  const totalKeluarga = validMasterItems.length;
  const validDocIds = new Set(validMasterItems.map((m) => m.idDokumen));

  const validMembers = repeatItems.filter((r) => {
    if (!validDocIds.has(r.idDokumen)) return false;
    const d = r.data;
    const val401 = String(d["401"] || "").trim();
    return val401 !== "" && val401 !== "null" && val401 !== "undefined";
  });

  const totalPenduduk = validMembers.length;

  let domisiliPend1 = 0;
  let domisiliPend2 = 0;
  let domisiliPend3 = 0;
  let domisiliPend4 = 0;
  let domisiliPendLainnya = 0;

  validMembers.forEach((r) => {
    const d = r.data;
    const val405b = String(d["405_b"] || d["405b"] || "").trim();
    if (val405b === "1") domisiliPend1++;
    else if (val405b === "2") domisiliPend2++;
    else if (val405b === "3") domisiliPend3++;
    else if (val405b === "4") domisiliPend4++;
    else domisiliPendLainnya++;
  });

  const docToRepeatMap = new Map();
  repeatItems.forEach((r) => {
    if (!docToRepeatMap.has(r.idDokumen)) docToRepeatMap.set(r.idDokumen, []);
    docToRepeatMap.get(r.idDokumen).push(r.data);
  });

  let domisiliKel1 = 0;
  let domisiliKel2 = 0;
  let domisiliKel3 = 0;
  let domisiliKel4 = 0;
  let domisiliKelLainnya = 0;

  validMasterItems.forEach((m) => {
    const members = docToRepeatMap.get(m.idDokumen) || [];
    const krt = members.find((d) => String(d["401"] || "").trim() === "1") || members[0];
    if (krt) {
      const val405b = String(krt["405_b"] || krt["405b"] || "").trim();
      if (val405b === "1") domisiliKel1++;
      else if (val405b === "2") domisiliKel2++;
      else if (val405b === "3") domisiliKel3++;
      else if (val405b === "4") domisiliKel4++;
      else domisiliKelLainnya++;
    } else {
      domisiliKelLainnya++;
    }
  });

  return {
    rt,
    totalKeluarga,
    totalPenduduk,
    keluarga: { 1: domisiliKel1, 2: domisiliKel2, 3: domisiliKel3, 4: domisiliKel4, lainnya: domisiliKelLainnya },
    penduduk: { 1: domisiliPend1, 2: domisiliPend2, 3: domisiliPend3, 4: domisiliPend4, lainnya: domisiliPendLainnya },
  };
}

async function main() {
  const rts = ["all", "01", "02", "03", "04", "05"];
  for (const rt of rts) {
    const res = await computeForRt(rt);
    console.log(res);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
