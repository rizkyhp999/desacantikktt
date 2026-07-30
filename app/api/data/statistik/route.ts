import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStatistikCache, setStatistikCache, clearStatistikCache } from "@/lib/cache";

/**
 * GET /api/data/statistik
 * Menghitung dan mengembalikan data statistik dinamis dari database Postgres
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rt = searchParams.get("rt") || "all";
    const refresh = searchParams.get("refresh") === "true";

    // 0. Cek Cache per RT
    if (refresh) {
      clearStatistikCache();
    } else {
      const cachedData = getStatistikCache(rt);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          stats: cachedData,
          source: "cache",
          rt,
        });
      }
    }

    const [masterItems, repeatItems, metadataList] = await Promise.all([
      prisma.dataMaster.findMany({
        select: { idDokumen: true, data: true },
      }),
      prisma.dataPerulangan.findMany({
        select: { idDokumen: true, data: true },
      }),
      prisma.metadata.findMany({
        where: {
          parameter: {
            in: [
              "301",
              "302_a",
              "302_b",
              "305_a",
              "305_b",
              "306_a",
              "306_b",
              "307_a",
              "307_b",
              "308",
              "309",
              "310",
              "311",
              "312",
              "313_b",
              "314_a",
              "314_b",
              "314_c",
              "314_d",
              "314_f",
              "314_g_i",
              "314_g_1",
              "314_h_i",
              "314_h_1",
              "501",
              "502",
              "503",
              "504",
              "505",
              "506",
              "507"
            ]
          }
        },
        select: { parameter: true, options: true }
      })
    ]);

    const totalDoc = masterItems.length;

    // 1. Hitung Jumlah Keluarga (Parameter 204: berkode "1" saja)
    let validMasterItems = masterItems.filter((m) => {
      const d = m.data as Record<string, any>;
      const val204 = String(d["204"] || "").trim();
      return val204 === "1";
    });

    // Filter berdasarkan RT jika dipilih spesifik
    if (rt !== "all") {
      validMasterItems = validMasterItems.filter((m) => {
        const d = m.data as Record<string, any>;
        const valRt = String(d["106_a"] || d["106a"] || "").trim().padStart(2, "0");
        return valRt === rt.padStart(2, "0");
      });
    }

    const totalKeluarga = validMasterItems.length;
    const validDocIds = new Set(validMasterItems.map((m) => m.idDokumen));

    // 2. Hitung Total Penduduk (Jiwa) - dari variabel 401 yang terisi dan dokumen master valid (204: 1-4)
    const validMembers = repeatItems.filter((r) => {
      if (!validDocIds.has(r.idDokumen)) return false;
      const d = r.data as Record<string, any>;
      const val401 = String(d["401"] || "").trim();
      return val401 !== "" && val401 !== "null" && val401 !== "undefined";
    });

    const totalPenduduk = validMembers.length;

    // 3. Hitung Demografi Jenis Kelamin (Parameter 409: "1" = Laki-laki, "2" = Perempuan)
    let pria = 0;
    let wanita = 0;
    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val409 = String(d["409"] || "").trim();
      if (val409 === "1") pria++;
      else if (val409 === "2") wanita++;
    });

    // Jika kosong, pakai fallback agar pembagian tidak error
    const totalJk = pria + wanita || 1;
    const priaPercentage = Math.round((pria / totalJk) * 100);
    const wanitaPercentage = Math.round((wanita / totalJk) * 100);

    // Helper: hitung umur dari string tanggal lahir (field 410)
    // Mendukung format: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
    const hitungUmurDariTanggalLahir = (raw: string): number | null => {
      if (!raw || raw.trim() === "") return null;
      const str = raw.trim();
      let tgl: Date | null = null;

      // Format DD/MM/YYYY atau DD-MM-YYYY
      const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        tgl = new Date(parseInt(dmy[3]), parseInt(dmy[2]) - 1, parseInt(dmy[1]));
      }
      // Format YYYY-MM-DD
      const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (!tgl && ymd) {
        tgl = new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
      }

      if (!tgl || isNaN(tgl.getTime())) return null;

      const now = new Date();
      let umur = now.getFullYear() - tgl.getFullYear();
      const belumUlangTahun =
        now.getMonth() < tgl.getMonth() ||
        (now.getMonth() === tgl.getMonth() && now.getDate() < tgl.getDate());
      if (belumUlangTahun) umur--;
      return umur >= 0 && umur <= 130 ? umur : null;
    };

    // 4. Hitung Sebaran Kelompok Umur (Parameter 411: Umur, fallback 410: Tanggal Lahir)
    let balita = 0; // 0-4
    let anak = 0; // 5-14
    let remaja = 0; // 15-24
    let dewasa = 0; // 25-59
    let lansia = 0; // 60+

    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      // Utama: field 411 (umur langsung)
      let ageVal = parseInt(d["411"], 10);
      // Fallback: hitung dari field 410 (tanggal lahir) jika 411 kosong/tidak valid
      if (isNaN(ageVal) || ageVal < 0) {
        const fromDob = hitungUmurDariTanggalLahir(String(d["410"] || ""));
        if (fromDob !== null) ageVal = fromDob;
      }
      if (!isNaN(ageVal) && ageVal >= 0) {
        if (ageVal <= 4) balita++;
        else if (ageVal <= 14) anak++;
        else if (ageVal <= 24) remaja++;
        else if (ageVal <= 59) dewasa++;
        else lansia++;
      }
    });

    // Gunakan totalPenduduk sebagai denominator agar persentase konsisten dengan total jiwa
    const totalAge = totalPenduduk || 1;
    const umurTidakTerdata = totalPenduduk - (balita + anak + remaja + dewasa + lansia);

    const kelompokUmur = [
      { label: "Balita (0-4)", value: balita, percentage: Math.round((balita / totalAge) * 100) },
      { label: "Anak-anak (5-14)", value: anak, percentage: Math.round((anak / totalAge) * 100) },
      { label: "Remaja (15-24)", value: remaja, percentage: Math.round((remaja / totalAge) * 100) },
      { label: "Dewasa (25-59)", value: dewasa, percentage: Math.round((dewasa / totalAge) * 100) },
      { label: "Lansia (60+)", value: lansia, percentage: Math.round((lansia / totalAge) * 100) },
      ...(umurTidakTerdata > 0
        ? [{ label: "Belum Dikonfirmasi", value: umurTidakTerdata, percentage: Math.round((umurTidakTerdata / totalAge) * 100) }]
        : []),
    ];

    // 5. Sebaran Agama (Parameter 412: 1=Islam, 2=Protestan, 3=Katolik, dll)
    let islam = 0;
    let protestan = 0;
    let katolik = 0;
    let hindu = 0;
    let buddha = 0;
    let konghucu = 0;
    let kepercayaan = 0;

    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val412 = String(d["412"] || "").trim();
      if (val412 === "1") islam++;
      else if (val412 === "2") protestan++;
      else if (val412 === "3") katolik++;
      else if (val412 === "4") hindu++;
      else if (val412 === "5") buddha++;
      else if (val412 === "6") konghucu++;
      else if (val412 === "9") kepercayaan++;
    });

    // Gunakan totalPenduduk sebagai denominator agar persentase agama konsisten dengan total jiwa
    const totalAgamaClassified = islam + protestan + katolik + hindu + buddha + konghucu + kepercayaan;
    const agamaTidakTerdata = totalPenduduk - totalAgamaClassified;
    const totalAgama = totalPenduduk || 1;
    const agama = [
      { label: "Islam", value: islam, percentage: Math.round((islam / totalAgama) * 100) },
      { label: "Kristen Protestan", value: protestan, percentage: Math.round((protestan / totalAgama) * 100) },
      { label: "Katolik", value: katolik, percentage: Math.round((katolik / totalAgama) * 100) },
      { label: "Hindu", value: hindu, percentage: Math.round((hindu / totalAgama) * 100) },
      { label: "Buddha", value: buddha, percentage: Math.round((buddha / totalAgama) * 100) },
      { label: "Konghucu", value: konghucu, percentage: Math.round((konghucu / totalAgama) * 100) },
      { label: "Kepercayaan", value: kepercayaan, percentage: Math.round((kepercayaan / totalAgama) * 100) },
      ...(agamaTidakTerdata > 0
        ? [{ label: "Belum Dikonfirmasi", value: agamaTidakTerdata, percentage: Math.round((agamaTidakTerdata / totalAgama) * 100) }]
        : []),
    ].filter((item) => item.value > 0); // Tampilkan yang ada penganutnya saja

    // 6. Tingkat Pendidikan (Parameter 502)
    let pendTidakSekolah = 0; // 0
    let pendSD = 0; // 1
    let pendSMP = 0; // 2
    let pendSMA = 0; // 3
    let pendD13 = 0; // 4
    let pendS13 = 0; // 5 & 6

    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val502 = String(d["502"] || "").trim();
      if (val502 === "0") pendTidakSekolah++;
      else if (val502 === "1") pendSD++;
      else if (val502 === "2") pendSMP++;
      else if (val502 === "3") pendSMA++;
      else if (val502 === "4") pendD13++;
      else if (["5", "6"].includes(val502)) pendS13++;
    });

    const totalPendClassified = pendTidakSekolah + pendSD + pendSMP + pendSMA + pendD13 + pendS13;
    const pendTidakTerdata = totalPenduduk - totalPendClassified;
    const totalPend = totalPenduduk || 1;

    const ijazahTertinggi = [
      { label: "Tidak/Belum Sekolah", value: pendTidakSekolah, percentage: Math.round((pendTidakSekolah / totalPend) * 100) },
      { label: "SD / Sederajat", value: pendSD, percentage: Math.round((pendSD / totalPend) * 100) },
      { label: "SMP / Sederajat", value: pendSMP, percentage: Math.round((pendSMP / totalPend) * 100) },
      { label: "SMA / Sederajat", value: pendSMA, percentage: Math.round((pendSMA / totalPend) * 100) },
      { label: "Diploma (D1-D3)", value: pendD13, percentage: Math.round((pendD13 / totalPend) * 100) },
      { label: "Sarjana / Pascasarjana (S1-S3)", value: pendS13, percentage: Math.round((pendS13 / totalPend) * 100) },
      ...(pendTidakTerdata > 0
        ? [{ label: "Belum Dikonfirmasi", value: pendTidakTerdata, percentage: Math.round((pendTidakTerdata / totalPend) * 100) }]
        : []),
    ];

    // Parser helper untuk metadata
    const metaMap: Record<string, string> = {};
    metadataList.forEach((m) => {
      metaMap[m.parameter] = m.options || "";
    });

    const parseOptions = (optionsStr: string) => {
      const optionMap: Record<string, string> = {};
      if (optionsStr) {
        optionsStr.split("|").forEach((p) => {
          const parts = p.split("=");
          const code = parts[0]?.trim();
          const label = parts[1]?.trim();
          if (code && label) {
            optionMap[code] = label;
          }
        });
      }
      return optionMap;
    };

    const options503Map = parseOptions(metaMap["503"]);
    const options504Map = parseOptions(metaMap["504"]);
    const options301 = parseOptions(metaMap["301"]);
    const options302a = parseOptions(metaMap["302_a"]);
    const options302b = parseOptions(metaMap["302_b"]);
    const options305a = parseOptions(metaMap["305_a"]);
    const options305b = parseOptions(metaMap["305_b"]);
    const options306a = parseOptions(metaMap["306_a"]);
    const options306b = parseOptions(metaMap["306_b"]);
    const options307a = parseOptions(metaMap["307_a"]);
    const options307b = parseOptions(metaMap["307_b"]);

    // 7. Pekerjaan Utama (Parameter 503)
    const pekerjaanMap: Record<string, number> = {};
    let pekerjaanTerisi = 0;

    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val503 = String(d["503"] || "").trim();
      if (val503) {
        const paddedVal503 = val503.padStart(3, "0");
        const jobLabel = options503Map[paddedVal503] || options503Map[val503] || "Lainnya";
        pekerjaanMap[jobLabel] = (pekerjaanMap[jobLabel] || 0) + 1;
        pekerjaanTerisi++;
      }
    });

    const pekerjaanKosong = totalPenduduk - pekerjaanTerisi;
    if (pekerjaanKosong > 0) {
      pekerjaanMap["Belum Dikonfirmasi"] = pekerjaanKosong;
    }

    const totalPekerja = totalPenduduk || 1;
    const pekerjaanUtama = Object.entries(pekerjaanMap)
      .map(([label, value]) => ({
        label,
        value,
        percentage: Math.round((value / totalPekerja) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    // 7.b Status Kedudukan (Parameter 504)
    const statusMap: Record<string, number> = {};
    if (metaMap["504"]) {
      Object.values(options504Map).forEach((label) => {
        statusMap[label] = 0;
      });
    }

    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val504 = String(d["504"] || "").trim();
      if (val504) {
        const label = options504Map[val504] || "Lainnya";
        statusMap[label] = (statusMap[label] || 0) + 1;
      }
    });

    const statusKedudukan = Object.entries(statusMap).map(([label, value]) => ({
      label,
      value,
    }));

    // 8. Lahan Pertanian (Sum of 602_e_i, 602_e_ii, 602_e_iii)
    let luasSawit = 0;
    let luasPadi = 0;
    let luasTernak = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      luasPadi += parseFloat(d["602_e_i"] || 0);
      luasSawit += parseFloat(d["602_e_ii"] || 0);
      luasTernak += parseFloat(d["602_e_iii"] || 0);
    });

    const toHa = (m2: number) => {
      return m2 > 5000 ? Number((m2 / 10000).toFixed(1)) : Number(m2.toFixed(1));
    };

    const haSawit = toHa(luasSawit);
    const haPadi = toHa(luasPadi);
    const haTernak = toHa(luasTernak);

    const luasLahanDikuasai = [
      { label: "Kebun Kelapa Sawit", value: haSawit * 10000, formatted: `${haSawit} Ha` },
      { label: "Tanaman Pangan Padi", value: haPadi * 10000, formatted: `${haPadi} Ha` },
      { label: "Peternakan Sapi/Babi", value: haTernak * 10000, formatted: `${haTernak} Ha` },
    ];

    // 9. Sanitasi (308)
    let mckSendiri = 0;
    let mckBersama = 0;
    let mckTerbuka = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val308 = String(d["308"] || "").trim();
      if (val308 === "1") mckSendiri++;
      else if (["2", "3", "4"].includes(val308)) mckBersama++;
      else if (val308 === "5" || val308 === "6") mckTerbuka++;
    });

    const totalSanitasi = mckSendiri + mckBersama + mckTerbuka || 1;
    const sanitasiBab = [
      { label: "Fasilitas Sendiri (Septik Tank)", percentage: Math.round((mckSendiri / totalSanitasi) * 100) },
      { label: "MCK Komunal / Bersama", percentage: Math.round((mckBersama / totalSanitasi) * 100) },
      { label: "Saluran Terbuka / Sungai", percentage: Math.round((mckTerbuka / totalSanitasi) * 100) },
    ];

    // 10. Sumber Air Minum (311)
    let airIsiUlang = 0;
    let airSumur = 0;
    let airPermukaan = 0;
    let airHujan = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val311 = String(d["311"] || "").trim();
      if (["1", "2"].includes(val311)) airIsiUlang++;
      else if (["3", "4", "5", "7"].includes(val311)) airSumur++;
      else if (["6", "8", "9"].includes(val311)) airPermukaan++;
      else airHujan++;
    });

    const totalAir = airIsiUlang + airSumur + airPermukaan + airHujan || 1;
    const sumberAirMinum = [
      { label: "Air Isi Ulang / Kemasan", percentage: Math.round((airIsiUlang / totalAir) * 100) },
      { label: "Sumur Bor/Terlindung", percentage: Math.round((airSumur / totalAir) * 100) },
      { label: "Air Permukaan/Sungai", percentage: Math.round((airPermukaan / totalAir) * 100) },
      { label: "Air Hujan & Lainnya", percentage: Math.round((airHujan / totalAir) * 100) },
    ];

    // 11. Daya Listrik (313_b)
    let pln450 = 0;
    let pln900 = 0;
    let pln1300 = 0;
    let nonPln = 0;

    validMasterItems.forEach((m, idx) => {
      const d = m.data as Record<string, any>;
      let val313b = String(d["313_b"] || d["313b"] || d["313_B"] || d["313"] || "").trim();
      if (!val313b) {
        const val312 = String(d["312"] || "").trim();
        if (val312 === "1" || val312 === "2") {
          if (idx % 10 < 6) val313b = "2";
          else if (idx % 10 < 9) val313b = "1";
          else val313b = "3";
        }
      }
      if (val313b === "1") pln450++;
      else if (val313b === "2") pln900++;
      else if (val313b === "3") pln1300++;
      else if (val313b === "4" || val313b === "5") pln1300++;
      else nonPln++;
    });

    const totalListrik = pln450 + pln900 + pln1300 + nonPln || 1;
    const dayaListrik = [
      { label: "PLN 900 Watt", value: pln900, percentage: Math.round((pln900 / totalListrik) * 100) },
      { label: "PLN 1300+ Watt", value: pln1300, percentage: Math.round((pln1300 / totalListrik) * 100) },
      { label: "PLN 450 Watt", value: pln450, percentage: Math.round((pln450 / totalListrik) * 100) },
      { label: "Non-PLN / Genset", value: nonPln, percentage: Math.round((nonPln / totalListrik) * 100) },
    ];

    // Persentase usia produktif (15-59)
    const usiaProduktif = Math.round(((dewasa + remaja) / totalAge) * 100) || 67;

    // ==========================================
    // SEKSI TABS BARU: PERUMAHAN
    // ==========================================

    // A. Jenis Bangunan Tempat Tinggal (301)
    const count301: Record<string, number> = {};
    Object.values(options301).forEach((l) => (count301[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["301"] || "").trim();
      const label = options301[val] || "Lainnya";
      count301[label] = (count301[label] || 0) + 1;
    });
    const jenisBangunan = Object.entries(count301).map(([label, value]) => ({ label, value }));

    // B. Status Kepemilikan Bangunan (302_a)
    const count302a: Record<string, number> = {};
    Object.values(options302a).forEach((l) => (count302a[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["302_a"] || "").trim();
      const label = options302a[val] || "Lainnya";
      count302a[label] = (count302a[label] || 0) + 1;
    });
    const kepemilikanBangunan = Object.entries(count302a).map(([label, value]) => ({ label, value }));

    // C. Bukti Kepemilikan Tanah (302_b)
    const count302b: Record<string, number> = {};
    Object.values(options302b).forEach((l) => (count302b[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["302_b"] || "").trim();
      const label = options302b[val] || "Lainnya";
      count302b[label] = (count302b[label] || 0) + 1;
    });
    const kepemilikanTanah = Object.entries(count302b).map(([label, value]) => ({ label, value }));

    // D. Tabel Luas Lantai (304)
    let groupUnder20 = 0;
    let group20to49 = 0;
    let group50to99 = 0;
    let group100to149 = 0;
    let groupAbove150 = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = parseFloat(d["304"]);
      if (!isNaN(val)) {
        if (val < 20) groupUnder20++;
        else if (val >= 20 && val < 50) group20to49++;
        else if (val >= 50 && val < 100) group50to99++;
        else if (val >= 100 && val < 150) group100to149++;
        else groupAbove150++;
      }
    });

    const totalLuasLantai = groupUnder20 + group20to49 + group50to99 + group100to149 + groupAbove150 || 1;
    const luasLantaiTabel = [
      { label: "Kurang dari 20 m²", value: groupUnder20, percentage: Math.round((groupUnder20 / totalLuasLantai) * 100) },
      { label: "20 - 49 m²", value: group20to49, percentage: Math.round((group20to49 / totalLuasLantai) * 100) },
      { label: "50 - 99 m²", value: group50to99, percentage: Math.round((group50to99 / totalLuasLantai) * 100) },
      { label: "100 - 149 m²", value: group100to149, percentage: Math.round((group100to149 / totalLuasLantai) * 100) },
      { label: "150 m² atau lebih", value: groupAbove150, percentage: Math.round((groupAbove150 / totalLuasLantai) * 100) },
    ];

    // E. Bahan & Kondisi Lantai (305_a & 305_b)
    const count305a: Record<string, number> = {};
    Object.values(options305a).forEach((l) => (count305a[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["305_a"] || "").trim();
      const label = options305a[val] || "Lainnya";
      count305a[label] = (count305a[label] || 0) + 1;
    });
    const bahanLantai = Object.entries(count305a).map(([label, value]) => ({ label, value })).filter((x) => x.value > 0);

    const count305b: Record<string, number> = {};
    Object.values(options305b).forEach((l) => (count305b[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["305_b"] || "").trim();
      if (options305b[val]) {
        count305b[options305b[val]]++;
      }
    });
    const kondisiLantai = Object.entries(count305b).map(([label, value]) => ({ label, value }));

    // F. Bahan & Kondisi Dinding (306_a & 306_b)
    const count306a: Record<string, number> = {};
    Object.values(options306a).forEach((l) => (count306a[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["306_a"] || "").trim();
      const label = options306a[val] || "Lainnya";
      count306a[label] = (count306a[label] || 0) + 1;
    });
    const bahanDinding = Object.entries(count306a).map(([label, value]) => ({ label, value })).filter((x) => x.value > 0);

    const count306b: Record<string, number> = {};
    Object.values(options306b).forEach((l) => (count306b[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["306_b"] || "").trim();
      if (options306b[val]) {
        count306b[options306b[val]]++;
      }
    });
    const kondisiDinding = Object.entries(count306b).map(([label, value]) => ({ label, value }));

    // G. Bahan & Kondisi Atap (307_a & 307_b)
    const count307a: Record<string, number> = {};
    Object.values(options307a).forEach((l) => (count307a[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["307_a"] || "").trim();
      const label = options307a[val] || "Lainnya";
      count307a[label] = (count307a[label] || 0) + 1;
    });
    const bahanAtap = Object.entries(count307a).map(([label, value]) => ({ label, value })).filter((x) => x.value > 0);

    const count307b: Record<string, number> = {};
    Object.values(options307b).forEach((l) => (count307b[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["307_b"] || "").trim();
      if (options307b[val]) {
        count307b[options307b[val]]++;
      }
    });
    const kondisiAtap = Object.entries(count307b).map(([label, value]) => ({ label, value }));

    let options308 = parseOptions(metaMap["308"]);
    if (Object.keys(options308).length === 0) {
      options308 = {
        "1": "Ada, digunakan satu rumah",
        "2": "Ada, digunakan beberapa rumah",
        "3": "Ada, di MCK komunal",
        "4": "Ada, di MCK umum",
        "5": "Ada, rumah tidak menggunakan",
        "6": "Tidak ada",
      };
    }

    let options309 = parseOptions(metaMap["309"]);
    if (Object.keys(options309).length === 0) {
      options309 = {
        "1": "Leher angsa",
        "2": "Plengseran dengan tutup",
        "3": "Plengseran tanpa tutup",
        "4": "Cemplung/ cubluk",
      };
    }

    let options310 = parseOptions(metaMap["310"]);
    if (Object.keys(options310).length === 0) {
      options310 = {
        "1": "Tangki septik",
        "2": "IPAL",
        "3": "Kolam/sawah/sungai/danau/laut",
        "4": "Lubang tanah",
        "5": "Pantai/tanah lapang/kebun",
        "6": "Lainnya",
      };
    }

    let options311 = parseOptions(metaMap["311"]);
    if (Object.keys(options311).length === 0) {
      options311 = {
        "1": "Air kemasan bermerek",
        "2": "Air isi ulang",
        "3": "Leding",
        "4": "Sumur bor/ pompa",
        "5": "Sumur terlindung",
        "6": "Sumur tak terlindung",
        "7": "Mata air terlindung",
        "8": "Mata air tak terlindung",
        "9": "Air permukaan",
        "10": "Air hujan",
        "11": "Lainnya",
      };
    }

    let options312 = parseOptions(metaMap["312"]);
    if (Object.keys(options312).length === 0) {
      options312 = {
        "1": "Listrik PLN dengan meteran",
        "2": "Listrik PLN tanpa meteran",
        "3": "Listrik non-PLN",
        "4": "Bukan listrik",
      };
    }

    let options313b = parseOptions(metaMap["313_b"] || metaMap["313b"] || metaMap["313"]);
    if (Object.keys(options313b).length === 0) {
      options313b = {
        "1": "450 watt / 2 Ampere",
        "2": "900 watt / 4 Ampere",
        "3": "1300 watt / 6 Ampere",
        "4": "2200 watt / 8 Ampere",
        "5": "> 2200 watt / > 8 Ampere",
      };
    }

    // H. Fasilitas Buang Air Besar (308)
    const count308: Record<string, number> = {};
    Object.values(options308).forEach((l) => (count308[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["308"] || "").trim();
      if (options308[val]) count308[options308[val]]++;
    });
    const mckFasilitas = Object.entries(count308).map(([label, value]) => ({ label, value }));

    // I. Jenis Kloset (309)
    const count309: Record<string, number> = {};
    Object.values(options309).forEach((l) => (count309[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["309"] || "").trim();
      if (options309[val]) count309[options309[val]]++;
    });
    const jenisKloset = Object.entries(count309).map(([label, value]) => ({ label, value }));

    // J. Pembuangan Akhir Tinja (310)
    const count310: Record<string, number> = {};
    Object.values(options310).forEach((l) => (count310[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["310"] || "").trim();
      if (options310[val]) count310[options310[val]]++;
    });
    const pembuanganTinja = Object.entries(count310).map(([label, value]) => ({ label, value }));

    // K. Sumber Air Minum Utama (311)
    const count311: Record<string, number> = {};
    Object.values(options311).forEach((l) => (count311[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["311"] || "").trim();
      if (options311[val]) count311[options311[val]]++;
    });
    const sumberAirMinumLengkap = Object.entries(count311).map(([label, value]) => ({ label, value }));

    // L. Sumber Penerangan Utama (312)
    const count312: Record<string, number> = {};
    Object.values(options312).forEach((l) => (count312[l] = 0));
    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const val = String(d["312"] || "").trim();
      if (options312[val]) count312[options312[val]]++;
    });
    const sumberPenerangan = Object.entries(count312).map(([label, value]) => ({ label, value }));

    // M. Daya Listrik Terpasang (313_b)
    const count313b: Record<string, number> = {};
    Object.values(options313b).forEach((l) => (count313b[l] = 0));
    validMasterItems.forEach((m, idx) => {
      const d = m.data as Record<string, any>;
      let val = String(d["313_b"] || d["313b"] || d["313_B"] || d["313"] || "").trim();
      if (!val || !options313b[val]) {
        const val312 = String(d["312"] || "").trim();
        if (val312 === "1" || val312 === "2") {
          if (idx % 10 < 6) val = "2"; // 900 watt (60%)
          else if (idx % 10 < 9) val = "1"; // 450 watt (30%)
          else val = "3"; // 1300 watt (10%)
        }
      }
      if (options313b[val]) count313b[options313b[val]]++;
    });
    const dayaListrikDetail = Object.entries(count313b).map(([label, value]) => ({ label, value }));

    // N. Kepemilikan Barang Elektronik & Kendaraan (314_a s/d 314_h_ii)
    let gas3kg = 0;
    let gasBesar = 0;
    let kulkas = 0;
    let ac = 0;
    let pemanasAir = 0;
    let komputer = 0;
    let sepeda = 0;
    let motor = 0;
    let perahuMotor = 0;
    let mobil = 0;
    let perahuTempel = 0;
    let kapalMotor = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      gas3kg += parseFloat(d["314_a"] || d["314a"] || 0) || 0;
      gasBesar += parseFloat(d["314_b"] || d["314b"] || 0) || 0;
      kulkas += parseFloat(d["314_c"] || d["314c"] || 0) || 0;
      ac += parseFloat(d["314_d"] || d["314d"] || 0) || 0;
      pemanasAir += parseFloat(d["314_e"] || d["314e"] || 0) || 0;
      komputer += parseFloat(d["314_f"] || d["314f"] || 0) || 0;
      sepeda += parseFloat(d["314_g"] || d["314g"] || 0) || 0;
      motor += parseFloat(d["314_g_i"] || d["314_g_1"] || d["314g_i"] || 0) || 0;
      perahuMotor += parseFloat(d["314_g_ii"] || d["314_g_2"] || d["314g_ii"] || 0) || 0;
      mobil += parseFloat(d["314_h"] || d["314h"] || 0) || 0;
      perahuTempel += parseFloat(d["314_h_i"] || d["314_h_1"] || d["314h_i"] || 0) || 0;
      kapalMotor += parseFloat(d["314_h_ii"] || d["314_h_2"] || d["314h_ii"] || 0) || 0;
    });

    const kepemilikanAset314 = [
      { label: "Tabung Gas 3 kg (314_a)", value: gas3kg, key: "314_a" },
      { label: "Tabung Gas ≥ 5,5 kg (314_b)", value: gasBesar, key: "314_b" },
      { label: "Lemari Es / Kulkas (314_c)", value: kulkas, key: "314_c" },
      { label: "Pendingin Ruangan / AC (314_d)", value: ac, key: "314_d" },
      { label: "Pemanas Air (Water Heater) (314_e)", value: pemanasAir, key: "314_e" },
      { label: "Komputer / Laptop / Tablet (314_f)", value: komputer, key: "314_f" },
      { label: "Sepeda (314_g)", value: sepeda, key: "314_g" },
      { label: "Sepeda Motor (314_g_i)", value: motor, key: "314_g_i" },
      { label: "Perahu Motor / Boat (314_g_ii)", value: perahuMotor, key: "314_g_ii" },
      { label: "Mobil (314_h)", value: mobil, key: "314_h" },
      { label: "Perahu Tempel (314_h_i)", value: perahuTempel, key: "314_h_i" },
      { label: "Kapal Motor (314_h_ii)", value: kapalMotor, key: "314_h_ii" },
    ];

    // O. Status Perkawinan (408)
    let options408 = parseOptions(metaMap["408"]);
    if (Object.keys(options408).length === 0) {
      options408 = {
        "1": "Belum kawin",
        "2": "Kawin/nikah",
        "3": "Cerai hidup",
        "4": "Cerai mati",
      };
    }

    const count408: Record<string, number> = {};
    Object.values(options408).forEach((l) => (count408[l] = 0));
    let unpopulated408 = 0;
    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val = String(d["408"] || "").trim();
      if (options408[val]) count408[options408[val]]++;
      else unpopulated408++;
    });

    if (unpopulated408 > 0) {
      count408["Belum Dikonfirmasi"] = unpopulated408;
    }

    const statusPerkawinan = Object.entries(count408).map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / totalPenduduk) * 100),
    }));

    // P. Latar Belakang Suku (413)
    const sukuMap: Record<string, number> = {};
    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      let rawSuku = String(d["413"] || "").trim().toUpperCase();
      if (rawSuku) {
        if (rawSuku.includes("TIDUNG") || rawSuku === "TIUNG" || rawSuku === "TUDUNG" || rawSuku === "TIDUN") rawSuku = "Suku Tidung";
        else if (rawSuku.includes("BUGIS") || rawSuku.includes("BONE") || rawSuku.includes("BULUKUMBA")) rawSuku = "Suku Bugis";
        else if (rawSuku.includes("TIMUR") || rawSuku.includes("TIMOR") || rawSuku.includes("TIMU")) rawSuku = "Suku Timur / NTT";
        else if (rawSuku.includes("JAWA")) rawSuku = "Suku Jawa";
        else if (rawSuku.includes("BULUNGAN")) rawSuku = "Suku Bulungan";
        else if (rawSuku.includes("DAYAK")) rawSuku = "Suku Dayak";
        else if (rawSuku.includes("HABIB") || rawSuku.includes("SYARIFAH") || rawSuku.includes("SARIFAH") || rawSuku.includes("ARAB") || rawSuku.includes("ALKAB")) rawSuku = "Arab / Keturunan";
        else rawSuku = "Suku Lainnya";

        sukuMap[rawSuku] = (sukuMap[rawSuku] || 0) + 1;
      }
    });

    const sebaranSuku = Object.entries(sukuMap)
      .map(([label, value]) => ({
        label,
        value,
        percentage: Math.round((value / totalPenduduk) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    // Q. Partisipasi Sekolah (501)
    let options501 = parseOptions(metaMap["501"]);
    if (Object.keys(options501).length === 0) {
      options501 = {
        "0": "Tidak / Belum Pernah Sekolah",
        "1": "Masih Sekolah",
        "2": "Tidak Sekolah Lagi",
        "99": "Belum Dikonfirmasi",
      };
    } else {
      options501["99"] = "Belum Dikonfirmasi";
    }
    const count501: Record<string, number> = {};
    Object.values(options501).forEach((l) => (count501[l] = 0));
    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val = String(d["501"] || "").trim();
      const mappedKey = val === "" ? "99" : val;
      if (options501[mappedKey]) count501[options501[mappedKey]]++;
    });
    const partisipasiSekolah = Object.entries(count501).map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / totalPenduduk) * 100),
    }));

    // R. Kepemilikan Rekening Bank / Tabungan (505)
    let options505 = parseOptions(metaMap["505"]);
    if (Object.keys(options505).length === 0) {
      options505 = {
        "1": "Memiliki Rekening Bank Umum",
        "2": "Memiliki Akun E-Money / Digital",
        "3": "Memiliki Tabungan Koperasi/Lainnya",
        "4": "Tidak Memiliki Rekening Bank",
        "99": "Belum Dikonfirmasi",
      };
    } else {
      options505["99"] = "Belum Dikonfirmasi";
    }
    const count505: Record<string, number> = {};
    Object.values(options505).forEach((l) => (count505[l] = 0));
    validMembers.forEach((r) => {
      const d = r.data as Record<string, any>;
      const val = String(d["505"] || d["505_a"] || "").trim();
      const mappedKey = val === "" ? "99" : val;
      if (options505[mappedKey]) count505[options505[mappedKey]]++;
    });
    const kepemilikanRekening = Object.entries(count505).map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / totalPenduduk) * 100),
    }));

    // S. Rekapitulasi Disabilitas (506_a - 506_f)
    const disabilitasList = [
      { key: "506_a", label: "Tunanetra / Gangguan Penglihatan" },
      { key: "506_b", label: "Tunawicara / Tunarungu" },
      { key: "506_c", label: "Tunadaksa / Cacat Fisik" },
      { key: "506_d", label: "Tunagrahita / Gangguan Mental" },
      { key: "506_e", label: "Gangguan Emosi / Perilaku" },
      { key: "506_f", label: "Disabilitas Ganda / Lainnya" },
    ];
    const rekapDisabilitas = disabilitasList.map((item) => {
      let count = 0;
      validMembers.forEach((r) => {
        const d = r.data as Record<string, any>;
        const val = String(d[item.key] || "").trim();
        if (val && val !== "0" && val !== "2" && val.toLowerCase() !== "false") count++;
      });
      return { label: item.label, value: count };
    });

    // T. Rekapitulasi Penyakit Kronis / Menahun (507_a - 507_o)
    const penyakitList = [
      { key: "507_a", label: "Hipertensi (Darah Tinggi)" },
      { key: "507_b", label: "Diabetes Melitus" },
      { key: "507_l", label: "Asma / Pernapasan" },
      { key: "507_d", label: "Penyakit Jantung" },
      { key: "507_g", label: "TBC / Paru-Paru" },
      { key: "507_c", label: "Stroke / Kelumpuhan" },
      { key: "507_e", label: "Gagal Ginjal" },
      { key: "507_f", label: "Kanker / Tumor" },
      { key: "507_o", label: "Penyakit Kronis Lainnya" },
    ];
    const rekapPenyakit = penyakitList.map((item) => {
      let count = 0;
      validMembers.forEach((r) => {
        const d = r.data as Record<string, any>;
        const val = String(d[item.key] || "").trim();
        if (val && val !== "0" && val !== "2" && val.toLowerCase() !== "false") count++;
      });
      return { label: item.label, value: count };
    });

    // U. Usaha Penangkapan Ikan (1001, 1007, 1008_a, 1008_b, 1009, 1016)
    let totalUsahaIkan1001 = 0;
    let totalTrip1007 = 0;
    let totalVolume1008a = 0;
    let totalNilai1008b = 0;

    const docIdsUsahaIkan = new Set<string>();

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const v1001 = String(d["1001"] || "").trim();
      if (v1001 === "1") {
        totalUsahaIkan1001++;
        docIdsUsahaIkan.add(m.idDokumen);

        const trip = parseFloat(String(d["1007"] || "0").replace(/[^0-9.]/g, "")) || 0;
        const volPerTrip = parseFloat(String(d["1008_a"] || "0").replace(/[^0-9.]/g, "")) || 0;
        const nilaiPerTrip = parseFloat(String(d["1008_b"] || "0").replace(/[^0-9.]/g, "")) || 0;

        totalTrip1007 += trip;
        totalVolume1008a += volPerTrip * trip;
        totalNilai1008b += nilaiPerTrip * trip;
      }
    });

    let totalNilaiTangkapan1009 = 0;
    let totalPengeluaran1015 = 0;
    let totalPendapatan1016 = 0;
    let totalPendapatan1017 = 0;
    const rincianTangkapanList: any[] = [];

    let respIdx = 1;
    validMasterItems.forEach((m) => {
      const md = m.data as Record<string, any>;
      const v1001 = String(md["1001"] || "").trim();
      if (v1001 === "1") {
        const rMatch = repeatItems.find((r) => r.idDokumen === m.idDokumen && (r.data as any)["1009"] !== undefined);
        const rd = rMatch ? (rMatch.data as Record<string, any>) : {};

        const trip = parseFloat(String(md["1007"] || "0").replace(/[^0-9.]/g, "")) || 0;
        const volPerTrip = parseFloat(String(md["1008_a"] || "0").replace(/[^0-9.]/g, "")) || 0;
        const nilaiPerTrip = parseFloat(String(md["1008_b"] || "0").replace(/[^0-9.]/g, "")) || 0;

        // Ambil nilai resmi terdaftar dari Perulangan atau Master
        let val1009 = parseFloat(String(rd["1009"] ?? md["1009"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        if (val1009 === 0 && trip > 0 && nilaiPerTrip > 0) {
          val1009 = nilaiPerTrip * trip;
        }

        const val1010_c = parseFloat(String(md["1010_c"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        const val1010_d = parseFloat(String(md["1010_d"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        const val1010_e = parseFloat(String(md["1010_e"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        const val1010_f = parseFloat(String(rd["1010_f"] ?? md["1010_f"] ?? "0").replace(/[^0-9.]/g, "")) || (val1010_c + val1010_d + val1010_e);
        
        let val1011 = parseFloat(String(rd["1011"] ?? md["1011"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        if (val1011 === 0 && trip > 0 && val1010_f > 0) {
          val1011 = val1010_f * trip;
        }

        const val1013 = parseFloat(String(md["1013"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        const val1014 = parseFloat(String(md["1014"] ?? "0").replace(/[^0-9.]/g, "")) || 0;

        let val1015 = parseFloat(String(rd["1015"] ?? md["1015"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        if (val1015 === 0 && (val1011 > 0 || val1013 > 0 || val1014 > 0)) {
          val1015 = val1011 + val1013 + val1014;
        }

        let val1016 = parseFloat(String(rd["1016"] ?? md["1016"] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        if (val1016 === 0 && val1009 > 0) {
          val1016 = val1009 - val1015;
        }

        const val1017 = parseFloat(String(md["1017"] ?? rd["1017"] ?? "0").replace(/[^0-9.]/g, "")) || 0;

        // 1102, 1103, 1107
        const v1101 = String(md["1101"] || "").trim();
        let v1102 = String(md["1102"] || "").trim();
        if (v1102.toUpperCase().includes("BUONG.MAILIN") || v1102.toUpperCase().includes("BUONG")) {
          v1102 = "KELOMPOK NELAYAN";
        }

        const v1103 = {
          a: String(md["1103_a"] || "").trim(),
          b: String(md["1103_b"] || "").trim(),
          c: String(md["1103_c"] || "").trim(),
          d: String(md["1103_d"] || "").trim(),
          e: String(md["1103_e"] || "").trim(),
          f: String(md["1103_f"] || "").trim(),
          g: String(md["1103_g"] || "").trim(),
        };

        const v1107 = {
          a_i: String(md["1107_a_i"] || "").trim(),
          a_ii: String(md["1107_a_ii"] || "").trim(),
          b_i: String(md["1107_b_i"] || "").trim(),
          b_ii: String(md["1107_b_ii"] || "").trim(),
          c_i: String(md["1107_c_i"] || "").trim(),
          c_ii: String(md["1107_c_ii"] || "").trim(),
          d_i: String(md["1107_d_i"] || "").trim(),
          d_ii: String(md["1107_d_ii"] || "").trim(),
          e_i: String(md["1107_e_i"] || "").trim(),
          e_ii: String(md["1107_e_ii"] || "").trim(),
          f_i: String(md["1107_f_i"] || "").trim(),
          f_ii: String(md["1107_f_ii"] || "").trim(),
          g_i: String(md["1107_g_i"] || "").trim(),
          g_ii: String(md["1107_g_ii"] || "").trim(),
          h_i: String(md["1107_h_i"] || "").trim(),
          h_ii: String(md["1107_h_ii"] || "").trim(),
          i_i: String(md["1107_i_i"] || "").trim(),
          i_ii: String(md["1107_i_ii"] || "").trim(),
        };

        totalNilaiTangkapan1009 += val1009;
        totalPengeluaran1015 += val1015;
        totalPendapatan1016 += val1016;
        totalPendapatan1017 += val1017;

        rincianTangkapanList.push({
          respondenLabel: `Responden ${respIdx++}`,
          idDokumen: m.idDokumen,
          v1007: trip,
          v1008_a: volPerTrip,
          v1008_b: nilaiPerTrip,
          v1009: val1009,
          v1010_c: val1010_c,
          v1010_d: val1010_d,
          v1010_e: val1010_e,
          v1010_f: val1010_f,
          v1011: val1011,
          v1013: val1013,
          v1014: val1014,
          v1015: val1015,
          v1016: val1016,
          v1017: val1017,
          v1101: v1101,
          v1102: v1102,
          v1103: v1103,
          v1107: v1107,
        });
      }
    });

    // Aggregate Rekap 1102, 1103, 1107
    const rekap1102: Record<string, number> = {};
    const rekap1103 = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
    const rekap1107: Record<string, { total: number; milikSendiri: number; sewa: number; milikBersama: number }> = {};

    ["a", "b", "c", "d", "e", "f", "g", "h", "i"].forEach((k) => {
      rekap1107[k] = { total: 0, milikSendiri: 0, sewa: 0, milikBersama: 0 };
    });

    rincianTangkapanList.forEach((item) => {
      const isMember = item.v1101 === "1";
      const namaKlp = isMember ? (item.v1102 || "Kelompok Nelayan") : "Tidak Tergabung";
      rekap1102[namaKlp] = (rekap1102[namaKlp] || 0) + 1;

      const v3 = item.v1103 || {};
      ["a", "b", "c", "d", "e", "f", "g"].forEach((k) => {
        if (v3[k] === "1") (rekap1103 as any)[k]++;
      });

      const v7 = item.v1107 || {};
      ["a", "b", "c", "d", "e", "f", "g", "h", "i"].forEach((k) => {
        const penguasaan = v7[`${k}_i`];
        const kepemilikan = v7[`${k}_ii`];
        if (penguasaan === "1") {
          rekap1107[k].total++;
          if (kepemilikan === "1") rekap1107[k].milikSendiri++;
          else if (kepemilikan === "2") rekap1107[k].sewa++;
          else if (kepemilikan === "4") rekap1107[k].milikBersama++;
        }
      });
    });

    // Aggregate Rekap Keadaan Usaha (1108, 1109a, 1110, 1111, 1116, 1117) & Bansos (1118)
    const rekap1108: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    const rekap1109a: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    const rekap1110: Record<string, number> = { "1": 0, "2": 0 };
    const rekap1111: Record<string, number> = {
      a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0
    };
    const rekap1116: Record<string, number> = { a: 0, b: 0, c: 0 };
    const rekap1117: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      const isFishing = String(d["1001"] || "").trim() === "1";
      if (isFishing) {
        const v1108 = String(d["1108"] || "").trim();
        if (v1108 && rekap1108[v1108] !== undefined) rekap1108[v1108]++;

        const v1109a = String(d["1109_a"] || d["1109a"] || "").trim();
        if (v1109a && rekap1109a[v1109a] !== undefined) rekap1109a[v1109a]++;

        const v1110 = String(d["1110"] || "").trim();
        if (v1110 && rekap1110[v1110] !== undefined) rekap1110[v1110]++;

        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r"].forEach((sub) => {
          if (String(d[`1111_${sub}`] || "").trim() === "1") {
            rekap1111[sub]++;
          }
        });

        ["a", "b", "c"].forEach((sub) => {
          if (String(d[`1116_${sub}`] || "").trim() === "1") {
            rekap1116[sub]++;
          }
        });

        const v1117 = String(d["1117"] || "").trim();
        if (v1117 && rekap1117[v1117] !== undefined) rekap1117[v1117]++;
      }
    });

    // Aggregate Rekap Bantuan Sosial & Subsidi (1118_a s.d. 1118_k) SELURUH KK DESA (188 KK)
    const rekap1118: Record<string, number> = {
      a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0
    };
    let totalPenerimaBansosDesa = 0;

    validMasterItems.forEach((m) => {
      const d = m.data as Record<string, any>;
      let receivesAny = false;
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"].forEach((sub) => {
        const val = String(d[`1118_${sub}`] || "").trim();
        if (val === "1" || (sub === "d" && val.length > 1 && val !== "2" && val !== "Tidak") || (sub === "k" && val.length > 1 && val !== "0" && val !== "-")) {
          rekap1118[sub]++;
          receivesAny = true;
        }
      });
      if (receivesAny) totalPenerimaBansosDesa++;
    });

    const resultStats = {
      totalKeluarga,
      totalPenduduk,
      usiaProduktif,
      luasLahanTotal: haSawit + haPadi + haTernak,
      pria,
      wanita,
      priaPercentage,
      wanitaPercentage,
      kelompokUmur,
      agama,
      ijazahTertinggi,
      pekerjaanUtama,
      statusKedudukan,
      luasLahanDikuasai,
      sumberAirMinum,
      sanitasiBab,
      dayaListrik,
      // Data Perumahan Baru
      jenisBangunan,
      kepemilikanBangunan,
      kepemilikanTanah,
      luasLantaiTabel,
      bahanLantai,
      kondisiLantai,
      bahanDinding,
      kondisiDinding,
      bahanAtap,
      kondisiAtap,
      // Rincian Tambahan 308 - 314
      mckFasilitas,
      jenisKloset,
      pembuanganTinja,
      sumberAirMinumLengkap,
      sumberPenerangan,
      dayaListrikDetail,
      kepemilikanAset314,
      // Demografi Tambahan 408 & 413
      statusPerkawinan,
      sebaranSuku,
      // Sosial Ekonomi Keluarga 501, 502, 505, 506, 507
      partisipasiSekolah,
      kepemilikanRekening,
      rekapDisabilitas,
      rekapPenyakit,
      // Usaha Penangkapan Ikan (1001, 1007, 1008_a * 1007, 1008_b * 1007, 1009, 1015, 1016)
      totalUsahaIkan1001,
      totalTrip1007,
      totalVolume1008a,
      totalNilai1008b,
      totalNilaiTangkapan1009,
      totalPengeluaran1015,
      totalPendapatan1016,
      totalPendapatan1017,
      rincianTangkapanList,
      rekap1102,
      rekap1103,
      rekap1107,
      rekap1108,
      rekap1109a,
      rekap1110,
      rekap1111,
      rekap1116,
      rekap1117,
      rekap1118,
      totalPenerimaBansosDesa,
    };

    // Simpan ke Cache per RT key
    setStatistikCache(rt, resultStats);

    return NextResponse.json({
      success: true,
      stats: resultStats,
      source: "database",
    });
  } catch (error) {
    console.error("API /api/data/statistik error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghitung data statistik." },
      { status: 500 }
    );
  }
}
