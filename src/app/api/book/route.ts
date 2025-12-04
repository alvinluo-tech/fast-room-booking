import { NextRequest, NextResponse } from "next/server";
import { book, SimplyBookCookies } from "@/lib/simplybook";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("📍 [Book API] 收到预约请求");
    
    const cookieRaw = req.cookies.get("sb_cookies")?.value;
    const userRaw = req.cookies.get("sb_user")?.value;
    
    console.log("📍 [Book API] Cookie 存在:", !!cookieRaw);
    console.log("📍 [Book API] User 信息存在:", !!userRaw);
    
    if (!cookieRaw) {
      console.error("❌ [Book API] 未找到登录 Cookie");
      return NextResponse.json({ ok: false, error: "未登录，请先登录" }, { status: 401 });
    }

    let cookies: SimplyBookCookies;
    try {
      cookies = JSON.parse(decodeURIComponent(cookieRaw));
      console.log("✅ [Book API] Cookie 解析成功，包含:", Object.keys(cookies));
    } catch (e) {
      console.error("❌ [Book API] Cookie 解析失败:", e);
      return NextResponse.json({ ok: false, error: "登录信息已过期，请重新登录" }, { status: 401 });
    }

    // 添加用户信息到 cookies
    if (userRaw) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(userRaw));
        cookies["__user_email"] = userInfo.email || "";
        cookies["__user_name"] = userInfo.name || "";
        cookies["__user_phone"] = userInfo.phone || "";
        console.log("✅ [Book API] 用户信息已添加:", userInfo.email);
      } catch (e) {
        console.error("❌ [Book API] 用户信息解析失败:", e);
      }
    }

    const res = await book(payload, cookies);
    console.log("📍 [Book API] 预约结果:", res.ok);
    console.log("📍 [Book API] 预约ID数量:", res.ids.length);
    
    const resp = NextResponse.json({ 
      ok: res.ok, 
      data: res.raw,
      error: res.ok ? undefined : "预约失败"
    }, { status: res.ok ? 200 : 400 });
    
    if (res.ids && res.ids.length) {
      const existingRaw = req.cookies.get("sb_booking_ids")?.value ?? encodeURIComponent("[]");
      let existing: string[] = [];
      try { existing = JSON.parse(decodeURIComponent(existingRaw)); } catch {}
      const merged = Array.from(new Set([...(existing ?? []), ...res.ids]));
      resp.cookies.set("sb_booking_ids", encodeURIComponent(JSON.stringify(merged)), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return resp;
  } catch (error) {
    console.error("❌ [Book API] 异常错误:", error);
    return NextResponse.json({ ok: false, error: `${error}` }, { status: 500 });
  }
}
