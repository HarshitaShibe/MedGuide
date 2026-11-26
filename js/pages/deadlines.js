/* Page: Deadlines (deadlines.html) — personal tracker, calendar export and browser reminders */
const DL_TPL = [
  "MCC registration & fee payment closes",
  "MCC choice filling & locking closes",
  "MCC seat allotment result",
  "Report to allotted college (MCC)",
  "State counselling registration closes",
  "State choice filling closes",
  "State allotment result",
  "Report to allotted college (State)",
  "Upload documents / willingness (Float)",
];
P["/deadlines"] = () => {
  if (need()) return "";
  const l = DL(),
    np = "Notification" in window ? Notification.permission : "unsupported";
  return `<h1 style="font-size:30px">Deadlines</h1><p class="m">Add each date from the official schedule. MedGuide shows what is due, warns you on every page two days before, and can put everything in your phone’s calendar.</p>
<div class="note">Copy dates only from mcc.nic.in or your State authority’s notice. Schedules are often revised mid-round; update your dates when they are.</div>
<form class="card np" id="df"><div class="row"><label>What is due<input id="dt" list="tpl" required maxlength="120" placeholder="e.g. MCC Round 2 choice locking closes"><datalist id="tpl">${DL_TPL.map((t) => `<option value="${t}">`).join("")}</datalist></label><label>Date<input id="dd" type="date" required></label><label>Official link <small>(optional)</small><input id="dk" type="url" placeholder="https://mcc.nic.in/…"></label><button class="btn">Add</button></div></form>
<div class="card">${
    l.length
      ? l
          .map((x) => {
            const n = dleft(x.date),
              tg = x.done ? ["Done", "o"] : n < 0 ? ["Overdue", "b"] : n <= 2 ? ["Due " + dueTxt(x.date), "w"] : ["", ""];
            return `<div class="li ${x.done ? "done" : ""}"><input type="checkbox" data-c="${x.id}" ${x.done ? "checked" : ""} aria-label="Mark done"><div><b>${esc(x.t)}</b> ${tg[0] ? `<span class="tag ${tg[1]}">${tg[0]}</span>` : ""}<br><span class="m">${fmtD(x.date)} · ${dueTxt(x.date)}${/^https?:\/\//.test(x.link || "") ? ` · <a href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">source</a>` : ""}</span></div><a class="btn sm sec np" href="https://wa.me/?text=${encodeURIComponent(`Reminder: ${x.t}, due ${fmtD(x.date)} (${dueTxt(x.date)}).${/^https?:\/\//.test(x.link || "") ? " " + x.link : ""} — MedGuide`)}" target="_blank" rel="noopener noreferrer" aria-label="Send on WhatsApp" title="Send on WhatsApp">WA</a><button class="btn sm x np" data-r="${x.id}" aria-label="Remove">✕</button></div>`;
          })
          .join("")
      : `<p class="m">No deadlines yet. Add the dates from the current round’s schedule, or use “Add to deadlines” in <a href="notice.html">Explain a notice</a>.</p>`
  }</div>
<h2>Alerts</h2><div class="g"><div class="card"><h3>WhatsApp &amp; SMS</h3><p class="m">Send your upcoming dates as a message to yourself, a parent or a group, so the reminder sits in your chats.</p><div class="row"><a class="btn" id="wa" target="_blank" rel="noopener noreferrer" ${l.some((x) => !x.done && dleft(x.date) >= 0) ? "" : 'aria-disabled="true"'}>Send upcoming on WhatsApp</a><a class="btn sec" id="sm">Send by SMS</a></div></div><div class="card"><h3>Calendar alerts</h3><p class="m">Download all deadlines as a calendar file. Your phone will remind you one day before each date, even when MedGuide is closed.</p><button class="btn" id="ics" ${l.length ? "" : "disabled"}>Add to my calendar (.ics)</button></div><div class="card"><h3>Browser reminders</h3><p class="m">${np == "granted" ? "On. When you open MedGuide, you get a reminder for anything due within 2 days." : np == "denied" ? "Blocked in your browser settings. Use calendar alerts instead." : np == "unsupported" ? "Not supported in this browser. Use calendar alerts instead." : "Get a reminder when you open MedGuide and something is due within 2 days."}</p>${np == "default" ? `<button class="btn sec" id="nt">Turn on reminders</button>` : ""}</div></div>`;
};
P["/deadlines"].after = () => {
  const f = $("#df");
  if (!f) return;
  f.onsubmit = (e) => {
    e.preventDefault();
    const t = $("#dt").value.trim(),
      dt = $("#dd").value,
      k = $("#dk").value.trim();
    if (!t || !dt) return;
    toast(addDeadline(t, dt, k) ? "Deadline added" : "Already in your list");
    render();
  };
  const ch = (id, fn) => {
    const d = D();
    d.dl = (d.dl || []).filter((x) => (x.id == id ? fn(x) : true));
    setD(d);
    render();
  };
  document.querySelectorAll("[data-c]").forEach((c) => (c.onchange = () => ch(c.dataset.c, (x) => ((x.done = c.checked), true))));
  document.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => ch(b.dataset.r, () => false)));
  $("#ics").onclick = () => icsExport(DL().filter((x) => !x.done));
  const up = DL().filter((x) => !x.done && dleft(x.date) >= 0),
    txt = "MedGuide: upcoming counselling dates\n" + up.map((x) => `• ${x.t}: ${fmtD(x.date)} (${dueTxt(x.date)})`).join("\n");
  $("#wa").href = up.length ? "https://wa.me/?text=" + encodeURIComponent(txt) : "#";
  $("#sm").href = "sms:?&body=" + encodeURIComponent(txt);
  const nt = $("#nt");
  if (nt)
    nt.onclick = async () => {
      await Notification.requestPermission();
      render();
    };
};
