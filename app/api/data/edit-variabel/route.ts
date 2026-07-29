import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearStatistikCache } from "@/lib/cache";

/**
 * PUT /api/data/edit-variabel
 * Memperbarui nilai variabel tertentu di dalam JSON `data` milik DataMaster
 */
export async function PUT(request: Request) {
  try {
    const { idDokumen, idPerulangan, parameter, val } = await request.json();

    if (!parameter || (!idDokumen && !idPerulangan)) {
      return NextResponse.json(
        { success: false, error: "Parameter dan ID (idDokumen atau idPerulangan) wajib diisi." },
        { status: 400 }
      );
    }

    let parsedVal: any = val;
    if (val === "" || val === null || val === undefined) {
      parsedVal = null;
    } else {
      const num = Number(val);
      if (!isNaN(num) && String(val).trim() !== "") {
        parsedVal = num;
      }
    }

    // Jika idPerulangan diberikan, update tabel DataPerulangan
    if (idPerulangan) {
      const item = await prisma.dataPerulangan.findUnique({
        where: { id: idPerulangan },
      });

      if (!item) {
        return NextResponse.json(
          { success: false, error: "Item Data Perulangan tidak ditemukan." },
          { status: 404 }
        );
      }

      const currentData = (item.data as Record<string, any>) || {};
      if (parsedVal === null) {
        delete currentData[parameter];
      } else {
        currentData[parameter] = parsedVal;
      }

      await prisma.dataPerulangan.update({
        where: { id: idPerulangan },
        data: { data: currentData },
      });

      clearStatistikCache();

      return NextResponse.json({
        success: true,
        message: `Variabel perulangan ${parameter} berhasil diperbarui!`,
      });
    }

    // Ambil data master saat ini
    const master = await prisma.dataMaster.findUnique({
      where: { idDokumen },
    });

    if (!master) {
      return NextResponse.json(
        { success: false, error: "Dokumen Master tidak ditemukan." },
        { status: 404 }
      );
    }

    const currentData = (master.data as Record<string, any>) || {};

    if (parsedVal === null) {
      delete currentData[parameter];
    } else {
      currentData[parameter] = parsedVal;
    }

    // Update database
    await prisma.dataMaster.update({
      where: { idDokumen },
      data: {
        data: currentData,
      },
    });

    // Invalidadasikan cache statistik
    clearStatistikCache();

    return NextResponse.json({
      success: true,
      message: `Variabel ${parameter} pada dokumen ${idDokumen} berhasil diperbarui menjadi ${parsedVal}!`,
    });
  } catch (error) {
    console.error("API Edit-Variabel Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan perubahan ke database." },
      { status: 500 }
    );
  }
}
