/**
 * ============================================================
 * GDS Digital Solutions — ORDER NOTIFIER + SEMI-AUTO DELIVERY (v3)
 * ------------------------------------------------------------
 * Hiwalay sa order backend. Tumatakbo sa PERSONAL account mo (na kayang
 * mag-email); BINABASA/SINUSULATAN ang Orders sheet (File B) at ang
 * Licenses sheet (File C) kada 5 minuto. Walang binabago sa gdsdigisol
 * backend code.
 *
 * ANO ANG GINAGAWA
 *   1. Bagong order            → email sa IYO + confirmation sa BUYER
 *   2. Na-upload ang resibo    → email sa IYO (may Drive link) + sa BUYER
 *   3. IKAW → Status "Verified" (pagkatapos makita ang pera):
 *        • GDS ONT Flasher  → kukuha ng susunod na unused key sa Licenses,
 *                             isusulat ang buyer doon, ie-email sa buyer ang
 *                             download link + key + gabay, ilalagay ang key sa
 *                             Internal Notes, at Status → "Delivered". Kopya sa iyo.
 *                             Walang stock? Email sa iyo, walang ide-deliver.
 *        • BayadTrack       → email sa buyer ng susunod na hakbang (+ template
 *                             link kung naka-set) at email sa iyo na simulan ang
 *                             setup. Nananatiling "Verified" hanggang ikaw ang
 *                             mag-set ng "Delivered" pagkatapos ng walkthrough.
 *        • Iba (hal. website) → email sa buyer na kakausapin siya + email sa iyo.
 *   Ang delivery ay LAGING nakadepende sa "Verified" na IKAW LANG ang nagse-set —
 *   hindi ito matri-trigger ng pekeng resibo.
 *
 * PAANO I-SETUP (isang beses):
 *   1. Sa gdsdigisol: i-Share sa PERSONAL email mo bilang **Editor** ang
 *      (a) "GDS Orders" (File B)  at  (b) "GDS Ont Flasher Licenses" (File C).
 *      (Editor na, dahil nagsusulat na ito: Status/Internal Notes at Buyer.)
 *   2. Personal account → https://script.google.com → ang "GDS Order Notifier"
 *      project → palitan ang buong laman ng file na ito → Save.
 *   3. Kung BAGONG project: function dropdown → setup → Run → Allow.
 *      Kung UPDATE lang (may trigger na): i-run ang  checkNow  isang beses para
 *      lumabas ang bagong permission prompt (Licenses sheet) → Allow.
 *
 * TEST NG DELIVERY: mag-test order (ibang email kada test — 5/oras/email ang
 *   limit ng backend) → i-upload ang resibo → sa Orders sheet, i-set ang Status
 *   ng row na iyon sa "Verified" → checkNow → dapat: email sa buyer na may key
 *   (Flasher) at Status → Delivered; sa Licenses may Buyer na ang key na iyon.
 *   Pagkatapos ng test: burahin ang order row; sa Licenses, i-clear ang Buyer
 *   at Notes ng test key (para maibenta ulit).
 *
 * MGA FUNCTION: setup · checkNow · reset (mag-e-email ulit sa lahat!) · stop
 * ============================================================ */

var NOTIFIER = {
  // ---- Sheets ----
  sheetId: "1SThEOPeMHNcESk2NfPid9QFFyGu8fMSXNn6ZiiUSqfw",        // GDS Orders (File B)
  sheetName: "Orders",
  licensesSheetId: "11X74z-pALgKoDEJU9o3TnZxiaxbLhe2DyM-lEEWBMNg",  // GDS Ont Flasher Licenses (File C)
  licensesSheetName: "Licenses",

  timeZone: "Asia/Manila",
  everyMinutes: 5,

  // ---- Emails ----
  notifyBuyer: true,
  businessName: "GDS Digital Solutions",
  replyTo: "gdsdigisol@gmail.com",          // dito pupunta ang reply ng buyer
  siteUrl: "https://gdsdigitalsolutions.github.io/gds-site",
  deliveryPromise: "within 1–6 oras pagka-verify ng bayad",

  // Payment details sa buyer email — DAPAT PAREHO ng js/config.js sa site
  gcash: { name: "GE***D S.", number: "0919 703 0111" },
  bank:  { name: "MariBank", accountName: "GERALD SINIO", accountNumber: "1847 4603 430" },

  // ---- Semi-auto delivery ----
  autoDeliver: true,
  // GDS ONT Flasher download (GitHub Release). PALITAN kapag may bagong release.
  flasherDownloadUrl: "https://github.com/gdsdigitalsolutions/gds-site/releases/download/flasher-v1.0/GDS-ONT-Flasher-v1.0.exe",
  // BayadTrack client-list template (Google Sheet link). Blangko = "ipapadala namin ang template".
  bayadtrackTemplateUrl: "",
  // Babala sa iyo kapag ganito na lang kakaunti ang natitirang key
  lowStockWarnAt: 5,
  // Pinakamaraming key na ipapadala sa isang order (qty)
  maxKeysPerOrder: 5,

  // Unang pagtakbo: kilalanin ang lumang orders nang hindi nag-e-email
  quietFirstRun: true
};

/* ============================================================
   Trigger management
   ============================================================ */

function setup() {
  stop();
  ScriptApp.newTrigger("checkOrders").timeBased().everyMinutes(NOTIFIER.everyMinutes).create();
  if (NOTIFIER.quietFirstRun && !PropertiesService.getScriptProperties().getProperty("STATE")) {
    markAllSeen_();
    Logger.log("Setup OK. Nakita na ang kasalukuyang orders (walang ipinadalang email).");
  } else {
    Logger.log("Setup OK.");
  }
  Logger.log("Kada " + NOTIFIER.everyMinutes + " min ang check. Notification → " + myEmail_() +
    " · Buyer emails: " + (NOTIFIER.notifyBuyer ? "ON" : "OFF") +
    " · Auto-delivery: " + (NOTIFIER.autoDeliver ? "ON" : "OFF") +
    " · Unused keys sa stock: " + countUnusedKeys_());
}

function stop() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "checkOrders") ScriptApp.deleteTrigger(t);
  });
}

function reset() {
  PropertiesService.getScriptProperties().deleteProperty("STATE");
  Logger.log("Na-reset. Sa susunod na check, lahat ng order ay ituturing na bago (mag-e-email ulit!).");
}

function checkNow() {
  checkOrders();
  Logger.log("Tapos ang manual check. Unused keys sa stock: " + countUnusedKeys_() + ". Tingnan ang inbox mo.");
}

/* ============================================================
   Pangunahing check (kada 5 min)
   ============================================================ */

function checkOrders() {
  var rows = readOrders_();
  if (!rows) return;

  var state = loadState_();
  var sent = 0;

  rows.forEach(function (r) {
    if (!r.ref) return;
    var s = state.orders[r.ref];
    if (!s) s = state.orders[r.ref] = newEntry_(r.status, false);
    s.status = r.status;

    // (1) Bagong order
    if (!s.newOwner && trySend_(function () { emailOwnerNew_(r); }, r.ref, "owner/new")) { s.newOwner = true; sent++; }
    if (!s.newBuyer) {
      if (!NOTIFIER.notifyBuyer || !isEmail_(r.email)) s.newBuyer = true;
      else if (trySend_(function () { emailBuyerNew_(r); }, r.ref, "buyer/new")) { s.newBuyer = true; sent++; }
    }

    // (2) Na-upload ang resibo
    if (isPaidOrLater_(r.status)) {
      if (!s.paidOwner && trySend_(function () { emailOwnerPaid_(r); }, r.ref, "owner/paid")) { s.paidOwner = true; sent++; }
      if (!s.paidBuyer) {
        if (!NOTIFIER.notifyBuyer || !isEmail_(r.email)) s.paidBuyer = true;
        else if (trySend_(function () { emailBuyerPaid_(r); }, r.ref, "buyer/paid")) { s.paidBuyer = true; sent++; }
      }
    }

    // (3) Verified → delivery
    if (NOTIFIER.autoDeliver && isVerified_(r.status) && !s.delivered) {
      sent += handleVerified_(r, s);
    }
    // Kung ikaw mismo ang nag-set ng Delivered, huwag nang i-deliver ulit
    if (isDelivered_(r.status)) s.delivered = true;
  });

  saveState_(state);
  if (sent) Logger.log(sent + " email(s) ipinadala.");
}

function trySend_(fn, ref, what) {
  try { fn(); return true; }
  catch (err) { console.error("Failed (" + what + ") for " + ref + ": " + err); return false; }
}

/* ============================================================
   Verified → delivery
   ============================================================ */

function handleVerified_(r, s) {
  // Pangalawang guard: kung may marker na sa Internal Notes, na-deliver na ito dati
  if (/\[auto-delivery\]/.test(r.internalNotes)) { s.delivered = true; return 0; }

  if (r.slug === "gds-ont-flasher") return deliverFlasher_(r, s);

  // BayadTrack at iba pa: email lang, status nananatiling Verified
  if (s.verifiedNotified) return 0;
  var sent = 0;
  var buyerOk = !NOTIFIER.notifyBuyer || !isEmail_(r.email) ||
    trySend_(function () { emailBuyerVerified_(r); }, r.ref, "buyer/verified");
  if (buyerOk) sent++;
  var ownerOk = trySend_(function () { emailOwnerVerified_(r); }, r.ref, "owner/verified");
  if (ownerOk) sent++;
  if (buyerOk && ownerOk) {
    s.verifiedNotified = true;
    try { noteOrder_(r, "[auto-delivery] buyer emailed next steps " + fmt_(new Date()) + " (setup by Gerald)"); }
    catch (e) { console.error("Internal Notes write failed for " + r.ref + ": " + e); }
  }
  return sent;
}

function deliverFlasher_(r, s) {
  var need = Math.max(1, Math.min(NOTIFIER.maxKeysPerOrder, r.qty || 1));
  var sent = 0;

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) { console.error("Lock busy — susubukan ulit sa susunod na run (" + r.ref + ")"); return 0; }
  try {
    // Kumuha ng key(s) kung wala pa — nananatili ang reserved keys sa state para sa retry
    if (s.assignedKeys.length < need) {
      var got = reserveKeys_(need - s.assignedKeys.length, r);
      if (got === null) return 0;                       // hindi mabuksan ang Licenses sheet (naka-log na)
      s.assignedKeys = s.assignedKeys.concat(got);
      if (s.assignedKeys.length < need) {
        if (!s.stockAlerted && trySend_(function () { emailOwnerNoStock_(r, need, s.assignedKeys.length); }, r.ref, "owner/nostock")) {
          s.stockAlerted = true; sent++;
        }
        return sent;                                     // hintayin ang bagong stock
      }
    }
  } finally { lock.releaseLock(); }

  var keys = s.assignedKeys;

  // Email sa buyer — kapag pumalya, retry sa susunod na run gamit ang PAREHONG keys
  if (isEmail_(r.email)) {
    if (!trySend_(function () { emailBuyerDelivery_(r, keys); }, r.ref, "buyer/delivery")) return sent;
    sent++;
  }
  if (trySend_(function () { emailOwnerDelivered_(r, keys); }, r.ref, "owner/delivered")) sent++;

  // I-update ang order: Internal Notes + Status Delivered + Last Update
  try {
    noteOrder_(r, "[auto-delivery] key " + keys.join(", ") + " sent to " + r.email + " " + fmt_(new Date()));
    setOrderStatus_(r, "Delivered");
  } catch (e) { console.error("Orders sheet write failed for " + r.ref + " (na-email na ang buyer): " + e); }

  s.delivered = true;
  return sent;
}

/* ============================================================
   Licenses sheet (File C)
   ============================================================ */

function openLicenses_() {
  var ss = SpreadsheetApp.openById(NOTIFIER.licensesSheetId);
  var sh = ss.getSheetByName(NOTIFIER.licensesSheetName);
  if (!sh) throw new Error("Walang tab na '" + NOTIFIER.licensesSheetName + "' sa Licenses sheet.");
  return sh;
}

// Kumukuha ng n na unused key (Status=active, walang Buyer, walang Machine),
// isinusulat ang buyer sa Buyer column, at ibinabalik ang mga key. Kulang = kung ano lang ang meron.
function reserveKeys_(n, r) {
  var sh;
  try { sh = openLicenses_(); }
  catch (e) { console.error("Licenses sheet: " + e + " — na-share ba ito (Editor) sa account na ito?"); return null; }

  var data = sh.getDataRange().getValues();
  var H = data[0].map(function (h) { return String(h).trim(); });
  var cKey = H.indexOf("Key"), cBuyer = H.indexOf("Buyer"), cMachine = H.indexOf("Machine"),
      cStatus = H.indexOf("Status"), cNotes = H.indexOf("Notes");
  if (cKey < 0 || cBuyer < 0 || cStatus < 0) { console.error("Licenses headers: kailangan ng Key, Buyer, Status."); return null; }

  var taken = [];
  for (var i = 1; i < data.length && taken.length < n; i++) {
    var row = data[i];
    var key = String(row[cKey]).trim();
    if (!key) continue;
    if (String(row[cStatus]).trim().toLowerCase() !== "active") continue;
    if (String(row[cBuyer]).trim() !== "") continue;
    if (cMachine >= 0 && String(row[cMachine]).trim() !== "") continue;

    sh.getRange(i + 1, cBuyer + 1).setValue(r.name + " · " + r.ref + " · " + r.email);
    if (cNotes >= 0) sh.getRange(i + 1, cNotes + 1).setValue("auto-delivered " + fmt_(new Date()));
    taken.push(key);
  }
  return taken;
}

function countUnusedKeys_() {
  try {
    var sh = openLicenses_();
    var data = sh.getDataRange().getValues();
    var H = data[0].map(function (h) { return String(h).trim(); });
    var cKey = H.indexOf("Key"), cBuyer = H.indexOf("Buyer"), cMachine = H.indexOf("Machine"), cStatus = H.indexOf("Status");
    var n = 0;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (String(row[cKey]).trim() && String(row[cStatus]).trim().toLowerCase() === "active" &&
          String(row[cBuyer]).trim() === "" && (cMachine < 0 || String(row[cMachine]).trim() === "")) n++;
    }
    return n;
  } catch (e) { return "?"; }
}

/* ============================================================
   Orders sheet writes (File B)
   ============================================================ */

function noteOrder_(r, text) {
  var sh = SpreadsheetApp.openById(NOTIFIER.sheetId).getSheetByName(NOTIFIER.sheetName);
  var c = r.cols["Internal Notes"];
  if (c < 0) return;
  var cell = sh.getRange(r.rowIndex, c + 1);
  var cur = String(cell.getValue() || "").trim();
  cell.setValue(cur ? cur + "\n" + text : text);
}

function setOrderStatus_(r, status) {
  var sh = SpreadsheetApp.openById(NOTIFIER.sheetId).getSheetByName(NOTIFIER.sheetName);
  if (r.cols["Status"] >= 0) sh.getRange(r.rowIndex, r.cols["Status"] + 1).setValue(status);
  if (r.cols["Last Update"] >= 0) sh.getRange(r.rowIndex, r.cols["Last Update"] + 1).setValue(new Date());
}

/* ============================================================
   EMAILS — sa IYO
   ============================================================ */

function emailOwnerNew_(r) {
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] Bagong order " + r.ref + " — " + r.product + " " + amount_(r) + " (" + (r.status || "Pending") + ")",
    body:
      "MAY BAGONG ORDER.\n\n" + orderBlock_(r) +
      "\nHintayin ang resibo (may susunod na email kapag na-upload), o i-message ang buyer.\n\n" +
      "Orders sheet: " + sheetUrl_() + "\n"
  });
}

function emailOwnerPaid_(r) {
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] RESIBO na-upload — " + r.ref + " — i-verify ang " + amount_(r),
    body:
      "NAG-UPLOAD NG RESIBO ANG BUYER. I-verify ang bayad sa GCash/MariBank app mo.\n\n" + orderBlock_(r) +
      (r.paidRef ? "Payment ref # : " + r.paidRef + "\n" : "") +
      "Resibo (Drive): " + (r.proof || "(walang link)") + "\n" +
      "Na-upload     : " + fmt_(r.lastUpdate) + "\n\n" +
      "KAPAG TOTOO ANG PERA: i-set ang Status → Verified.\n" +
      (r.slug === "gds-ont-flasher"
        ? "  → Awtomatikong ipapadala ng notifier ang download link + license key sa buyer\n    at gagawing Delivered ang order.\n"
        : "  → Awtomatikong ie-email ng notifier ang buyer ng susunod na hakbang; ikaw ang\n    gagawa ng setup, tapos i-set mo ang Delivered.\n") +
      "\nOrders sheet: " + sheetUrl_() + "\n"
  });
}

function emailOwnerVerified_(r) {
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] VERIFIED " + r.ref + " (" + r.product + ") — simulan ang setup",
    body:
      "Na-verify mo ang " + r.ref + ". Na-email na ang buyer ng susunod na hakbang" +
      (r.slug === "bayadtrack" ? " (client-list template" + (NOTIFIER.bayadtrackTemplateUrl ? " link" : " — IKAW ang magpapadala ng template") + ").\n" : ".\n") +
      "\n" + orderBlock_(r) +
      "\nPagkatapos ng setup/walkthrough: Status → Delivered.\n\nOrders sheet: " + sheetUrl_() + "\n"
  });
}

function emailOwnerDelivered_(r, keys) {
  var left = countUnusedKeys_();
  var warn = (typeof left === "number" && left <= NOTIFIER.lowStockWarnAt)
    ? "\n⚠ NATITIRANG KEY SA STOCK: " + left + " — magdagdag na ng keys sa Licenses sheet.\n" : "";
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] DELIVERED " + r.ref + " — key " + keys.join(", ") + " → " + r.name,
    body:
      "Awtomatikong na-deliver ang GDS ONT Flasher.\n\n" + orderBlock_(r) +
      "License key(s) : " + keys.join(", ") + "\n" +
      "Download link  : " + NOTIFIER.flasherDownloadUrl + "\n" +
      "Status         : Delivered\n" +
      "Unused keys sa stock: " + left + "\n" + warn +
      "\nLicenses sheet: https://docs.google.com/spreadsheets/d/" + NOTIFIER.licensesSheetId + "\n" +
      "Orders sheet  : " + sheetUrl_() + "\n"
  });
}

function emailOwnerNoStock_(r, need, have) {
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] ⚠ WALANG LICENSE KEY STOCK — " + r.ref + " HINDI na-deliver",
    body:
      "Na-verify mo ang " + r.ref + " (" + r.product + ", qty " + need + ") pero kulang ang unused key sa Licenses sheet " +
      "(nakuha: " + have + " sa " + need + ").\n\n" +
      "GAWIN: magdagdag ng bagong key rows sa Licenses (Key, Status=active, Buyer at Machine blangko). " +
      "Sa susunod na check, awtomatikong ide-deliver ang order na ito.\n\n" + orderBlock_(r) +
      "\nLicenses sheet: https://docs.google.com/spreadsheets/d/" + NOTIFIER.licensesSheetId + "\n"
  });
}

/* ============================================================
   EMAILS — sa BUYER
   ============================================================ */

function emailBuyerNew_(r) {
  var amount = amount_(r);
  var pay = r.amount === ""
    ? "Ipapadala namin sa iyo ang eksaktong halaga bago ka magbayad.\n"
    : "PARAAN NG BAYAD (ipadala ang eksaktong halaga: " + amount + ")\n" +
      "  GCash    : " + NOTIFIER.gcash.number + "  (" + NOTIFIER.gcash.name + ")\n" +
      "  " + NOTIFIER.bank.name + " : " + NOTIFIER.bank.accountNumber + "  (" + NOTIFIER.bank.accountName + ")\n" +
      "  ⚠ Ilagay ang reference " + r.ref + " sa notes/message ng bayad.\n\n" +
      "PAGKATAPOS MAGBAYAD\n" +
      "  I-upload ang screenshot ng resibo sa order page, o ipadala ito sa Messenger\n" +
      "  kasama ang reference mo. Ve-verify namin ito nang manu-mano.\n";

  MailApp.sendEmail({
    to: r.email, replyTo: NOTIFIER.replyTo, name: NOTIFIER.businessName,
    subject: "[" + NOTIFIER.businessName + "] Natanggap ang order mo — " + r.ref + " (" + r.product + ")",
    body:
      "Hi " + firstName_(r.name) + ",\n\n" +
      "Salamat! Natanggap namin ang order mo.\n\n" +
      "Reference : " + r.ref + "   ← i-save ito\n" +
      "Product   : " + r.product + (r.qty > 1 ? " x" + r.qty : "") + "\n" +
      "Halaga    : " + amount + "\n" +
      "Bayad via : " + r.method + "\n\n" +
      pay + "\n" +
      "I-TRACK ANG ORDER MO\n  " + trackUrl_(r) + "\n\n" +
      "Para sa seguridad mo: hindi kami humihingi ng password, OTP, o card details — kailanman.\n" +
      "Isang GCash at isang bank account lang ang gamit namin (ang nasa itaas at sa website).\n" +
      "Kung may nag-message sa iyo ng ibang account number, hindi iyon kami.\n\n" +
      "May tanong? I-reply lang ang email na ito o i-message kami sa Facebook.\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

function emailBuyerPaid_(r) {
  var next = r.slug === "bayadtrack"
    ? "Pagka-verify ng payment, iko-coordinate namin ang client-list import, Google Drive setup,\n  at walkthrough ng BayadTrack — kakausapin ka namin sa email na ito o sa Messenger."
    : r.slug === "gds-ont-flasher"
    ? "Pagka-verify ng bayad, ipapadala namin sa email na ito ang download link at license key,\n  kasama ang gabay sa paggamit. Paalala: 1 license key = 1 PC."
    : "Pagka-verify ng bayad, kakausapin ka namin para sa susunod na hakbang.";

  MailApp.sendEmail({
    to: r.email, replyTo: NOTIFIER.replyTo, name: NOTIFIER.businessName,
    subject: "[" + NOTIFIER.businessName + "] Natanggap ang resibo mo — " + r.ref,
    body:
      "Hi " + firstName_(r.name) + ",\n\n" +
      "Natanggap namin ang resibo mo para sa order " + r.ref + " (" + r.product + ", " + amount_(r) + ").\n\n" +
      "ANO ANG SUSUNOD\n" +
      "  Manu-mano naming che-check ang bayad — " + NOTIFIER.deliveryPromise + ".\n" +
      "  " + next + "\n\n" +
      "I-TRACK ANG ORDER MO\n  " + trackUrl_(r) + "\n\n" +
      "Kung lampas na sa sinabi naming oras at wala pa, i-reply lang ang email na ito kasama ang reference mo.\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

function emailBuyerVerified_(r) {
  var next;
  if (r.slug === "bayadtrack") {
    next =
      "SUSUNOD NA HAKBANG — CLIENT LIST\n" +
      (NOTIFIER.bayadtrackTemplateUrl
        ? "  1. Buksan ang template: " + NOTIFIER.bayadtrackTemplateUrl + "\n     (File → Make a copy, tapos punan.)\n"
        : "  1. Ipapadala namin sa iyo ang client-list template (Google Sheet) sa email na ito.\n") +
      "  2. Ilagay ang bawat kliyente: pangalan, area/purok, monthly plan, petsa ng kabit,\n" +
      "     at kung may dating utang — ilang buwan.\n" +
      "  3. I-reply ang email na ito kapag tapos na (o i-share ang sheet sa " + NOTIFIER.replyTo + ").\n\n" +
      "Pagkatanggap namin ng listahan: ii-import namin ito, ise-setup ang BayadTrack sa Google Drive mo\n" +
      "(sa loob ng 1 araw), at magse-schedule tayo ng 30-minutong walkthrough kasama ang collector mo.\n" +
      "Kasama ang 30 days support pagkatapos ng setup, at check-in pagkatapos ng unang buwan.\n";
  } else {
    next = "Kakausapin ka namin sa email na ito o sa Messenger para sa mga detalye at susunod na hakbang.\n";
  }
  MailApp.sendEmail({
    to: r.email, replyTo: NOTIFIER.replyTo, name: NOTIFIER.businessName,
    subject: "[" + NOTIFIER.businessName + "] Verified na ang bayad mo — " + r.ref + " — susunod na hakbang",
    body:
      "Hi " + firstName_(r.name) + ",\n\n" +
      "Na-verify na namin ang bayad mo para sa " + r.product + " (" + r.ref + "). Salamat!\n\n" +
      next + "\n" +
      "I-TRACK ANG ORDER MO\n  " + trackUrl_(r) + "\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

function emailBuyerDelivery_(r, keys) {
  var keyLines = keys.length === 1 ? "  License key : " + keys[0] + "\n"
    : keys.map(function (k, i) { return "  License key " + (i + 1) + " : " + k + "\n"; }).join("");
  MailApp.sendEmail({
    to: r.email, replyTo: NOTIFIER.replyTo, name: NOTIFIER.businessName,
    subject: "[" + NOTIFIER.businessName + "] Download link at license key mo — " + r.ref,
    body:
      "Hi " + firstName_(r.name) + ",\n\n" +
      "Verified na ang bayad mo. Ito na ang GDS ONT Flasher mo:\n\n" +
      "  Download    : " + NOTIFIER.flasherDownloadUrl + "\n" +
      keyLines + "\n" +
      "QUICK START\n" +
      "  1. I-download ang \"GDS ONT Flasher.exe\" (~170 MB). Kapag may SmartScreen na\n" +
      "     \"unknown publisher\" — normal ito: More info → Run anyway.\n" +
      "  2. Right-click → Run as administrator.\n" +
      "  3. I-paste ang license key → Activate (kailangan ng internet, isang beses lang).\n" +
      "  4. Factory reset muna ang unit (~10s), ikabit sa LAN cable, hintayin ang boot.\n" +
      "  5. I-check ang dalawang consent box → piliin ang GPON o EPON → Start.\n" +
      "     Huwag hawakan ang PC/modem habang tumatakbo. Lalabas ang device access\n" +
      "     details sa dulo.\n\n" +
      "MAHALAGA\n" +
      "  • 1 license key = 1 PC. Napalitan ang PC o nag-reformat? I-reply lang ang email\n" +
      "    na ito para mailipat namin ang key.\n" +
      "  • Gamitin lang sa unit na pag-aari mo o may pahintulot kang i-service.\n" +
      "  • Huwag i-share ang key — mababawi ang license kapag napatunayang ibinahagi.\n\n" +
      "Suporta: i-reply ang email na ito o i-message kami sa Facebook.\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

/* ============================================================
   Pagbasa ng Orders sheet
   ============================================================ */

function readOrders_() {
  var ss;
  try { ss = SpreadsheetApp.openById(NOTIFIER.sheetId); }
  catch (e) { console.error("Hindi mabuksan ang Orders sheet — na-share ba ito sa account na ito? " + e); return null; }
  var sh = ss.getSheetByName(NOTIFIER.sheetName);
  if (!sh) { console.error("Walang tab na '" + NOTIFIER.sheetName + "'."); return null; }

  var data = sh.getDataRange().getValues();
  if (data.length < 2) return [];

  var H = data[0].map(function (h) { return String(h).trim(); });
  var cols = {};
  ["Timestamp", "Reference", "Status", "Product", "Slug", "Qty", "Amount", "Payment Method", "Name", "Email",
   "Mobile", "Messenger", "Notes", "Proof of Payment", "Payment Ref No.", "Last Update", "Internal Notes"]
    .forEach(function (n) { cols[n] = H.indexOf(n); });
  var get = function (row, name) { var i = cols[name]; return i < 0 ? "" : row[i]; };

  var out = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    out.push({
      rowIndex: i + 1, cols: cols,
      timestamp: get(row, "Timestamp"),
      ref:       String(get(row, "Reference")).trim().toUpperCase(),
      status:    String(get(row, "Status")).trim(),
      product:   String(get(row, "Product")),
      slug:      String(get(row, "Slug")).trim().toLowerCase(),
      qty:       Number(get(row, "Qty")) || 1,
      amount:    get(row, "Amount") === "" ? "" : Number(get(row, "Amount")),
      method:    String(get(row, "Payment Method")),
      name:      String(get(row, "Name")),
      email:     String(get(row, "Email")).trim(),
      mobile:    String(get(row, "Mobile")),
      messenger: String(get(row, "Messenger")),
      notes:     String(get(row, "Notes")),
      proof:     String(get(row, "Proof of Payment")),
      paidRef:   String(get(row, "Payment Ref No.")),
      lastUpdate: get(row, "Last Update"),
      internalNotes: String(get(row, "Internal Notes"))
    });
  }
  return out;
}

/* ============================================================
   State (ano na ang na-notify / na-deliver)
   ============================================================ */

function newEntry_(status, seenBefore) {
  // seenBefore=true: lumang order — huwag nang i-email; ituring na na-deliver na kung Verified/Delivered na
  var done = isVerified_(status) || isDelivered_(status);
  return {
    status: status,
    newOwner: seenBefore, newBuyer: seenBefore,
    paidOwner: seenBefore && isPaidOrLater_(status), paidBuyer: seenBefore && isPaidOrLater_(status),
    verifiedNotified: seenBefore && done,
    delivered: seenBefore && done,
    assignedKeys: [], stockAlerted: false
  };
}

function loadState_() {
  var raw = PropertiesService.getScriptProperties().getProperty("STATE");
  var s = raw ? JSON.parse(raw) : { orders: {} };
  if (!s.orders) s.orders = {};
  Object.keys(s.orders).forEach(function (k) {
    var o = s.orders[k];
    // v1 → v2 fields
    if (o.newOwner === undefined) {
      var paid = !!o.paidNotified;
      o = { status: o.status, newOwner: true, newBuyer: true, paidOwner: paid, paidBuyer: paid };
    }
    // v2 → v3 fields: ang mga Verified/Delivered na bago ang v3 ay ituturing na manual na na-deliver
    if (o.delivered === undefined) {
      var done = isVerified_(o.status) || isDelivered_(o.status);
      o.verifiedNotified = done; o.delivered = done; o.assignedKeys = []; o.stockAlerted = false;
    }
    if (!o.assignedKeys) o.assignedKeys = [];
    s.orders[k] = o;
  });
  return s;
}

function saveState_(state) {
  var keys = Object.keys(state.orders);
  if (keys.length > 400) keys.sort().slice(0, keys.length - 400).forEach(function (k) { delete state.orders[k]; });
  PropertiesService.getScriptProperties().setProperty("STATE", JSON.stringify(state));
}

function markAllSeen_() {
  var rows = readOrders_() || [];
  var state = { orders: {} };
  rows.forEach(function (r) { if (r.ref) state.orders[r.ref] = newEntry_(r.status, true); });
  saveState_(state);
}

/* ============================================================
   Helpers
   ============================================================ */

function isPaidOrLater_(status) {
  var s = String(status || "").toLowerCase();
  return s === "payment received" || s === "verified" || s === "delivered";
}
function isVerified_(status)  { return String(status || "").toLowerCase() === "verified"; }
function isDelivered_(status) { return String(status || "").toLowerCase() === "delivered"; }
function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || "")); }
function myEmail_() { return Session.getEffectiveUser().getEmail(); }
function sheetUrl_() { return "https://docs.google.com/spreadsheets/d/" + NOTIFIER.sheetId; }
function trackUrl_(r) { return NOTIFIER.siteUrl + "/track/?ref=" + encodeURIComponent(r.ref); }
function amount_(r) { return r.amount === "" ? "(ipapadala ang quote)" : "₱" + Number(r.amount).toLocaleString("en-PH"); }
function firstName_(name) { var n = String(name || "").trim().split(/\s+/)[0]; return n || "there"; }
function fmt_(d) {
  if (!d) return "";
  try { return Utilities.formatDate(new Date(d), NOTIFIER.timeZone, "MMM d, yyyy h:mm a"); }
  catch (e) { return String(d); }
}
function orderBlock_(r) {
  return "Reference : " + r.ref + "\n" +
         "Product   : " + r.product + (r.qty > 1 ? " x" + r.qty : "") + "\n" +
         "Halaga    : " + amount_(r) + "\n" +
         "Bayad via : " + r.method + "\n" +
         "Pangalan  : " + r.name + "\n" +
         "Email     : " + r.email + "\n" +
         "Mobile    : " + r.mobile + "\n" +
         (r.messenger ? "Messenger : " + r.messenger + "\n" : "") +
         (r.notes ? "Notes     : " + r.notes + "\n" : "") +
         "Oras      : " + fmt_(r.timestamp) + "\n";
}
