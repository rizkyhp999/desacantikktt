import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearStatistikCache } from "@/lib/cache";

/**
 * DELETE /api/data/delete-all
 * Menghapus seluruh data dari tabel DataPerulangan, DataMaster, & Metadata
 */
export async function DELETE() {
  try {
    const [repeatDeleted, masterDeleted, metaDeleted] = await prisma.$transaction([
      prisma.dataPerulangan.deleteMany({}),
      prisma.dataMaster.deleteMany({}),
      prisma.metadata.deleteMany({}),
    ]);

    // Invalidadasikan cache statistik
    clearStatistikCache();

    return NextResponse.json({
      success: true,
      message: "Seluruh data berhasil dihapus!",
      summary: {
        masterDeleted: masterDeleted.count,
        repeatDeleted: repeatDeleted.count,
        metaDeleted: metaDeleted.count,
      },
    });
  } catch (error) {
    console.error("API Delete-All error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus seluruh data dari database" },
      { status: 500 }
    );
  }
}
