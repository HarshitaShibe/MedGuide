/* Page: Institute view (institute.html) — demo cohort dashboard for coaching institutes. Uses SAMPLE students, clearly labelled. */
const BATCH = (() => {
  const fn = ["Aarav", "Diya", "Kabir", "Ananya", "Vihaan", "Ishita", "Arjun", "Meera", "Reyansh", "Saanvi", "Aditya", "Kavya", "Rohan", "Nisha", "Yash", "Tanvi", "Karan", "Pooja", "Dev", "Riya", "Aman", "Sneha", "Harsh", "Zoya"],
    cats = ["General", "OBC-NCL", "OBC-NCL", "General", "EWS", "SC", "OBC-NCL", "ST"],
    sts = ["Rajasthan", "Uttar Pradesh", "Rajasthan", "Maharashtra", "Rajasthan", "Uttar Pradesh"];
  let s = 7;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return fn.map((n, i) => {
    const pr = Math.round(r() * 9),
      air = Math.round(3000 + r() * 160000);
    return { n: n + " " + "ABCDEGHKMNPRSTV"[i % 15] + ".", air, cat: cats[i % cats.length], st: sts[i % sts.length], pr, docs: Math.min(10, Math.round(pr * 1.1 + r() * 2)), od: pr < 4 && r() > 0.4 ? 1 + Math.round(r()) : 0, ch: Math.round(pr * 2.5 + r() * 4) };
  });
})();
P["/institute"] = () => {
  const f = store.get("mg_if", "all"),
    q = (store.get("mg_iq", "") || "").toLowerCase(),
    risk = (x) => x.od > 0 || x.pr <= 3,
    rows = BATCH.filter((x) => (f == "all" || (f == "risk" && risk(x)) || (f == "noreg" && x.pr < 3)) && (!q || x.n.toLowerCase().includes(q))),
    avg = Math.round(BATCH.reduce((a, x) => a + x.pr, 0) / BATCH.length / 9 * 100),
    rk = BATCH.filter(risk).length,
    dc = Math.round(BATCH.reduce((a, x) => a + x.docs, 0) / (BATCH.length * 10) * 100),
    bk = [0, 0, 0, 0];
  BATCH.forEach((x) => bk[Math.min(3, Math.floor(x.pr / 2.5))]++);
  const mxb = Math.max(...bk);
  return `<div class="dh"><div><p class="eyebrow">For coaching institutes</p><h1>Institute view</h1><p class="m">Track your whole batch through counselling and nudge students who are falling behind.</p></div><span class="tag w" style="flex:0 0 auto">Demo · sample students</span></div>
<div class="kp"><div><b data-count="${BATCH.length}">0</b><span>Students in batch</span></div><div><b data-count="${avg}" data-suf="%">0</b><span>Average roadmap progress</span></div><div><b data-count="${rk}">0</b><span>Need attention</span></div><div><b data-count="${dc}" data-suf="%">0</b><span>Documents ready</span></div></div>
<div class="g2"><div class="card"><div class="ch"><div><p class="eyebrow">Progress</p><h3>Where the batch is</h3></div></div>${["Just started", "Registered", "Planning choices", "Allotment & joining"].map((l, i) => `<div class="fn"><div class="fl"><span>${l}</span><b>${bk[i]}</b></div><div class="ft"><i class="${i == 3 ? "acc" : ""}" data-w="${((100 * bk[i]) / mxb).toFixed(0)}"></i></div></div>`).join("")}</div>
<form class="card" id="af"><p class="eyebrow">Announcement</p><h3>Send a reminder to the batch</h3><label>Message<input id="am" maxlength="120" required placeholder="e.g. MCC Round 2 choice locking closes"></label><div class="row"><label>Due date<input id="ad" type="date" required></label>${SEL("aa", "Send to", [["all", "Whole batch"], ["risk", "Students needing attention"]])}<button class="btn">Send</button></div><p class="s">Live version: adds the date to every selected student’s deadline tracker and alerts them.</p></form></div>
<div class="card"><div class="row" style="align-items:center;margin-bottom:8px"><input id="iq" placeholder="Search students" value="${esc(q)}"><div class="chips" style="flex:0 0 auto;margin:0">${[["all", "All"], ["risk", "Need attention"], ["noreg", "Not registered"]].map(([k, l]) => `<button class="chip ${k == f ? "on" : ""}" data-f="${k}">${l}</button>`).join("")}</div></div><div class="tw"><table><tr><th>Student</th><th>AIR</th><th>Category</th><th>State</th><th>Roadmap</th><th>Docs</th><th>Choices</th><th>Status</th></tr>${rows
    .map((x) => `<tr><td><b>${x.n}</b></td><td>${nf(x.air)}</td><td>${x.cat}</td><td>${x.st}</td><td style="min-width:120px"><div class="bar"><i data-w="${((100 * x.pr) / 9).toFixed(0)}"></i></div><span class="s">${x.pr}/9 steps</span></td><td>${x.docs}/10</td><td>${x.ch}</td><td>${x.od ? `<span class="tag b">${x.od} overdue</span>` : x.pr <= 3 ? `<span class="tag w">Behind</span>` : `<span class="tag o">On track</span>`}</td></tr>`)
    .join("")}</table></div><p class="s" style="margin-top:8px">Sample data for the demo. With an institute licence, students join with a batch code and their progress appears here.</p></div>
<div class="card"><h3>Institute licence</h3><p class="m">₹25,000 (up to 100 students) or ₹50,000 (up to 300) per counselling season. Every student gets Premium.</p><a class="btn sec" href="pricing.html">See plans</a></div>`;
};
P["/institute"].after = () => {
  document.querySelectorAll("[data-f]").forEach(
    (b) =>
      (b.onclick = () => {
        store.set("mg_if", b.dataset.f);
        render();
      }),
  );
  const iq = $("#iq");
  iq.oninput = () => {
    store.set("mg_iq", iq.value);
    const p = iq.selectionStart;
    render();
    const n = $("#iq");
    n.focus();
    n.setSelectionRange(p, p);
  };
  $("#af").onsubmit = (e) => {
    e.preventDefault();
    const n = $("#aa").value == "risk" ? BATCH.filter((x) => x.od > 0 || x.pr <= 3).length : BATCH.length;
    toast(`Demo: reminder would reach ${n} students`);
    e.target.reset();
  };
};
