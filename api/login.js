import { XTREAM_BASE } from "./config.js";

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { username, password } = await req.json();
  if (!username || !password)
    return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });

  const url = `${XTREAM_BASE}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  const r = await fetch(url);
  const data = await r.json();

  if (!data?.user_info || data.user_info.auth === 0)
    return new Response(JSON.stringify({ error: "Invalid line" }), { status: 401 });

  return new Response(JSON.stringify({
    user_info: {
      username: data.user_info.username,
      exp_date: data.user_info.exp_date,
      status: data.user_info.status
    }
  }), { headers: { "Content-Type": "application/json" }});
}
