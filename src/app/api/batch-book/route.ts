import { NextRequest, NextResponse } from "next/server";
import { batchBook, SimplyBookCookies, BatchBookingItem } from "@/lib/simplybook";

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json() as { items: BatchBookingItem[] };
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "无效的预约列表" }, { status: 400 });
    }

    const cookieRaw = req.cookies.get("sb_cookies")?.value;
    const userRaw = req.cookies.get("sb_user")?.value;
    console.log("📍 [Batch Book] Cookie 存在:", !!cookieRaw);
    console.log("📍 [Batch Book] User 信息存在:", !!userRaw);
    console.log("📍 [Batch Book] Cookie 值长度:", cookieRaw?.length ?? 0);
    
    if (!cookieRaw) {
      console.error("❌ [Batch Book] 未找到登录 Cookie");
      return NextResponse.json({ ok: false, error: "未登录，请先登录" }, { status: 401 });
    }

    let cookies: SimplyBookCookies;
    try {
      cookies = JSON.parse(decodeURIComponent(cookieRaw));
      console.log("✅ [Batch Book] Cookie 解析成功，包含字段:", Object.keys(cookies));
    } catch (e) {
      console.error("❌ [Batch Book] Cookie 解析失败:", e);
      return NextResponse.json({ ok: false, error: "登录信息已过期，请重新登录" }, { status: 401 });
    }

    // 添加用户信息到 cookies
    if (userRaw) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(userRaw));
        cookies["__user_email"] = userInfo.email || "";
        cookies["__user_name"] = userInfo.name || "";
        cookies["__user_phone"] = userInfo.phone || "";
        console.log("✅ [Batch Book] 用户信息已添加:", userInfo.email);
      } catch (e) {
        console.error("❌ [Batch Book] 用户信息解析失败:", e);
      }
    }

    const res = await batchBook(items, cookies);
    console.log("📍 [Batch Book] 批量预约完成，成功:", res.results.filter(r => r.ok).length, "失败:", res.results.filter(r => !r.ok).length);

    // 保存预约ID到cookie
    if (res.ids && res.ids.length > 0) {
      const existingRaw = req.cookies.get("sb_booking_ids")?.value ?? encodeURIComponent("[]");
      let existing: string[] = [];
      try {
        existing = JSON.parse(decodeURIComponent(existingRaw));
      } catch {}
      const merged = Array.from(new Set([...(existing ?? []), ...res.ids]));
      
      const resp = NextResponse.json({ ok: true, results: res.results });
      resp.cookies.set("sb_booking_ids", encodeURIComponent(JSON.stringify(merged)), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return resp;
    }

    return NextResponse.json({ ok: true, results: res.results });
  } catch (error) {
    console.error("❌ [Batch Book] 异常错误:", error);
    return NextResponse.json({ ok: false, error: `${error}` }, { status: 500 });
  }
}
