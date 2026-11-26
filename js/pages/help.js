/* Page: Help & experts (help.html) — tabs: Questions & answers · Ask an expert · Videos */
const HTABS = [
  ["qa", "Questions & answers"],
  ["expert", "Ask an expert"],
  ["videos", "Videos"],
];
const SLOTS = ["10:00–11:00", "12:00–13:00", "15:00–16:00", "17:00–18:00", "19:00–20:00"];
P["/help"] = () => {
  const t = tabOf(HTABS.map((x) => x[0]), "qa"),
    q = (store.get("mg_hq", "") || "").toLowerCase(),
    cats = [...new Set(QA.map((x) => x[2]))],
    fc = store.get("mg_hc", "All"),
    list = QA.filter((x) => (fc == "All" || x[2] == fc) && (!q || (x[0] + " " + x[1]).toLowerCase().includes(q))),
    ss = (U && D().sessions) || [],
    tmr = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const body = {
    qa: `<div class="card"><input id="hq" placeholder="Search questions, e.g. refund, float, documents" value="${esc(q)}"><div class="chips">${["All", ...cats].map((c) => `<button class="chip ${c == fc ? "on" : ""}" data-c="${c}">${c}</button>`).join("")}</div></div>
<div class="card">${list.length ? list.map(([a, b, c]) => `<details><summary>${a}</summary><p class="m"><span class="tag">${c}</span> ${b}</p></details>`).join("") : `<p class="m">No answer found. <a href="#expert">Ask an expert</a> instead.</p>`}</div><p class="s">Answers summarise the ${BULL}. Confirm on the official site before acting.</p>`,
    expert: `<div class="g2"><div class="card"><p class="eyebrow">1:1 with a counsellor</p><h3>Book a 1:1 session</h3><p class="m">30 minutes on a video or phone call with an experienced NEET counsellor: your choice list, State vs AIQ, or a tricky allotment decision.</p><div class="kp" style="margin:12px 0"><div><b>₹1,000</b><span>per session</span></div><div><b>30 min</b><span>video or phone</span></div><div><b>EN · हिं</b><span>language</span></div></div><p class="s">You pay only after the counsellor confirms a slot.</p></div>
<form class="card" id="bf"><label>What do you need help with?<select id="bt">${["Choice list review", "AIQ vs State strategy", "After-allotment decision", "Documents and eligibility", "Something else"].map((x) => `<option>${x}</option>`).join("")}</select></label><div class="row"><label>Preferred date<input id="bd" type="date" min="${tmr}" value="${tmr}" required></label>${SEL("bs", "Time slot", SLOTS)}${SEL("bl", "Language", ["English", "Hindi"])}</div><label>Your question <small>(optional)</small><textarea id="bq" rows="3" maxlength="600" placeholder="Share your AIR, category and what you are unsure about"></textarea></label><p style="margin:12px 0 0"><button class="btn">Request session</button></p></form></div>
${ss.length ? `<h2>Your requests</h2><div class="card">${ss.slice().reverse().map((x) => `<div class="li"><div><b>${esc(x.t)}</b><br><span class="m">${fmtD(x.d)} · ${esc(x.s)} · ${esc(x.l)}</span></div><span class="tag w">${esc(x.st)}</span></div>`).join("")}</div>` : ""}
${EXPERT_WHATSAPP ? "" : `<p class="s">Demo: requests are saved on this device. Set EXPERT_WHATSAPP in js/data.js to send them to your counsellor team on WhatsApp.</p>`}`,
    videos: `${videoCard()}<div class="card"><h3>New to MedGuide?</h3><p class="m">A 5-step walkthrough of how MedGuide fits into your counselling.</p><button class="btn sec" id="hw3">${ico("help")} How to use MedGuide</button></div>`,
  };
  return `<p class="eyebrow">Help</p><h1>Help &amp; experts</h1><p class="m">Find an answer fast, or book time with a counsellor.</p>${tabsBar(HTABS, t)}<div class="tabp">${body[t]}</div>`;
};
P["/help"].after = () => {
  const hq = $("#hq");
  if (hq)
    hq.oninput = () => {
      store.set("mg_hq", hq.value);
      const p = hq.selectionStart;
      render();
      const n = $("#hq");
      n.focus();
      n.setSelectionRange(p, p);
    };
  document.querySelectorAll("[data-c]").forEach(
    (b) =>
      (b.onclick = () => {
        store.set("mg_hc", b.dataset.c);
        render();
      }),
  );
  const h3 = $("#hw3");
  if (h3) h3.onclick = () => howTo(0);
  const f = $("#bf");
  if (f)
    f.onsubmit = (e) => {
      e.preventDefault();
      if (!U) return go("signin.html");
      const x = { t: $("#bt").value, d: $("#bd").value, s: $("#bs").value, l: $("#bl").value, q: $("#bq").value.trim(), st: "Requested" },
        d = D(),
        p = PR();
      d.sessions = d.sessions || [];
      d.sessions.push(x);
      setD(d);
      if (EXPERT_WHATSAPP) {
        const msg = `MedGuide 1:1 session request\n${x.t}\n${fmtD(x.d)}, ${x.s} (${x.l})${p ? `\nAIR ${p.air} · ${p.cat} · ${p.dom}` : ""}${x.q ? "\n" + x.q : ""}`;
        window.open(`https://wa.me/${EXPERT_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      }
      toast("Request saved");
      render();
    };
};
