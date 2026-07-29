import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting data seed into database...");
  const jsonPath = path.join(process.cwd(), "scratch", "parsed_data.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const parsed = JSON.parse(rawData);

  // 1. Seed Metadata
  console.log(`Seeding ${parsed.metadata.length} metadata records...`);
  await prisma.metadata.deleteMany({});
  
  // Batch insert metadata in chunks
  const chunkSize = 100;
  for (let i = 0; i < parsed.metadata.length; i += chunkSize) {
    const chunk = parsed.metadata.slice(i, i + chunkSize);
    await prisma.metadata.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  // 2. Seed DataMaster & DataPerulangan
  console.log(`Seeding ${parsed.master.length} master records...`);
  await prisma.dataPerulangan.deleteMany({});
  await prisma.dataMaster.deleteMany({});

  for (let i = 0; i < parsed.master.length; i += chunkSize) {
    const chunk = parsed.master.slice(i, i + chunkSize);
    await prisma.dataMaster.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log(`Seeding ${parsed.repeat.length} repeat records...`);
  for (let i = 0; i < parsed.repeat.length; i += chunkSize) {
    const chunk = parsed.repeat.slice(i, i + chunkSize);
    await prisma.dataPerulangan.createMany({
      data: chunk,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
