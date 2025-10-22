import { XTREAM_BASE } from "./config.js";

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const { username, password } = await req.json();
  const url = `${XTREAM_BASE}/player_api.php?username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    console.log("DEBUG XTREAM RESPONSE (first 400 chars):", text.slice(0, 400));

    return new Response(
      JSON.stringify({
        debug: text.slice(0, 400),
        status: res.status,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
