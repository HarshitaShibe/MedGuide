/* Page: My account (account.html) — dashboard, parent sharing, backup */
P["/account"] = () => {
  if (need()) return "";
  const p = PR();
  if (!p)
    return `<div class="card"><h3>Welcome</h3><p class="m">Add your details to see your personal plan.</p><a class="btn" href="profile.html">Add my details</a></div>`;
  const d = D(),
    dc = d.docs || {},
    tot = DOCS.length + condFor().length,
    done = Object.keys(dc).filter((k) => dc[k]).length,
    lo = (p.cat != "General" && p.cat != "EWS") || p.pwd == "yes",
    rg = lo ? "₹500 + ₹5,000" : "₹1,000 + ₹10,000",
    ch = (d.drafts || [{ items: [] }]).reduce((a, x) => a + x.items.length, 0),
    pc = progress(),
    nx = STEPS().find((x) => !x.done),
    up = upcoming(1)[0];
  return `<h1 style="font-size:30px">Hello, ${esc(p.name.split(" ")[0])}</h1><p class="m">NEET ${esc(p.year)} · Score ${esc(p.score)} · AIR ${esc(p.air)}${p.crank ? " · Category rank " + esc(p.crank) : ""} · ${esc(CATS[p.cat])} · Domicile ${esc(p.dom)} · <span class="tag ${isPlus() ? "o" : ""}">${PLAN_NAME()} plan</span></p>
<div class="card"><div class="row" style="align-items:center"><div><b>Roadmap ${pc}% complete</b><br><span class="m">${nx ? "Next: " + nx.t : "All steps done."}</span></div><a class="btn" href="roadmap.html" style="flex:0 0 auto">Open my roadmap</a></div><div class="bar" style="margin-top:10px"><i style="width:${pc}%"></i></div></div>
<div class="kp"><div><b>${up ? dueTxt(up.date) : "—"}</b><span>${up ? "Next: " + esc(up.t) : "No upcoming deadline"}</span></div><div><b>${done}/${tot}</b><span>Documents ready</span></div><div><b>${ch}</b><span>Colleges in choice list</span></div><div><b>${rg}</b><span>AIQ / central registration + refundable security</span></div></div>
<h2>Share with a parent</h2><div class="card"><p class="m">Create a read-only link showing your progress, upcoming deadlines and choice list. The data is inside the link itself, so anyone with the link can see it. It’s a snapshot: share again after updates.</p><div class="row np"><button class="btn" id="sh">Copy parent link</button><a class="btn sec" id="wa" target="_blank" rel="noopener noreferrer">Send on WhatsApp</a></div></div>
<h2>Your data</h2><div class="card"><p class="m">Everything is saved only in this browser. Download a backup before switching device or clearing your browser.</p><div class="row np"><button class="btn sec" id="bk">Download backup</button><label class="btn sec" style="margin:0;font-weight:600">Restore backup<input type="file" id="rs" accept="application/json" hidden></label></div></div>
<div class="row np"><a class="btn sec" href="profile.html">Edit details</a><a class="btn sec" href="pricing.html">Manage plan</a><button class="btn sec" id="lo">Sign out</button><button class="btn x" id="del">Delete account &amp; data</button></div>`;
};
P["/account"].after = () => {
  const lo = $("#lo");
  if (!lo) return;
  const p = PR(),
    d = D(),
    dc = d.docs || {},
    dr = d.drafts || [{ items: [] }],
    link = () =>
      new URL(
        "parent.html#" +
          b64e({
            n: p.name.split(" ")[0],
            y: p.year,
            air: p.air,
            cat: CATS[p.cat],
            dom: p.dom,
            pc: progress(),
            dd: Object.keys(dc).filter((k) => dc[k]).length,
            dt: DOCS.length + condFor().length,
            st: STEPS().map((x) => [x.t.replace(/<[^>]*>/g, ""), x.done]),
            dl: upcoming(5).map((x) => [x.t, x.date]),
            ch: dr[Math.min(d.cur || 0, dr.length - 1)].items.slice(0, 15).map((x) => x.n),
            at: fmtD(new Date().toISOString().slice(0, 10)),
          }),
        location.href,
      ).href;
  $("#wa").href = "https://wa.me/?text=" + encodeURIComponent("My NEET counselling progress on MedGuide: " + link());
  $("#sh").onclick = async () => {
    try {
      await navigator.clipboard.writeText(link());
      toast("Parent link copied");
    } catch (e) {
      prompt("Copy this link:", link());
    }
  };
  $("#bk").onclick = () => download("medguide-backup.json", JSON.stringify({ v: 1, data: D() }, null, 2), "application/json");
  $("#rs").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (!j || typeof j.data != "object") throw 0;
      if (!confirm("Replace the data in this account with the backup?")) return;
      setD(j.data);
      toast("Backup restored");
      render();
    } catch (er) {
      toast("That file isn’t a MedGuide backup");
    }
  };
  lo.onclick = () => {
    U = null;
    store.set("mg_s", null);
    go("index.html");
  };
  $("#del").onclick = () => {
    if (!confirm("Delete this account and all saved data from this browser?")) return;
    const us = store.get("mg_users", {});
    delete us[U];
    store.set("mg_users", us);
    try {
      localStorage.removeItem(key());
    } catch (e) {}
    U = null;
    store.set("mg_s", null);
    go("index.html");
  };
};
