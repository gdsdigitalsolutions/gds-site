/* ============================================================
   GDS — order flow
   Hakbang 1: detalye  ->  Hakbang 2: bayad  ->  Hakbang 3: proof
   ============================================================ */
(function () {
  "use strict";

  var G = window.GDS;
  if (!G) return;

  var CFG = G.cfg;
  var endpoint = G.get("order.endpoint");
  var maxMB = Number(G.get("order.maxProofSizeMB", 5)) || 5;
  var STORE_KEY = "gds_order";

  var state = {
    slug: "",
    qty: 1,
    method: "",
    ref: "",
    amount: null,
    email: ""
  };

  /* ---------- storage ---------- */
  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }
  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { /* walang magagawa */ }
  }

  /* ---------- elements ---------- */
  var $ = function (sel) { return document.querySelector(sel); };
  var form = $("#order-form");
  var proofForm = $("#proof-form");
  var selProduct = $("#f-product");
  var inpQty = $("#f-qty");
  var selPayment = $("#f-payment");

  if (!form) return;

  /* ---------- product dropdown ---------- */
  function fillProducts() {
    var params = new URLSearchParams(window.location.search);
    var want = params.get("p") || state.slug || "";

    selProduct.innerHTML = '<option value="">Pumili ng product…</option>' +
      G.products.map(function (p) {
        return '<option value="' + G.esc(p.slug) + '">' + G.esc(p.name) + " — " + G.esc(G.priceLabel(p)) + "</option>";
      }).join("");

    if (want && G.bySlug(want)) selProduct.value = want;
  }

  /* ---------- summary ---------- */
  function currentProduct() { return G.bySlug(selProduct.value); }

  function isQuote(p) { return !p || p.quoteOnly || p.price === null || p.price === undefined; }

  function total() {
    var p = currentProduct();
    if (isQuote(p)) return null;
    return p.price * (parseInt(inpQty.value, 10) || 1);
  }

  function updateSummary() {
    var p = currentProduct();
    var qty = parseInt(inpQty.value, 10) || 1;
    var t = total();

    $("#sum-product").textContent = p ? p.name : "—";
    $("#sum-qty").textContent = qty;
    $("#sum-method").textContent = selPayment.value || "—";
    $("#sum-total").textContent = t === null ? (p ? "Ipapadala namin" : "—") : G.money(t);

    var note = $("#sum-note");
    var wrap = $("#field-payment-wrap");

    if (p && isQuote(p)) {
      note.textContent = "Wala pang nakatakdang presyo ang produktong ito. Ipapadala namin sa iyo ang eksaktong halaga bago ka magbayad.";
      wrap.hidden = true;
      selPayment.required = false;
    } else {
      note.textContent = "Walang dagdag na bayad. Ang halagang ito lang ang ipapadala mo.";
      wrap.hidden = false;
      selPayment.required = true;
    }

    // Habang may naka-pending nang order (may reference na), huwag i-overwrite ang
    // naka-save na product/dami/paraan — iyon ang ipinapakita sa Step 2.
    if (!state.ref) {
      state.slug = selProduct.value;
      state.qty = qty;
      state.method = selPayment.value;
      save();
    }
  }

  /* ---------- validation ---------- */
  function fieldEl(name) { return form.querySelector('[name="' + name + '"]'); }

  function setError(name, on) {
    var el = fieldEl(name);
    if (!el) return;
    var field = el.closest(".field");
    if (field) field.classList.toggle("has-error", on);
    var msg = form.querySelector('[data-error-for="' + name + '"]');
    if (msg && !field) msg.style.display = on ? "block" : "none";
  }

  function validate() {
    var bad = [];
    var p = currentProduct();

    if (!selProduct.value) { setError("product", true); bad.push("product"); } else setError("product", false);

    var name = fieldEl("name").value.trim();
    if (name.length < 2) { setError("name", true); bad.push("name"); } else setError("name", false);

    var email = fieldEl("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError("email", true); bad.push("email"); } else setError("email", false);

    var mobile = fieldEl("mobile").value.replace(/[^\d]/g, "");
    if (mobile.length < 10) { setError("mobile", true); bad.push("mobile"); } else setError("mobile", false);

    if (p && !isQuote(p) && !selPayment.value) { setError("paymentMethod", true); bad.push("paymentMethod"); }
    else setError("paymentMethod", false);

    if (!fieldEl("agree").checked) { setError("agree", true); bad.push("agree"); } else setError("agree", false);

    return bad;
  }

  /* ---------- network ---------- */
  function post(payload) {
    if (!endpoint) {
      return Promise.reject(new Error("Hindi pa naka-set up ang order system. Message mo muna kami sa Facebook."));
    }
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 45000);

    return fetch(endpoint, {
      method: "POST",
      // text/plain para hindi mag-CORS preflight ang Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var data;
        try { data = JSON.parse(txt); }
        catch (e) { throw new Error("Hindi maintindihan ang sagot ng server. Subukan ulit o i-message mo kami."); }
        if (!data.ok) throw new Error(data.error || "May mali sa pag-save ng order.");
        return data;
      })
      .catch(function (err) {
        if (err.name === "AbortError") throw new Error("Masyadong matagal ang koneksyon. Tingnan ang internet mo at subukan ulit.");
        throw err;
      })
      .finally(function () { clearTimeout(timer); });
  }

  function busy(btn, on, labelWhenBusy) {
    if (!btn) return;
    if (on) {
      btn.dataset.label = btn.innerHTML;
      btn.innerHTML = labelWhenBusy || "Sandali lang…";
      btn.setAttribute("aria-disabled", "true");
    } else {
      if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
      btn.removeAttribute("aria-disabled");
    }
  }

  function showError(boxId, msgId, text) {
    var box = document.getElementById(boxId);
    document.getElementById(msgId).textContent = " " + text;
    box.hidden = false;
    box.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  /* ---------- steps ---------- */
  function goStep(n) {
    document.querySelectorAll("[data-flow-step]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-flow-step") === String(n));
    });
    document.querySelectorAll("[data-flow-nav]").forEach(function (el) {
      var i = parseInt(el.getAttribute("data-flow-nav"), 10);
      el.classList.toggle("is-active", i === n);
      el.classList.toggle("is-done", i < n);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- payment panel ---------- */
  function payPanel() {
    var method = state.method;
    var amount = state.amount;
    var amountText = amount === null || amount === undefined ? "Ipapadala namin ang eksaktong halaga" : G.money(amount);

    var gcashName = G.get("payment.gcash.accountName");
    var gcashNum = G.get("payment.gcash.accountNumber");
    var gcashQR = G.get("payment.gcash.qrImage");
    var bankName = G.get("payment.bank.bankName");
    var bankAcct = G.get("payment.bank.accountName");
    var bankNum = G.get("payment.bank.accountNumber");
    var bankType = G.get("payment.bank.accountType");
    var bankQR = G.get("payment.bank.qrImage");

    var useBank = method === "Bank Transfer";
    var configured = useBank ? (!!bankNum || !!bankQR) : !!gcashNum;

    // Pwedeng lumipat ng paraan ng bayad dito mismo sa Step 2 (kung naka-set ang isa pa)
    var otherMethod = useBank ? "GCash" : "Bank Transfer";
    var otherReady = (amount !== null && amount !== undefined) && (useBank ? !!gcashNum : (!!bankNum || !!bankQR));
    var switchRow = otherReady
      ? '<div style="text-align:center;margin-top:var(--s-4)">' +
          '<button type="button" class="btn btn--ghost btn--sm" data-switch-method="' + otherMethod + '">' +
            'Magbayad via ' + (useBank ? "GCash" : G.esc(bankName || "bank transfer")) + ' sa halip' +
          '</button></div>'
      : "";

    if (!configured) {
      return '' +
        '<div class="notice notice--info">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>' +
          '<div><strong>Ipapadala namin ang payment details</strong>' +
          "Naitala na ang order mo. Ipapadala namin sa email o Messenger mo ang " +
          (useBank ? "bank details" : "GCash details") + " kasama ang eksaktong halaga.</div>" +
        "</div>";
    }

    var rows = useBank
      ? '' +
        '<div class="field-row"><div><div class="field-row__label">Bangko</div>' +
          '<div class="field-row__value">' + G.esc(bankName) + (bankType ? " (" + G.esc(bankType) + ")" : "") + "</div></div></div>" +
        (bankAcct
          ? '<div class="field-row"><div><div class="field-row__label">Account name</div>' +
            '<div class="field-row__value">' + G.esc(bankAcct) + "</div></div></div>"
          : "") +
        (bankNum
          ? '<div class="field-row"><div><div class="field-row__label">Account number</div>' +
            '<div class="field-row__value" id="pay-num">' + G.esc(bankNum) + "</div></div>" +
            copyBtn("#pay-num") + "</div>"
          : "") +
        (bankQR
          ? '<div style="text-align:center;padding-top:var(--s-3)">' +
            '<img src="../assets/pay/' + G.esc(bankQR) + '" alt="' + G.esc(bankName || "Bank") + ' QR code" style="max-width:220px;margin:0 auto;border-radius:var(--r-md)">' +
            '<div class="tiny muted" style="margin-top:var(--s-2)">I-scan gamit ang banking app mo</div></div>'
          : "")
      : '' +
        (gcashName
          ? '<div class="field-row"><div><div class="field-row__label">Account name</div>' +
            '<div class="field-row__value">' + G.esc(gcashName) + "</div></div></div>"
          : "") +
        '<div class="field-row"><div><div class="field-row__label">GCash number</div>' +
          '<div class="field-row__value" id="pay-num">' + G.esc(gcashNum) + "</div></div>" +
          copyBtn("#pay-num") + "</div>" +
        (gcashQR
          ? '<div style="text-align:center;padding-top:var(--s-3)">' +
            '<img src="../assets/pay/' + G.esc(gcashQR) + '" alt="GCash QR code" style="max-width:220px;margin:0 auto;border-radius:var(--r-md)">' +
            '<div class="tiny muted" style="margin-top:var(--s-2)">I-scan gamit ang GCash app</div></div>'
          : "");

    return '' +
      '<div class="pay-card">' +
        '<div class="pay-card__head">' +
          '<span class="pay-card__logo ' + (useBank ? "pay-card__logo--bank" : "pay-card__logo--gcash") + '">' +
            (useBank
              ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v9M19 10v9M3 19h18M9 19v-5h6v5"/></svg>'
              : "GC") +
          "</span>" +
          "<div><h3>" + (useBank ? G.esc(bankName || "Bank transfer") : "GCash") + "</h3>" +
          "<span>Ipadala ang eksaktong halaga sa ibaba</span></div>" +
        "</div>" +
        '<div class="pay-card__body">' +
          '<div class="field-row" style="border-bottom:1px solid var(--border);padding-bottom:var(--s-4)">' +
            '<div><div class="field-row__label">Halagang babayaran</div>' +
            '<div class="field-row__value" style="font-size:1.5rem;color:var(--accent)" id="pay-amt">' + G.esc(amountText) + "</div></div>" +
            (amount === null || amount === undefined ? "" : copyBtn("#pay-amt")) +
          "</div>" +
          rows +
        "</div>" +
      "</div>" +
      switchRow;
  }

  function copyBtn(sel) {
    return '<button class="copy-btn" type="button" data-copy-from="' + sel + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>' +
      '<span class="copy-btn__label">Kopyahin</span></button>';
  }

  function renderStep2() {
    document.getElementById("ref-display").textContent = state.ref;
    document.getElementById("ref-display-2").textContent = state.ref;
    document.getElementById("ref-inline").textContent = state.ref;
    document.getElementById("pay-panel").innerHTML = payPanel();
    var later = document.getElementById("pay-later");
    if (later) later.href = "../track/?ref=" + encodeURIComponent(state.ref);
  }

  /* ---------- hakbang 1: submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("form-error").hidden = true;

    var bad = validate();
    if (bad.length) {
      var first = form.querySelector('[name="' + bad[0] + '"]');
      if (first) first.focus();
      return;
    }

    var p = currentProduct();
    var btn = document.getElementById("submit-order");
    var t = total();

    var payload = {
      action: "create",
      product: p.name,
      productSlug: p.slug,
      qty: parseInt(inpQty.value, 10) || 1,
      unitPrice: p.price === null || p.price === undefined ? "" : p.price,
      amount: t === null ? "" : t,
      paymentMethod: isQuote(p) ? "Ipapadala ang quote" : selPayment.value,
      name: fieldEl("name").value.trim(),
      email: fieldEl("email").value.trim(),
      mobile: fieldEl("mobile").value.trim(),
      messenger: fieldEl("messenger").value.trim(),
      notes: fieldEl("notes").value.trim(),
      source: (function () {
        try { return sessionStorage.getItem("gds_src") || ""; } catch (e) { return ""; }
      })(),
      website: fieldEl("website").value, // honeypot
      pageUrl: window.location.href
    };

    busy(btn, true, "Kinukuha ang reference…");

    post(payload).then(function (data) {
      state.ref = data.ref;
      state.amount = t;
      state.email = payload.email;
      state.method = payload.paymentMethod;
      save();
      updateSummary();   // tiyaking tugma ang "Buod ng order" sa ipinadalang order
      renderStep2();
      goStep(2);
    }).catch(function (err) {
      showError("form-error", "form-error-msg", err.message);
    }).finally(function () {
      busy(btn, false);
    });
  });

  /* ---------- live updates ---------- */
  [selProduct, inpQty, selPayment].forEach(function (el) {
    el.addEventListener("change", updateSummary);
    el.addEventListener("input", updateSummary);
  });

  document.querySelectorAll("[data-goto-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goStep(parseInt(btn.getAttribute("data-goto-step"), 10));
    });
  });

  /* ---------- Step 2: lumipat ng paraan ng bayad / baguhin ang order ---------- */
  document.getElementById("pay-panel").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-switch-method]");
    if (!btn) return;
    var method = btn.getAttribute("data-switch-method");
    selPayment.value = method;
    state.method = method;
    save();
    updateSummary();
    renderStep2();
  });

  // Bagong order: kalimutan ang naunang reference at halaga, balik sa form
  // (nananatili ang na-type na pangalan/contact para hindi na ulitin)
  var newOrderBtn = document.getElementById("new-order");
  if (newOrderBtn) {
    newOrderBtn.addEventListener("click", function () {
      state.ref = "";
      state.amount = null;
      state.email = "";
      save();
      document.getElementById("form-error").hidden = true;
      updateSummary();
      goStep(1);
    });
  }

  /* ---------- hakbang 3: proof ---------- */
  var chosenFile = null;

  var drop = document.getElementById("file-drop");
  var input = document.getElementById("f-proof");
  var preview = document.getElementById("file-preview");

  document.getElementById("max-size").textContent = maxMB;

  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-dragover"); });
  });
  drop.addEventListener("drop", function (e) {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener("change", function () {
    if (input.files && input.files[0]) handleFile(input.files[0]);
  });
  document.getElementById("clear-file").addEventListener("click", function () {
    chosenFile = null;
    input.value = "";
    preview.classList.remove("is-active");
  });

  function handleFile(file) {
    document.getElementById("proof-error").hidden = true;

    var okTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (okTypes.indexOf(file.type) === -1) {
      showError("proof-error", "proof-error-msg", "JPG, PNG, o PDF lang ang tinatanggap. Ang napili mo ay " + (file.type || "hindi kilalang uri") + ".");
      return;
    }
    if (file.size > maxMB * 1024 * 1024 * 2) {
      showError("proof-error", "proof-error-msg", "Masyadong malaki ang file (" + (file.size / 1048576).toFixed(1) + "MB). Kailangan ay hanggang " + maxMB + "MB lang.");
      return;
    }

    chosenFile = file;
    document.getElementById("preview-name").textContent = file.name;
    document.getElementById("preview-size").textContent = (file.size / 1024).toFixed(0) + " KB";
    var img = document.getElementById("preview-img");
    if (file.type.indexOf("image/") === 0) {
      img.src = URL.createObjectURL(file);
      img.hidden = false;
    } else {
      img.hidden = true;
    }
    preview.classList.add("is-active");
  }

  // Pinapaliit ang malalaking larawan bago ipadala para hindi mabagal
  function toBase64(file) {
    return new Promise(function (resolve, reject) {
      if (file.type === "application/pdf" || file.size < 700 * 1024) {
        var fr = new FileReader();
        fr.onload = function () { resolve({ data: fr.result.split(",")[1], type: file.type, name: file.name }); };
        fr.onerror = function () { reject(new Error("Hindi mabasa ang file.")); };
        fr.readAsDataURL(file);
        return;
      }
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1600;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var dataUrl = c.toDataURL("image/jpeg", 0.82);
        resolve({
          data: dataUrl.split(",")[1],
          type: "image/jpeg",
          name: file.name.replace(/\.[^.]+$/, "") + ".jpg"
        });
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Hindi mabuksan ang larawan.")); };
      img.src = url;
    });
  }

  proofForm.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("proof-error").hidden = true;

    if (!chosenFile) {
      showError("proof-error", "proof-error-msg", "Pumili muna ng screenshot ng resibo.");
      return;
    }
    if (!state.ref) {
      showError("proof-error", "proof-error-msg", "Nawala ang reference mo. I-refresh ang page o i-message mo kami.");
      return;
    }

    var btn = document.getElementById("submit-proof");
    busy(btn, true, "Ipinapadala…");

    toBase64(chosenFile).then(function (f) {
      var sizeMB = (f.data.length * 0.75) / 1048576;
      if (sizeMB > maxMB) {
        throw new Error("Masyado pa ring malaki ang file (" + sizeMB.toFixed(1) + "MB). Subukan ang mas maliit na screenshot.");
      }
      return post({
        action: "proof",
        ref: state.ref,
        email: state.email,
        paidRef: document.getElementById("f-paid-ref").value.trim(),
        file: f
      });
    }).then(function () {
      var doneRef = state.ref;
      // Tapos na ang order na ito — huwag nang ibalik sa Step 2 kapag binuksan ulit ang page
      try { sessionStorage.removeItem(STORE_KEY); } catch (e2) { /* private mode */ }
      window.location.href = "confirmation.html?ref=" + encodeURIComponent(doneRef) + "&proof=1";
    }).catch(function (err) {
      showError("proof-error", "proof-error-msg", err.message);
      busy(btn, false);
    });
  });

  /* ---------- boot ---------- */
  load();

  // May naka-pending na order pero IBANG product ang binuksan (?p=...) —
  // bagong order iyon: huwag ipilit ang lumang reference at halaga.
  var wantedSlug = new URLSearchParams(window.location.search).get("p");
  if (state.ref && wantedSlug && wantedSlug !== state.slug) {
    state.ref = "";
    state.amount = null;
    state.email = "";
    state.method = "";
    save();
  }

  fillProducts();

  // May naka-pending na order: ibalik sa form ang naka-save na product/dami/paraan
  // para tugma ang "Buod ng order" sa payment panel
  if (state.ref) {
    if (G.bySlug(state.slug)) selProduct.value = state.slug;
    inpQty.value = state.qty || 1;
    selPayment.value = state.method || "";
  }

  updateSummary();

  // Kapag may naunang order sa session na ito, ibalik ang customer sa hakbang 2
  if (state.ref) {
    renderStep2();
    goStep(2);
  }
})();
