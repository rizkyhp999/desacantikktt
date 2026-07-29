const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/data/statistik');
    const json = await res.json();
    console.log("partisipasiSekolah:", json.stats?.partisipasiSekolah);
    console.log("kepemilikanRekening:", json.stats?.kepemilikanRekening);
    console.log("rekapDisabilitas:", json.stats?.rekapDisabilitas);
    console.log("rekapPenyakit:", json.stats?.rekapPenyakit);
  } catch (err) {
    console.error(err.message);
  }
}

test();
