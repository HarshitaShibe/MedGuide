/* Page: College finder (predict.html) — where your AIR stands against 2025 AIQ closing ranks. Reference data, not a prediction. */
function parseCSV(t) {
  const rows = [];
  t.replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim())
    .forEach((l) => {
      const o = [];
      let c = "",
        q = false;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i];
        if (q) {
          if (ch == '"' && l[i + 1] == '"') (c += '"'), i++;
          else if (ch == '"') q = false;
          else c += ch;
        } else if (ch == '"') q = true;
        else if (ch == ",") o.push(c.trim()), (c = "");
        else c += ch;
      }
      o.push(c.trim());
      rows.push(o);
    });
  return rows;
}
const CAT_ALIAS = { general: "General", ur: "General", open: "General", gn: "General", ews: "EWS", obc: "OBC-NCL", "obc-ncl": "OBC-NCL", bc: "OBC-NCL", sc: "SC", st: "ST" };
const bdsBlock = (p, open) => {
  const air = +p.air,
    useObc = p.cat == "OBC-NCL",
    rows = BDS_COLLEGES.list.map((c, i) => [c, i, useObc && c[3] ? c[3] : p.cat == "General" || useObc ? c[2] : null]).sort((a, b) => (a[2] || 1e9) - (b[2] || 1e9)),
    hit = rows.filter((r) => r[2] && air <= r[2] * 1.1).length;
  return `<details class="card bds" ${open ? "open" : ""}><summary><span><b>Government dental colleges (BDS AIQ, 2025)</b><br><span class="m">${p.cat == "General" || useObc ? `Your AIR was within or near the closing rank at ${hit} of ${rows.length} colleges.` : "Closing ranks shown for General; your category usually closes later."}</span></span></summary><div class="tw" style="margin-top:10px"><table><tr><th>College</th><th>State</th><th>General</th><th>OBC</th><th>Your fit</th><th class="np"></th></tr>${rows
    .map(([c, i, cr]) => {
      const fx = fitOf(air, cr);
      return `<tr><td><b>${c[0]}</b></td><td>${c[1]}</td><td>${nf(c[2])}</td><td>${nf(c[3])}</td><td>${fx ? `<span class="tag ${fx[1]}">${fx[0]}</span>` : `<span class="s">No ${esc(p.cat)} data</span>`}</td><td class="np"><button class="btn sm sec" data-bds="${i}">+ List</button></td></tr>`;
    })
    .join("")}</table></div><p class="s" style="margin-top:8px">OBC used where the source lists it, otherwise General. Source: ${BDS_COLLEGES.src}.</p></details>`;
};
P["/predict"] = () => {
  const p = PR();
  if (!p)
    return `<h1 style="font-size:30px">College finder</h1><div class="card empty"><p class="m">Add your AIR and category to see where you stand in All India Quota counselling.</p><a class="btn" href="${U ? "profile.html" : "signin.html?new"}">${U ? "Add my details" : "Create free account"}</a></div>`;
  const air = +p.air,
    cat = p.cat,
    bds = /BDS/.test(p.course || ""),
    L5 = AIQ_LAST[cat] || [],
    first = L5.findIndex((x) => x && air <= x),
    last = L5.filter(Boolean).slice(-1)[0],
    yrs = AIQ_YEARS[cat] || [],
    have = yrs.map((v, i) => [AIQ_YEARS.years[i], v]).filter((x) => x[1]),
    within = have.filter((x) => air <= x[1]).length,
    rec = have.slice(-3).map((x) => x[1]),
    avg = rec.length ? Math.round(rec.reduce((a, b) => a + b, 0) / rec.length) : 0,
    lo = Math.min(...rec),
    hi = Math.max(...rec),
    v =
      within == have.length && air <= lo * 0.85
        ? ["Strong position", "o", `Your AIR was inside the government MBBS last rank in all ${have.length} years with data, with a comfortable margin.`]
        : within == have.length
          ? ["Good chance", "o", `Your AIR was inside the last rank in all ${have.length} years with data (${have[0][0]}–${have[have.length - 1][0]}), but late rounds may be needed.`]
          : within > 0
            ? ["Borderline", "w", `Your AIR was inside the last rank in ${within} of ${have.length} years. Recent years closed between AIR ${nf(lo)} and ${nf(hi)}. Keep State quota and BDS options open.`]
            : ["Government AIQ MBBS unlikely", "b", `In the last ${have.length} years the last government MBBS AIQ seat for ${CATS[cat]} closed by AIR ${nf(hi)}. Focus on your State quota, deemed/private colleges, BDS and AYUSH.`],
    mx = Math.max(last || 0, air) * 1.12,
    cut = store.get("mg_cut", null),
    crs = bds ? "BDS" : "MBBS",
    mine = cut ? cut.rows.filter((r) => r.cat == cat && (!r.c || r.c.toUpperCase().includes(crs))).sort((a, b) => a.cr - b.cr) : [],
    showAll = store.get("mg_cut_all", false),
    mineV = showAll ? mine : mine.filter((r) => air <= r.cr * 1.15);
  return `<div class="dh"><div><p class="eyebrow">College finder</p><h1>Where AIR ${nf(air)} stands</h1><p class="m">${esc(CATS[cat])} · Domicile ${esc(p.dom)} · compared with All India Quota closing ranks from 2021–2025. MCC allots AIQ seats by AIR, so category rank is not used here.</p></div><a class="btn sec" href="counselling.html" style="flex:0 0 auto">AIQ vs State: how it works</a></div>
${p.pwd == "yes" ? `<div class="note">PwD seats have their own closing ranks, not included in this data. Use the official MCC allotment results for PwD.</div>` : ""}
${bds ? `<h2 style="margin-top:6px">Your course: BDS</h2>${bdsBlock(p, true)}<h2>MBBS for comparison</h2>` : ""}<div class="card verdict"><div class="ch"><div><p class="eyebrow">All India Quota · government MBBS · last 5 years</p><h3 style="font-size:20px">${v[0]}</h3></div><span class="tag ${v[1]}">${have.length} years of data</span></div><p>${v[2]}</p>
<div class="yrs">${have
    .map(([y, r]) => {
      const m = Math.max(hi, air) * 1.12;
      return `<div class="yr"><div class="yt"><i class="${air <= r ? "in" : ""}" data-h="${((100 * r) / m).toFixed(1)}" style="height:${((100 * r) / m).toFixed(1)}%"></i><em style="bottom:${((100 * air) / m).toFixed(1)}%"></em></div><b>${nf(r)}</b><span>${y}</span></div>`;
    })
    .join("")}</div><p class="s" style="margin:8px 0 14px"><span class="lg in"></span> year your AIR got in &nbsp; <span class="lg"></span> closed before your AIR &nbsp; <span class="lg mk h"></span> your AIR. Average of the last 3 years: AIR ${nf(avg)}.${yrs[0] == null ? " 2021 has no reliable figure for this category." : ""}</p>
<h3 style="margin-top:6px">2025, round by round</h3><div class="rbars">${L5.map((x, i) =>
    x
      ? `<div class="rb"><span>${AIQ_LAST.rounds[i]}</span><div class="rt"><i class="${air <= x ? "in" : ""}" data-w="${((100 * x) / mx).toFixed(1)}"></i><em style="left:${((100 * air) / mx).toFixed(1)}%"></em></div><b>${nf(x)}</b></div>`
      : "",
  ).join("")}<p class="s" style="margin:6px 0 0"><span class="lg in"></span> round reached your AIR &nbsp; <span class="lg"></span> round closed before your AIR &nbsp; <span class="lg mk"></span> your AIR</p></div>
<p class="s" style="margin:10px 0 0">Last AIR given a government MBBS AIQ seat. Sources: ${AIQ_YEARS.src}; ${AIQ_LAST.src}. 2026–27 added about 9,900 MBBS seats, so closing ranks can shift. Past ranks never guarantee a seat.</p></div>
<h2>Government colleges by State (AIQ seats, 2025)</h2>
<div class="card tw"><table><tr><th>State</th><th>Last AIQ rank · ${esc(CATS[cat])}</th><th>Your AIR ${nf(air)}</th></tr>${Object.entries(STATE_AIQ)
    .filter(([k]) => k != "src")
    .map(([s, o]) => [s, o[cat]])
    .sort((a, b) => b[1] - a[1])
    .map(([s, r]) => {
      const f = fitOf(air, r);
      return `<tr ${s == p.dom ? 'class="me"' : ""}><td><b>${s}</b>${s == p.dom ? ' <span class="tag">Your State</span>' : ""}</td><td>${nf(r)}</td><td>${f ? `<span class="tag ${f[1]}">${f[0]}</span>` : "—"}</td></tr>`;
    })
    .join("")}</table><p class="s" style="margin-top:8px">These are 15% AIQ seats at government colleges located in each State, not State-quota cutoffs. ${STATE_AUTH[p.dom] ? `For ${esc(p.dom)}'s 85% State quota, check ${L(STATE_AUTH[p.dom][0] + " ›", STATE_AUTH[p.dom][1])}.` : "For your State quota, check your State authority’s merit list and allotment results."} Source: ${STATE_AIQ.src}.</p></div>
<h2>Top government colleges (AIQ closing ranks, 2025)</h2>
<div class="card tw"><table><tr><th>College</th><th>State</th><th>General</th><th>OBC</th><th>Your fit</th><th class="np"></th></tr>${TOP_COLLEGES.list
    .map((c, i) => {
      const cr = cat == "OBC-NCL" ? c[3] : cat == "General" ? c[2] : null,
        f = fitOf(air, cr);
      return `<tr><td><b>${c[0]}</b></td><td>${c[1]}</td><td>${nf(c[2])}</td><td>${nf(c[3])}</td><td>${f ? `<span class="tag ${f[1]}">${f[0]}</span>` : `<span class="s">No ${esc(cat)} data</span>`}</td><td class="np"><button class="btn sm sec" data-add="${i}">+ List</button></td></tr>`;
    })
    .join("")}</table><p class="s" style="margin-top:8px">Likely: your AIR is well inside the closing rank. Borderline: within about 10%. Reach: beyond it. ${cat == "General" || cat == "OBC-NCL" ? "" : "Only General and OBC closing ranks are available; your category usually closes later at the same college. "}2025 AIQ closing ranks.</p></div>
${bds ? "" : `<h2>Backup option: BDS</h2>${bdsBlock(p, false)}`}
<h2>Full college list from official results</h2>
<div class="card"><p class="m">For every college, load MCC’s official allotment results as a CSV with columns <code>college, state, route, category, closing_rank, year</code>, plus optional <code>course</code> (MBBS/BDS) and <code>fee</code> (annual tuition). State-quota results work too: set route to “State quota”. MedGuide then lists the colleges your AIR reached for your category, and you can add them to your choice list in one click.</p><div class="row np"><button class="btn sec" id="tpl">Download CSV template</button><label class="btn" style="margin:0">Load CSV<input type="file" id="csv" accept=".csv,text/csv" hidden></label>${cut ? `<button class="btn x" id="clr">Remove loaded data</button>` : ""}</div>
${
  cut
    ? `<p class="s" style="margin:12px 0 6px">Loaded “${esc(cut.name)}” · ${cut.rows.length} rows · ${mine.length} for ${esc(CATS[cat])}. <label class="ck" style="display:inline-flex;margin:0 0 0 8px"><input type="checkbox" id="sa" ${showAll ? "checked" : ""}> Show all</label></p>${
        mineV.length
          ? `<div class="tw"><table><tr><th>College</th><th>State</th><th>Route</th><th>Closing rank</th><th>Fee / yr</th><th>Year</th><th>Fit</th><th class="np"></th></tr>${mineV
              .slice(0, 300)
              .map((r) => {
                const f = fitOf(air, r.cr);
                return `<tr><td><b>${esc(r.n)}</b></td><td>${esc(r.s)}</td><td>${esc(r.r)}</td><td>${nf(r.cr)}</td><td>${r.fee ? "₹" + nf(r.fee) : "—"}</td><td>${esc(r.y)}</td><td><span class="tag ${f[1]}">${f[0]}</span></td><td class="np"><button class="btn sm sec" data-ac="${mine.indexOf(r)}">+ List</button></td></tr>`;
              })
              .join("")}</table></div>`
          : `<p class="m">No colleges in this file reached AIR ${nf(air)} for your category. Tick “Show all” to see the full list.</p>`
      }`
    : ""
}</div>`;
};
P["/predict"].after = () => {
  const p = PR();
  if (!p) return;
  const add = (n, r, cr, cy, fee) => {
    if (!U) return go("signin.html");
    const d = D();
    d.drafts = d.drafts || [{ name: "Draft 1", items: [] }];
    d.cur = Math.min(d.cur || 0, d.drafts.length - 1);
    const it = d.drafts[d.cur].items;
    if (it.some((x) => x.n == n)) return toast("Already in your choice list");
    if (!isPlus() && it.length >= 10) return toast("Free plan: up to 10 colleges");
    it.push({ n, r, cr: String(cr || ""), cy, ...(fee ? { fee: String(fee) } : {}) });
    setD(d);
    toast("Added to choice list");
  };
  document.querySelectorAll("[data-add]").forEach(
    (b) =>
      (b.onclick = () => {
        const c = TOP_COLLEGES.list[+b.dataset.add];
        add(c[0], "AIQ", p.cat == "OBC-NCL" ? c[3] : c[2], "2025 AIQ");
      }),
  );
  document.querySelectorAll("[data-bds]").forEach(
    (b) =>
      (b.onclick = () => {
        const c = BDS_COLLEGES.list[+b.dataset.bds];
        add(c[0], "AIQ", p.cat == "OBC-NCL" && c[3] ? c[3] : c[2], "2025 BDS AIQ");
      }),
  );
  const cut = store.get("mg_cut", null);
  document.querySelectorAll("[data-ac]").forEach(
    (b) =>
      (b.onclick = () => {
        const crs = /BDS/.test(p.course || "") ? "BDS" : "MBBS",
          r = cut.rows.filter((x) => x.cat == p.cat && (!x.c || x.c.toUpperCase().includes(crs))).sort((a, b) => a.cr - b.cr)[+b.dataset.ac];
        add(r.n, /state/i.test(r.r) ? "State quota" : /deemed/i.test(r.r) ? "Deemed" : "AIQ", r.cr, r.y + " " + r.r, r.fee);
      }),
  );
  $("#tpl").onclick = () =>
    download(
      "medguide-cutoffs-template.csv",
      "college,state,route,category,closing_rank,year,course,fee\n\"Example Govt Medical College, City\",Rajasthan,AIQ,General,25000,2025,MBBS,60000\n\"Example Govt Medical College, City\",Rajasthan,State quota,OBC,31000,2025,MBBS,60000\n",
      "text/csv",
    );
  $("#csv").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const rows = parseCSV(await f.text()),
      h = (rows.shift() || []).map((x) => x.toLowerCase().replace(/\s+/g, "_")),
      ix = (k) => h.indexOf(k),
      need = ["college", "category", "closing_rank"];
    if (need.some((k) => ix(k) < 0)) return toast("CSV needs columns: college, category, closing_rank");
    const out = rows
      .map((r) => ({
        n: r[ix("college")],
        s: ix("state") >= 0 ? r[ix("state")] : "",
        r: ix("route") >= 0 ? r[ix("route")] : "AIQ",
        cat: CAT_ALIAS[(r[ix("category")] || "").toLowerCase()] || r[ix("category")],
        cr: +String(r[ix("closing_rank")] || "").replace(/[^\d]/g, ""),
        y: ix("year") >= 0 ? r[ix("year")] : "",
        c: ix("course") >= 0 ? r[ix("course")] : "",
        fee: ix("fee") >= 0 ? +String(r[ix("fee")] || "").replace(/[^\d]/g, "") || 0 : 0,
      }))
      .filter((r) => r.n && r.cr > 0);
    if (!out.length) return toast("No usable rows found");
    store.set("mg_cut", { name: f.name, rows: out });
    toast(out.length + " rows loaded");
    render();
  };
  const c = $("#clr");
  if (c)
    c.onclick = () => {
      store.set("mg_cut", null);
      render();
    };
  const sa = $("#sa");
  if (sa)
    sa.onchange = () => {
      store.set("mg_cut_all", sa.checked);
      render();
    };
};
