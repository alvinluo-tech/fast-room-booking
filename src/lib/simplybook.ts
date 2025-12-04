export type SimplyBookCookies = Record<string, string>;

const BASE = "https://stjohnscollegedurham.simplybook.it";

export async function fetchCsrfAndDebug() {
  const res = await fetch(`${BASE}/v2/`, { cache: "no-store" });
  const html = await res.text();
  const csrf = /"csrf_token"\s*:\s*"([^"]+)"/.exec(html)?.[1] ?? "";
  const debug = /"debug_id"\s*:\s*"([^"]+)"/.exec(html)?.[1] ?? "";
  return { csrf, debug, setCookie: res.headers.get("set-cookie") ?? "" };
}

function parseSetCookieToCookieHeader(setCookieRaw: string): SimplyBookCookies {
  const cookies: SimplyBookCookies = {};
  const attrKeys = new Set([
    "Expires",
    "Max-Age",
    "Path",
    "Domain",
    "Secure",
    "HttpOnly",
    "SameSite",
    "Priority",
  ]);
  const pairs = setCookieRaw.match(/[^,]+?;\s*(?:Expires=[^,]+GMT)?/g) ?? [];
  for (const cookie of pairs) {
    const firstPair = /([^=;\s]+)=([^;]+)/.exec(cookie);
    if (!firstPair) continue;
    const name = firstPair[1];
    const value = firstPair[2];
    if (!attrKeys.has(name)) cookies[name] = value;
  }
  return cookies;
}

export async function login(email: string, password: string) {
  const { csrf, debug, setCookie } = await fetchCsrfAndDebug();
  console.log("📍 [SimplyBook] 获取 CSRF 和 Debug ID");
  const cookiesFromLanding = parseSetCookieToCookieHeader(setCookie);
  console.log("📍 [SimplyBook] Landing 页面 Cookie:", Object.keys(cookiesFromLanding));
  
  const headers: Record<string, string> = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    dnt: "1",
    origin: `${BASE}`,
    pragma: "no-cache",
    priority: "u=1, i",
    referer: `${BASE}/v2/`,
    "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-csrf-token": csrf,
    "x-debug": debug,
    "x-requested-with": "XMLHttpRequest",
  };

  const json = { email, password, remember: true };

  const cookieHeader = Object.entries(cookiesFromLanding)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  console.log("📍 [SimplyBook] 发送登录请求");
  const res = await fetch(`${BASE}/v2/ext/client/sign-in/`, {
    method: "POST",
    headers: { ...headers, cookie: cookieHeader },
    body: JSON.stringify(json),
  });

  const loginSetCookie = res.headers.get("set-cookie") ?? "";
  console.log("📍 [SimplyBook] 登录响应状态:", res.status);
  console.log("📍 [SimplyBook] 登录返回 Set-Cookie:", loginSetCookie ? "有" : "无");
  
  const loginCookies = parseSetCookieToCookieHeader(loginSetCookie);
  console.log("📍 [SimplyBook] 登录 Cookie:", Object.keys(loginCookies));
  
  const allCookies: SimplyBookCookies = { ...cookiesFromLanding, ...loginCookies };
  // 保存 CSRF 和 Debug token 到 cookies 中以便后续使用
  allCookies["__csrf_token"] = csrf;
  allCookies["__debug_id"] = debug;
  console.log("📍 [SimplyBook] 合并后所有 Cookie:", Object.keys(allCookies));
  
  const data = await res.json().catch(() => ({}));
  console.log("📍 [SimplyBook] 登录响应 is_logged_in:", data?.is_logged_in);
  
  return { ok: res.ok && (data?.is_logged_in ?? false), cookies: allCookies, payload: data };
}

export async function getClientInfo(cookies: SimplyBookCookies) {
  const csrfToken = cookies["__csrf_token"] ?? "";
  const debugId = cookies["__debug_id"] ?? "";
  
  const cookieHeader = Object.entries(cookies)
    .filter(([k]) => !k.startsWith("__"))
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  
  const headers: Record<string, string> = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    dnt: "1",
    pragma: "no-cache",
    priority: "u=1, i",
    referer: `${BASE}/v2/`,
    "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-csrf-token": csrfToken,
    "x-debug": debugId,
    "x-requested-with": "XMLHttpRequest",
    cookie: cookieHeader,
  };

  console.log("📍 [GetClientInfo] 获取用户信息");
  const res = await fetch(`${BASE}/v2/ext/client/`, {
    headers,
  });
  
  const text = await res.text();
  console.log("📍 [GetClientInfo] 响应状态:", res.status);
  
  let data: any = {};
  try {
    data = JSON.parse(text);
    console.log("📍 [GetClientInfo] 用户信息:", {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
    });
  } catch (e) {
    console.error("❌ [GetClientInfo] JSON 解析失败:", e);
  }
  
  return { ok: res.ok, data };
}

export type SlotQuery = {
  from: string;
  to: string;
  location?: string;
  category?: string;
  provider?: string;
  service?: string;
  count?: string;
  booking_id?: string;
};

export async function getSlots(query: Partial<SlotQuery> & Record<string, string>) {
  const url = new URL(`${BASE}/v2/booking/time-slots/`);
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.length > 0) url.searchParams.set(k, `${v}`);
  });
  
  // getSlots 不需要身份校验，使用最小化的请求头
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  return { ok: res.ok, raw: text };
}

export type BookingPayload = {
  current_booking: unknown;
  require_confirm: boolean;
  bookings: unknown[];
  cart: Record<string, unknown>;
  batch_type: unknown;
  batch_hash: unknown;
  batch_id: unknown;
  confirm: boolean;
};

export async function book(payload: BookingPayload, cookies: SimplyBookCookies) {
  // 提取 CSRF token、Debug ID 和用户信息
  const csrfToken = cookies["__csrf_token"] ?? "";
  const debugId = cookies["__debug_id"] ?? "";
  const userEmail = cookies["__user_email"] ?? "";
  const userName = cookies["__user_name"] ?? "";
  const userPhone = cookies["__user_phone"] ?? "";
  
  console.log("📍 [Book] 用户信息 - 邮箱:", userEmail, "名字:", userName);
  
  // 更新 payload 中的用户信息
  if (payload.current_booking && typeof payload.current_booking === "object") {
    const booking = payload.current_booking as Record<string, unknown>;
    booking.client_email = userEmail;
    booking.client_name = userName;
    booking.client_phone = userPhone;
  }
  
  // 构建 Cookie header（排除特殊的 __ 前缀字段）
  const cookieHeader = Object.entries(cookies)
    .filter(([k]) => !k.startsWith("__"))
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  
  const headers: Record<string, string> = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    dnt: "1",
    origin: `${BASE}`,
    pragma: "no-cache",
    priority: "u=1, i",
    referer: `${BASE}/v2/`,
    "sec-fetch-mode": "cors",
    "x-requested-with": "XMLHttpRequest",
    "x-csrf-token": csrfToken,
    "x-debug": debugId,
    cookie: cookieHeader,
  };
  
  const booking = (payload.current_booking as Record<string, unknown>) || {};
  console.log("📍 [Book] 发送预约请求");
  console.log("📍 [Book] 日期:", booking.start_date);
  console.log("📍 [Book] 时间:", booking.start_time);
  console.log("📍 [Book] Cookie 数量:", Object.keys(cookies).length - 4); // 减去 __ 开头的字段
  console.log("📍 [Book] CSRF Token:", csrfToken.substring(0, 20) + "...");
  console.log("📍 [Book] Debug ID:", debugId.substring(0, 20) + "...");
  
  const res = await fetch(`${BASE}/v2/booking/`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  
  const text = await res.text();
  console.log("📍 [Book] 响应状态:", res.status);
  console.log("📍 [Book] 响应长度:", text.length);
  console.log("📍 [Book] 响应前500字符:", text.substring(0, 500));
  
  type BookItem = { booking_id?: string; id?: string };
  type BookResponse = { bookings?: BookItem[] };
  let parsed: BookResponse = {};
  try {
    parsed = JSON.parse(text) as BookResponse;
    console.log("📍 [Book] JSON 解析成功");
  } catch (e) {
    console.error("❌ [Book] JSON 解析失败:", e);
  }
  const ids: string[] = Array.isArray(parsed.bookings)
    ? parsed.bookings.map((b) => String(b?.booking_id ?? b?.id)).filter(Boolean)
    : [];
  return { ok: res.ok, raw: text, json: parsed, ids };
}

export async function getBookingsByIds(ids: string[], cookies: SimplyBookCookies) {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  const url = new URL(`${BASE}/v2/booking/`);
  for (const id of ids) url.searchParams.append("booking_ids[]", id);
  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "x-requested-with": "XMLHttpRequest",
      cookie: cookieHeader,
    },
  });
  const text = await res.text();
  return { ok: res.ok, raw: text };
}

export async function getUpcomingBookings(cookies: SimplyBookCookies) {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  const url = new URL(`${BASE}/v2/booking/`);
  url.searchParams.set("type", "upcoming");
  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "x-requested-with": "XMLHttpRequest",
      cookie: cookieHeader,
    },
  });
  const text = await res.text();
  return { ok: res.ok, raw: text };
}

export async function cancelBooking(bookingId: string, cookies: SimplyBookCookies) {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  
  const headers: Record<string, string> = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "x-requested-with": "XMLHttpRequest",
    cookie: cookieHeader,
  };

  const res = await fetch(`${BASE}/v2/booking/${bookingId}/`, {
    method: "DELETE",
    headers,
  });

  const text = await res.text();
  return { ok: res.ok, raw: text };
}

export type BatchBookingItem = {
  date: string;
  time: string;
};

export async function batchBook(items: BatchBookingItem[], cookies: SimplyBookCookies) {
  const results: { date: string; time: string; ok: boolean; bookingId?: string; error?: string }[] = [];
  
  for (const item of items) {
    const payload: BookingPayload = {
      current_booking: {
        id: null,
        location_id: null,
        category_id: null,
        service_id: "7",
        provider_id: "7",
        start_date: item.date,
        start_time: item.time,
        end_date: null,
        end_time: null,
        code: null,
        hash: null,
        client_name: "",
        client_email: "",
        client_phone: "",
        promo_code: null,
        price_with_tax: null,
        price_without_tax: null,
        products: [],
        count: "1",
        with_deposit: false,
        is_pay_full_price_without_deposit: false,
        sheduler_channel: null,
        client_hash: "",
        client_id: "",
        addons: null,
        wl: null,
        dates: [],
        additional_fields: {
          adf4212dc42ee322a3a2e62524bebdf8: "1",
          af0fffc9ef6ed9e5be6e359151ca1835: "None",
        },
        additional_fields_values: [
          { field_title: "Number of users including yourself", field_type: "digits", field_position: "1", value: "1" },
          { field_title: "Name and surnames of the other users of the facility- if it is just you, please type None", field_type: "text", field_position: "3", value: "None" },
        ],
        terms: { simplybook_terms: "20200812", user_terms: true, privacy_policy: null, cancellation_terms: null, promotion_letters: "1" },
        start_datetime_raw: `${item.date}T${item.time.slice(0, 5)}.000Z`,
        start_datetime: `${item.date}T${item.time.slice(0, 5)}.000Z`,
        prices: { items: [], totals: null },
      },
      require_confirm: false,
      bookings: [],
      cart: {},
      batch_type: null,
      batch_hash: null,
      batch_id: null,
      confirm: true,
    };

    try {
      const res = await book(payload, cookies);
      results.push({
        date: item.date,
        time: item.time,
        ok: res.ok,
        bookingId: res.ids?.[0],
        error: res.ok ? undefined : res.raw,
      });
      // 添加小延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        date: item.date,
        time: item.time,
        ok: false,
        error: String(error),
      });
    }
  }

  const allIds = results.filter(r => r.ok && r.bookingId).map(r => r.bookingId!);
  return { results, ids: allIds };
}

