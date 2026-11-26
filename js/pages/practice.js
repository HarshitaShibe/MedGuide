/* Choice list → Practice tab: a mock of MCC-style choice filling and locking. Nothing is sent anywhere. */
let MOCK_T = null;
const MOCK_MIN = 15;
const mockPool = () => {
  const p = PR(),
    bds = p && /BDS/.test(p.course || ""),
    base = (bds ? BDS_COLLEGES.list : TOP_COLLEGES.list).map((c) => [c[0], c[1], p && p.cat == "OBC-NCL" && c[3] ? c[3] : c[2]]),
    d = D(),
    dr = d.drafts || [{ items: [] }],
    mine = dr[Math.min(d.cur || 0, dr.length - 1)].items.map((x) => [x.n, x.r, +x.cr || null]);
  const seen = new Set(),
    out = [];
  [...mine, ...base].forEach((x) => !seen.has(x[0]) && (seen.add(x[0]), out.push(x)));
  return out;
};
P["/practice"] = () => {
  const d = D(),
    m = d.mock || { list: [], locked: false, start: 0 },
    p = PR(),
    pool = mockPool(),
    q = (store.get("mg_mq", "") || "").toLowerCase(),
    left = m.start ? Math.max(0, MOCK_MIN * 60 - Math.floor((Date.now() - m.start) / 1000)) : MOCK_MIN * 60,
    ft = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  if (m.locked) {
    const air = p ? +p.air : 0,
      k = { Likely: 0, Borderline: 0, Reach: 0, "No data": 0 };
    m.list.forEach((x) => {
      const f = air && x[2] ? fitOf(air, x[2]) : null;
      k[f ? f[0] : "No data"]++;
    });
    const tips = [];
    if (m.list.length < 10) tips.push("You filled fewer than 10 choices. Fill every college you would genuinely join; too few raises the risk of no allotment.");
    if (!k.Likely && air) tips.push("No “Likely” colleges in your list. Add safer options at the end.");
    if (m.list.length > 1 && m.list[0][2] && m.list[m.list.length - 1][2] && m.list[0][2] > m.list[m.list.length - 1][2])
      tips.push("Your first choice has a later closing rank than your last. Check the order is your real preference, not the cutoffs.");
    if (!tips.length) tips.push("Good balance. On the real portal, re-check every choice before locking.");
    return `<div class="card"><div class="ch"><div><p class="eyebrow">Practice result</p><h3>Choices locked (practice)</h3></div><span class="tag o">Locked</span></div><div class="kp"><div><b>${m.list.length}</b><span>Choices filled</span></div><div><b>${k.Likely}</b><span>Likely</span></div><div><b>${k.Borderline}</b><span>Borderline</span></div><div><b>${k.Reach}</b><span>Reach</span></div></div><h3>Feedback</h3><ul class="b">${tips.map((t) => `<li>${t}</li>`).join("")}</ul><ol class="steps">${m.list.map((x) => `<li>${esc(x[0])} <span class="s">${x[2] ? "· closing " + (+x[2]).toLocaleString("en-IN") : ""}</span></li>`).join("")}</ol><div class="row np" style="margin-top:12px"><button class="btn" id="mcopy">Copy into my choice list</button><button class="btn sec" id="mreset">Reset practice</button></div></div><p class="s">Practice only. Nothing is sent to MCC. On the real portal, locked choices cannot be changed.</p>`;
  }
  const vis = pool.filter((x) => !m.list.some((y) => y[0] == x[0]) && (!q || x[0].toLowerCase().includes(q)));
  return `<div class="note">Practice the real thing: pick colleges, put them in order, then lock before the timer ends. Like the MCC portal, a locked list can’t be edited. Nothing is sent anywhere.</div>
<div class="card mockbar"><div><p class="eyebrow">Mock choice filling</p><h3>${m.start ? "Practice running" : "Ready when you are"}</h3></div><div class="timer ${left < 120 && m.start ? "low" : ""}"><span id="tm">${ft(left)}</span><small>left</small></div>${m.start ? `<button class="btn" id="mlock" ${m.list.length ? "" : "disabled"}>Lock choices</button>` : `<button class="btn" id="mstart">Start practice</button>`}</div>
<div class="g2 mock"><div class="card"><div class="ch"><h3>Available colleges</h3><span class="s">${pool.length}</span></div><input id="mq" placeholder="Search colleges" value="${esc(q)}" style="margin-bottom:8px"><div class="mlist">${
    vis.length
      ? vis.slice(0, 60).map((x) => `<div class="mi"><div><b>${esc(x[0])}</b><br><span class="s">${esc(x[1])}${x[2] ? " · closing " + (+x[2]).toLocaleString("en-IN") : ""}</span></div><button class="btn sm sec" data-ma="${esc(x[0])}" ${m.start ? "" : "disabled"}>Add</button></div>`).join("")
      : `<p class="m">No colleges match.</p>`
  }</div></div><div class="card"><div class="ch"><h3>Your choices</h3><span class="s">${m.list.length} filled</span></div><div class="mlist">${
    m.list.length
      ? m.list
          .map((x, i) => `<div class="mi"><b class="ord">${i + 1}</b><div><b>${esc(x[0])}</b><br><span class="s">${esc(x[1])}</span></div><span class="np"><button class="btn sm sec" data-mu="${i}" ${i ? "" : "disabled"} aria-label="Up">↑</button> <button class="btn sm sec" data-md="${i}" ${i < m.list.length - 1 ? "" : "disabled"} aria-label="Down">↓</button> <button class="btn sm x" data-mr="${i}" aria-label="Remove">✕</button></span></div>`)
          .join("")
      : `<p class="m">${m.start ? "Add colleges from the left, in the order you prefer." : "Press Start practice to begin."}</p>`
  }</div></div></div>`;
};
P["/practice"].after = () => {
  clearInterval(MOCK_T);
  const g = () => D().mock || { list: [], locked: false, start: 0 },
    sv = (m) => {
      const d = D();
      d.mock = m;
      setD(d);
      render();
    },
    pool = mockPool();
  const st = $("#mstart");
  if (st) st.onclick = () => sv({ list: [], locked: false, start: Date.now() });
  const lk = $("#mlock"),
    lock = () => {
      const m = g();
      m.locked = true;
      clearInterval(MOCK_T);
      sv(m);
    };
  if (lk) lk.onclick = () => confirm("Lock your choices? On the real portal this can’t be undone.") && lock();
  const q = $("#mq");
  if (q)
    q.oninput = () => {
      store.set("mg_mq", q.value);
      const pos = q.selectionStart;
      render();
      const n = $("#mq");
      n.focus();
      n.setSelectionRange(pos, pos);
    };
  document.querySelectorAll("[data-ma]").forEach(
    (b) =>
      (b.onclick = () => {
        const m = g(),
          x = pool.find((c) => c[0] == b.dataset.ma);
        if (x) m.list.push(x);
        sv(m);
      }),
  );
  const mv = (i, j) => {
    const m = g();
    [m.list[i], m.list[j]] = [m.list[j], m.list[i]];
    sv(m);
  };
  document.querySelectorAll("[data-mu]").forEach((b) => (b.onclick = () => mv(+b.dataset.mu, +b.dataset.mu - 1)));
  document.querySelectorAll("[data-md]").forEach((b) => (b.onclick = () => mv(+b.dataset.md, +b.dataset.md + 1)));
  document.querySelectorAll("[data-mr]").forEach(
    (b) =>
      (b.onclick = () => {
        const m = g();
        m.list.splice(+b.dataset.mr, 1);
        sv(m);
      }),
  );
  const rs = $("#mreset");
  if (rs) rs.onclick = () => sv({ list: [], locked: false, start: 0 });
  const cp = $("#mcopy");
  if (cp)
    cp.onclick = () => {
      if (!U) return go("signin.html");
      const d = D(),
        m = g();
      d.drafts = d.drafts || [{ name: "Draft 1", items: [] }];
      const name = "Practice list";
      if (isPlus()) {
        d.drafts.push({ name, items: [] });
        d.cur = d.drafts.length - 1;
      }
      const it = d.drafts[Math.min(d.cur || 0, d.drafts.length - 1)].items;
      m.list.forEach((x) => !it.some((y) => y.n == x[0]) && (isPlus() || it.length < 10) && it.push({ n: x[0], r: /State/.test(x[1]) ? x[1] : "AIQ", cr: x[2] ? String(x[2]) : "", cy: "2025" }));
      d.cmp = [];
      setD(d);
      toast(isPlus() ? "Saved as a new draft" : "Added to your list (Free: up to 10)");
      location.hash = "list";
    };
  const m = g(),
    tm = $("#tm");
  if (m.start && !m.locked && tm) {
    const tick = () => {
      const left = Math.max(0, MOCK_MIN * 60 - Math.floor((Date.now() - m.start) / 1000));
      tm.textContent = String(Math.floor(left / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0");
      if (!left) {
        clearInterval(MOCK_T);
        toast(m.list.length ? "Time’s up: choices auto-locked" : "Time’s up");
        if (m.list.length) lock();
      }
    };
    MOCK_T = setInterval(tick, 1000);
  }
};
