import { XTREAM_BASE } from "./config.js";

// ✅ Ignore SSL validation (since the panel certificate may not be fully trusted)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const { username, password } = await req.json();
  if (!username || !password)
    return new Response(
      JSON.stringify({ error: "Missing credentials" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );

  const url = `${XTREAM_BASE}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid response from server", raw: text }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data?.user_info || data.user_info.auth === 0) {
      return new Response(
        JSON.stringify({ error: "Login failed. Check your credentials." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
