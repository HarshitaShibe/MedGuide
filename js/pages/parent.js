/* Page: Parent view (parent.html#<data>) — read-only snapshot a student shares. Data travels inside the link only. */
P["/parent"] = () => {
  let s;
  try {
    s = b64d(location.hash.slice(1));
  } catch (e) {}
  if (!s || !s.n)
    return `<div class="card"><h3>Parent view</h3><p class="m">This link is incomplete. Ask your child to share it again from MedGuide (My account → Share with parent).</p></div>`;
  return `<h1 style="font-size:30px">${esc(s.n)}’s counselling progress</h1><p class="m">Snapshot shared on ${esc(s.at)}. Read-only; ask ${esc(s.n)} for a fresh link to see updates.</p>
<div class="kp"><div><b>${+s.pc}%</b><span>Roadmap complete</span></div><div><b>${esc(s.air)}</b><span>All India Rank (NEET ${esc(s.y)})</span></div><div><b>${esc(s.cat)}</b><span>Category · Domicile ${esc(s.dom)}</span></div><div><b>${+s.dd}/${+s.dt}</b><span>Documents ready</span></div></div>
<h2>Steps</h2><div class="card">${(s.st || []).map((x, i) => `<div class="li step ${x[1] ? "done" : ""}"><span class="num">${x[1] ? "✓" : i + 1}</span><div>${esc(x[0])}</div></div>`).join("")}</div>
<h2>Upcoming deadlines</h2><div class="card">${(s.dl || []).length ? s.dl.map((x) => `<div class="li"><div><b>${esc(x[0])}</b><br><span class="m">${fmtD(x[1])} · ${dueTxt(x[1])}</span></div></div>`).join("") : `<p class="m">None saved.</p>`}</div>
<h2>Choice list (in order)</h2><div class="card">${(s.ch || []).length ? `<ol style="margin:0;padding-left:20px">${s.ch.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : `<p class="m">No colleges listed yet.</p>`}</div>
<div class="note">Only official MCC and State counselling websites can register, fill or lock choices. MedGuide is a planning aid.</div>`;
};
