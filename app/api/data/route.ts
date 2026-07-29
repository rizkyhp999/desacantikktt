import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isExcludedVariable(key: string): boolean {
  const match = key.match(/^(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    // Block 7: 700-799
    if (num >= 700 && num <= 799) return true;
    // Block 8: 800-899
    if (num >= 800 && num <= 899) return true;
    // Block 9: 900-999
    if (num >= 900 && num <= 999) return true;
    // Block 12: 1200-1299
    if (num >= 1200 && num <= 1299) return true;
    // Block 13: 1300-1399
    if (num >= 1300 && num <= 1399) return true;
  }
  return false;
}

/**
 * GET /api/data
 * Mengambil daftar data master beserta data perulangan dan metadata
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Filter pencarian berdasarkan Nama_KRT, ID_Dokumen, atau SLS
    const whereCondition = search
      ? {
          OR: [
            { namaKRT: { contains: search, mode: "insensitive" as const } },
            { idDokumen: { contains: search, mode: "insensitive" as const } },
            { sls: { contains: search, mode: "insensitive" as const } },
            { desa: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, masterItems, metadataItems] = await Promise.all([
      prisma.dataMaster.count({ where: whereCondition }),
      prisma.dataMaster.findMany({
        where: whereCondition,
        include: {
          perulangan: {
            orderBy: { isianKe: "asc" },
          },
        },
        orderBy: { no: "asc" },
        skip,
        take: limit,
      }),
      prisma.metadata.findMany(),
    ]);

    // Format metadata ke bentuk map dictionary untuk kemudahan lookup UI
    const metadataMap: Record<string, { label: string; options?: string | null }> = {};
    metadataItems.forEach((m) => {
      if (isExcludedVariable(m.parameter)) return;
      metadataMap[m.parameter] = {
        label: m.label,
        options: m.options,
      };
    });

    // Bersihkan data master & perulangan dari variabel yang disembunyikan
    const cleanedMasterItems = masterItems.map((item) => {
      const currentData = (item.data as Record<string, any>) || {};
      const cleanedData: Record<string, any> = {};
      Object.entries(currentData).forEach(([k, v]) => {
        if (!isExcludedVariable(k)) {
          cleanedData[k] = v;
        }
      });

      const cleanedPerulangan = item.perulangan.map((p) => {
        const pData = (p.data as Record<string, any>) || {};
        const cleanedPData: Record<string, any> = {};
        Object.entries(pData).forEach(([k, v]) => {
          if (!isExcludedVariable(k)) {
            cleanedPData[k] = v;
          }
        });
        return {
          ...p,
          data: cleanedPData,
        };
      });

      return {
        ...item,
        data: cleanedData,
        perulangan: cleanedPerulangan,
      };
    });

    return NextResponse.json({
      success: true,
      data: cleanedMasterItems,
      metadataMap,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API /api/data error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dari database" },
      { status: 500 }
    );
  }
}
