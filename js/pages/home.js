/* Page: Dashboard (index.html). Signed in: personal stats. Signed out: national picture + tools. */
const JL = ["Details", "Routes", "MCC reg.", "State reg.", "Documents", "Plan list", "Lock", "Decide", "Join"];
const HERO_ART = `<svg class="art" viewBox="0 0 360 260" aria-hidden="true">
<defs><linearGradient id="ha" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4f7cff"/><stop offset="1" stop-color="#14b8a6"/></linearGradient></defs>
<circle cx="250" cy="120" r="110" fill="url(#ha)" opacity=".14"/>
<rect x="120" y="40" width="170" height="200" rx="18" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>
<rect x="170" y="28" width="70" height="26" rx="10" fill="url(#ha)"/>
<g stroke-linecap="round" stroke-width="7"><path d="M150 96h18" stroke="#14b8a6"/><path d="M182 96h80" stroke="var(--line)"/><path d="M150 132h18" stroke="#14b8a6"/><path d="M182 132h64" stroke="var(--line)"/><path d="M150 168h18" stroke="var(--line)"/><path d="M182 168h72" stroke="var(--line)"/><path d="M150 204h18" stroke="var(--line)"/><path d="M182 204h52" stroke="var(--line)"/></g>
<path d="M78 70v54a34 34 0 0 0 68 0" fill="none" stroke="#4f7cff" stroke-width="7" stroke-linecap="round"/>
<path d="M112 158v34a26 26 0 0 0 52 0v-6" fill="none" stroke="#4f7cff" stroke-width="7" stroke-linecap="round"/>
<circle cx="164" cy="178" r="12" fill="var(--surface)" stroke="#14b8a6" stroke-width="6"/>
<circle cx="78" cy="66" r="6" fill="#4f7cff"/><circle cx="146" cy="66" r="6" fill="#4f7cff"/>
<g fill="url(#ha)"><rect x="300" y="30" width="34" height="34" rx="9"/></g><path d="M317 38v18M308 47h18" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
<circle cx="40" cy="200" r="8" fill="#14b8a6" opacity=".5"/><circle cx="330" cy="210" r="5" fill="#4f7cff" opacity=".6"/></svg>`;
const quick = () => {
  const a = +String($("#qa").value).replace(/\D/g, ""),
    c = $("#qc").value,
    o = $("#qkr");
  if (!a) return (o.innerHTML = `<span class="m">Type your All India Rank to see how it compares.</span>`);
  const y = AIQ_YEARS[c] || [],
    h = y.map((v, i) => [AIQ_YEARS.years[i], v]).filter((x) => x[1]),
    w = h.filter((x) => a <= x[1]).length;
  o.innerHTML = `<b>${w} of ${h.length}</b> recent years: AIR ${nf(a)} was within the last government MBBS rank in All India Quota (${esc(c)}, final round). <a href="predict.html">See colleges and State quota →</a>`;
};
const landing = () => `<section class="gh">${STUDY("h")}<h1>The rank opens the door.<br>The right choice gets you through.</h1>

<div class="gcard"><p class="scr">Start with your rank</p>
<form class="qk" id="qkf"><input id="qa" inputmode="numeric" placeholder="Your NEET All India Rank" aria-label="All India Rank"><select id="qc" aria-label="Category">${Object.keys(CATS)
  .map((k) => `<option>${k}</option>`)
  .join("")}</select><button class="btn sm" type="submit">Check</button></form><p class="qkr" id="qkr"></p>
<p class="s" style="margin:6px 0 0">Or open a tool</p><div class="fold">${[
  ["/roadmap", "Roadmap"],
  ["/predict", "Colleges"],
  ["/notice", "Notices"],
  ["/documents", "Documents"],
]
  .map(([h, t]) => `<a href="${FILE(h)}">${ico(h)}${t}</a>`)
  .join("")}</div>
<ul class="qs"><li><a href="counselling.html#cmp"><span>AIQ or State quota — which should I fill?</span></a></li><li><a href="counselling.html#rules"><span>What happens if I don’t join an allotted seat?</span></a></li></ul></div></section>
<div class="sh"><h2>One place for your <span class="hl hp">whole counselling</span></h2><p>From the result to the day you join, MedGuide turns official <a href="counselling.html">rules</a>, <a href="deadlines.html">dates</a> and <a href="notice.html">notices</a> into steps you can act on.</p></div>
<div class="fg2"><a class="card fcard" href="roadmap.html"><h3>Your roadmap</h3><p>Every step from result to joining, in order, with progress you can see.</p><div class="shot sb"><div class="mini"><div class="r"><span>✓ Add your details</span><b>Done</b></div><div class="r"><span>✓ MCC registration</span><b>Done</b></div><div class="r"><span>● Fill and lock choices</span><b>Next</b></div><div class="r"><span>○ Report to college</span><b></b></div></div></div></a>
<a class="card fcard" href="predict.html"><h3>College finder</h3><p>Your AIR against five years of closing ranks, for AIQ and your State.</p><div class="shot sg"><div class="mini">${AIQ_YEARS.years
  .map((y, i) => `<div class="r"><span>${y}</span><b>${AIQ_YEARS.General[i] ? nf(AIQ_YEARS.General[i]) : "—"}</b></div>`)
  .join("")}</div></div></a></div>
<div class="fg3"><a class="card fcard" href="notice.html"><h3>Explain a notice</h3><p>Upload the PDF. Get a short summary, what applies to you, and the dates.</p><div class="shot sp2" style="min-height:96px"><div class="mini" style="min-height:80px"><span class="s">Example</span><br><span class="hl">Choice locking closes 18 Sep, 11:55 PM.</span> Fee is refundable if you don’t join.</div></div></a>
<a class="card fcard" href="deadlines.html"><h3>Deadlines</h3><p>Warnings before a date passes, with calendar, WhatsApp and SMS alerts.</p><div class="shot so" style="min-height:96px"><div class="mini" style="min-height:80px"><span class="s">Example</span><div class="r"><span>Round 2 reporting</span><b>3 days</b></div><div class="r"><span>Document check</span><b>Today</b></div></div></div></a>
<a class="card fcard" href="documents.html"><h3>Documents</h3><p>Only the certificates that apply to you, uploaded once, downloaded as one ZIP.</p><div class="shot sy" style="min-height:96px"><div class="mini" style="min-height:80px"><div class="r"><span>NEET admit card</span><b>✓</b></div><div class="r"><span>Category certificate</span><b>Upload</b></div></div></div></a></div>
<div class="sh"><h2>The numbers behind <span class="hl hb">every seat</span></h2><p>NEET-UG 2026, from NTA results and the NMC seat matrix.</p></div>
<div class="garden"><div class="tile sb"><b data-count="${NEET_STATS.qual}" data-fmt="lakh">0</b><span>Candidates qualified</span><p class="tn">out of ${(NEET_STATS.reg / 1e5).toFixed(2)}L registered</p></div>${mccCard()}</div>
<div class="garden r2">${videoCard()}<div class="tile sy"><b data-count="${NEET_STATS.mbbs + NEET_STATS.bds}" data-fmt="lakh">0</b><span>MBBS + BDS seats</span><p class="tn">≈ ${(NEET_STATS.qual / (NEET_STATS.mbbs + NEET_STATS.bds)).toFixed(1)} qualified candidates per seat</p></div></div>
<div class="sh"><h2>Questions, <span class="hl hp">answered</span></h2><p>The basics before you start. More in <a href="help.html">Help &amp; experts</a>.</p></div><div class="faqw">${faq()}</div>
<section class="cta2"><h2>Start planning your<br><span class="hl hy">counselling</span> today</h2><a class="btn" href="${U ? "profile.html" : "signin.html?new"}">${U ? "Add my details" : "Create free account"}</a></section>`;
const ring = (pc, size = 120) => {
  const c = 2 * Math.PI * 52;
  return `<svg class="ring" viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true"><circle cx="60" cy="60" r="52" class="rbg"/><circle cx="60" cy="60" r="52" class="rfg" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${c * (1 - pc / 100)}"/></svg>`;
};
const natCard = () => {
  const N = NEET_STATS,
    seats = N.mbbs + N.bds,
    rows = [
      ["Registered", N.reg],
      ["Appeared", N.app],
      ["Qualified", N.qual],
      ["MBBS + BDS seats", seats],
    ];
  return `<div class="card"><div class="ch"><div><p class="eyebrow">NEET-UG 2026 · India</p><h3>From registration to a seat</h3></div><span class="pill">≈ ${(N.qual / seats).toFixed(1)} qualified per seat</span></div>${rows
    .map(
      ([l, v], i) =>
        `<div class="fn"><div class="fl"><span>${l}</span><b data-count="${v}" data-fmt="lakh">0</b></div><div class="ft"><i class="${i == 3 ? "acc" : ""}" data-w="${Math.max(3, (100 * v) / N.reg).toFixed(1)}"></i></div></div>`,
    )
    .join("")}<p class="s" style="margin:10px 0 0">Source: ${N.src}.</p></div>`;
};
const standCard = (p) => {
  const air = +p.air,
    yrs = AIQ_YEARS[p.cat] || [],
    have = yrs.map((v, i) => [AIQ_YEARS.years[i], v]).filter((x) => x[1]),
    w = have.filter((x) => air <= x[1]).length,
    rec = have.slice(-3).map((x) => x[1]),
    avg = rec.length ? Math.round(rec.reduce((a, b) => a + b, 0) / rec.length) : 0,
    st = STATE_AIQ[p.dom] && STATE_AIQ[p.dom][p.cat],
    v = w == have.length ? ["Good chance", "o"] : w > 0 ? ["Borderline", "w"] : ["Unlikely", "b"];
  return `<a class="card" href="predict.html"><div class="ch"><div><p class="eyebrow">Where you stand · AIQ, last 5 years</p><h3>Government MBBS <span class="tag ${v[1]}">${v[0]}</span></h3></div><span class="pill">College finder →</span></div><div class="kp" style="margin:0"><div><b>${nf(air)}</b><span>Your AIR</span></div><div><b>${nf(avg)}</b><span>Avg last govt AIQ rank, ${esc(p.cat)} (3 yrs)</span></div>${st ? `<div><b>${nf(st)}</b><span>Last AIQ rank in ${esc(p.dom)} govt colleges, 2025</span></div>` : ""}</div><p class="s" style="margin:10px 0 0">Inside the last rank in ${w} of ${have.length} years with data. Past ranks don’t guarantee a seat.</p></a>`;
};
const toolsGrid = () =>
  `<div class="g tools">${[
    ["/roadmap", "My roadmap", "Every step from result to joining, with progress."],
    ["/deadlines", "Deadlines", "Warnings before dates pass, plus calendar alerts."],
    ["/documents", "Documents", "Only the certificates that apply to you."],
    ["/predict", "College finder", "Where your AIR stands against 2025 closing ranks."],
    ["/choices", "Choice list", "Order preferences, compare and practise locking."],
    ["/counselling", "Counselling guide", "AIQ vs State, rules, fees and after allotment."],
    ["/notice", "Explain a notice", "Dates, fees and jargon in plain words."],
    ["/help", "Help & experts", "Answers, 1:1 expert sessions and official videos."],
  ]
    .map(([h, a, b]) => `<a class="card tool" href="${FILE(h)}"><span class="ti">${ico(h)}</span><h3>${a}</h3><p class="m">${b}</p><span class="go">Open →</span></a>`)
    .join("")}</div>`;
const mccCard = () =>
  `<div class="card"><div class="ch"><div><p class="eyebrow">Official notices</p><h3>Latest on the MCC board</h3></div>${L('<span class="pill">mcc.nic.in ↗</span>')}</div><ul class="feed">${[
    ["14.09.2026", "UG AIQ Counselling Schedule 2026 Round 2, 3 and Stray vacancy"],
    ["02.09.2026", "AIQ and State Schedule Round 2 UG 2026"],
    ["20.08.2026", "Revised UG Counselling 2026 Information Bulletin"],
    ["", "Notice for verification of documents for Round 2"],
    ["", "Advisory regarding Fake Notice"],
  ]
    .map(([d, t]) => `<li><span class="dot"></span><div>${t}${d ? `<br><span class="s">${d}</span>` : ""}</div></li>`)
    .join("")}</ul><p class="s" style="margin:8px 0 0">Titles as seen on mcc.nic.in. Open them on the official site.</p></div>`;
const faq = () =>
  `<div class="card"><div class="ch"><div><p class="eyebrow">Questions</p><h3>FAQ</h3></div></div>${[
    ["Is MedGuide an official portal?", "No. Register and lock choices only on the MCC or State authority’s official website."],
    ["Can you tell me which college I will get?", "No. Allotment depends on merit, choices and seat availability. MedGuide does not predict or guarantee allotment."],
    ["Do you have college cutoffs?", "Not yet verified. In Premium you can add closing ranks you find on official sources and compare them with your rank."],
    ["Where is my data stored?", "Only in your browser, on this device. Download a backup from My account before switching device."],
  ]
    .map(([q, a]) => `<details><summary>${q}</summary><p class="m">${a}</p></details>`)
    .join("")}</div>`;
P["/"] = () => {
  const p = U && PR();
  if (!p) return landing();
  const d = D(),
    s = STEPS(),
    pc = progress(),
    nx = s.find((x) => !x.done),
    up = upcoming(4),
    n1 = up[0],
    dc = d.docs || {},
    tot = DOCS.length + condFor().length,
    dn = Object.keys(dc).filter((k) => dc[k]).length,
    dr = d.drafts || [{ items: [] }],
    items = dr[Math.min(d.cur || 0, dr.length - 1)].items,
    k = { Reach: 0, Target: 0, "Safer relative": 0 };
  items.forEach((x) => {
    const t = cmpR(p, x);
    if (t) k[t[0]]++;
  });
  const kn = k.Reach + k.Target + k["Safer relative"],
    hr = new Date().getHours(),
    hi = LANG == "hi" ? "नमस्ते" : hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening",
    od = DL().filter((x) => !x.done && dleft(x.date) < 0).length;
  return `<div class="dh"><div><p class="eyebrow">${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p><h1>${hi}, ${esc(p.name.split(" ")[0])}</h1><p class="m">NEET ${esc(p.year)} · AIR ${esc(p.air)} · ${esc(CATS[p.cat])} · ${esc(p.dom)} · <span class="tag ${isPlus() ? "o" : ""}">${PLAN_NAME()}</span></p></div><div class="row" style="flex:0 0 auto"><button class="btn sec" id="hw2" type="button">${ico("help")} How to use</button><a class="btn" href="deadlines.html">+ Add deadline</a></div></div>
<div class="stats">
<a class="card stat" href="roadmap.html"><div class="rw">${ring(pc, 76)}<b class="rv"><span><span data-count="${pc}">0</span>%</span></b></div><div><p class="sl">Roadmap</p><p class="sv">${s.filter((x) => x.done).length}/${s.length} steps</p><p class="s">${nx ? "Next: " + JL[s.indexOf(nx)] : "All done"}</p></div></a>
<a class="card stat" href="deadlines.html"><span class="si ${n1 && dleft(n1.date) <= 2 ? "warn" : ""}">${ico("/deadlines")}</span><div><p class="sl">Next deadline</p><p class="sv">${n1 ? (dleft(n1.date) == 0 ? "Today" : `<span data-count="${dleft(n1.date)}">0</span> day${dleft(n1.date) == 1 ? "" : "s"}`) : "—"}</p><p class="s">${n1 ? esc(n1.t) : "Add dates from official notices"}${od ? ` · <span style="color:var(--bad)">${od} overdue</span>` : ""}</p></div></a>
<a class="card stat" href="documents.html"><span class="si">${ico("/documents")}</span><div style="flex:1"><p class="sl">Documents</p><p class="sv"><span data-count="${dn}">0</span>/${tot} ready</p><div class="bar"><i data-w="${tot ? (100 * dn) / tot : 0}"></i></div></div></a>
<a class="card stat" href="choices.html"><span class="si">${ico("/choices")}</span><div style="flex:1"><p class="sl">Choice list</p><p class="sv"><span data-count="${items.length}">0</span> college${items.length == 1 ? "" : "s"}</p>${kn ? `<div class="stack" title="Reach ${k.Reach} · Target ${k.Target} · Safer ${k["Safer relative"]}"><i class="b" data-w="${(100 * k.Reach) / kn}"></i><i class="w" data-w="${(100 * k.Target) / kn}"></i><i class="o" data-w="${(100 * k["Safer relative"]) / kn}"></i></div><p class="s">${k.Reach} reach · ${k.Target} target · ${k["Safer relative"]} safer</p>` : `<p class="s">${isPlus() ? "Add closing ranks to see balance" : "Premium shows reach / target / safer"}</p>`}</div></a>
</div>
<div class="card"><div class="ch"><div><p class="eyebrow">Your journey</p><h3>Result to admission</h3></div><a class="pill" href="roadmap.html">Open roadmap →</a></div><div class="journey">${s
    .map(
      (x, i) =>
        `<a class="jn ${x.done ? "done" : x == nx ? "now" : ""}" href="roadmap.html" title="${esc(x.t.replace(/<[^>]*>/g, ""))}"><span>${x.done ? "✓" : i + 1}</span><em>${JL[i]}</em></a>`,
    )
    .join("")}</div></div>
<div class="g2">${standCard(p)}<div class="card"><div class="ch"><div><p class="eyebrow">Coming up</p><h3>Deadlines</h3></div><a class="pill" href="deadlines.html">All →</a></div>${
    up.length
      ? up.map((x) => `<div class="dlr"><div class="cal"><b>${new Date(x.date + "T00:00:00").getDate()}</b><span>${new Date(x.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}</span></div><div><b>${esc(x.t)}</b><br><span class="m">${dueTxt(x.date)}</span></div>${dleft(x.date) <= 2 ? '<span class="tag w">Soon</span>' : ""}</div>`).join("")
      : `<div class="empty"><p class="m">No upcoming deadlines. Add the dates from the current round’s schedule.</p><a class="btn sm" href="deadlines.html">Add deadline</a></div>`
  }</div></div>
<div class="g2">${natCard()}${mccCard()}</div>
<h2>Tools</h2>${toolsGrid()}<div class="g2" style="margin-top:14px">${videoCard()}${faq()}</div>
<section class="cta2"><h2>Need a second pair of eyes<br>on your choice list?</h2><a class="btn" href="help.html">Book an expert session</a></section>`;
};
P["/"].after = () => {
  const b = $("#hw2");
  if (b) b.onclick = () => howTo(0);
  const f = $("#qkf");
  if (f) f.onsubmit = (e) => (e.preventDefault(), quick());
};
