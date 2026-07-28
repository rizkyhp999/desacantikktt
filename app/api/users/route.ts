import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/users
 * Fetches all users from the Neon PostgreSQL database via Prisma.
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user record in Neon PostgreSQL database.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email wajib diisi" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        role: role || "USER",
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
