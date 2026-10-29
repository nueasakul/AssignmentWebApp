/* ===== CONFIG: ต่อ API Server (Assignment #1) — ไม่มีข้อมูลสำรองในโค้ด ถ้าเชื่อมต่อไม่ได้จะแจ้งข้อผิดพลาด ===== */
const API_BASE = 'https://assignmentwebapp.onrender.com';
const DRONE_ID = "67010999";
const $ = id => document.getElementById(id);

async function call(path, opt) {
  let r;
  try { r = await fetch(`${API_BASE}${path}`, opt) }
  catch (e) { throw new Error("เชื่อมต่อ Server ไม่ได้ — ตรวจสอบว่า API Server เปิดอยู่") }
  if (!r.ok) {
    let m = ""; try { m = (await r.json()).error || "" } catch (_) { }
    throw new Error(r.status === 404 ? "ไม่พบข้อมูลโดรนนี้บน Server" : `Server ตอบกลับผิดพลาด (${r.status})${m ? ": " + m : ""}`)
  }
  return r;
}
const api = {
  async getConfig() { return (await call(`/configs/${DRONE_ID}`)).json() },
  async getLogs(p = 1) {
    const r = await call(`/logs/${DRONE_ID}?page=${p}`), d = await r.json();
    const tp = parseInt(r.headers.get("X-Total-Pages")), ti = parseInt(r.headers.get("X-Total-Items"));
    return { items: Array.isArray(d) ? d : [], totalPages: isNaN(tp) ? null : tp, totalItems: isNaN(ti) ? null : ti }
  },
  async postLog(b) { await call("/logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }) }
};

/* ===== SPRITES ===== */
const face = '<circle cx="38" cy="48" r="10" fill="#fff" stroke="#3a2210" stroke-width="3"/><circle cx="62" cy="48" r="10" fill="#fff" stroke="#3a2210" stroke-width="3"/><circle cx="41" cy="50" r="4" fill="#3a2210"/><circle cx="59" cy="50" r="4" fill="#3a2210"/><path d="M26 34l22 10M74 34L52 44" stroke="#3a2210" stroke-width="6" stroke-linecap="round"/><path d="M44 56l6 4l6-4l-6 12z" fill="#ff9a1f" stroke="#3a2210" stroke-width="3" stroke-linejoin="round"/>';
const body = {
  red: '<path d="M40 14q8 10 12 14q6-12 18-12q-8 8-8 16z" fill="#a3201c" stroke="#3a2210" stroke-width="4"/><circle cx="50" cy="55" r="38" fill="#e5322d" stroke="#3a2210" stroke-width="5"/><path d="M26 66q24 26 48 0q-6 22-24 24q-18-2-24-24z" fill="#fff3d6"/>',
  yellow: '<path d="M50 6L94 86Q50 100 6 86Z" fill="#ffd12e" stroke="#3a2210" stroke-width="5" stroke-linejoin="round"/>',
  black: '<circle cx="50" cy="56" r="36" fill="#333" stroke="#111" stroke-width="5"/><path d="M62 22q8-14 18-10" stroke="#a86a2c" stroke-width="5" fill="none"/>',
  blue: '<circle cx="50" cy="55" r="34" fill="#3aa7ff" stroke="#3a2210" stroke-width="5"/>'
};
const K = 'stroke="#2a170a" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
const eye = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${K}/><circle cx="${x + 1.5}" cy="${y + 1.5}" r="${r / 2.2}" fill="#2a170a"/><circle cx="${x + r / 3}" cy="${y}" r="${r / 6}" fill="#fff"/>`;
const brow = (d, c = '#2a170a', w = 7) => `<path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
const beak = (x, y, w = 9) => `<path d="M${x - w} ${y}q${w} -${w * .7} ${w * 2} 0l-${w} ${w * 1.5}z" fill="#ffa51f" ${K}/>`;
const feath = (x, y) => `<path d="M${x} ${y}q-6-14 4-18M${x + 6} ${y}q0-14 10-16M${x + 12} ${y}q8-10 18-6" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const SP = {
  red: `<path d="M12 50l-10-4M12 58l-10 2" stroke="#222" stroke-width="5" stroke-linecap="round"/><path d="M36 22q4-16 24-12q-10 4-8 14z" fill="#a51a24" ${K}/><ellipse cx="52" cy="56" rx="40" ry="36" fill="#d9232d" ${K}/><path d="M22 72q30 26 60 0q-6 18-30 20q-24-2-30-20z" fill="#f3d3a8"/>${eye(42, 50, 8)}${eye(62, 50, 8)}${brow('M28 38L50 47M78 38L54 47')}${beak(53, 60, 10)}`,
  big: `<path d="M10 52l-8-4M10 60l-8 2" stroke="#222" stroke-width="5" stroke-linecap="round"/><path d="M32 18q6-16 28-10q-12 2-10 14z" fill="#7d0c20" ${K}/><ellipse cx="50" cy="56" rx="44" ry="40" fill="#b3122f" ${K}/><path d="M16 74q34 28 68 0q-6 20-34 22q-28-2-34-22z" fill="#e8c9a4"/>${brow('M20 42H80', '#2a170a', 12)}<circle cx="40" cy="54" r="4" fill="#fff"/><circle cx="62" cy="54" r="4" fill="#fff"/>${beak(52, 62, 12)}`,
  yellow: `<path d="M50 18L95 90Q50 100 5 90Z" fill="#ffd21f" ${K}/>${feath(42, 22)}${eye(41, 64, 7)}${eye(60, 64, 7)}${brow('M28 54L46 60M72 50L56 60', '#8a2a12')}${beak(56, 76, 8)}`,
  black: `<circle cx="50" cy="58" r="36" fill="#2b2b33" ${K}/><ellipse cx="38" cy="42" rx="10" ry="6" fill="#fff" opacity=".18"/><path d="M50 22q-6-14 2-18" stroke="#2a170a" stroke-width="5" fill="none"/><circle cx="53" cy="6" r="4" fill="#ff8a1f"/>${eye(40, 54, 8)}${eye(62, 54, 8)}${brow('M28 42L48 52M76 42L56 52', '#ff7a1a')}${beak(51, 64, 9)}`,
  blue: `${feath(44, 28)}<circle cx="50" cy="58" r="32" fill="#6bbbe6" ${K}/><path d="M22 66q28 22 56 0q-8 14-28 14t-28-14z" fill="#dff3ff"/>${eye(40, 54, 7)}${eye(60, 54, 7)}${brow('M30 44L46 50M70 44L54 50')}${beak(51, 62, 9)}`,
  white: `${feath(44, 22)}<ellipse cx="50" cy="58" rx="34" ry="38" fill="#fff" ${K}/>${eye(42, 46, 7)}${eye(60, 46, 7)}${brow('M32 36L48 42M72 36L54 42')}<path d="M34 62q16-14 36 0q-4 20-18 22q-14-2-18-22z" fill="#ffa51f" ${K}/><path d="M44 68q8 6 16 0" stroke="#2a170a" stroke-width="3" fill="none"/>`,
  pink: `<ellipse cx="38" cy="16" rx="8" ry="16" fill="#f7a8c4" ${K}/><ellipse cx="62" cy="16" rx="8" ry="16" fill="#f7a8c4" ${K}/><circle cx="50" cy="58" r="36" fill="#f7a8c4" ${K}/><circle cx="39" cy="54" r="10" fill="#fff" ${K}/><circle cx="61" cy="54" r="10" fill="#fff" ${K}/><circle cx="41" cy="55" r="6" fill="#27b4d6"/><circle cx="59" cy="55" r="6" fill="#27b4d6"/><circle cx="41" cy="55" r="3" fill="#2a170a"/><circle cx="59" cy="55" r="3" fill="#2a170a"/>${brow('M28 40q10-8 20-2M52 38q10-6 20 2', '#2a170a', 4)}${beak(50, 68, 6)}`
};
const SHP = { yellow: '<path d="M50 18L95 90Q50 100 5 90Z"', white: '<ellipse cx="50" cy="58" rx="34" ry="38"', blue: '<circle cx="50" cy="58" r="32"', big: '<ellipse cx="50" cy="56" rx="44" ry="40"', red: '<ellipse cx="52" cy="56" rx="40" ry="36"' };
const bird = t => `<svg viewBox="0 0 100 100">${SP[t]}${SHP[t] || '<circle cx="50" cy="58" r="36"'} fill="url(#sh)"/><ellipse cx="42" cy="40" rx="12" ry="6" fill="#fff" opacity=".32" transform="rotate(-30 42 40)"/></svg>`;
const pigBase = `<circle cx="22" cy="26" r="10" fill="#7fd13f" ${K}/><circle cx="78" cy="26" r="10" fill="#7fd13f" ${K}/><circle cx="50" cy="56" r="40" fill="#7fd13f" ${K}/>${eye(36, 48, 9)}${eye(64, 48, 9)}<ellipse cx="50" cy="68" rx="17" ry="12" fill="#a8ec4e" ${K}/><circle cx="44" cy="68" r="3" fill="#2a170a"/><circle cx="56" cy="68" r="3" fill="#2a170a"/>`;
const PIGS = {
  helmet: pigBase + `<path d="M14 40q4-32 36-32t36 32z" fill="#ffd21f" ${K}/><path d="M8 42h84" stroke="#2a170a" stroke-width="5" stroke-linecap="round"/>`,
  stache: pigBase + `<path d="M28 76q10-12 22-4q12-8 22 4q-8 16-22 8q-14 8-22-8z" fill="#e8702a" ${K}/>`,
  king: pigBase + `<path d="M28 22l4-16l10 10l8-14l8 14l10-10l4 16z" fill="#ffc933" ${K}/><path d="M32 82q18 14 36 0z" fill="#fff" ${K}/>`
};
const PIG = '<svg viewBox="0 0 100 100"><circle cx="24" cy="24" r="10" fill="#8fd14f" stroke="#3a2210" stroke-width="4"/><circle cx="76" cy="24" r="10" fill="#8fd14f" stroke="#3a2210" stroke-width="4"/><circle cx="50" cy="55" r="40" fill="#8fd14f" stroke="#3a2210" stroke-width="5"/><circle cx="36" cy="46" r="8" fill="#fff" stroke="#3a2210" stroke-width="3"/><circle cx="64" cy="46" r="8" fill="#fff" stroke="#3a2210" stroke-width="3"/><circle cx="37" cy="48" r="3" fill="#3a2210"/><circle cx="63" cy="48" r="3" fill="#3a2210"/><ellipse cx="50" cy="67" rx="16" ry="12" fill="#6fb530" stroke="#3a2210" stroke-width="4"/><circle cx="44" cy="67" r="3" fill="#3a2210"/><circle cx="56" cy="67" r="3" fill="#3a2210"/></svg>';
$("logo").innerHTML = bird("red"); $("heroBird").innerHTML = bird("red"); $("logo").firstChild.style.cssText = $("heroBird").firstChild.style.cssText = "width:100%;filter:drop-shadow(0 6px 3px rgba(0,0,0,.3))";

/* ===== SCENE ===== */
const blk = (l, b, w, h, c = '') => `<i class="blk ${c}" style="left:${l}px;bottom:${b}px;width:${w}px;height:${h}px"></i>`;
const PT = ['helmet', 'stache', 'king']; let pc = 0;
const pig = (l, b, s) => `<div class="pig" style="left:${l}px;bottom:${b}px;width:${s}px;height:${s}px;animation-delay:${-Math.random() * 2}s"><svg viewBox="0 0 100 100">${PIGS[PT[pc++ % 3]]}<circle cx="50" cy="56" r="40" fill="url(#sh)"/><ellipse cx="36" cy="34" rx="11" ry="5" fill="#fff" opacity=".3" transform="rotate(-30 36 34)"/></svg></div>`;
const clouds = [[8, 1.1, 90, 0, .95, 0], [20, .7, 120, -40, .7, 1], [34, 1.4, 150, -90, .8, 2], [48, .6, 170, -20, .55, 2], [14, .9, 110, -70, .8, 0]]
  .map(([t, s, d, dl, o, b]) => `<div class="cl" style="top:${t}%;--s:${s};--d:${d}s;--dl:${dl}s;--o:${o};--b:${b}px"></div>`).join("");
$("scene").innerHTML = `<div class="sun"></div>${clouds}<svg width="0" height="0" style="position:absolute"><defs><radialGradient id="sh" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient></defs></svg>
<div class="mt" style="left:-5%;width:50%"></div><div class="mt" style="left:32%;width:62%;height:36vh;opacity:.5"></div><div class="hill h1"></div><div class="hill h2"></div>
${[[4, 150, .6], [12, 125, .8], [20, 170, .5], [30, 110, .7], [45, 160, .55], [56, 140, .7], [66, 170, .5], [74, 120, .8], [84, 150, .6], [92, 110, .75]].map(([l, b, s]) => `<i class="tree" style="left:${l}%;bottom:${b}px;transform:scale(${s})"></i>`).join("")}
${[["pink", 18, 150, 30], ["white", 27, 160, 26], ["blue", 64, 175, 22], ["yellow", 80, 158, 28]].map(([t, l, b, s]) => `<div class="far" style="left:${l}%;bottom:${b}px;width:${s}px;height:${s}px;animation-delay:${-Math.random() * 1.6}s">${bird(t)}</div>`).join("")}
<div id="sky"></div>
<div class="sling"><svg viewBox="0 0 70 110"><path d="M35 108V64L12 14M35 64l24-50" stroke="#6b3f17" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M35 108V64L12 14M35 64l24-50" stroke="#c98a44" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M12 16Q35 40 59 16" stroke="#3a2210" stroke-width="4" fill="none"/></svg></div>
${["yellow", "black", "blue"].map((t, i) => `<div class="q" style="left:calc(max(30px,7vw) + ${90 + i * 52}px);animation-delay:${-i * .5}s">${bird(t)}</div>`).join("")}
<div class="fort" id="fort">${blk(0, 0, 56, 56) + pig(64, 0, 56) + blk(128, 0, 56, 56, 'st') + blk(0, 56, 184, 16, 'pl') + blk(18, 72, 40, 56) + blk(126, 72, 40, 56) + pig(66, 72, 50) + blk(8, 128, 168, 16, 'pl') + pig(70, 144, 46)}</div>
<div class="ground"></div><div class="tnt">TNT</div>
${[[3, .9], [22, 1.1], [48, .8], [71, 1], [90, .9]].map(([l, s]) => `<i class="bush" style="left:${l}%;transform:scale(${s});transform-origin:bottom left"></i>`).join("")}
${[[9, "🌼", 70], [17, "🌷", 66], [36, "🌼", 72], [41, "🍄", 70], [58, "🌷", 68], [63, "🌼", 72], [79, "🍄", 70], [96, "🌼", 66]].map(([l, e, b]) => `<span class="fl" style="left:${l}%;bottom:${b}px">${e}</span>`).join("")}
<div class="fg"></div>`;

function launch(type, k, hit) {
  const W = innerWidth, H = innerHeight, sc = W < 600 ? .6 : 1, sz = 64 * k;
  const x0 = Math.max(30, W * .07) + 35, y0 = H - 90 - 110;
  const tx = W - W * .05 - 100 * sc, ty = H - 90 - 95 * sc, apex = (.3 + Math.random() * .3) * H;
  const tm = hit ? 1 : 1.35, N = 30, fr = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N * tm, x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * t - 4 * apex * t * (1 - t) * (hit ? 1 : .8) - (hit ? 0 : 60 * (1 - k));
    fr.push({ transform: `translate(${x - sz / 2}px,${y - sz / 2}px) rotate(${t * 540}deg)`, opacity: hit || i < N ? 1 : 0 })
  }
  const el = document.createElement("div"); el.className = "fb"; el.style.width = el.style.height = sz + "px";
  if (!hit) el.style.filter = `blur(${(1 - k) * 5}px) drop-shadow(0 4px 3px rgba(0,0,0,.2))`;
  el.innerHTML = bird(type); $("sky").appendChild(el);
  el.animate(fr, { duration: hit ? 1900 : 3400, easing: "linear" }).onfinish = () => {
    el.remove();
    if (hit) {
      const p = document.createElement("div"); p.className = "puff"; p.textContent = "💥"; p.style.left = tx - 32 + "px"; p.style.top = ty - 32 + "px"; $("scene").appendChild(p); setTimeout(() => p.remove(), 750);
      const f = $("fort"); f.classList.remove("hit"); void f.offsetWidth; f.classList.add("hit")
    }
  };
}
if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const T = ["red", "red", "yellow", "black", "blue", "white", "pink", "big"], pick = () => T[Math.floor(Math.random() * T.length)];
  const go = () => { if (document.hidden) return; launch(pick(), 1, true); if (Math.random() < .75) setTimeout(() => launch(pick(), .45 + Math.random() * .3, false), 500); if (Math.random() < .4) setTimeout(() => launch(pick(), .4 + Math.random() * .2, false), 1300) };
  setTimeout(go, 500); setInterval(go, 2800);
}

/* ===== APP ===== */
let config = null, logs = [], page = 1, hasNext = false, totalPages = null, totalItems = null; const PER = 12;
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === t));
  document.querySelectorAll(".panel").forEach(p => p.hidden = p.id !== t.dataset.p);
  if (t.dataset.p === "p3") loadLogs();
}));
async function loadConfig() {
  try {
    config = await api.getConfig();
    $("heroName").textContent = config.drone_name;
    const l = $("heroLight"); l.style.display = ""; l.textContent = "Light: " + config.light; l.classList.toggle("off", config.light !== "on");
    $("cfgGrid").innerHTML = [["Drone ID", config.drone_id], ["Drone Name", config.drone_name], ["Light", config.light], ["Country", config.country]]
      .map(([k, v]) => `<div class="item"><span>${k}</span><b>${String(v).replace(/</g, "&lt;")}</b></div>`).join("");
  } catch (e) {
    config = null; $("heroName").textContent = "โหลดข้อมูลไม่ได้"; $("heroLight").style.display = "none";
    $("cfgGrid").innerHTML = `<div class="item" style="grid-column:1/-1"><b>⚠️ ${e.message}</b></div>`; toast(e.message)
  }
}
const tiltSel = ".btn,.tab";
document.addEventListener("pointermove", e => {
  const c = e.target.closest && e.target.closest(tiltSel); if (!c || c.disabled) return; const r = c.getBoundingClientRect();
  c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 10 + "deg"); c.style.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * 16 + "deg")
});
document.addEventListener("pointerout", e => { const c = e.target.closest && e.target.closest(tiltSel); if (c) { c.style.removeProperty("--rx"); c.style.removeProperty("--ry") } });
$("send").addEventListener("click", async () => {
  const v = $("temp").value.trim();
  if (v === "" || isNaN(Number(v))) { $("err").textContent = "กรอกอุณหภูมิเป็นตัวเลข"; return }
  if (Number(v) < 0 || Number(v) > 80) { $("err").textContent = "ใส่ได้เฉพาะ 0 - 80 °C"; return }
  if (!config) await loadConfig(); if (!config) { $("err").textContent = "ยังโหลด Config ไม่เสร็จ ลองใหม่อีกครั้ง"; return }
  $("err").textContent = ""; $("send").disabled = true;
  try {
    await api.postLog({ drone_id: Number(config.drone_id), drone_name: config.drone_name, country: config.country, celsius: Number(v) });
    $("temp").value = ""; paint(); toast("🎉 ส่งข้อมูลแล้ว!"); launch("red", 1.2, true); const tb = $("birds"); tb.classList.remove("jump"); void tb.offsetWidth; tb.classList.add("jump"); setTimeout(() => $("t3").click(), 1000)
  } catch (e) { $("err").textContent = e.message }
  $("send").disabled = false;
});
/* หลอดตัวละคร: 6 ตัว ตัวละ 80/6 องศา สว่างจากซ้ายไปขวา */
const tin = $("temp");
const BORD = ["blue", "white", "yellow", "pink", "red", "black"], STEP = 80 / BORD.length;
function paint() {
  const v = parseFloat(tin.value), t = isNaN(v) ? 0 : Math.min(80, Math.max(0, v));
  document.querySelectorAll("#birds .lit").forEach((el, i) => { el.style.clipPath = `inset(0 ${100 - Math.min(1, Math.max(0, (t - i * STEP) / STEP)) * 100}% 0 0)` })
}
tin.addEventListener("keydown", e => { if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault() });
tin.addEventListener("input", () => {
  const v = parseFloat(tin.value);
  if (!isNaN(v) && v > 80) { tin.value = 80; $("err").textContent = "สูงสุด 80 °C" }
  else if (!isNaN(v) && v < 0) { tin.value = 0; $("err").textContent = "ต่ำสุด 0 °C" }
  else $("err").textContent = ""; paint()
});
$("birds").innerHTML = BORD.map((t, i) => `<div class="b" style="animation-delay:${i * .07}s"><div class="dim">${bird(t)}</div><div class="lit">${bird(t)}</div></div>`).join(""); paint();
async function loadLogs(p = 1, last = false) {
  $("rows").innerHTML = '<tr><td colspan="5">กำลังโหลด…</td></tr>';
  try {
    const d = await api.getLogs(p);
    if (!d.items.length && p > 1) { toast("ไม่มีข้อมูลหน้าถัดไปแล้ว"); return loadLogs(p - 1, true) }
    logs = d.items; page = p; totalPages = d.totalPages; totalItems = d.totalItems;
    hasNext = !last && (totalPages !== null ? p < totalPages : d.items.length >= PER); renderLogs()
  }
  catch (e) { $("rows").innerHTML = `<tr><td colspan="5">⚠️ ${e.message}</td></tr>`; $("pageInfo").textContent = ""; $("prev").disabled = $("next").disabled = true }
}
function fmtDate(c) { const d = new Date(String(c).replace(" ", "T")); return isNaN(d) ? c : d.toLocaleString("th-TH") }
function renderLogs() {
  const s = logs;
  $("rows").innerHTML = s.length ? s.map(r => `<tr><td>${fmtDate(r.created)}</td><td>${r.country}</td><td>${r.drone_id}</td><td>${r.drone_name}</td><td class="${r.celsius >= 45 ? 'hot' : ''}">${r.celsius}</td></tr>`).join("") : '<tr><td colspan="5">ยังไม่มี log — ไปส่งข้อมูลแรกที่หน้า Log Form</td></tr>';
  $("pageInfo").textContent = `หน้า ${page}${totalPages ? ` / ${totalPages}` : ""}${totalItems !== null ? ` (ทั้งหมด ${totalItems} รายการ)` : ""}`; $("prev").disabled = page <= 1; $("next").disabled = !hasNext;
}
$("prev").onclick = () => loadLogs(page - 1); $("next").onclick = () => loadLogs(page + 1);
function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2400) }
loadConfig();