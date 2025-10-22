:root { --bg:#0b0f14; --card:#121821; --ink:#e8eef7; --muted:#9bb0c6; --accent:#4ea8ff; --chip:#1a2430; }
* { box-sizing: border-box; }
body { margin:0; font-family: Inter, system-ui, Arial, sans-serif; background:var(--bg); color:var(--ink); }
.topbar { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid #1f2a38; position:sticky; top:0; background:rgba(11,15,20,.8); backdrop-filter: blur(6px); }
.brand { font-weight:700; letter-spacing:.3px; }
.meta { font-size:14px; color:var(--muted); }
.container { max-width:1100px; margin:24px auto; padding:0 16px; }
.card { background:var(--card); border:1px solid #1f2a38; border-radius:16px; padding:18px; }
h2 { margin-top:0; }
label { font-size:14px; color:var(--muted); margin-top:8px; display:block; }
input { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #223043; background:#0e141c; color:var(--ink); outline:none; }
input:focus { border-color:var(--accent); }
button { background:var(--accent); color:#001427; border:none; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer; }
button.pill { background:#182232; color:var(--ink); border:1px solid #2a3b51; margin-right:8px; }
.hidden { display:none; }
.error { color:#ff6b6b; margin-top:8px; }

.home-actions { display:flex; gap:10px; margin-bottom:12px; }
.search-row { display:flex; gap:8px; margin:12px 0; }
.chip-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.chip-row .chip { background:var(--chip); padding:8px 12px; border-radius:999px; border:1px solid #223043; cursor:pointer; }
.chip.active { border-color:var(--accent); }

.tabs { display:flex; gap:8px; margin-bottom:12px; }
.tab-btn { background:#182232; color:var(--ink); border:1px solid #2a3b51; padding:8px 12px; border-radius:999px; cursor:pointer; }
.tab-btn.active { border-color:var(--accent); }

.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap:12px; }
.card-item { background:var(--card); border:1px solid #1f2a38; border-radius:14px; padding:10px; cursor:pointer; display:flex; flex-direction:column; gap:6px; }
.card-item .title { font-weight:600; }
.card-item .muted { color:var(--muted); font-size:13px; }

.drawer { background:var(--card); border:1px solid #1f2a38; border-radius:14px; padding:12px; margin-top:12px; }
.modal { position:fixed; inset:0; background:rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; }
.modal.hidden { display:none; }
.modal-content { background:#000; width:min(900px,95vw); border-radius:10px; position:relative; padding:8px; }
.close { position:absolute; top:6px; right:8px; background:#222; color:#fff; border:none; border-radius:8px; padding:6px 10px; cursor:pointer; }
video { width:100%; height:auto; background:#000; border-radius:8px; }
.muted { color:var(--muted); }