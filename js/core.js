/* Theme: saved choice, else the system setting. */
(() => {
  let t = null;
  try {
    t = localStorage.getItem("mg_theme");
  } catch (e) {}
  if (!t) t = matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = t;
})();
/* Shared code: helpers, storage, accounts, profile helpers, navigation and page shell. */
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)],
  esc = (t) =>
    String(t ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
let mem = {};
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return k in mem ? mem[k] : d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      mem[k] = v;
    }
  },
};
function toast(m) {
  const e = document.createElement("div");
  e.className = "toast";
  e.setAttribute("role", "status");
  e.textContent = m;
  document.body.append(e);
  setTimeout(() => e.remove(), 2400);
}
const MCC = "https://mcc.nic.in",
  L = (t, u = MCC) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`,
  BULL = "MCC UG 2026 Information Bulletin (revised 20.08.2026)";
let U = store.get("mg_s", null);
const key = () => "mg_u_" + (U || "guest"),
  D = () => store.get(key(), {}),
  setD = (d) => store.set(key(), d),
  PR = () => D().profile || null,
  PLAN = () => (U && D().plan) || "free";
async function hash(p) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("mg:" + p));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const condFor = () => {
  const p = PR();
  return p ? COND.filter((c) => c[1](p)) : COND;
};
const feeFor = (p) => ({ lo: (p && p.cat != "General" && p.cat != "EWS") || (p && p.pwd == "yes") });
const fitOf = (air, cr) => (!cr ? null : air <= cr * 0.8 ? ["Likely", "o"] : air <= cr * 1.1 ? ["Borderline", "w"] : ["Reach", "b"]),
  nf = (n) => (n == null ? "—" : (+n).toLocaleString("en-IN"));
const NAVG = [
  ["", [["/", "Dashboard"]]],
  ["Plan", [["/roadmap", "Roadmap"], ["/deadlines", "Deadlines"], ["/documents", "Documents"]]],
  ["Colleges", [["/predict", "College finder"], ["/choices", "Choice list"]]],
  ["Learn", [["/counselling", "Counselling guide"], ["/notice", "Explain a notice"], ["/help", "Help & experts"]]],
  ["More", [["/institute", "Institute view"], ["/pricing", "Plans"]]],
];
const NAVP = NAVG.flatMap((g) => g[1]);
const tabOf = (keys, def) => {
    const h = location.hash.slice(1);
    return keys.includes(h) ? h : def;
  },
  tabsBar = (list, cur) =>
    `<div class="tabs np" role="tablist">${list.map(([k, l]) => `<a role="tab" aria-selected="${k == cur}" class="${k == cur ? "on" : ""}" href="#${k}">${l}</a>`).join("")}</div>`,
  stripH1 = (h) => h.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");
addEventListener("hashchange", () => render());
const P = {},
  go = (h) => (location.href = h);
/* Tools need an account. Only these pages open without signing in. */
const OPEN = ["/", "/signin", "/privacy", "/pricing", "/parent"];
/* Page to return to after sign-in: only a local page name, never a full URL. */
const NEXT = () => {
  const n = new URLSearchParams(location.search).get("next") || "";
  return /^[a-z]+\.html(#[a-z]+)?$/.test(n) ? n : "";
};
const toSignIn = (page, fresh) => location.replace(`signin.html?${fresh ? "new&" : ""}next=${encodeURIComponent(page)}`);
function need() {
  if (!U) {
    toSignIn((location.pathname.split("/").pop() || "index.html") + location.hash);
    return true;
  }
}
const SEL = (id, l, o, v, opt) =>
    `<label>${l}${opt ? " <small>(optional)</small>" : ""}<select id="${id}">${o
      .map((x) => {
        const [a, b] = Array.isArray(x) ? x : [x, x];
        return `<option value="${a}" ${v == a ? "selected" : ""}>${b}</option>`;
      })
      .join("")}</select></label>`,
  INP = (id, l, t, v, opt, extra = "") =>
    `<label>${l}${opt ? " <small>(optional)</small>" : ""}<input id="${id}" type="${t}" value="${esc(v)}" ${opt ? "" : "required"} ${extra}></label>`;
const routes = (p) => {
  const r = [
    ["15% All India Quota (MCC)", "Open to NEET-qualified candidates; domicile-free seats.", 1],
    ["Deemed universities (MCC)", "100% counselled by MCC. Confirm each college’s fee before choosing.", 1],
    [
      "AIIMS / JIPMER open seats (MCC)",
      "Domicile-free open seats; check institute eligibility annexures in the bulletin.",
      1,
    ],
    [
      "Central university / institute quotas (MCC)",
      "DU, AMU, BHU, IP University, ESIC. Institutional or domicile-quota seats need you to confirm eligibility and domicile first.",
      0,
    ],
    [
      "State quota & private colleges (" + esc(p.dom) + ")",
      STATE_AUTH[p.dom]
        ? `Run by ${STATE_AUTH[p.dom][0]}, not MCC. Separate registration. ${L("Official site ›", STATE_AUTH[p.dom][1])} <span class="s">(link checked ${VERIFIED})</span>`
        : "Run by your State authority, not MCC. Separate registration on your State’s official counselling website.",
      0,
    ],
  ];
  if (p.nri == "yes") r.push(["NRI quota", "See the NRI chapter (pp. 15–19) for eligibility and documents.", 0]);
  if (p.pwd == "yes")
    r.push([
      "PwD reservation",
      "5% horizontal reservation in AIQ; an Eligibility Certificate from an MCC Medical Assessment Board is needed.",
      0,
    ]);
  return r;
};
const isPlus = () => PLAN() == "plus",
  PLAN_NAME = () => (isPlus() ? "Premium" : "Free"),
  cmpR = (p, x) => {
    const c = +x.cr;
    if (!p || !c) return null;
    const me = +(p.crank || p.air),
      r = me / c;
    return r < 0.8 ? ["Safer relative", "o"] : r <= 1.1 ? ["Target", "w"] : ["Reach", "b"];
  };

/* ---------- Dates, deadlines, roadmap, sharing ---------- */
const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
  dleft = (s) => Math.round((new Date(s + "T00:00:00") - today()) / 864e5),
  fmtD = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  dueTxt = (s) => {
    const n = dleft(s);
    return n < 0 ? `${-n} day${n == -1 ? "" : "s"} ago` : n == 0 ? "today" : n == 1 ? "tomorrow" : `in ${n} days`;
  },
  DL = () => (D().dl || []).slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
  upcoming = (n = 3) => DL().filter((x) => !x.done && dleft(x.date) >= 0).slice(0, n),
  uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function addDeadline(t, date, link = "") {
  const d = D();
  d.dl = d.dl || [];
  if (d.dl.some((x) => x.t == t && x.date == date)) return false;
  d.dl.push({ id: uid(), t, date, link, done: false });
  setD(d);
  return true;
}
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 },
  isoD = (y, mo, d) =>
    mo >= 1 && mo <= 12 && d >= 1 && d <= 31
      ? `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      : null;
function pDate(s) {
  let m = s.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/);
  if (m) return isoD(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
  m = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s*(\d{4})?/i);
  if (m) return isoD(m[3] ? +m[3] : new Date().getFullYear(), MON[m[2].toLowerCase()], +m[1]);
  m = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/i);
  if (m) return isoD(m[3] ? +m[3] : new Date().getFullYear(), MON[m[1].toLowerCase()], +m[2]);
  return null;
}
function download(name, txt, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([txt], { type }));
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}
function icsExport(list) {
  const z = (s) => s.replace(/-/g, ""),
    e2 = (t) => String(t).replace(/[\\;,]/g, (m) => "\\" + m),
    stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
    o = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MedGuide//EN"];
  list.forEach((x) => {
    const n = new Date(x.date + "T00:00:00Z");
    n.setUTCDate(n.getUTCDate() + 1);
    o.push(
      "BEGIN:VEVENT",
      "UID:" + x.id + "@medguide",
      "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + z(x.date),
      "DTEND;VALUE=DATE:" + z(n.toISOString().slice(0, 10)),
      "SUMMARY:" + e2(x.t),
      ...(x.link ? ["URL:" + x.link] : []),
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + e2(x.t),
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
    );
  });
  o.push("END:VCALENDAR");
  download("medguide-deadlines.ics", o.join("\r\n"), "text/calendar");
}
/* Roadmap steps: some tick themselves from your data, the rest you tick. */
function STEPS() {
  const d = D(),
    p = PR(),
    st = d.steps || {},
    dc = d.docs || {},
    tot = DOCS.length + condFor().length,
    dn = Object.keys(dc).filter((k) => dc[k]).length,
    ch = (d.drafts || []).reduce((a, x) => a + x.items.length, 0),
    sa = p && STATE_AUTH[p.dom];
  return [
    { k: "profile", t: "Add your details", m: "Rank, category, domicile and preferences.", done: !!p, h: "profile.html", a: "Edit details" },
    { k: "routes", t: "Check which counselling routes apply to you", m: "Your eligibility and quota summary is below.", done: !!st.routes, man: 1, h: "#routes", a: "See routes" },
    { k: "reg_mcc", t: "Register and pay on MCC", m: "Use the email and mobile from your NTA form. One registration per candidate.", done: !!st.reg_mcc, man: 1, h: MCC, a: "MCC site", ext: 1 },
    { k: "reg_state", t: "Register for your State counselling" + (p ? ` (${esc(p.dom)})` : ""), m: "A separate registration on your State authority’s site.", done: !!st.reg_state, man: 1, h: sa ? sa[1] : "", a: sa ? "Official site" : "", ext: 1 },
    { k: "docs", t: "Get your documents ready", m: `${dn} of ${tot} ready.`, done: tot > 0 && dn >= tot, h: "documents.html", a: "Checklist" },
    { k: "plan", t: "Plan your choice list", m: `${ch} college${ch == 1 ? "" : "s"} listed. Mix reach, target and safer options.`, done: ch > 0, h: "choices.html", a: "Choice list" },
    { k: "locked", t: "Fill and lock choices on the official portal", m: "Locked choices cannot be changed.", done: !!st.locked, man: 1, h: MCC, a: "MCC site", ext: 1 },
    { k: "decided", t: "Decide after allotment: freeze, float or exit", m: "Rules change by round.", done: !!st.decided, man: 1, h: "counselling.html#after", a: "Allotment helper" },
    { k: "reported", t: "Report to the college and join", m: "Carry originals and attested copies.", done: !!st.reported, man: 1, h: "documents.html", a: "Documents" },
  ];
}
const progress = () => {
  const s = STEPS();
  return Math.round((100 * s.filter((x) => x.done).length) / s.length);
};
const b64e = (o) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  b64d = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
/* Browser reminders: once a day, for deadlines due within 2 days, when the site is opened. */
function remind() {
  if (!U || !("Notification" in window) || Notification.permission != "granted") return;
  const d = D(),
    t = new Date().toISOString().slice(0, 10);
  if (d.lastRem == t) return;
  const up = DL().filter((x) => !x.done && dleft(x.date) >= 0 && dleft(x.date) <= 2);
  if (!up.length) return;
  try {
    up.forEach((x) => new Notification("MedGuide reminder", { body: `${x.t}: due ${dueTxt(x.date)}` }));
  } catch (e) {}
  d.lastRem = t;
  setD(d);
}
const soonBar = (r) => {
  if (!U || ["/deadlines", "/parent", "/signin"].includes(r)) return "";
  const s = DL().filter((x) => !x.done && dleft(x.date) >= 0 && dleft(x.date) <= 2),
    od = DL().filter((x) => !x.done && dleft(x.date) < 0).length;
  if (!s.length && !od) return "";
  return `<div class="note np" role="status">${s.length ? `<b>Due soon:</b> ${s.map((x) => `${esc(x.t)} (${dueTxt(x.date)})`).join(" · ")}. ` : ""}${od ? `${od} overdue item${od == 1 ? "" : "s"}. ` : ""}<a href="deadlines.html">Open deadlines ›</a></div>`;
};

/* ---------- Icons (24px stroke) ---------- */
const IC = {
  "/": '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  "/roadmap": '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/>',
  "/deadlines": '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  "/documents": '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
  "/choices": '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
  "/compare": '<path d="M12 3v18M4 7h16M7 7l-3 7h6zM17 7l-3 7h6z"/>',
  "/allotment": '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/>',
  "/predict": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8.5 11h5M11 8.5v5"/>',
  "/counselling": '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>',
  "/help": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
  "/institute": '<path d="M3 10l9-6 9 6M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18"/>',
  lang: '<path d="M4 6h9M8.5 4v2M6 6c0 4 3 7 6 8M11 6c0 3-3 7-7 9M13 20l4-9 4 9M14.5 17h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>',
  "/notice": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  "/guide": '<path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z"/>',
  "/pricing": '<path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1 6L12 16.8 6.8 19.5l1-6L3.4 9.3l6-.8z"/>',
  "/account": '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
};
const ico = (k, c = "") => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || ""}</svg>`;
const LOGO = `<svg class="mk" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--ink)"/><path d="M16 9v14M9 16h14" stroke="var(--surface)" stroke-width="3" stroke-linecap="round"/></svg>`;
/* ---------- How to use: modal walkthrough ---------- */
const HOWTO = [
  ["Add your details once", "NEET year, score, AIR, category and domicile. Everything else is personalised from this.", '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'],
  ["Follow your roadmap", "Nine steps from result to joining college. See which routes are open to you and what to do next.", IC["/roadmap"]],
  ["Track every deadline", "Copy dates from official notices. You get warned 2 days before and can add them to your phone calendar.", IC["/deadlines"]],
  ["Plan and compare choices", "Order your colleges, note closing ranks and fees, compare side by side, then lock on the official portal.", IC["/compare"]],
  ["Decide after allotment", "Freeze, float or exit: see what each choice means in your round before you act.", IC["/allotment"]],
];
function howTo(i = 0) {
  let m = $("#howto");
  if (!m) {
    m = document.createElement("div");
    m.id = "howto";
    m.className = "modal";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-label", "How to use MedGuide");
    document.body.append(m);
    m.onclick = (e) => e.target == m && m.remove();
    document.addEventListener("keydown", function k(e) {
      if (e.key == "Escape" && $("#howto")) {
        $("#howto").remove();
        document.removeEventListener("keydown", k);
      }
    });
  }
  const h = HOWTO[i];
  m.innerHTML = `<div class="mbox"><button class="mx" aria-label="Close">✕</button><div class="mic"><svg viewBox="0 0 24 24" class="ic">${h[2]}</svg></div><p class="eyebrow">Step ${i + 1} of ${HOWTO.length}</p><h2 style="margin:4px 0 8px">${h[0]}</h2><p class="m">${h[1]}</p><div class="dots">${HOWTO.map((_, j) => `<button class="${j == i ? "on" : ""}" data-j="${j}" aria-label="Step ${j + 1}"></button>`).join("")}</div><div class="row" style="justify-content:space-between;margin-top:18px"><button class="btn sec" data-j="${i - 1}" ${i ? "" : "disabled"}>Back</button>${i < HOWTO.length - 1 ? `<button class="btn" data-j="${i + 1}">Next</button>` : `<a class="btn" href="${U ? (PR() ? "roadmap.html" : "profile.html") : "signin.html?new"}">${U ? "Go to my roadmap" : "Create free account"}</a>`}</div></div>`;
  tr(m);
  m.querySelector(".mx").onclick = () => m.remove();
  m.querySelectorAll("[data-j]").forEach((b) => (b.onclick = () => howTo(+b.dataset.j)));
  (m.querySelector(".btn:not([disabled])") || m.querySelector(".mx")).focus();
}
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("mg_theme", t);
  } catch (e) {}
}
/* After every render: count-up numbers, animated bars and rings. */
function animate() {
  const red = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-count]").forEach((el) => {
    const to = +el.dataset.count,
      fmt = (n) => (el.dataset.fmt == "lakh" ? (n / 1e5).toFixed(2) + "L" : Math.round(n).toLocaleString("en-IN")) + (el.dataset.suf || "");
    return (el.textContent = fmt(to));
    const t0 = performance.now(),
      step = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
    requestAnimationFrame(step);
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-w]").forEach((el) => (el.style.width = el.dataset.w + "%"));
      document.querySelectorAll("[data-off]").forEach((el) => (el.style.strokeDashoffset = el.dataset.off));
    }),
  );
}

/* Official MCC video tutorials card, reused on several pages. */
const videoCard = () =>
  `<div class="card"><div class="ch"><div><p class="eyebrow">Official · MCC</p><h3>Video tutorials</h3></div>${L('<span class="pill">Watch on mcc.nic.in ↗</span>', MCC_VIDEOS.url)}</div>${MCC_VIDEOS.list
    .map(([t, l]) => `<a class="vid" href="${MCC_VIDEOS.url}" target="_blank" rel="noopener noreferrer">${ico("video")}<div><b>${t}</b><br><span class="s">${l}</span></div><span class="go">↗</span></a>`)
    .join("")}<p class="s" style="margin:8px 0 0">Made by MCC. Watch them before you register and before choice locking.</p></div>`;
/* ---------- File storage (IndexedDB, this browser only) ---------- */
const FS = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((ok, no) => {
      const r = indexedDB.open("medguide", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("files");
      r.onsuccess = () => ok((this.db = r.result));
      r.onerror = () => no(r.error);
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((ok, no) => {
      const t = db.transaction("files", mode),
        s = t.objectStore("files"),
        r = fn(s);
      t.oncomplete = () => ok(r && r.result);
      t.onerror = () => no(t.error);
    });
  },
  put: (k, v) => FS.tx("readwrite", (s) => s.put(v, k)),
  get: (k) => FS.tx("readonly", (s) => s.get(k)),
  del: (k) => FS.tx("readwrite", (s) => s.delete(k)),
  async list(prefix) {
    const db = await this.open();
    return new Promise((ok) => {
      const out = {},
        r = db.transaction("files").objectStore("files").openCursor();
      r.onsuccess = () => {
        const cur = r.result;
        if (!cur) return ok(out);
        if (String(cur.key).startsWith(prefix)) out[String(cur.key).slice(prefix.length)] = { name: cur.value.name, size: cur.value.size, type: cur.value.type, at: cur.value.at };
        cur.continue();
      };
      r.onerror = () => ok(out);
    });
  },
};
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");
/* Load pdf.js on demand and return the text of a PDF file. */
async function pdfText(file) {
  if (!window.pdfjsLib) {
    await new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = "js/vendor/pdf.min.js";
      s.onload = ok;
      s.onerror = () => no(new Error("Could not load the PDF reader."));
      document.head.append(s);
    });
    pdfjsLib.GlobalWorkerOptions.workerSrc = "js/vendor/pdf.worker.min.js";
  }
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise,
    out = [];
  for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
    const pg = await pdf.getPage(i),
      tc = await pg.getTextContent();
    let line = "",
      lastY = null;
    tc.items.forEach((it) => {
      const y = Math.round(it.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 2) (out.push(line.trim()), (line = ""));
      line += it.str + (it.hasEOL ? "\n" : " ");
      lastY = y;
    });
    out.push(line.trim());
  }
  return out.filter(Boolean).join("\n");
}
/* ---------- Quick search (Ctrl/Cmd + K) ---------- */
function palette() {
  if ($("#cmdk")) return;
  const items = [
    ...NAVP.map(([h, t]) => [t, () => go(FILE(h)), h]),
    ["Add a deadline", () => go("deadlines.html"), "/deadlines"],
    ["Compare colleges", () => go("choices.html#compare"), "/choices"],
    ["Practise choice filling", () => go("choices.html#practice"), "/choices"],
    ["Rules & fees", () => go("counselling.html#rules"), "/counselling"],
    ["After allotment: freeze, float or exit", () => go("counselling.html#after"), "/counselling"],
    ["Book a 1:1 expert session", () => go("help.html#expert"), "/help"],
    ["Switch language: English / हिंदी", () => (setLang(LANG == "hi" ? "en" : "hi"), location.reload()), "lang"],
    ["Where does my AIR stand?", () => go("predict.html"), "/predict"],
    ["Edit my details", () => go("profile.html"), "/account"],
    ["Share progress with a parent", () => go("account.html"), "/account"],
    ["MCC video tutorials (official)", () => window.open(MCC_VIDEOS.url, "_blank", "noopener"), "video"],
    ["How to use MedGuide", () => ($("#cmdk").remove(), howTo(0)), "help"],
    ["Switch light / dark mode", () => ($("#cmdk").remove(), setTheme(document.documentElement.dataset.theme == "dark" ? "light" : "dark"), render()), "moon"],
  ];
  const m = document.createElement("div");
  m.id = "cmdk";
  m.className = "modal";
  m.innerHTML = `<div class="mbox pal"><div class="pin">${ico("search")}<input id="pq" placeholder="Search pages and actions…" aria-label="Search"><kbd>Esc</kbd></div><div id="pr" role="listbox"></div></div>`;
  document.body.append(m);
  let sel = 0,
    vis = items;
  const draw = () => {
    $("#pr").innerHTML = vis.length
      ? vis.map((x, i) => `<button class="pit ${i == sel ? "on" : ""}" data-i="${i}" role="option">${ico(x[2])}<span>${x[0]}</span></button>`).join("")
      : `<p class="m" style="padding:12px">No matches.</p>`;
    $("#pr").querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => vis[+b.dataset.i][1]()));
    tr($("#pr"));
  };
  const q = $("#pq");
  q.oninput = () => {
    const t = q.value.toLowerCase().trim();
    vis = items.filter((x) => x[0].toLowerCase().includes(t));
    sel = 0;
    draw();
  };
  q.onkeydown = (e) => {
    if (e.key == "ArrowDown") (sel = Math.min(sel + 1, vis.length - 1)), draw(), e.preventDefault();
    else if (e.key == "ArrowUp") (sel = Math.max(sel - 1, 0)), draw(), e.preventDefault();
    else if (e.key == "Enter" && vis[sel]) vis[sel][1]();
    else if (e.key == "Escape") m.remove();
  };
  m.onclick = (e) => e.target == m && m.remove();
  draw();
  q.focus();
}
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == "k") {
    e.preventDefault();
    palette();
  }
});
/* ---------- Page shell: banner, navigation, footer, page render ---------- */
const FILE = (h) => (h === "/" ? "index.html" : h.slice(1) + ".html");
/* Original illustration: a NEET aspirant's study corner. Colours come from CSS variables (--sc-*),
   so the scene is an evening room in light mode and a bright daytime room in dark mode. */
const STUDY = (id = "s", fit = "xMidYMid slice") => {
  const sp = (x, y, w, h, c, t) =>
    `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${x + 3}" y="${y - h + 7}" width="${w - 6}" height="3" fill="#fff" opacity=".55"/>${
      t ? `<text x="${x + w / 2 + 3}" y="${y - 8}" transform="rotate(-90 ${x + w / 2 + 3} ${y - 8})" font-size="${Math.min(9, w - 12, (h - 22) / (t.length * 0.66)).toFixed(1)}" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">${t}</text>` : ""
    }`;
  return `<svg class="land" viewBox="0 0 1200 640" preserveAspectRatio="${fit}" aria-hidden="true">
<defs>
<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop style="stop-color:var(--sc-w1)"/><stop offset=".75" style="stop-color:var(--sc-w2)"/><stop offset="1" style="stop-color:var(--sc-w3)"/></linearGradient>
<radialGradient id="${id}g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1040 260) scale(420 320)"><stop style="stop-color:var(--sc-glow)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--sc-glow)" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop style="stop-color:var(--sc-k1)"/><stop offset="1" style="stop-color:var(--sc-k2)"/></linearGradient>
<linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dcb68b"/><stop offset="1" stop-color="#b98c62"/></linearGradient>
<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop style="stop-color:var(--sc-veil)" stop-opacity=".5"/><stop offset=".42" style="stop-color:var(--sc-veil)" stop-opacity="0"/></linearGradient>
<pattern id="${id}p" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" style="fill:var(--sc-dot)"/></pattern>
</defs>
<rect width="1200" height="640" fill="url(#${id}w)"/>
<rect width="1200" height="470" fill="url(#${id}p)"/>
<rect width="1200" height="640" fill="url(#${id}g)"/>
<g style="fill:var(--sc-tx)" font-family="Georgia, serif" font-size="22" font-style="italic">
<text x="350" y="250">C₆H₁₂O₆</text><text x="780" y="230">F = ma</text><text x="520" y="330">ATP → ADP + Pᵢ</text><text x="860" y="420">pH = −log[H⁺]</text><text x="330" y="430">v = u + at</text></g>
<!-- periodic table poster -->
<g transform="translate(80 40) scale(.78)"><rect width="196" height="112" rx="8" fill="#fbf7ee"/><rect x="0" y="0" width="196" height="112" rx="8" fill="none" stroke="#e7dcc6" stroke-width="2"/>${["#bcd9fb", "#f7c6dc", "#cdeab8", "#fcd9b3", "#d9cdf7", "#f7e27a"]
    .map((c, r) => Array.from({ length: 9 }, (_, i) => (r > 0 && r < 3 && i > 1 && i < 7 ? "" : `<rect x="${14 + i * 19}" y="${14 + r * 15}" width="15" height="12" rx="2.5" fill="${c}"/>`)).join(""))
    .join("")}<rect x="54" y="30" width="88" height="22" rx="4" fill="#fff"/><text x="98" y="45" text-anchor="middle" font-size="11" font-weight="700" fill="#3a4b5e" font-family="system-ui,sans-serif">PERIODIC TABLE</text></g>
<!-- bookshelf -->
<g transform="translate(78 196)"><rect width="236" height="176" rx="8" style="fill:var(--sc-shelf)"/>
<rect y="80" width="236" height="9" rx="2" fill="#b0855b"/><rect y="166" width="236" height="9" rx="2" fill="#b0855b"/>
${sp(12, 80, 24, 62, "#4f86e8", "BIOLOGY")}${sp(38, 80, 20, 54, "#e4709f", "")}${sp(60, 80, 26, 66, "#53a862", "CHEMISTRY")}${sp(88, 80, 18, 48, "#f0a35b", "")}${sp(108, 80, 24, 62, "#8b6fd6", "PHYSICS")}${sp(134, 80, 18, 52, "#e9c440", "")}
<g transform="translate(166 18)"><path d="M10 0c22 12 22 30 0 42s-22 30 0 44M34 0c-22 12-22 30 0 42s22 30 0 44" stroke="#4f86e8" stroke-width="4" fill="none" transform="scale(.7)"/><g stroke="#e4709f" stroke-width="3" transform="scale(.7)"><path d="M14 8h16M10 21h24M14 34h16M14 50h16M10 63h24M14 76h16"/></g><rect x="-2" y="58" width="36" height="6" rx="2" fill="#7d8b99"/></g>
${sp(12, 166, 26, 64, "#f0a35b", "NCERT")}${sp(40, 166, 20, 56, "#53a862", "")}${sp(62, 166, 22, 68, "#4f86e8", "NCERT")}${sp(86, 166, 26, 60, "#8b6fd6", "")}${sp(114, 166, 18, 52, "#e4709f", "")}
<!-- microscope -->
<g transform="translate(152 98)" fill="#5d6d7e"><rect x="8" y="58" width="56" height="10" rx="3"/><rect x="28" y="50" width="16" height="10" rx="2"/><path d="M40 52 56 10l8 4-14 40z"/><rect x="50" y="0" width="16" height="22" rx="3" transform="rotate(22 58 11)" fill="#3a4b5e"/><rect x="18" y="36" width="30" height="5" rx="2" fill="#9fb0c0"/><circle cx="58" cy="44" r="5" fill="#9fb0c0"/></g>
</g>
<!-- NEET calendar -->
<g transform="translate(1000 30)"><rect width="96" height="96" rx="10" fill="#fbf7ee"/><rect width="96" height="26" rx="10" fill="#e25c5c"/><rect y="16" width="96" height="10" fill="#e25c5c"/><text x="48" y="19" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">NEET</text><text x="48" y="66" text-anchor="middle" font-size="30" font-weight="800" fill="#253a52" font-family="system-ui,sans-serif">D-30</text><text x="48" y="84" text-anchor="middle" font-size="10" font-weight="600" fill="#7d8b99" font-family="system-ui,sans-serif">counselling</text><circle cx="24" cy="4" r="4" fill="#3a4b5e"/><circle cx="72" cy="4" r="4" fill="#3a4b5e"/></g>
<!-- window -->
<g transform="translate(908 150)"><rect width="200" height="214" rx="10" fill="#efe4d0"/><rect x="11" y="11" width="178" height="192" rx="6" fill="url(#${id}k)"/>
<circle cx="140" cy="54" r="18" style="fill:var(--sc-sun)"/>
<g style="fill:var(--sc-cloud)"><ellipse cx="60" cy="60" rx="30" ry="9"/><ellipse cx="76" cy="52" rx="20" ry="10"/><ellipse cx="150" cy="110" rx="24" ry="7"/></g>
<g style="fill:var(--sc-star)"><circle cx="40" cy="34" r="1.6"/><circle cx="80" cy="84" r="1.2"/><circle cx="168" cy="120" r="1.2"/><circle cx="110" cy="26" r="1.1"/></g>
<path d="M11 166l36-26 26 16 34-30 44 28 38-16v65H11z" style="fill:var(--sc-hill)"/>
<rect x="97" y="11" width="6" height="192" fill="#efe4d0"/><rect x="11" y="104" width="178" height="6" fill="#efe4d0"/><rect x="-8" y="208" width="216" height="12" rx="4" fill="#e0cfb2"/>
<g transform="translate(14 176)"><path d="M10 32c-4-14 2-26 14-30M22 32c2-12 10-20 22-22" stroke="#53a862" stroke-width="3" fill="none"/><ellipse cx="22" cy="6" rx="8" ry="4" fill="#53a862" transform="rotate(-30 22 6)"/><ellipse cx="42" cy="10" rx="8" ry="4" fill="#6fbf7a" transform="rotate(20 42 10)"/><path d="M2 30h40l-5 18H7z" fill="#e4709f"/></g></g>
<!-- desk -->
<rect y="468" width="1200" height="172" fill="url(#${id}d)"/><rect y="460" width="1200" height="12" fill="#e7c7a0"/><rect y="472" width="1200" height="4" fill="#a97c54" opacity=".35"/>
<!-- book stack + apple, left -->
<g transform="translate(80 384)"><rect x="0" y="62" width="150" height="22" rx="3" fill="#4f86e8"/><rect x="10" y="40" width="136" height="22" rx="3" fill="#53a862"/><rect x="4" y="18" width="142" height="22" rx="3" fill="#f0a35b"/><g fill="#fff" font-size="10" font-weight="700" font-family="system-ui,sans-serif"><text x="14" y="77">BIOLOGY · CLASS 12</text><text x="22" y="55">CHEMISTRY</text><text x="16" y="33">PHYSICS</text></g>
<circle cx="204" cy="66" r="18" fill="#e25c5c"/><path d="M204 48c0-8 4-12 10-14" stroke="#5a3d2b" stroke-width="3" fill="none"/><path d="M208 44c8-6 16-4 18 0-6 4-12 4-18 0z" fill="#53a862"/></g>
<!-- laptop with mock test -->
<g transform="translate(944 372)"><rect x="6" y="0" width="150" height="92" rx="8" fill="#2f3b48"/><rect x="14" y="8" width="134" height="76" rx="4" fill="#f5f8fc"/><rect x="14" y="8" width="134" height="14" rx="4" fill="#4f86e8"/><text x="22" y="18" font-size="8" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">MOCK TEST · Q 42/180</text><g fill="#dfe6ee"><rect x="22" y="30" width="96" height="6" rx="3"/><rect x="22" y="42" width="76" height="6" rx="3"/></g><g><circle cx="26" cy="58" r="4" fill="#53a862"/><rect x="34" y="55" width="50" height="5" rx="2.5" fill="#dfe6ee"/><circle cx="26" cy="72" r="4" fill="none" stroke="#c4cfdb" stroke-width="2"/><rect x="34" y="69" width="40" height="5" rx="2.5" fill="#dfe6ee"/></g><path d="M0 92h162l-10 10H10z" fill="#4a5867"/></g>
<!-- open notebook -->
<g transform="translate(800 482) rotate(-4)"><path d="M0 10 140 0v92L0 104z" fill="#fdfaf3"/><path d="M140 0l140 10v94L140 92z" fill="#f5efe3"/><g stroke="#bcd9fb" stroke-width="2">${[28, 44, 60, 76]
    .map((y) => `<path d="M14 ${y}h114M154 ${y - 2}h114"/>`)
    .join("")}</g><path d="M140 0v92" stroke="#d9cdb4" stroke-width="2"/><path d="M166 40c14-14 26 10 40-4s20 8 34-2" stroke="#e4709f" stroke-width="2.5" fill="none"/><text x="20" y="24" font-size="11" font-style="italic" fill="#4f86e8" font-family="Georgia,serif">Revision · Ch 5</text></g>
<g transform="translate(770 596) rotate(-14)"><rect width="120" height="10" rx="2" fill="#e9c440"/><path d="M120 0l16 5-16 5z" fill="#f2d7a8"/><rect x="-10" width="10" height="10" rx="2" fill="#e4709f"/></g>
<!-- stethoscope -->
<g transform="translate(990 506)" fill="none" stroke-linecap="round"><path d="M20 10c-10 40 10 70 50 70s56-30 48-62" stroke="#34495e" stroke-width="7"/><path d="M118 18c4-18-10-24-18-20M20 10c-4-18 10-24 18-20" stroke="#34495e" stroke-width="5"/><path d="M70 80c0 20-10 34-30 34" stroke="#34495e" stroke-width="7"/><circle cx="30" cy="114" r="14" fill="#d3dce4" stroke="#8a99a8" stroke-width="4"/></g>
<!-- mug -->
<g transform="translate(1116 414)"><rect width="46" height="54" rx="8" fill="#fbf7ee"/><path d="M46 14c16 0 16 26 0 26" stroke="#fbf7ee" stroke-width="6" fill="none"/><rect x="9" y="20" width="28" height="9" rx="4.5" fill="#53a862"/><path d="M14 -6c-6-10 6-14 0-24M30 -6c-6-10 6-14 0-24" style="stroke:var(--sc-steam)" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<rect width="1200" height="640" fill="url(#${id}v)"/>
</svg>`;
};
const TOP_HTML = `MedGuide is an independent service. It is not affiliated with MCC, DGHS, NTA or any government body.`;
const FOOTER_HTML = `<div class="fg"><div class="fb"><a class="logo" href="index.html">${LOGO}<span>MedGuide</span></a><p>Your NEET-UG counselling companion. The rank opens the door; the right choice gets you through.</p></div>${NAVG.filter((g) => g[0])
  .map(([g, l]) => `<div class="fc"><h4>${g}</h4>${l.map(([h, t]) => `<a href="${FILE(h)}">${t}</a>`).join("")}</div>`)
  .join("")}</div><p class="fd">Rules and fees are summarised from the MCC UG Counselling 2026 Information Bulletin (revised, 20.08.2026). Schedules and rules can change; confirm on <a href="https://mcc.nic.in" target="_blank" rel="noopener noreferrer">mcc.nic.in</a> or your State authority. MedGuide cannot guarantee admission or allotment and never registers, fills or locks choices for you. Your account and entries are stored only in this browser. Official links last checked ${VERIFIED}.</p><div class="fl2"><span>© 2026 MedGuide</span><span><a href="privacy.html">Privacy &amp; disclaimer</a></span></div>`;
function render() {
  const r = document.body.dataset.page || "/";
  if (!U && !OPEN.includes(r)) return toSignIn(FILE(r) + location.hash);
  if (typeof MOCK_T != "undefined") clearInterval(MOCK_T);
  const pg = P[r] || P["/"],
    y = scrollY,
    same = r == window._r;
  window._r = r;
  $("#top").innerHTML = TOP_HTML;
  $("#ft").innerHTML = FOOTER_HTML;
  const dark = document.documentElement.dataset.theme == "dark",
    lk = ([h, t]) => `<a href="${FILE(h)}" ${r == h ? 'class="on" aria-current="page"' : ""} title="${t}">${ico(h)}<span>${t}</span></a>`;
  const grp = (l) => l.some(([h]) => h == r),
    dd = ([g, l]) =>
      `<div class="dd${grp(l) ? " cur" : ""}"><button class="ddb" type="button" aria-expanded="false">${g}<i>›</i></button><div class="ddp">${l.map(lk).join("")}</div></div>`;
  $("#nv").innerHTML =
    `<a class="logo" href="index.html">${LOGO}<span>MedGuide</span></a><div class="nm">` +
    NAVG.map((x) => (x[0] ? dd(x) : x[1].map(lk).join(""))).join("") +
    `</div><div class="na"><button class="nb ib" id="sk" type="button" title="Search (Ctrl K)" aria-label="Search">${ico("search")}</button><button class="nb ib" id="hw" type="button" title="How to use" aria-label="How to use">${ico("help")}</button><button class="nb ib" id="lgb" type="button" title="${LANG == "hi" ? "English" : "हिंदी"}" aria-label="Switch language"><b>${LANG == "hi" ? "EN" : "हि"}</b></button><button class="nb ib" id="th" type="button" title="${dark ? "Light mode" : "Dark mode"}" aria-label="Switch to ${dark ? "light" : "dark"} mode">${ico(dark ? "sun" : "moon")}</button>` +
    (U
      ? `<a class="acc${r == "/account" || r == "/profile" ? " on" : ""}" href="account.html">My account</a>`
      : `<a class="acc${r == "/signin" ? " on" : ""}" href="signin.html">Sign in</a>`) +
    `<button class="nb ib bgr" id="bgr" type="button" aria-label="Menu" aria-expanded="false"><span></span></button></div>`;
  $$(".dd .ddb").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const d = b.parentNode,
        o = !d.classList.contains("open");
      $$(".dd.open").forEach((x) => (x.classList.remove("open"), $(".ddb", x).setAttribute("aria-expanded", "false")));
      if (o) d.classList.add("open"), b.setAttribute("aria-expanded", "true");
    };
  });
  $("#bgr").onclick = (e) => {
    e.stopPropagation();
    const n = $("nav").classList.toggle("open");
    $("#bgr").setAttribute("aria-expanded", n);
  };
  if (!window._ddc) {
    window._ddc = 1;
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dd")) $$(".dd.open").forEach((x) => x.classList.remove("open"));
      if (!e.target.closest("nav")) $("nav").classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") $$(".dd.open").forEach((x) => x.classList.remove("open")), $("nav").classList.remove("open");
    });
  }
  $("#app").innerHTML = soonBar(r) + pg();
  if (pg.after) pg.after();
  document.body.classList.toggle("landing", !!$("#app .gh"));
  /* every page title gets a section label, so headers read the same everywhere */
  const h1 = $("#app h1"),
    pv = h1 && h1.previousElementSibling;
  if (h1 && r != "/" && r != "/signin" && pv && pv.classList.contains("eyebrow")) pv.classList.add("pe");
  else if (h1 && r != "/" && r != "/signin") {
    const g = NAVG.find((x) => x[1].some(([q]) => q == r)),
      lb = (g && g[0]) || { "/account": "Account", "/profile": "Account", "/privacy": "About", "/parent": "Shared view" }[r];
    if (lb) h1.insertAdjacentHTML("beforebegin", `<p class="eyebrow pe">${lb}</p>`);
  }
  $("#th").onclick = () => {
    setTheme(document.documentElement.dataset.theme == "dark" ? "light" : "dark");
    render();
  };
  $("#lgb").onclick = () => {
    setLang(LANG == "hi" ? "en" : "hi");
    location.reload();
  };
  $("#hw").onclick = () => howTo(0);
  $("#sk").onclick = palette;
  ["#nv", "#app", "#ft"].forEach((s) => tr($(s)));
  animate();
  scrollTo(0, same ? y : 0);
  remind();
}
document.addEventListener("DOMContentLoaded", render);
