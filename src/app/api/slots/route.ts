import { NextRequest, NextResponse } from "next/server";
import { getSlots } from "@/lib/simplybook";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query: Record<string, string> = {};
    searchParams.forEach((v, k) => (query[k] = v));
    
    // 验证必需参数
    if (!query.from || !query.to) {
      return NextResponse.json({ 
        ok: false, 
        error: "缺少必需参数: from 和 to" 
      }, { status: 400 });
    }
    
    console.log("📍 [Slots API] 请求参数:", query);
    
    try {
      const res = await getSlots(query);
      console.log("📍 [Slots API] 响应状态:", res.ok);
      console.log("📍 [Slots API] 响应长度:", res.raw.length);
      console.log("📍 [Slots API] 响应前200字符:", res.raw.substring(0, 200));
      
      if (!res.ok) {
        console.error("❌ [Slots API] 失败状态码");
        return NextResponse.json({ 
          ok: false, 
          error: "获取时间槽失败",
        }, { status: 500 });
      }
      
      // 尝试解析 JSON 响应
      let parsedData: unknown;
      let responseData: unknown;
      try {
        parsedData = JSON.parse(res.raw);
        console.log("✅ [Slots API] JSON 解析成功");
        console.log("✅ [Slots API] 数据类型:", typeof parsedData, "是否数组:", Array.isArray(parsedData));
        
        // 新API格式：直接返回数组，需要转换为 { items: [...] } 格式
        responseData = parsedData;
        if (Array.isArray(parsedData)) {
          responseData = { items: parsedData };
          console.log("✅ [Slots API] 转换数组为 items 格式");
        }
      } catch (e) {
        console.error("❌ [Slots API] JSON 解析失败:", e);
        return NextResponse.json({ 
          ok: false, 
          error: "响应格式错误"
        }, { status: 500 });
      }
      
      return NextResponse.json({ ok: true, data: responseData });
    } catch (fetchError) {
      console.error("❌ [Slots API] 获取时段出错:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ [Slots API] 异常错误:", error);
    return NextResponse.json({ 
      ok: false, 
      error: `${error}` 
    }, { status: 500 });
  }
}
