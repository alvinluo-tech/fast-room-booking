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
  
  // 从请求体中获取 hash
  let hash = "";
  try {
    const body = await req.json();
    hash = body.hash || "";
  } catch (e) {
    console.log("📍 [DELETE /api/bookings/[id]] 无法解析请求体, hash 将为空");
  }
  
  const res = await cancelBooking(bookingId, hash, cookies);
  return NextResponse.json({ ok: res.ok, data: res.raw });
}
