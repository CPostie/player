import { XTREAM_BASE } from "./config.js";

export default async function handler(req) {
  const { username, password } = Object.fromEntries(new URL(req.url).searchParams);
  const url = `${XTREAM_BASE}/player_api.php?username=${username}&password=${password}&action=get_live_categories`;
  const r = await fetch(url);
  const data = await r.json();
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
