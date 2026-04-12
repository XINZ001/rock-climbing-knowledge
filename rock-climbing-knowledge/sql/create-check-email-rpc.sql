-- RPC 函数：前端直接调用，检测邮箱是否已注册
-- 执行方式：在 Supabase Dashboard → SQL Editor 中运行

CREATE OR REPLACE FUNCTION check_email_exists(email_input text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = lower(email_input)
  );
$$;

-- 允许匿名用户调用（前端直接调 supabase.rpc()）
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;
