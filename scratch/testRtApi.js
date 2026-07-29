const http = require('http');

function fetchRt(rt) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000/api/data/statistik?rt=${rt}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const allStats = await fetchRt('all');
    console.log("rt=all -> Total KK:", allStats.stats?.totalKeluarga, "Total Penduduk:", allStats.stats?.totalPenduduk);
    const rt1Stats = await fetchRt('01');
    console.log("rt=01 -> Total KK:", rt1Stats.stats?.totalKeluarga, "Total Penduduk:", rt1Stats.stats?.totalPenduduk);
  } catch (err) {
    console.log("Dev server error or not running (handled):", err.message);
  }
}

main();
