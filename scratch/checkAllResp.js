const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const masters = await prisma.dataMaster.findMany({ select: { idDokumen: true, data: true } });
  const repeats = await prisma.dataPerulangan.findMany({ select: { idDokumen: true, data: true } });
  
  const fishingDocs = masters.filter(m => String(m.data['1001'] || '').trim() === '1');
  console.log('Total fishing docs:', fishingDocs.length);
  
  fishingDocs.forEach((doc, i) => {
    const rMatch = repeats.find(r => r.idDokumen === doc.idDokumen && r.data['1009'] !== undefined);
    const md = doc.data;
    const rd = rMatch ? rMatch.data : {};
    
    const trip = parseFloat(String(md["1007"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const volPerTrip = parseFloat(String(md["1008_a"] || "0").replace(/[^0-9.]/g, "")) || 0;
    const nilaiPerTrip = parseFloat(String(md["1008_b"] || "0").replace(/[^0-9.]/g, "")) || 0;

    console.log(`\nResp ${i+1} (${doc.idDokumen}):`);
    console.log(`  Trip: ${trip}, Vol/Trip: ${volPerTrip}, Nilai/Trip: ${nilaiPerTrip}`);
    console.log(`  Master -> 1009: ${md['1009']}, 1010_f: ${md['1010_f']}, 1011: ${md['1011']}, 1015: ${md['1015']}, 1016: ${md['1016']}`);
    console.log(`  Repeat -> 1009: ${rd['1009']}, 1010_f: ${rd['1010_f']}, 1011: ${rd['1011']}, 1015: ${rd['1015']}, 1016: ${rd['1016']}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
