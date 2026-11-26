/* Page: AIQ vs State counselling (counselling.html). Facts from the MCC UG 2026 bulletin as summarised elsewhere in MedGuide. */
const stateRows = (p) => {
  const q = (store.get("mg_sq", "") || "").toLowerCase(),
    rows = Object.entries(STATE_AUTH)
      .filter(([s, [n]]) => !q || (s + " " + n).toLowerCase().includes(q))
      .sort((a, b) => (p && a[0] == p.dom ? -1 : p && b[0] == p.dom ? 1 : a[0].localeCompare(b[0])));
  return rows.length
    ? rows.map(([s, [n, u]]) => `<div class="li ${p && s == p.dom ? "me" : ""}"><div><b>${s}</b>${p && s == p.dom ? ' <span class="tag">Your State</span>' : ""}<br><span class="m">${n}</span><br><span class="s">${u.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span></div>${L('<span class="btn sm sec">Open ↗</span>', u)}</div>`).join("")
    : `<p class="m">No State matches.</p>`;
};
const CTABS = [
  ["aiq", "All India Quota (MCC)"],
  ["state", "State counselling"],
  ["cmp", "Side by side"],
  ["both", "Using both"],
  ["rules", "Rules & fees"],
  ["after", "After allotment"],
];
P["/counselling"] = () => {
  const t = tabOf(CTABS.map((x) => x[0]), "aiq"),
    p = PR(),
    sa = p && STATE_AUTH[p.dom],
    body = {
      aiq: `<div class="g2"><div class="card"><p class="eyebrow">Run by</p><h3>Medical Counselling Committee (MCC), DGHS</h3><p class="m">One national counselling on ${L("mcc.nic.in")}. No domicile needed for open seats. Seats are allotted by your All India Rank.</p></div><div class="card"><p class="eyebrow">Seats it fills</p><ul class="b"><li>15% All India Quota seats in government colleges</li><li>AIIMS and JIPMER (open seats)</li><li>Deemed universities (100%)</li><li>Central universities and institutes: DU, AMU, BHU, IP University, ESIC</li><li>B.Sc. Nursing in central institutes</li></ul></div></div>
<div class="card"><h3>How a round works</h3><div class="flow">${["Register & pay", "Fill & lock choices", "Seat allotment", "Freeze or Float", "Upload documents", "Report with originals"].map((x, i) => `<div><span>${i + 1}</span><p>${x}</p></div>`).join("")}</div><p class="m" style="margin:12px 0 0">Four rounds: Round 1, Round 2, Round 3 and the Stray Vacancy Round. Upgradation is possible up to Round 3. No seats revert to States after Round 2.</p></div>
<div class="g2"><div class="card"><h3>Fees at registration</h3><table><tr><th>Route</th><th>Registration (non-refundable)</th><th>Security (refundable)</th></tr><tr><td>Govt / central, UR & EWS</td><td>₹1,000</td><td>₹10,000</td></tr><tr><td>Govt / central, SC/ST/OBC/PwD</td><td>₹500</td><td>₹5,000</td></tr><tr><td>Deemed universities</td><td>₹5,000</td><td>₹2,00,000</td></tr></table></div><div class="card"><h3>Rules to remember</h3><ul class="b"><li>Allotted in Round 2 or later and not joining: security deposit forfeited.</li><li>Round 3: physical reporting is mandatory; no resignation afterwards.</li><li>Stray Vacancy needs fresh registration.</li><li>One registration per candidate; locked choices can’t be changed.</li></ul></div></div>${videoCard()}<p class="s">Source: ${BULL}. <a href="predict.html">See where your AIR stands in AIQ ›</a></p>`,
      state: `<div class="g2"><div class="card"><p class="eyebrow">Run by</p><h3>Your State’s counselling authority</h3><p class="m">Each State runs its own counselling, with its own registration, fee, merit list, rules and website. It is separate from MCC: registering on MCC does not register you in your State.</p>${sa ? `<p style="margin:10px 0 0"><b>${esc(p.dom)}:</b> ${L(sa[0] + " ›", sa[1])} <span class="s">(link checked ${VERIFIED})</span></p>` : ""}</div><div class="card"><p class="eyebrow">Seats it fills</p><ul class="b"><li>The remaining 85% of seats in the State’s government colleges</li><li>State-quota seats in private colleges</li><li>In many States, management and NRI seats too</li></ul><p class="s" style="margin:8px 0 0">Exact seat shares and fees are set by each State. Check its information bulletin.</p></div></div>
<div class="card"><h3>What usually decides eligibility</h3><div class="g">${[
        ["Domicile", "Most States reserve their quota for domicile candidates; the proof needed differs by State."],
        ["State reservation", "Category reservation follows the State’s list, which can differ from the Central list used in AIQ."],
        ["Merit list", "The State makes its own merit list from NEET scores for registered candidates."],
        ["Documents", "Domicile and State category certificates are usually checked at verification."],
      ]
        .map(([a, b]) => `<div class="mini"><b>${a}</b><p class="m">${b}</p></div>`)
        .join("")}</div></div>
<div class="card"><div class="ch"><div><h3>State counselling websites</h3><p class="m" style="margin:0">All ${Object.keys(STATE_AUTH).length} States and UTs with medical colleges.</p></div><input id="sq" placeholder="Find your State" value="${esc(store.get("mg_sq", ""))}" style="max-width:220px"></div><div id="sl">${stateRows(p)}</div><p class="s" style="margin:8px 0 0">Links checked ${VERIFIED}. Some States open a new portal each year; if a link has moved, the authority’s home page links to the current one.</p></div>`,
      cmp: `<div class="card tw"><table><tr><th></th><th>All India Quota (MCC)</th><th>State counselling</th></tr>${[
        ["Run by", "MCC, DGHS (Government of India)", "Each State’s authority"],
        ["Seats", "15% govt seats + AIIMS, JIPMER, deemed, central universities, ESIC", "85% govt seats + private-college State quota (and often management/NRI)"],
        ["Domicile needed?", "No, for open seats", "Usually yes"],
        ["Allotted by", "All India Rank", "State merit list from NEET scores"],
        ["Reservation list", "Central list (SC 15%, ST 7.5%, OBC-NCL 27%, EWS 10%, PwD 5%)", "State’s own list"],
        ["Registration", "On mcc.nic.in", "On the State’s website, separately"],
        ["Rounds", "Round 1, 2, 3 and Stray Vacancy", "Set by the State; usually run alongside MCC rounds"],
        ["Fees", "₹1,000 + ₹10,000 security (UR/EWS); deemed ₹5,000 + ₹2,00,000", "Set by the State"],
      ]
        .map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`)
        .join("")}</table></div>`,
      both: `<div class="card"><h3>Most students should register in both</h3><p class="m">AIQ gives you national seats; your State quota usually gives far more seats for domicile candidates. Taking part in both keeps more options open.</p><ol class="steps">${[
        ["Register in both", "MCC on mcc.nic.in, and your State on its own portal. Two fees, two logins."],
        ["Keep two choice lists", "Your AIQ list and your State list are filled separately. Plan both in the Choice list (Premium allows multiple drafts)."],
        ["Track both schedules", "Add every MCC and State date to Deadlines. MCC publishes a combined AIQ and State schedule; States add their own notices."],
        ["Choose carefully between seats", "If you get seats in both, decide which to keep before the reporting deadline. Read both exit rules first."],
        ["Mind the AIQ late-round rules", "After joining in AIQ Round 3 you can’t take part in other counselling, and Stray Vacancy removes candidates already allotted in a Centre or State list."],
      ]
        .map(([a, b]) => `<li><b>${a}</b><br><span class="m">${b}</span></li>`)
        .join("")}</ol></div><div class="row np"><a class="btn" href="deadlines.html">Add both schedules to Deadlines</a><a class="btn sec" href="#after">After-allotment helper</a></div>`,
    };
  return `<p class="eyebrow">Counselling guide</p><h1>All India Quota vs State counselling</h1><p class="m">Two separate counsellings run at the same time. What each covers, the rules and fees, and what to do once you get a seat.</p>
${tabsBar(CTABS, t)}<div class="tabp">${t == "rules" ? stripH1(P["/guide"]()) + `<h2>Fees &amp; reservation</h2>` + stripH1(P["/fees"]()) : t == "after" ? P["/allotment"]().replace(/<h1[^>]*>/, "<h2 style=\"margin-top:0\">").replace("</h1>", "</h2>") : body[t]}</div>`;
};
P["/counselling"].after = () => {
  const t = tabOf(CTABS.map((x) => x[0]), "aiq");
  if (t == "rules") P["/fees"].after();
  const sq = $("#sq");
  if (sq)
    sq.oninput = () => {
      store.set("mg_sq", sq.value);
      $("#sl").innerHTML = stateRows(PR());
    };
  if (t == "after") P["/allotment"].after();
};
