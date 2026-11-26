/* Page: Documents (documents.html) — checklist with a stored scan for each document (kept in this browser only). */
let DOC_FILES = null;
const DOC_MAX = 5 * 1024 * 1024;
P["/documents"] = () => {
  const d = D().docs || {},
    cd = condFor(),
    f = DOC_FILES || {},
    row = (t, k) => {
      const x = f[k];
      return `<div class="li doc ${x ? "done" : ""}"><span class="dst ${x ? "on" : ""}" role="img" aria-label="${x ? "Uploaded" : "Not uploaded yet"}">${x ? "✓" : ""}</span><div><b>${esc(t)}</b>${x ? `<br><span class="s">${esc(x.name)} · ${kb(x.size)}</span>` : ""}</div><span class="np dact">${
        x
          ? `<button class="btn sm sec" data-v="${k}">View</button><button class="btn sm sec" data-r="${k}" aria-label="Remove file">Remove</button>`
          : `<label class="btn sm sec" style="margin:0">Upload<input type="file" data-u="${k}" accept="application/pdf,image/*" hidden></label>`
      }</span></div>`;
    },
    n = DOCS.filter((_, i) => d["a" + i]).length,
    up = Object.keys(f).length,
    tot = DOCS.length + cd.length;
  return `<h1>Documents</h1><p class="m">Upload a scan of each document. A document is marked ready once its file is here, so you can upload it on the MCC or State portal in seconds and carry everything in one ZIP. ${PR() ? "Certificates are filtered to your profile." : "Sign in to filter certificates to your profile and store scans."}</p>
<div class="kp"><div><b>${up}/${tot}</b><span>Uploaded and ready</span></div><div><b>${kb(Object.values(f).reduce((a, x) => a + (x.size || 0), 0))}</b><span>Stored on this device</span></div><div><b>PDF · JPG · PNG</b><span>Up to 5 MB each</span></div></div>
<div class="card"><h3>Core documents</h3>${DOCS.map((t, i) => row(t, "a" + i)).join("")}</div>
<div class="card"><h3>${PR() ? "Certificates for you" : "If applicable to you"}</h3>${cd.length ? cd.map((c) => row(c[0], "c" + COND.indexOf(c))).join("") : `<p class="m" style="margin:0">None beyond the core list, based on your details.</p>`}</div>
<div class="card zipc"><div><h3>All documents in one file</h3><p class="m" style="margin:0">Download every uploaded scan as a ZIP, named by document, ready to carry on a pen drive or send to yourself.</p></div><button class="btn" id="zip" ${up ? "" : "disabled"}>Download all as ZIP</button></div>
<p class="s">Scans are saved in this browser on this device only; nothing is sent anywhere. Download a backup of your details from My account; scans are not included in it. Source: ${BULL}, FAQ Q32. Your allotted college may ask for more. Regional-language certificates need an attested English/Hindi translation.</p>`;
};
P["/documents"].after = () => {
  if (U && DOC_FILES === null) {
    DOC_FILES = {};
    FS.list(U + "|")
      .then((m) => {
        DOC_FILES = m;
        const d = D();
        d.docs = {};
        Object.keys(m).forEach((k) => (d.docs[k] = true));
        setD(d);
        render();
      })
      .catch(() => {});
  }
  document.querySelectorAll("[data-u]").forEach(
    (i) =>
      (i.onchange = async () => {
        const file = i.files[0],
          k = i.dataset.u;
        if (!file) return;
        if (!U) return go("signin.html");
        if (file.size > DOC_MAX) return toast("File is over 5 MB. Compress it and try again.");
        try {
          await FS.put(U + "|" + k, { name: file.name, type: file.type, size: file.size, at: Date.now(), blob: file });
          DOC_FILES[k] = { name: file.name, size: file.size, type: file.type };
          const d = D();
          d.docs = d.docs || {};
          d.docs[k] = true;
          setD(d);
          toast("Saved");
          render();
        } catch (e) {
          toast("Couldn’t save the file. Your browser storage may be full.");
        }
      }),
  );
  document.querySelectorAll("[data-v]").forEach(
    (b) =>
      (b.onclick = async () => {
        const w = window.open("", "_blank");
        const x = await FS.get(U + "|" + b.dataset.v);
        if (!x) return w && w.close();
        const url = URL.createObjectURL(x.blob);
        if (w) w.location = url;
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }),
  );
  document.querySelectorAll("[data-r]").forEach(
    (b) =>
      (b.onclick = async () => {
        if (!confirm("Remove this file?")) return;
        await FS.del(U + "|" + b.dataset.r);
        delete DOC_FILES[b.dataset.r];
        const d = D();
        d.docs = d.docs || {};
        d.docs[b.dataset.r] = false;
        setD(d);
        render();
      }),
  );
  const z = $("#zip");
  if (z)
    z.onclick = async () => {
      z.disabled = true;
      z.textContent = "Preparing…";
      try {
        if (!window.JSZip)
          await new Promise((ok, no) => {
            const sc = document.createElement("script");
            sc.src = "js/vendor/jszip.min.js";
            sc.onload = ok;
            sc.onerror = no;
            document.head.append(sc);
          });
        const zip = new JSZip(),
          names = {};
        DOCS.forEach((t, i) => (names["a" + i] = t));
        COND.forEach((c, i) => (names["c" + i] = c[0]));
        const keys = Object.keys(DOC_FILES);
        let n = 0;
        for (const k of keys) {
          const x = await FS.get(U + "|" + k);
          if (!x) continue;
          const ext = (x.name.match(/\.[a-z0-9]+$/i) || [""])[0],
            base = (names[k] || k).replace(/\(.*?\)/g, "").replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().slice(0, 60);
          zip.file(`${String(++n).padStart(2, "0")} ${base}${ext}`, x.blob);
        }
        const p = PR(),
          blob = await zip.generateAsync({ type: "blob" }),
          a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `MedGuide documents${p ? " - " + p.name : ""}.zip`;
        document.body.append(a);
        a.click();
        setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
        toast(n + " files zipped");
      } catch (e) {
        toast("Couldn’t create the ZIP");
      }
      z.disabled = false;
      z.textContent = "Download all as ZIP";
    };
};
