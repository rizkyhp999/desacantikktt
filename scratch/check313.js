const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.dataMaster.findMany();
  const valid = items.filter(m => String(m.data["204"] || "").trim() === "1");
  console.log("Total valid 204=1 master items:", valid.length);
  
  const count312 = {};
  const count313a = {};
  valid.forEach(m => {
    const d = m.data || {};
    const v312 = d["312"] || "empty";
    const v313a = d["313_a"] || "empty";
    count312[v312] = (count312[v312] || 0) + 1;
    count313a[v313a] = (count313a[v313a] || 0) + 1;
  });
  console.log("312 breakdown:", count312);
  console.log("313_a breakdown:", count313a);
}

main().finally(() => prisma.$disconnect());
