import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/data/anomali-status
 * Mengambil status penyelesaian manual per variabel
 */
export async function GET() {
  try {
    const statuses = await prisma.metadata.findMany({
      where: {
        parameter: {
          startsWith: "_RESOLVED_",
        },
      },
    });

    const result: Record<string, boolean> = {};
    statuses.forEach((item) => {
      const paramName = item.parameter.replace("_RESOLVED_", "");
      result[paramName] = item.options === "true";
    });

    return NextResponse.json({ success: true, statuses: result });
  } catch (error) {
    console.error("API GET Status Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat status." }, { status: 500 });
  }
}

/**
 * POST /api/data/anomali-status
 * Menyimpan / toggle status penyelesaian variabel ke database
 */
export async function POST(request: Request) {
  try {
    const { parameter, isResolved } = await request.json();

    if (!parameter) {
      return NextResponse.json({ success: false, error: "Parameter wajib diisi." }, { status: 400 });
    }

    const key = `_RESOLVED_${parameter}`;
    const strVal = isResolved ? "true" : "false";

    await prisma.metadata.upsert({
      where: { parameter: key },
      update: { options: strVal },
      create: {
        parameter: key,
        options: strVal,
        label: `Status Penyelesaian Anomali untuk ${parameter}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Status penyelesaian ${parameter} berhasil diperbarui menjadi ${strVal}.`,
    });
  } catch (error) {
    console.error("API POST Status Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan status ke server." }, { status: 500 });
  }
}
