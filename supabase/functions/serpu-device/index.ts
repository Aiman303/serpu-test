// Serpuru · «аккаунт устройства» для приложения Серпу.
// Приложение при первом запуске получает отдельный аккаунт без почты и пароля от пользователя:
// функция создаёт подтверждённого пользователя через admin API и возвращает данные для входа.
// Позже аккаунт можно привязать к почте. verify_jwt = false, доступ только с publishable key.
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });

function keysFrom(name: string): string[] {
  try {
    return Object.values(JSON.parse(Deno.env.get(name) ?? "{}")).filter((v) => typeof v === "string") as string[];
  } catch {
    return [];
  }
}
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SECRET = keysFrom("SUPABASE_SECRET_KEYS")[0] ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLISHABLE = [...keysFrom("SUPABASE_PUBLISHABLE_KEYS"), Deno.env.get("SUPABASE_ANON_KEY") ?? ""].filter(Boolean);
const admin = createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false, autoRefreshToken: false } });

const randomToken = (bytes: number) =>
  [...crypto.getRandomValues(new Uint8Array(bytes))].map((x) => x.toString(16).padStart(2, "0")).join("");

async function sha256(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return reply({ ok: false, error: "method" }, 405);
  const apikey = req.headers.get("apikey") ?? "";
  if (PUBLISHABLE.length && !PUBLISHABLE.includes(apikey)) return reply({ ok: false, error: "forbidden" }, 401);

  // не больше 20 новых аккаунтов в сутки с одного адреса
  const ip = (req.headers.get("x-forwarded-for") ?? req.headers.get("cf-connecting-ip") ?? "0").split(",")[0].trim();
  const subject = `ip:${(await sha256(`${ip}|${new Date().toISOString().slice(0, 10)}|device`)).slice(0, 24)}`;
  const { data: allowed } = await admin.rpc("ai_take", { p_subject: subject, p_kind: "device", p_limit: 20 });
  if (allowed === false) return reply({ ok: false, error: "limit" }, 429);

  const email = `d${randomToken(8)}@device.serpuru.kg`;
  const password = randomToken(24);
  const { error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { device: true } });
  if (error) {
    console.error("serpu-device", error.message);
    return reply({ ok: false, error: "create_failed" }, 500);
  }
  return reply({ ok: true, email, password });
});
