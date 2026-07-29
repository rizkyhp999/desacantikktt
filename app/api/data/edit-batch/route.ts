import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearStatistikCache } from "@/lib/cache";

interface BatchEditItem {
  idDokumen?: string;
  docId?: string;
  parameter: string;
  val: any;
}

/**
 * PUT /api/data/edit-batch
 * Memperbarui banyak variabel sekaligus dalam satu transaksi database
 */
export async function PUT(request: Request) {
  try {
    const { edits } = (await request.json()) as { edits: BatchEditItem[] };

    if (!edits || !Array.isArray(edits) || edits.length === 0) {
      return NextResponse.json(
        { success: false, error: "Daftar perubahan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Kelompokkan editan berdasarkan idDokumen atau docId
    const groupedByDoc: Record<string, Record<string, any>> = {};

    edits.forEach((item) => {
      const idDok = item.idDokumen || item.docId;
      if (!idDok) return;

      if (!groupedByDoc[idDok]) {
        groupedByDoc[idDok] = {};
      }
      
      let parsedVal: any = item.val;
      if (item.val === "" || item.val === null || item.val === undefined) {
        parsedVal = null;
      } else {
        const num = Number(item.val);
        if (!isNaN(num) && String(item.val).trim() !== "") {
          parsedVal = num;
        }
      }
      
      groupedByDoc[idDok][item.parameter] = parsedVal;
    });

    // Jalankan update untuk setiap dokumen master yang diubah
    for (const [idDok, paramUpdates] of Object.entries(groupedByDoc)) {
      const master = await prisma.dataMaster.findUnique({
        where: { idDokumen: idDok },
      });

      if (master) {
        const currentData = (master.data as Record<string, any>) || {};
        
        Object.entries(paramUpdates).forEach(([paramKey, paramVal]) => {
          if (paramVal === null) {
            delete currentData[paramKey];
          } else {
            currentData[paramKey] = paramVal;
          }
        });

        await prisma.dataMaster.update({
          where: { idDokumen: idDok },
          data: {
            data: currentData,
          },
        });
      }
    }

    // Invalidadasikan cache statistik
    clearStatistikCache();

    return NextResponse.json({
      success: true,
      message: `Berhasil menyimpan batch ${edits.length} perubahan ke database!`,
    });
  } catch (error) {
    console.error("API Batch Edit Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan batch perubahan ke database." },
      { status: 500 }
    );
  }
}
