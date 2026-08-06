const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metadata.findMany({
    where: {
      parameter: { startsWith: "405" },
    },
  });
  console.log("Metadata 405:", meta);

  const repeatSample = await prisma.dataPerulangan.findMany({ take: 20 });
  repeatSample.forEach((r) => {
    const d = r.data;
    console.log({
      id: r.idDokumen,
      "401": d["401"],
      "402": d["402"],
      "405_a": d["405_a"] || d["405a"],
      "405_b": d["405_b"] || d["405b"],
    });
  });

  await prisma.$disconnect();
}

main().catch(console.error);
