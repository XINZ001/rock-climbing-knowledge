// Supabase Edge Function: check-email
// 检测邮箱是否已注册，用于统一认证入口的分流逻辑
//
// 部署方式：
//   supabase functions deploy check-email
//
// 调用方式：
//   POST /functions/v1/check-email
//   Body: { "email": "user@example.com" }
//   Response: { "exists": true } 或 { "exists": false }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// 简易内存 rate limiter（每个 Edge Function 实例独立）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 每分钟每 IP
const RATE_WINDOW = 60_000; // 1 分钟

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 解析请求
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 简单邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 使用 service_role key 查询 auth.users（管理员权限）
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    // listUsers 不支持按 email 过滤，改用 SQL 查询
    const { data: users, error: queryError } = await supabaseAdmin
      .rpc("check_email_exists", { email_input: email.toLowerCase() });

    if (queryError) {
      // 如果 RPC 函数不存在，回退到 listUsers 遍历方式
      // 生产环境应先创建 RPC 函数（见下方 SQL）
      console.error("RPC not found, trying direct query:", queryError.message);

      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      const exists = authData?.users?.some(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      ) ?? false;

      return new Response(
        JSON.stringify({ exists }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ exists: !!users }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
