/* Page: My roadmap (roadmap.html) — personal step-by-step plan, eligibility and quota summary */
P["/roadmap"] = () => {
  if (need()) return "";
  const p = PR();
  if (!p)
    return `<div class="card"><h3>Start your roadmap</h3><p class="m">Add your rank, category and domicile to see the steps and routes that apply to you.</p><a class="btn" href="profile.html">Add my details</a></div>`;
  const s = STEPS(),
    pc = progress(),
    nx = s.find((x) => !x.done),
    up = upcoming(3),
    rt = routes(p);
  return `<h1 style="font-size:30px">My counselling roadmap</h1><p class="m">From result to admission, in order. Steps with a box are ticked by you; the rest tick themselves from your data.</p>
<div class="card"><div class="row" style="align-items:center"><div><b>${pc}% complete</b> · ${s.filter((x) => x.done).length} of ${s.length} steps</div>${nx ? `<div class="m" style="text-align:right">Next: <b>${nx.t}</b></div>` : `<div class="m" style="text-align:right"><b>All steps done.</b></div>`}</div><div class="bar" style="margin-top:8px"><i style="width:${pc}%"></i></div></div>
<div class="card">${s
    .map(
      (x, i) =>
        `<div class="li step ${x.done ? "done" : ""}"><span class="num" aria-hidden="true">${x.done ? "✓" : i + 1}</span><div><b>${x.t}</b><br><span class="m">${x.m}</span></div>${x.man ? `<label class="ck" style="margin:0"><input type="checkbox" data-s="${x.k}" ${x.done ? "checked" : ""} aria-label="Mark done: ${esc(x.t)}"> Done</label>` : `<span class="tag ${x.done ? "o" : ""}">${x.done ? "Done" : "Auto"}</span>`}${x.h && x.a ? `<a class="btn sm sec np" href="${x.h}" ${x.ext ? 'target="_blank" rel="noopener noreferrer"' : ""}>${x.a}</a>` : ""}</div>`,
    )
    .join("")}</div>
<h2 id="routes">Your eligibility &amp; quota summary</h2>
<div class="card"><p><b>Reservation in AIQ:</b> ${RES[p.cat]}${p.pwd == "yes" ? ". Plus 5% PwD horizontal reservation." : "."}</p><p class="m" style="margin:0">Course: ${esc(p.course || "MBBS")} · Domicile: ${esc(p.dom)} · Preference: ${esc(p.type || "Any")}${p.budget ? ` · Tuition budget ₹${(+p.budget).toLocaleString("en-IN")}/year` : ""}</p></div>
<div class="card">${rt
    .map(
      (r) =>
        `<div class="li"><div><b>${r[0]}</b> <span class="tag ${r[2] ? "o" : "w"}">${r[2] ? "Open to you" : "Confirm eligibility"}</span><br><span class="m">${r[1]}</span></div></div>`,
    )
    .join(
      "",
    )}<p class="s" style="margin-top:8px">“Open to you” means the route has no domicile condition for NEET-qualified candidates. It is guidance from the ${BULL}, not an eligibility decision. Confirm on the official site.</p></div>
${p.type == "Deemed" || p.type == "Any" ? `<div class="note">Deemed universities need a ₹2,00,000 refundable security plus ₹5,000 registration at MCC. ${p.budget ? "Check each college’s tuition against your budget in <a href='choices.html#compare'>Compare</a>." : ""}</div>` : ""}
<h2>Coming up</h2><div class="card">${up.length ? up.map((x) => `<div class="li"><div><b>${esc(x.t)}</b><br><span class="m">${fmtD(x.date)} · ${dueTxt(x.date)}</span></div></div>`).join("") : `<p class="m">No upcoming deadlines saved.</p>`}<p style="margin:10px 0 0"><a href="deadlines.html">Manage deadlines ›</a></p></div>`;
};
P["/roadmap"].after = () =>
  document.querySelectorAll("[data-s]").forEach(
    (c) =>
      (c.onchange = () => {
        const d = D();
        d.steps = d.steps || {};
        d.steps[c.dataset.s] = c.checked;
        setD(d);
        render();
      }),
  );
