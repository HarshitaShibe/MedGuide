/* Counselling guide › "After allotment" tab (rendered inside counselling.html) — what to do for your round and decision. Rules from the bulletin. */
P["/allotment"] = () => {
  const s = store.get("mg_al", { r: "1", w: "keep" });
  return `<h1 style="font-size:30px">Got a seat? What to do next</h1><p class="m">Pick your round and what you want. MedGuide shows the matching option and its consequences, as summarised from the ${BULL}.</p>
<div class="card np"><div class="row">${SEL("ar", "Round of allotment (MCC)", [["1", "Round 1"], ["2", "Round 2"], ["3", "Round 3"], ["s", "Stray vacancy round"]], s.r)}${SEL("aw", "What do you want?", [["keep", "Keep this seat, no upgrade"], ["up", "Keep it, but try for a better choice"], ["no", "I don’t want this seat"]], s.w)}</div></div><div id="ao"></div>
<div class="card"><h3>Before you report</h3><ul class="b"><li>All originals plus attested photocopies: <a href="documents.html">document checklist</a></li><li>Allotment letter downloaded from the MCC site</li><li>Reporting date added to <a href="deadlines.html">your deadlines</a></li><li>Only you can report; no one may report on your behalf</li></ul></div>`;
};
P["/allotment"].after = () => {
  const u = () => {
    const r = $("#ar").value,
      w = $("#aw").value;
    store.set("mg_al", { r, w });
    let t, c, x;
    if (r == "s") {
      t = w == "no" ? ["Don’t join", "b"] : ["Join the college", "o"];
      c = w == "no" ? "Not joining means the seat is lost. This is the last round, so there is no later upgrade." : "Report physically and join. There is no upgrade after the stray vacancy round.";
      x = ["Stray vacancy needs fresh registration.", "Candidates already allotted a seat in a Centre or State list are eliminated from it."];
    } else if (w == "keep") {
      t = ["Freeze", "o"];
      c = "Choose Freeze. Join the college physically; documents are checked and the admission fee is paid at the institute. You won’t be considered for upgrades.";
      x = r == "3" ? ["Round 3: physical reporting is mandatory.", "You cannot resign after joining in Round 3, and cannot take part in any other counselling."] : ["Once joined, you are out of further MCC upgrades."];
    } else if (w == "up") {
      if (r == "3") {
        t = ["No upgrade after Round 3", "w"];
        c = "Upgradation is available only up to Round 3. Your Round 3 seat is final: report physically to keep it.";
        x = ["You cannot resign after joining in Round 3."];
      } else {
        t = ["Float", ""];
        c = `Choose Float. Give willingness online and upload documents; the institute verifies them online and may raise queries. You’ll be considered for a better choice in Round ${+r + 1}. If upgraded, the earlier seat is released.`;
        x = ["Upgradation is available up to Round 3.", "Watch the next round’s schedule and add it to your deadlines."];
      }
    } else {
      if (r == "1") {
        t = ["Not joining (Round 1)", "w"];
        c = "The forfeiture rule applies from Round 2 onwards, so not joining a Round 1 seat is treated differently. Check the bulletin’s exit rules for Round 1 before deciding, and register for the next round if you want to continue.";
        x = ["Read the exit and resignation section of the bulletin carefully."];
      } else {
        t = ["Security deposit at risk", "b"];
        c = `Allotted in Round ${r} and not joining means your security deposit is forfeited.`;
        x = r == "3" ? ["After Round 3 there is no resignation, and no other counselling after joining."] : ["Compare the forfeited deposit with the value of keeping the seat and floating for an upgrade."];
      }
    }
    $("#ao").innerHTML = `<div class="card"><span class="tag ${t[1]}">${t[0]}</span><p style="margin:10px 0">${c}</p><ul class="b">${x.map((i) => `<li>${i}</li>`).join("")}</ul><p class="s" style="margin-top:8px">Source: ${BULL}, Ch. 1, 15 and 16. State counselling has its own rules: check your State authority’s bulletin. MedGuide does not make this decision for you.</p>${U ? `<p class="np" style="margin:8px 0 0"><button class="btn sm sec" id="dec">Mark “Decide after allotment” done in my roadmap</button></p>` : ""}</div>`;
    const b = $("#dec");
    if (b)
      b.onclick = () => {
        const d = D();
        d.steps = d.steps || {};
        d.steps.decided = true;
        setD(d);
        toast("Roadmap updated");
      };
  };
  $("#ar").onchange = u;
  $("#aw").onchange = u;
  u();
};
