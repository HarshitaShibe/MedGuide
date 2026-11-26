/* Page: Explain a notice (notice.html) */
/* Read what a notice is about: who issued it, which round, topic, courses and categories it mentions. Rule-based, no AI. */
function noticeInfo(t) {
  const L = t.toLowerCase(),
    st = Object.keys(STATE_AUTH).find((s) => new RegExp("\\b" + s.replace(/[&]/g, "\\$&").split(" ")[0], "i").test(t) && new RegExp(s.replace(/[&]/g, "\\$&"), "i").test(t)),
    mcc = /medical counselling committee|\bmcc\b|all india quota|\baiq\b|dghs/i.test(t),
    ayush = /\baaccc\b|\b(bams|bhms|bums|bsms)\b|ayush/i.test(t),
    rd = (t.match(/\bround[\s-]*(1|2|3|4|i{1,3}|iv)\b/i) || [])[1],
    stray = /stray vacancy/i.test(t),
    mop = /mop[\s-]?up/i.test(t),
    round = stray ? "Stray Vacancy Round" : mop ? "Mop-up Round" : rd ? "Round " + ({ i: 1, ii: 2, iii: 3, iv: 4 }[rd.toLowerCase()] || rd) : "",
    topics = [
      [/fake|fraud|beware/i, "a warning about fake notices"],
      [/seat matrix/i, "the seat matrix"],
      [/schedule|time ?line|revised dates?|extended|extension/i, "the counselling schedule"],
      [/result of seat allotment|allotment (list|result)|provisional result/i, "seat allotment results"],
      [/refund|security deposit/i, "fees, deposits or refunds"],
      [/document verification|verification of documents/i, "document verification"],
      [/reporting|report to the allotted|joining/i, "reporting and joining"],
      [/registration|choice filling|choice locking/i, "registration and choice filling"],
    ],

    topic = (topics.find((x) => x[0].test(t)) || [null, "counselling"])[1],
    cats = ["OBC", "EWS", "SC", "ST", "PwD", "NRI"].filter((c) => new RegExp("\\b" + c + "\\b", c == "PwD" ? "i" : "").test(t)),
    courses = ["MBBS", "BDS", "B.Sc. Nursing", "BAMS", "BHMS"].filter((c) => new RegExp(c.replace(".", "\\.?"), "i").test(t));
  const auth = ayush ? "AACCC" : mcc ? "MCC" : st ? st : "";
  return {
    auth,
    st: mcc ? null : st,
    mcc,
    ayush,
    round,
    topic,
    cats,
    courses,
    deemed: /deemed/i.test(t),
    title: (auth ? (auth == "MCC" ? "MCC (All India Quota)" : auth == "AACCC" ? "AACCC (AYUSH)" : auth + " State counselling") : "Counselling notice") + (round ? " · " + round : "") + " · " + topic,
    L,
  };
}
/* All dates in a sentence, in order. */
function allDates(x) {
  const re = /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b|\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s*(\d{4})?|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/gi,
    out = [];
  let m;
  while ((m = re.exec(x))) {
    const d = pDate(m[0]);
    if (d && !out.includes(d)) out.push(d);
  }
  return out;
}
/* What a dated line asks the student to do, in plain words. Order = priority. */
const NEV = [
  ["report", /\b(report(ing)?|joining|join the)\b/i, "Report to your allotted college with original documents"],
  ["upload", /\b(upload|willingness|freeze|float)\b/i, "Upload documents and choose Freeze or Float"],
  ["result", /\b(result|allotment (list|will be)|seat allotment (process|will))\b/i, "Check your seat allotment result"],
  ["choice", /\b(choice[s]? (filling|locking)|lock(ing)? (of )?choices|fill(ing)? (of )?choices)\b/i, "Fill and lock your choices"],
  ["reg", /\b(registration|register|payment)\b/i, "Register and pay the fee"],
  ["verify", /\bverification\b/i, "Document verification at the college"],
  ["resign", /\b(resign|resignation|exit)\b/i, "Last date to resign or exit a seat"],
  ["refund", /\brefund/i, "Security deposit refund"],
  ["matrix", /seat matrix/i, "Seat matrix published: check which colleges have seats"],
];
function noticeSteps(S, info) {
  const steps = [];
  S.forEach((x) => {
    const ds = allDates(x);
    if (!ds.length) return;
    const ev = NEV.filter((e) => e[1].test(x)),
      main = ev[0],
      both = ev.find((e) => e[0] == "choice") && ev.find((e) => e[0] == "reg") ? "Register, pay and lock your choices" : null,
      range = ds.length > 1 && /\b(from|between|to|till|until|-)\b/i.test(x),
      closes = /\b(by|before|last date|close[sd]?|closing|till|until|upto|up to|deadline)\b/i.test(x),
      what = both || (main ? main[2] : x.length > 90 ? x.slice(0, 88) + "…" : x),
      due = ds[ds.length - 1],
      when = range ? `${fmtD(ds[0])} – ${fmtD(due)}` : fmtD(due);
    if (steps.some((s) => s.what == what && s.due == due)) return;
    steps.push({ what, due, start: range ? ds[0] : null, when, closes: closes || range, q: x, k: both ? "regchoice" : main ? main[0] : "other" });
  });
  return steps.sort((a, b) => (a.due < b.due ? -1 : 1));
}
/* A one-to-two line summary of the whole notice, in as few words as possible. */
function noticeSummary(info, steps, myLine, myCat) {
  const sd = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    up = steps.filter((x) => dleft(x.due) >= 0),
    w = (x) => (x.start ? `${sd(x.start)}–${sd(x.due)}` : (x.closes ? "by " : "") + sd(x.due)),
    ph = (x) =>
      ({
        regchoice: `register, pay & lock choices ${w(x)}`,
        reg: `register & pay ${w(x)}`,
        choice: `lock choices ${w(x)}`,
        result: `result ${x.start ? w(x) : sd(x.due)}`,
        upload: `upload documents & Freeze/Float ${w(x)}`,
        verify: `document check ${w(x)}`,
        report: `report to college ${w(x)}`,
        resign: `resign ${w(x)}`,
        refund: `refund from ${sd(x.start || x.due)}`,
        matrix: `seat matrix ${sd(x.start || x.due)}`,
      })[x.k] || null,
    noun = {
      "the counselling schedule": "schedule",
      "seat allotment results": "allotment result",
      "registration and choice filling": "registration",
      "reporting and joining": "reporting",
      "document verification": "document verification",
      "fees, deposits or refunds": "fees & refunds",
      "the seat matrix": "seat matrix",
      "a warning about fake notices": "fake-notice warning",
    }[info.topic] || "update",
    head = [info.auth, info.round, noun].filter(Boolean).join(" "),
    acts = up.map(ph).filter(Boolean);
  let txt = head.charAt(0).toUpperCase() + head.slice(1);
  txt += acts.length ? ": " + acts.join(", ") + "." : steps.length ? ": all dates have passed." : ".";
  if (myLine) {
    let l = myLine.replace(new RegExp("^(the\\s+)?(all\\s+)?" + myCat + "(-NCL)?\\s+(category\\s+)?candidates?\\s+(must|shall|should|have to|are required to)?\\s*", "i"), "");
    l = l.replace(/\s+as per\s+/i, " per ").replace(/\.$/, "");
    txt += ` ${esc(myCat)}: ${esc(l.length > 90 ? l.slice(0, 88) + "…" : l)}.`;
  }
  return txt;
}
/* Does it apply, and a short note on why. */
function noticeFor(i) {
  const p = PR();
  if (!p) return ["", "Check", `<a href="${U ? "profile.html" : "signin.html?new"}">Add your details</a> to see whether this notice applies to you.`];
  const myCourse = (p.course || "MBBS").split(" ")[0],
    myCat = p.cat == "OBC-NCL" ? "OBC" : p.cat,
    why = [];
  let v = ["o", "Applies to you"];
  if (i.ayush) (v = ["w", "Only if you want AYUSH"]), why.push("It is about AYUSH courses (BAMS, BHMS…), counselled separately by AACCC.");
  else if (i.mcc) why.push("It is from MCC, and every NEET-qualified candidate can take part in All India Quota counselling.");
  else if (i.st && i.st == p.dom) why.push(`It is from ${esc(p.dom)}, your home State, so it covers your State-quota counselling.`);
  else if (i.st) (v = ["b", "Probably not for you"]), why.push(`It is from ${esc(i.st)}; its State-quota seats usually need ${esc(i.st)} domicile and you are from ${esc(p.dom)}.`);
  else (v = ["w", "Check"]), why.push("It doesn’t say clearly whether it is from MCC or a State.");
  if (i.courses.length && !i.courses.some((c) => c.toUpperCase().startsWith(myCourse.toUpperCase().slice(0, 3)))) (v = ["w", "Check your course"]), why.push(`It mentions ${i.courses.join(", ")}, not ${esc(myCourse)}.`);
  if (i.cats.includes(myCat)) why.push(`It has lines for ${esc(myCat)} candidates, which include you.`);
  return [v[0], v[1], why.join(" ")];
}
P["/notice"] = () =>
  `<h1>Explain a notice</h1><p class="m">Upload or paste an MCC or State notice. MedGuide tells you whether it applies to you, turns its dates into steps you can add to your deadlines, and skips the lines meant for other candidates.</p><div class="card"><div class="drop np" id="dz"><div><b>Upload the notice PDF</b><br><span class="s">Text-based PDFs from mcc.nic.in or your State portal. Scanned images can’t be read.</span></div><label class="btn sec" style="margin:0">Choose PDF<input type="file" id="nf" accept="application/pdf,.txt" hidden></label></div><p class="s" id="nfs" style="margin:8px 0 0"></p><label>Or paste notice text<textarea id="nt" rows="8"></textarea></label><label>Source link <small>(optional)</small><input id="ns" type="url" placeholder="https://mcc.nic.in/…"></label><p style="margin-top:12px"><button class="btn" id="go">Explain this notice</button></p></div><div id="out"></div>`;
P["/notice"].after = () => {
  const load = async (file) => {
    if (!file) return;
    $("#nfs").textContent = "Reading " + file.name + "…";
    try {
      const t = /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name) ? await pdfText(file) : await file.text();
      if (t.replace(/\s/g, "").length < 20) {
        $("#nfs").textContent = "No text found in " + file.name + ". It may be a scanned image; paste the text instead.";
        return;
      }
      $("#nt").value = t;
      $("#nfs").textContent = "Read " + file.name + ". Key points below.";
      $("#go").click();
    } catch (e) {
      $("#nfs").textContent = e.message || "Couldn’t read that file.";
    }
  };
  $("#nf").onchange = (e) => load(e.target.files[0]);
  const dz = $("#dz");
  dz.ondragover = (e) => (e.preventDefault(), dz.classList.add("over"));
  dz.ondragleave = () => dz.classList.remove("over");
  dz.ondrop = (e) => {
    e.preventDefault();
    dz.classList.remove("over");
    load(e.dataTransfer.files[0]);
  };
  $("#go").onclick = () => {
    const t = $("#nt").value.trim();
    if (t.length < 20) {
      $("#out").innerHTML = `<div class="card"><p class="m">Paste at least a few sentences.</p></div>`;
      return;
    }
    const S = t
        .split(/(?<!\b(?:Rs|No|Dr|Sr|vs|i\.e|e\.g)\.)(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
      dr =
        /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s*\d{0,4})\b/i,
      sec = (h, a) =>
        `<div class="card"><h3>${h}</h3>${
          a.length
            ? a
                .slice(0, 8)
                .map((x) => `<p class="m" style="margin:6px 0">“${esc(x)}”</p>`)
                .join("")
            : `<p class="m">Nothing found.</p>`
        }</div>`,
      src = $("#ns").value.trim();
    const info = noticeInfo(t),
      p = PR(),
      myCat = p ? (p.cat == "OBC-NCL" ? "OBC" : p.cat) : null,
      steps = noticeSteps(S, info),
      fv = noticeFor(info),
      portal = info.mcc ? "mcc.nic.in" : info.st && STATE_AUTH[info.st] ? STATE_AUTH[info.st][1].replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "",
      catRe = /\b(SC|ST|OBC|EWS|PwD|PwBD|NRI|UR|General)\b/g,
      forOthers = (x) => {
        const c = [...new Set((x.match(catRe) || []).map((m) => (m == "PwBD" ? "PwD" : m == "UR" ? "General" : m)))];
        if (!c.length || !p) return false;
        return !c.includes(myCat) && !(c.includes("PwD") && p.pwd == "yes") && !(c.includes("General") && (p.cat == "General" || p.cat == "EWS"));
      },
      used = new Set(steps.map((x) => x.q)),
      extra = S.filter((x) => !used.has(x) && x.length > 25 && /\b(must|shall|mandatory|required|only|not allowed|will not|should|fee|deposit|certificate|document|forfeit|refund)\b/i.test(x)),
      mine = extra.filter((x) => !forOthers(x)),
      hidden = extra.length - mine.length,
      myLine = myCat ? mine.find((x) => new RegExp("\\b" + myCat + "\\b").test(x)) : null,
      rest = mine.filter((x) => x != myLine),
      who = [info.auth, info.round].filter(Boolean).join(" "),
      short = (x) => (x.length > 170 ? x.slice(0, 168) + "…" : x),
      g = GLOSSARY.filter((x) => x[0].test(t));
    $("#out").innerHTML = `<div class="card you"><div class="ch"><div><p class="eyebrow">${esc(info.title)}</p><h3>${fv[1] ? `<span class="tag ${fv[0]}">${fv[1]}</span>` : ""}</h3></div></div><p style="margin:0">${fv[2]}</p></div>
<div class="card"><div class="ch"><div><h3>Summary</h3>${portal ? `<p class="s" style="margin:0">Act on ${esc(portal)}</p>` : ""}</div>${steps.some((x) => dleft(x.due) >= 0) ? `<button class="btn sm" id="addall">${U ? "Add dates to deadlines" : "Sign in to add dates"}</button>` : ""}</div><p class="sum">${noticeSummary(info, steps, myLine, myCat)}</p></div>
${
  rest.length
    ? `<div class="card"><h3>Also note</h3><ul class="b">${rest
        .slice(0, 5)
        .map((x) => `<li>${esc(short(x))}</li>`)
        .join("")}</ul>${hidden ? `<p class="s" style="margin:8px 0 0">${hidden} line${hidden > 1 ? "s are" : " is"} only for other categories and ${hidden > 1 ? "are" : "is"} hidden.</p>` : ""}</div>`
    : hidden
      ? `<p class="s">${hidden} line${hidden > 1 ? "s" : ""} in the notice ${hidden > 1 ? "are" : "is"} only for other categories.</p>`
      : ""
}
${g.length ? `<details class="card more"><summary>Terms used in this notice (${g.length})</summary>${g.map((x) => `<div class="li"><div><b>${x[1]}</b><br><span class="m">${x[2]}</span></div></div>`).join("")}</details>` : ""}
<p class="s">This is an automatic reading of the text; the official notice decides.${/^https?:\/\//.test(src) ? ` <a href="${esc(src)}" target="_blank" rel="noopener noreferrer">Open the notice</a>.` : ""} MCC has warned about fake notices: check it appears on mcc.nic.in or your State portal.</p>`;
    const addOne = (i) => addDeadline((who ? who + ": " : "") + steps[i].what, steps[i].due, src);
    document.querySelectorAll("[data-a]").forEach(
      (b) =>
        (b.onclick = () => {
          if (!U) return go("signin.html");
          b.textContent = addOne(+b.dataset.a) ? "Added ✓" : "Added";
          b.disabled = true;
        }),
    );
    const all = $("#addall");
    if (all)
      all.onclick = () => {
        if (!U) return go("signin.html");
        let n = 0;
        steps.forEach((x, i) => dleft(x.due) >= 0 && addOne(i) && n++);
        all.textContent = "Added ✓";
        all.disabled = true;
        toast(n ? `${n} date${n > 1 ? "s" : ""} added to deadlines` : "Already in your deadlines");
      };
  };
};
