let creds = { username: "", password: "" };
let state = {
  liveCats: [],
  liveList: [],
  vodCats: [],
  vodList: [],
  seriesCats: [],
  seriesList: [],
  active: { tab: "live", liveCat: null, vodCat: null, seriesCat: null },
};

const el = (id) => document.getElementById(id);
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => [...document.querySelectorAll(sel)];

function unixToDate(u) {
  if (!u || u === "Unlimited") return "Unlimited";
  const d = new Date(parseInt(u, 10) * 1000);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

function show(id) {
  el(id).classList.remove("hidden");
}
function hide(id) {
  el(id).classList.add("hidden");
}
function setActiveTab(tab) {
  state.active.tab = tab;
  qsa(".tab-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  qsa(".tab").forEach((p) => {
    p.style.display = p.id === `tab-${tab}` ? "block" : "none";
  });
}

async function postJSON(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function getJSON(url, params) {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${url}?${qs}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

/* ---------- LOGIN ---------- */
el("loginBtn").addEventListener("click", async () => {
  el("loginError").textContent = "";
  creds.username = el("username").value.trim();
  creds.password = el("password").value.trim();
  if (!creds.username || !creds.password) {
    el("loginError").textContent = "Please enter username and password.";
    return;
  }
  try {
    const info = await postJSON("/api/login", creds);
    const exp = unixToDate(info?.user_info?.exp_date);
    el("lineMeta").textContent = `User: ${info?.user_info?.username} • Expires: ${exp}`;
    hide("loginCard");
    show("home");
    show("tabs");
    setActiveTab("live");
    await loadAllCategories();
  } catch (e) {
    el("loginError").textContent = "Login failed. Check your credentials.";
  }
});

async function loadAllCategories() {
  [state.liveCats, state.vodCats, state.seriesCats] = await Promise.all([
    getJSON("/api/live-categories", creds),
    getJSON("/api/vod-categories", creds),
    getJSON("/api/series-categories", creds),
  ]);
  renderChips("liveCats", state.liveCats, "live");
  renderChips("vodCats", state.vodCats, "vod");
  renderChips("seriesCats", state.seriesCats, "series");
}

/* ---------- TAB SWITCHING ---------- */
qsa(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
});
qsa(".pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveTab(btn.dataset.tab);
    window.scrollTo({ top: el("tabs").offsetTop - 10, behavior: "smooth" });
  });
});

/* ---------- RENDERING ---------- */
function renderChips(containerId, cats, type) {
  const box = el(containerId);
  box.innerHTML = "";
  cats.forEach((c) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = c.category_name || "Category";
    chip.addEventListener("click", () => {
      qsa("#" + containerId + " .chip").forEach((ch) =>
        ch.classList.remove("active")
      );
      chip.classList.add("active");
      if (type === "live") loadLiveByCat(c.category_id);
      if (type === "vod") loadVodByCat(c.category_id);
      if (type === "series") loadSeriesByCat(c.category_id);
    });
    box.appendChild(chip);
  });
}

function renderList(containerId, list, onClick) {
  const box = el(containerId);
  const search =
    containerId === "liveList"
      ? el("liveSearch").value.trim().toLowerCase()
      : containerId === "vodList"
      ? el("vodSearch").value.trim().toLowerCase()
      : el("seriesSearch").value.trim().toLowerCase();
  const filtered = search
    ? list.filter((x) =>
        (x.name || x.title || "").toLowerCase().includes(search)
      )
    : list;
  box.innerHTML = filtered
    .map(
      (item) => `
    <div class="card-item" data-id="${item.stream_id || item.series_id || item.id}">
      <div class="title">${item.name || item.title}</div>
      ${
        item.stream_icon
          ? `<img src="${item.stream_icon}" style="width:100%;border-radius:8px;">`
          : ""
      }
    </div>`
    )
    .join("");
  qsa(`#${containerId} .card-item`).forEach((div) =>
    div.addEventListener("click", () => onClick(div.dataset.id))
  );
}

/* ---------- LIVE ---------- */
async function loadLiveByCat(catId) {
  state.active.liveCat = catId;
  state.liveList = await getJSON("/api/live-streams", {
    ...creds,
    category_id: catId,
  });
  renderList("liveList", state.liveList, (id) => playStream("live", id));
}
el("liveSearch").addEventListener("input", () =>
  renderList("liveList", state.liveList, (id) => playStream("live", id))
);

/* ---------- VOD ---------- */
async function loadVodByCat(catId) {
  state.active.vodCat = catId;
  state.vodList = await getJSON("/api/vod-streams", {
    ...creds,
    category_id: catId,
  });
  renderList("vodList", state.vodList, (id) => playStream("vod", id));
}
el("vodSearch").addEventListener("input", () =>
  renderList("vodList", state.vodList, (id) => playStream("vod", id))
);

/* ---------- SERIES ---------- */
async function loadSeriesByCat(catId) {
  state.active.seriesCat = catId;
  state.seriesList = await getJSON("/api/series-list", {
    ...creds,
    category_id: catId,
  });
  renderList("seriesList", state.seriesList, (id) => showSeriesInfo(id));
}
el("seriesSearch").addEventListener("input", () =>
  renderList("seriesList", state.seriesList, (id) => showSeriesInfo(id))
);

async function showSeriesInfo(seriesId) {
  const info = await getJSON("/api/series-info", { ...creds, series_id: seriesId });
  const eps = info?.episodes ? Object.values(info.episodes).flat() : [];
  const box = el("seriesInfo");
  box.classList.remove("hidden");
  box.innerHTML = `
    <h3>${info?.info?.name || "Series"}</h3>
    <p class="muted">${info?.info?.plot || ""}</p>
    <div style="margin-top:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
      ${eps
        .map(
          (ep) => `
          <div class="card-item" data-ep="${ep.id}">
            <div class="title">S${ep.season}E${ep.episode_num}: ${ep.title}</div>
          </div>`
        )
        .join("")}
    </div>
  `;
  qsa("#seriesInfo [data-ep]").forEach((div) =>
    div.addEventListener("click", () => playStream("series", div.dataset.ep))
  );
}

/* ---------- PLAYER ---------- */
const modal = el("playerModal");
const video = el("video");
el("closePlayer").addEventListener("click", closePlayer);

function openPlayer(src, hls = false) {
  modal.classList.remove("hidden");
  if (hls && window.Hls && Hls.isSupported()) {
    const h = new Hls();
    h.loadSource(src);
    h.attachMedia(video);
  } else {
    video.src = src;
  }
  video.play().catch(() => {});
}
function closePlayer() {
  video.pause();
  video.removeAttribute("src");
  video.load();
  modal.classList.add("hidden");
}

function playStream(type, id) {
  const src = `/api/stream?type=${type}&u=${encodeURIComponent(
    creds.username
  )}&p=${encodeURIComponent(creds.password)}&id=${encodeURIComponent(id)}`;
  openPlayer(src, type === "live");
}

/* ---------- MASTER SEARCH ---------- */
el("masterSearchBtn").addEventListener("click", masterSearch);
el("masterSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") masterSearch();
});

function masterSearch() {
  const q = el("masterSearch").value.trim().toLowerCase();
  const all = [...state.liveList, ...state.vodList, ...state.seriesList];
  const hits = q
    ? all.filter((x) => (x.name || x.title || "").toLowerCase().includes(q))
    : [];
  const box = el("masterResults");
  if (!hits.length) {
    box.innerHTML = `<div class="muted">No results yet.</div>`;
    return;
  }
  box.innerHTML = hits
    .slice(0, 100)
    .map(
      (item) => `
    <div class="card-item" data-any="${
      item.stream_id || item.series_id || item.id
    }">
      <div class="title">${item.name || item.title}</div>
    </div>`
    )
    .join("");
}
