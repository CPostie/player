import { XTREAM_BASE } from "./config.js";

export default async function handler(req) {
  const sp = new URL(req.url).searchParams;
  const type = sp.get("type");
  const u = sp.get("u");
  const p = sp.get("p");
  const id = sp.get("id");

  let path;
  if (type === "live") path = `/live/${u}/${p}/${id}.m3u8`;
  else if (type === "vod") path = `/movie/${u}/${p}/${id}.mp4`;
  else if (type === "series") path = `/series/${u}/${p}/${id}.mp4`;
  else return new Response("Bad type", { status: 400 });

  const upstream = `${XTREAM_BASE}${path}`;
  const r = await fetch(upstream);
  if (!r.ok) return new Response("Stream error", { status: 502 });

  const headers = new Headers(r.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(r.body, { headers });
}
