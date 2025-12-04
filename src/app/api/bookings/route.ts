import { NextRequest, NextResponse } from "next/server";
import { getUpcomingBookings, SimplyBookCookies } from "@/lib/simplybook";

export async function GET(req: NextRequest) {
  const cookieRaw = req.cookies.get("sb_cookies")?.value ?? "";
  if (!cookieRaw) return NextResponse.json({ ok: false, error: "未登录" }, { status: 401 });
  
  const cookies: SimplyBookCookies = JSON.parse(decodeURIComponent(cookieRaw));
  const res = await getUpcomingBookings(cookies);
  return NextResponse.json({ ok: res.ok, data: res.raw });
}

