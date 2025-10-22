import { XTREAM_BASE } from "./config.js";

export default async function handler(req) {
  const sp = new URL(req.url).searchParams;
  const username = sp.get("username");
  const password = sp.get("password");

  const url = `${XTREAM_BASE}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`;
  const r = await fetch(url);
  const data = await r.json();
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
