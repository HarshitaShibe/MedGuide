/* Choice list › "Compare" tab (rendered inside choices.html) — colleges side by side, from your choice list. Figures are what you enter from official sources. */
/* Known facts for a college: COLLEGE_INFO, else its State (from the cutoff lists) for the bond rule. */
const collegeFacts = (n) => {
  const i = COLLEGE_INFO[n] || {},
    row = TOP_COLLEGES.list.find((c) => c[0] == n) || BDS_COLLEGES.list.find((c) => c[0] == n),
    st = row ? row[1] : "",
    bk = i.bond || (/ESIC/.test(n) ? "ESIC" : /AIIMS|JIPMER|BHU|AMU|Jamia/.test(n) ? "Central institute" : st);
  return { city: i.city || st, fee: i.fee, adm: i.adm, hostel: i.hostel, bond: BONDS[bk], bondKey: bk, known: !!COLLEGE_INFO[n] };
};
P["/compare"] = () => {
  const d = D(),
    dr = d.drafts || [{ name: "Draft 1", items: [] }],
    c = dr[Math.min(d.cur || 0, dr.length - 1)],
    p = PR(),
    pl = isPlus(),
    sel = d.cmp || [],
    max = pl ? 8 : 3,
    bud = p && +p.budget,
    rs = c.items.map((x, i) => [x, i, collegeFacts(x.n)]).filter(([, i]) => sel.includes(i)).slice(0, max);
  if (!c.items.length)
    return `<h1>Compare colleges</h1><div class="card"><p class="m" style="margin:0">Add colleges to your list first (from <a href="predict.html">College finder</a> or <a href="#list">My list</a>), then compare them here.</p></div>`;
  const rp = (n) => (n ? "₹" + (+n).toLocaleString("en-IN") : "—"),
    val = (x, k, fx) => (x[k] !== undefined && x[k] !== "" && +x[k] !== 0 ? x[k] : fx[k]),
    mine = (x, k) => x[k] !== undefined && x[k] !== "" && +x[k] !== 0,
    num = (x, i, fx, k, lab) => {
      const v = val(x, k, fx);
      return `<td><input class="ci" type="number" min="0" data-f="${k}" data-i="${i}" value="${v == null ? "" : esc(v)}" placeholder="Add" aria-label="${lab} for ${esc(x.n)}">${!mine(x, k) && fx[k] != null ? `<span class="src">Published fee</span>` : mine(x, k) ? `<span class="src">Your entry</span>` : ""}</td>`;
    };
  return `<h1>Compare colleges</h1><p class="m">Choose up to ${max} colleges from “${esc(c.name)}”. Known fees and bond rules fill in automatically; type over any figure to use your own.${pl ? "" : ` <a href="pricing.html">Premium</a> compares up to 8.`}</p>
<div class="card np pick">${c.items.map((x, i) => `<label class="ck"><input type="checkbox" data-x="${i}" ${sel.includes(i) ? "checked" : ""}> <span>${esc(x.n)}</span> <span class="s">${esc(x.r)}</span></label>`).join("")}</div>
${
  rs.length
    ? `<div class="card tw cmp"><table><tr><th></th>${rs.map(([x]) => `<th>${esc(x.n)}</th>`).join("")}</tr>
<tr><td>Location</td>${rs.map(([x, i, fx]) => `<td>${esc(val(x, "city", fx) || "—")}</td>`).join("")}</tr>
<tr><td>Route</td>${rs.map(([x]) => `<td>${esc(x.r)}</td>`).join("")}</tr>
<tr class="grp"><td colspan="${rs.length + 1}">Cost</td></tr>
<tr><td>Annual tuition (AIQ)</td>${rs.map(([x, i, fx]) => num(x, i, fx, "fee", "Tuition")).join("")}</tr>
<tr><td>Paid at admission</td>${rs.map(([x, i, fx]) => `<td>${rp(fx.adm)}</td>`).join("")}</tr>
<tr><td>Hostel fee (as listed)</td>${rs.map(([x, i, fx]) => num(x, i, fx, "hostel", "Hostel")).join("")}</tr>
<tr><td>Estimated course total</td>${rs.map(([x, i, fx]) => {
        const t = +val(x, "fee", fx) || 0,
          h = +val(x, "hostel", fx) || 0;
        return `<td><b>${t || h ? rp(Math.round(t * 4.5 + h * 5.5)) : "—"}</b>${bud && t > bud ? `<br><span class="tag b">Above your budget</span>` : ""}</td>`;
      }).join("")}</tr>
<tr class="grp"><td colspan="${rs.length + 1}">Commitments</td></tr>
<tr><td>Service bond</td>${rs.map(([x, i, fx]) => `<td>${fx.bond ? esc(fx.bond[0]) + `<span class="src">${esc(fx.bondKey)} rule</span>` : "—"}</td>`).join("")}</tr>
<tr><td>Penalty for leaving</td>${rs.map(([x, i, fx]) => `<td>${fx.bond ? esc(fx.bond[1]) : "—"}</td>`).join("")}</tr>
<tr class="grp"><td colspan="${rs.length + 1}">Admission</td></tr>
<tr><td>Closing rank noted</td>${rs.map(([x]) => `<td>${x.cr ? nf(x.cr) + (x.cy ? `<span class="src">${esc(x.cy)}</span>` : "") : "—"}</td>`).join("")}</tr>
<tr><td>Fit for your AIR</td>${rs.map(([x]) => { const t = pl ? cmpR(p, x) : null; return `<td>${t ? `<span class="tag ${t[1]}">${t[0]}</span>` : pl ? "—" : `<span class="s">Premium</span>`}</td>`; }).join("")}</tr>
</table></div>
<p class="s">Course total = tuition × 4.5 years + hostel × 5.5 years; mess, books and yearly fee revisions are not included. Published fees and 2026 State bond rules; confirm with the college prospectus, including whether a State bond applies to AIQ seats.</p>`
    : `<div class="card"><p class="m" style="margin:0">Tick colleges above to compare them.</p></div>`
}`;
};
P["/compare"].after = () => {
  const lim = isPlus() ? 8 : 3,
    cur = () => {
      const d = D();
      d.drafts = d.drafts || [{ name: "Draft 1", items: [] }];
      d.cur = Math.min(d.cur || 0, d.drafts.length - 1);
      return d;
    };
  document.querySelectorAll("[data-x]").forEach(
    (c) =>
      (c.onchange = () => {
        const d = cur(),
          i = +c.dataset.x;
        d.cmp = (d.cmp || []).filter((x) => x != i);
        if (c.checked) {
          if (d.cmp.length >= lim) {
            c.checked = false;
            toast(`You can compare up to ${lim}`);
            return;
          }
          d.cmp.push(i);
        }
        setD(d);
        render();
      }),
  );
  document.querySelectorAll("[data-f]").forEach(
    (e) =>
      (e.onchange = () => {
        const d = cur();
        d.drafts[d.cur].items[+e.dataset.i][e.dataset.f] = e.value.trim();
        setD(d);
        render();
      }),
  );
};
