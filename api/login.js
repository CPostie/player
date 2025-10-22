import { XTREAM_BASE } from "./config.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const { username, password } = await req.json();

  const url = `${XTREAM_BASE}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  console.log("🔍 Fetching:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    console.log("🪵 XTREAM RESPONSE (first 300 chars):", text.slice(0, 300));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid response", raw: text.slice(0, 300) }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data?.user_info || data.user_info.auth === 0) {
      console.log("❌ Login rejected:", data);
      return new Response(
        JSON.stringify({ error: "Login failed", raw: data }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Login success:", data.user_info.username);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Fetch error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
