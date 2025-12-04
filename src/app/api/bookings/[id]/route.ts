import { NextRequest, NextResponse } from "next/server";
import { cancelBooking, SimplyBookCookies } from "@/lib/simplybook";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieRaw = req.cookies.get("sb_cookies")?.value ?? "";
  if (!cookieRaw) {
    return NextResponse.json({ ok: false, error: "未登录" }, { status: 401 });
  }

  const cookies: SimplyBookCookies = JSON.parse(decodeURIComponent(cookieRaw));
  const bookingId = id;
  
  const res = await cancelBooking(bookingId, cookies);
  return NextResponse.json({ ok: res.ok, data: res.raw });
}
