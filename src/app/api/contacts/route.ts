
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const gasUrl = process.env.CONTACTS_GAS_URL;

    if (!gasUrl) {
      return NextResponse.json(
        { success: false, message: "CONTACTS_GAS_URL belum diatur." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "follow",
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Respons Google Apps Script tidak valid.");
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghubungi server kontak.",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";


export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Contact API is running!",
    endpoint: "/api/contacts",
    methods: ["GET", "POST"],
  });
}
