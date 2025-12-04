import { NextRequest, NextResponse } from "next/server";
import { login, getClientInfo } from "@/lib/simplybook";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log("📍 [Login API] 登录请求:", email);
  const res = await login(email, password);
  console.log("📍 [Login API] 登录结果:", res.ok);
  console.log("📍 [Login API] Cookie 数量:", Object.keys(res.cookies).length);
  console.log("📍 [Login API] Cookie 键名:", Object.keys(res.cookies));
  
  if (!res.ok) {
    console.error("❌ [Login API] 登录失败");
    return NextResponse.json({ ok: false, error: "登录失败" }, { status: 401 });
  }
  
  // 登录成功后获取用户信息
  const clientRes = await getClientInfo(res.cookies);
  let userEmail = email;
  let userName = email;
  let userPhone = "";
  
  if (clientRes.ok && clientRes.data) {
    userEmail = clientRes.data.email || email;
    userName = clientRes.data.name || email;
    userPhone = clientRes.data.phone || "";
    console.log("✅ [Login API] 成功获取用户信息");
  }
  
  const cookieValue = encodeURIComponent(JSON.stringify(res.cookies));
  const resp = NextResponse.json({ 
    ok: true, 
    payload: res.payload,
    user: {
      email: userEmail,
      name: userName,
      phone: userPhone
    }
  });
  resp.cookies.set("sb_cookies", cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
  
  // 保存用户信息到 cookie
  resp.cookies.set("sb_user", encodeURIComponent(JSON.stringify({
    email: userEmail,
    name: userName,
    phone: userPhone
  })), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
  
  console.log("✅ [Login API] Cookie 已设置");
  return resp;
}

