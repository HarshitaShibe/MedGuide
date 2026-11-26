/* Page: Plans (pricing.html) */
P["/pricing"] = () => {
  const cur = PLAN(),
    pl = [
      [
        "free",
        "Free",
        "₹0",
        "",
        [
          "Personal roadmap with progress",
          "Eligibility & quota summary for your profile",
          "Deadline tracker, calendar alerts and reminders",
          "Tailored document checklist",
          "Fee calculator and rules guide",
          "After-allotment helper",
          "Notice explainer with plain-language terms",
          "Choice list: 1 draft, up to 10 colleges",
          "Compare up to 3 colleges",
          "Parent view link",
        ],
      ],
      [
        "plus",
        "Premium",
        "₹999",
        "per counselling season",
        [
          "Everything in Free",
          "Unlimited choice-list drafts and colleges",
          "Cutoff notes: reach / target / safer against closing ranks you add",
          "Balance check of your choice list",
          "Compare up to 8 colleges",
          "Print-ready lists",
        ],
      ],
    ];
  const card = (id, name, price, per, feats, cta, tag, note) =>
    `<div class="card plan h ${cur == id ? "cur" : ""}"><div class="pl"><h3>${name} ${tag || (cur == id ? '<span class="tag o">Current</span>' : "")}</h3><div class="pr">${price}</div><p class="s">${per}</p></div><ul class="pf">${feats.map((x) => `<li>${x}</li>`).join("")}</ul><div class="pc">${cta}${note ? `<p class="s">${note}</p>` : ""}</div></div>`;
  return `<h1>Plans</h1><p class="m">Deadlines, documents and rules stay free: no student should miss a step because of price.</p>
<h2>For students</h2>
${pl
  .map(([id, n, pr, per, f]) =>
    card(id, n, pr, per || "forever", f, `<button class="btn ${cur == id ? "sec" : ""}" data-p="${id}" ${cur == id ? "disabled" : ""}>${cur == id ? "Your plan" : id == "free" ? "Use Free" : "Get Premium"}</button>`, "", id == "plus" ? "One payment for the whole season" : ""),
  )
  .join("")}
<h2>For institutes and counsellors</h2>
${card("inst", "Coaching institutes", "₹25,000–50,000", "per season, by batch size", ["Premium for every student in a batch", "Cohort progress dashboard", "Reminders to the whole batch", "Up to 300 students"], `<a class="btn sec" href="institute.html">See the institute view</a>`, '<span class="tag w">Pilot</span>')}
${card("cou", "Counsellors", "₹10,000", "per season", ["Student management and case notes", "Paid 1:1 sessions (₹1,000) booked through MedGuide", "Listing in Help & experts"], `<a class="btn sec" href="help.html#expert">See expert sessions</a>`, '<span class="tag w">Pilot</span>')}
<p class="s" style="margin-top:12px">${PAYMENT_LINK ? "Premium opens a secure payment page." : "Demo build: switching plan here takes no payment."}</p>`;
};
P["/pricing"].after = () =>
  document.querySelectorAll("[data-p]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!U) {
          go("signin.html?new");
          return;
        }
        if (b.dataset.p == "plus" && PAYMENT_LINK) {
          window.open(PAYMENT_LINK, "_blank", "noopener");
          toast("Complete payment in the new tab");
          return;
        }
        const d = D();
        d.plan = b.dataset.p;
        setD(d);
        toast(d.plan == "plus" ? "Premium enabled" : "Switched to Free");
        render();
      }),
  );
