/* Page: Sign in (signin.html) */
/* Sign-in illustration: MedGuide's dashboard floating in a calm study room (window, bookshelf).
   Original artwork; colours follow the theme through the --sc-* variables. */
const AUTH_ART = () => `<svg class="land" viewBox="0 0 680 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
<defs>
<linearGradient id="aw" x1="0" y1="0" x2="0" y2="1"><stop style="stop-color:var(--sc-w1)"/><stop offset=".7" style="stop-color:var(--sc-w2)"/><stop offset="1" style="stop-color:var(--sc-w3)"/></linearGradient>
<linearGradient id="ak" x1="0" y1="0" x2="0" y2="1"><stop style="stop-color:var(--sc-k1)"/><stop offset="1" style="stop-color:var(--sc-k2)"/></linearGradient>
<radialGradient id="ag" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(330 420) scale(320 230)"><stop style="stop-color:var(--sc-glow)" stop-opacity=".6"/><stop offset="1" style="stop-color:var(--sc-glow)" stop-opacity="0"/></radialGradient>
<pattern id="ap" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" style="fill:var(--sc-dot)"/></pattern>
<filter id="as" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#0b1a2a" flood-opacity=".28"/></filter>
</defs>
<rect width="680" height="600" fill="url(#aw)"/><rect width="680" height="600" fill="url(#ap)"/><rect width="680" height="600" fill="url(#ag)"/>
<!-- window -->
<g transform="translate(470 176)"><rect width="168" height="196" rx="12" fill="#efe4d0"/><rect x="10" y="10" width="148" height="176" rx="7" fill="url(#ak)"/><circle cx="118" cy="52" r="16" style="fill:var(--sc-sun)"/><g style="fill:var(--sc-cloud)"><ellipse cx="54" cy="58" rx="26" ry="8"/><ellipse cx="68" cy="50" rx="16" ry="9"/></g><g style="fill:var(--sc-star)"><circle cx="36" cy="30" r="1.5"/><circle cx="90" cy="88" r="1.2"/><circle cx="140" cy="110" r="1.2"/></g><path d="M10 150l32-22 24 14 30-26 36 22 26-12v60H10z" style="fill:var(--sc-hill)"/><rect x="81" y="10" width="6" height="176" fill="#efe4d0"/><rect x="10" y="95" width="148" height="6" fill="#efe4d0"/><rect x="-8" y="190" width="184" height="12" rx="4" fill="#e0cfb2"/>
<g transform="translate(112 158)"><path d="M14 30c-4-12 0-22 10-28M24 30c2-10 8-16 18-18" stroke="#53a862" stroke-width="3" fill="none"/><ellipse cx="24" cy="4" rx="8" ry="4" fill="#53a862" transform="rotate(-30 24 4)"/><ellipse cx="42" cy="12" rx="8" ry="4" fill="#6fbf7a" transform="rotate(20 42 12)"/><path d="M4 28h40l-5 16H9z" fill="#e4709f"/></g></g>
<!-- bookshelf -->
<g transform="translate(34 250)"><rect y="70" width="236" height="10" rx="3" fill="#b0855b"/>${[
  [8, 24, 60, "#4f86e8"], [34, 20, 52, "#e4709f"], [56, 26, 66, "#53a862"], [84, 18, 48, "#f0a35b"], [104, 24, 60, "#8b6fd6"], [130, 20, 54, "#e9c440"],
]
  .map(([x, w, h, c]) => `<rect x="${x}" y="${70 - h}" width="${w}" height="${h}" rx="2.5" fill="${c}"/><rect x="${x + 3}" y="${70 - h + 8}" width="${w - 6}" height="3" fill="#fff" opacity=".55"/>`)
  .join("")}<g transform="translate(176 4)" fill="none"><path d="M6 0c18 10 18 24 0 34s-18 24 0 24M30 0c-18 10-18 24 0 34s18 24 0 24" stroke="#4f86e8" stroke-width="3.2"/><path d="M10 6h16M7 17h22M10 28h16M10 40h16M7 50h22" stroke="#e4709f" stroke-width="2.4"/></g><rect x="174" y="62" width="42" height="8" rx="2" fill="#7d8b99"/></g>
<!-- dashboard card -->
<g transform="translate(128 330)" filter="url(#as)"><rect width="370" height="214" rx="18" fill="#fbfaf6"/>
<rect x="18" y="16" width="16" height="16" rx="4" fill="#151513"/><path d="M26 19.5v9M21.5 24h9" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><text x="42" y="29" font-size="12" font-weight="800" fill="#151513" font-family="system-ui,sans-serif">MedGuide</text><rect x="300" y="14" width="52" height="20" rx="10" fill="#151513"/><text x="326" y="28" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">Account</text>
<text x="18" y="60" font-size="13" font-weight="700" fill="#151513" font-family="system-ui,sans-serif">Good evening, Riya</text><text x="18" y="76" font-size="8.5" fill="#6b6a64" font-family="system-ui,sans-serif">NEET 2026 · AIR 25,000 · Rajasthan</text>
${[
  [18, "#dcecfb", "#2f6fdf", "3/9", "Roadmap"],
  [102, "#faf1c2", "#8a6d00", "2 days", "Next deadline"],
  [186, "#dff1d0", "#2f7a2b", "6/10", "Documents"],
  [270, "#fbe1ec", "#b03a74", "12", "Choice list"],
]
  .map(([x, bg, fg, v, l]) => `<rect x="${x}" y="88" width="78" height="58" rx="10" fill="${bg}"/><text x="${x + 10}" y="116" font-size="16" font-weight="500" fill="${fg}" font-family="system-ui,sans-serif">${v}</text><text x="${x + 10}" y="134" font-size="8" font-weight="600" fill="#6b6a64" font-family="system-ui,sans-serif">${l}</text>`)
  .join("")}
<rect x="18" y="156" width="334" height="42" rx="10" fill="#fff" stroke="#ece8de"/><text x="30" y="172" font-size="8.5" font-weight="700" fill="#151513" font-family="system-ui,sans-serif">Result to admission</text>${[0, 1, 2, 3, 4, 5, 6, 7, 8]
  .map((i) => `${i < 8 ? `<rect x="${42 + i * 36}" y="185" width="36" height="2" rx="1" fill="${i < 3 ? "#2f8a3e" : "#e3dfd4"}"/>` : ""}<circle cx="${40 + i * 36}" cy="186" r="6" fill="${i < 3 ? "#2f8a3e" : i == 3 ? "#2f6fdf" : "#fff"}" stroke="${i < 4 ? "none" : "#cfcabd"}" stroke-width="1.5"/>`)
  .join("")}</g>
<!-- floating chips -->
<g transform="translate(30 470)" filter="url(#as)"><rect width="176" height="54" rx="14" fill="#fff"/><rect x="10" y="9" width="36" height="36" rx="10" fill="#fde5cb"/><text x="28" y="25" text-anchor="middle" font-size="8" font-weight="800" fill="#b25a12" font-family="system-ui,sans-serif">DEC</text><text x="28" y="39" text-anchor="middle" font-size="13" font-weight="800" fill="#b25a12" font-family="system-ui,sans-serif">05</text><text x="56" y="25" font-size="9.5" font-weight="700" fill="#151513" font-family="system-ui,sans-serif">Choice locking</text><text x="56" y="40" font-size="8.5" fill="#6b6a64" font-family="system-ui,sans-serif">Round 2 · in 2 days</text></g>
<g transform="translate(456 506)" filter="url(#as)"><rect width="192" height="54" rx="14" fill="#fff"/><circle cx="28" cy="27" r="16" fill="#2f8a3e"/><path d="M21 27l5 5 9-10" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="52" y="24" font-size="9.5" font-weight="700" fill="#151513" font-family="system-ui,sans-serif">Category certificate</text><text x="52" y="39" font-size="8.5" fill="#6b6a64" font-family="system-ui,sans-serif">Uploaded · ready</text></g>
<g transform="translate(560 404)" filter="url(#as)"><rect width="76" height="76" rx="12" fill="#fbf7ee"/><path d="M0 12a12 12 0 0 1 12-12h52a12 12 0 0 1 12 12v10H0z" fill="#e25c5c"/><text x="38" y="16" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">NEET</text><text x="38" y="52" text-anchor="middle" font-size="22" font-weight="800" fill="#253a52" font-family="system-ui,sans-serif">D-30</text><text x="38" y="66" text-anchor="middle" font-size="7.5" font-weight="600" fill="#7d8b99" font-family="system-ui,sans-serif">counselling</text></g>
</svg>`;
P["/signin"] = () => {
  const nw = location.search.includes("new");
  return `<div class="auth"><div class="card af"><p class="eyebrow">${nw ? "Free account" : "Welcome back"}</p><h1>${nw ? "Create your account" : "Sign in"}</h1><p class="m">${nw ? "Save your roadmap, deadlines, documents and choice list in one place." : "Pick up your counselling plan where you left it."}</p><div class="note">Your account is saved on this device only. Don’t reuse an important password.</div><form id="af" novalidate><label>Email<input id="e" type="email" autocomplete="email" required></label><label>Password <small>(min 8 characters)</small><input id="p" type="password" autocomplete="${nw ? "new-password" : "current-password"}" required></label><p id="er" class="s" style="color:var(--bad)" role="alert"></p><button class="btn" style="width:100%">${nw ? "Create free account" : "Sign in"}</button></form><p class="m" style="margin-top:12px"><a href="signin.html${nw ? "" : "?new"}">${nw ? "I already have an account" : "Create an account"}</a></p></div><div class="ap">${AUTH_ART()}<div class="apt"><p>The rank opens the door.<br>The right choice gets you through.</p></div></div></div>`;
};
P["/signin"].after = () => {
  $("#af").onsubmit = async (ev) => {
    ev.preventDefault();
    const e = $("#e").value.trim().toLowerCase(),
      p = $("#p").value,
      nw = location.search.includes("new"),
      us = store.get("mg_users", {});
    if (!/^\S+@\S+\.\S+$/.test(e)) return ($("#er").textContent = "Enter a valid email address.");
    if (p.length < 8) return ($("#er").textContent = "Password must be at least 8 characters.");
    const h = await hash(p);
    if (nw) {
      if (us[e]) return ($("#er").textContent = "That email is already registered.");
      us[e] = h;
      store.set("mg_users", us);
    } else if (us[e] !== h) return ($("#er").textContent = "Email or password is incorrect.");
    U = e;
    store.set("mg_s", e);
    go(PR() ? "account.html" : "profile.html");
  };
};
