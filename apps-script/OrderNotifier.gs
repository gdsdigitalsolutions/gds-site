/**
 * ============================================================
 * GDS Digital Solutions — ORDER NOTIFIER (hiwalay sa order backend)
 * ------------------------------------------------------------
 * Nag-e-email kapag may (1) bagong order at (2) na-upload na resibo
 * (Status = "Payment Received") sa Orders sheet:
 *   • sa IYO  — notification na may buong detalye + link ng resibo
 *   • sa BUYER — confirmation ng order (may payment details at
 *                reference) at confirmation na natanggap ang resibo
 *
 * BAKIT HIWALAY: ang order backend ay nasa gdsdigisol, na HINDI
 * makapag-grant ng Gmail send scope. Kaya ang script na ito ay
 * tumatakbo sa PERSONAL account mo (na kayang mag-email) at BINABASA
 * lang ang Orders sheet kada 5 minuto. Walang binabago sa backend.
 * Ang "From" ng email ay ang personal account; ang Reply-To ay ang
 * business email (NOTIFIER.replyTo) para doon pumunta ang sagot ng buyer.
 *
 * PAANO I-SETUP (isang beses, ~5 minuto):
 *   1. Sa gdsdigisol: buksan ang "GDS Orders" (File B) → Share →
 *      idagdag ang PERSONAL email mo → Viewer ay sapat na.
 *   2. Mag-login sa PERSONAL account → https://script.google.com →
 *      New project → burahin ang laman → i-paste ang buong file na ito
 *      → i-save (pangalanan: "GDS Order Notifier").
 *   3. Sa function dropdown piliin ang  setup  → Run → Allow
 *      (hihingi ng Sheets + email permission — sa personal account ito OK).
 *   4. Tapos. Kada 5 minuto tatakbo ito mag-isa. Ang notification mo ay
 *      ipinapadala sa mismong account na nagpatakbo ng setup.
 *
 * KAPAG NAG-UPDATE KA NG FILE NA ITO: i-paste lang ang bago at i-save —
 *   hindi na kailangang i-run ulit ang setup (nananatili ang trigger).
 *
 * TEST: mag-test order sa website (gumamit ng ibang email kada test —
 *      may 5-orders-per-email-per-hour na limit ang backend). Sa loob ng
 *      ~5 min: email sa iyo + email sa buyer. Mag-upload ng resibo →
 *      pangalawang pares. (O patakbuhin ang  checkNow  para hindi maghintay.)
 *      Burahin ang test row pagkatapos.
 *
 * MGA FUNCTION:
 *   setup     — gumagawa ng 5-minutong trigger (isang beses lang)
 *   checkNow  — manual na pagtakbo ngayon (pang-test)
 *   reset     — kalimutan ang na-notify na (mag-uulit ng email sa lahat!)
 *   stop      — tanggalin ang trigger
 * ============================================================ */

var NOTIFIER = {
  // Spreadsheet ID ng "GDS Orders" (File B, gdsdigisol-owned, shared sa iyo)
  sheetId: "1SThEOPeMHNcESk2NfPid9QFFyGu8fMSXNn6ZiiUSqfw",
  sheetName: "Orders",
  timeZone: "Asia/Manila",
  everyMinutes: 5,

  // Buyer emails — i-false kung ayaw mo munang mag-email sa buyer
  notifyBuyer: true,
  businessName: "GDS Digital Solutions",
  // Dito pupunta ang reply ng buyer (ang official business email na nasa site)
  replyTo: "gdsdigisol@gmail.com",
  siteUrl: "https://gdsdigitalsolutions.github.io/gds-site",
  deliveryPromise: "within 1–6 oras pagka-verify ng bayad",

  // Payment details sa buyer email — DAPAT PAREHO ng js/config.js sa site
  gcash: { name: "GE***D S.", number: "0919 703 0111" },
  bank:  { name: "MariBank", accountName: "GERALD SINIO", accountNumber: "1847 4603 430" },

  // Kung ang unang pagtakbo ay may LUMANG orders pa, huwag i-email lahat —
  // markahan lang bilang nakita na. (true = tahimik na simula)
  quietFirstRun: true
};

/* ---------- trigger management ---------- */

function setup() {
  stop();
  ScriptApp.newTrigger("checkOrders").timeBased().everyMinutes(NOTIFIER.everyMinutes).create();
  // Unang pagtakbo: kilalanin ang kasalukuyang laman para hindi mag-spam ng lumang orders
  if (NOTIFIER.quietFirstRun && !PropertiesService.getScriptProperties().getProperty("STATE")) {
    markAllSeen_();
    Logger.log("Setup OK. Nakita na ang kasalukuyang orders (walang ipinadalang email). Kada " +
      NOTIFIER.everyMinutes + " min na ang check. Notification → " + myEmail_() +
      " · Buyer emails: " + (NOTIFIER.notifyBuyer ? "ON" : "OFF"));
  } else {
    Logger.log("Setup OK. Kada " + NOTIFIER.everyMinutes + " min na ang check. Notification → " + myEmail_() +
      " · Buyer emails: " + (NOTIFIER.notifyBuyer ? "ON" : "OFF"));
  }
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
  Logger.log("Tapos ang manual check. Tingnan ang inbox mo.");
}

/* ---------- ang pangunahing check (tumatakbo kada 5 min) ---------- */

function checkOrders() {
  var rows = readOrders_();
  if (!rows) return;

  var state = loadState_();
  var sent = 0;

  rows.forEach(function (r) {
    if (!r.ref) return;
    var s = state.orders[r.ref];
    if (!s) s = state.orders[r.ref] = { status: r.status, newOwner: false, newBuyer: false, paidOwner: false, paidBuyer: false };
    s.status = r.status;

    // (1) Bagong order — isang beses kada tatanggap; hiwalay ang retry ng bawat isa
    if (!s.newOwner)  { if (trySend_(function () { emailOwnerNew_(r); }, r.ref, "owner/new"))   { s.newOwner = true;  sent++; } }
    if (!s.newBuyer)  { if (!NOTIFIER.notifyBuyer || !isEmail_(r.email)) s.newBuyer = true;
                        else if (trySend_(function () { emailBuyerNew_(r); }, r.ref, "buyer/new")) { s.newBuyer = true; sent++; } }

    // (2) Na-upload ang resibo (Status → Payment Received / Verified / Delivered)
    if (isPaid_(r.status)) {
      if (!s.paidOwner) { if (trySend_(function () { emailOwnerPaid_(r); }, r.ref, "owner/paid"))  { s.paidOwner = true; sent++; } }
      if (!s.paidBuyer) { if (!NOTIFIER.notifyBuyer || !isEmail_(r.email)) s.paidBuyer = true;
                          else if (trySend_(function () { emailBuyerPaid_(r); }, r.ref, "buyer/paid")) { s.paidBuyer = true; sent++; } }
    }
  });

  saveState_(state);
  if (sent) Logger.log(sent + " email(s) ipinadala.");
}

function trySend_(fn, ref, what) {
  try { fn(); return true; }
  catch (err) { console.error("Email failed (" + what + ") for " + ref + ": " + err); return false; }
}

/* ---------- EMAIL SA IYO ---------- */

function emailOwnerNew_(r) {
  var amount = amount_(r);
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] Bagong order " + r.ref + " — " + r.product + " " + amount + " (" + (r.status || "Pending") + ")",
    body:
      "MAY BAGONG ORDER.\n\n" +
      "Reference : " + r.ref + "\n" +
      "Product   : " + r.product + (r.qty > 1 ? " x" + r.qty : "") + "\n" +
      "Halaga    : " + amount + "\n" +
      "Bayad via : " + r.method + "\n" +
      "Pangalan  : " + r.name + "\n" +
      "Email     : " + r.email + "\n" +
      "Mobile    : " + r.mobile + "\n" +
      (r.messenger ? "Messenger : " + r.messenger + "\n" : "") +
      (r.notes ? "Notes     : " + r.notes + "\n" : "") +
      "Oras      : " + fmt_(r.timestamp) + "\n" +
      "Status    : " + (r.status || "Pending") + "\n\n" +
      "Hintayin ang resibo (may susunod na email kapag na-upload), o i-message ang buyer.\n\n" +
      "Orders sheet: " + sheetUrl_() + "\n"
  });
}

function emailOwnerPaid_(r) {
  var amount = amount_(r);
  MailApp.sendEmail({
    to: myEmail_(), name: "GDS Order Notifier",
    subject: "[GDS] RESIBO na-upload — " + r.ref + " — i-verify ang " + amount,
    body:
      "NAG-UPLOAD NG RESIBO ANG BUYER. I-verify ang bayad sa GCash/MariBank app mo.\n\n" +
      "Reference     : " + r.ref + "\n" +
      "Product       : " + r.product + "\n" +
      "Halaga        : " + amount + "\n" +
      "Bayad via     : " + r.method + "\n" +
      "Pangalan      : " + r.name + "\n" +
      "Email         : " + r.email + "\n" +
      "Mobile        : " + r.mobile + "\n" +
      (r.messenger ? "Messenger     : " + r.messenger + "\n" : "") +
      (r.paidRef ? "Payment ref # : " + r.paidRef + "\n" : "") +
      "Resibo (Drive): " + (r.proof || "(walang link)") + "\n" +
      "Na-upload     : " + fmt_(r.lastUpdate) + "\n\n" +
      "Kapag totoo ang pera: Status → Verified, tapos i-deliver, tapos Status → Delivered.\n\n" +
      "Orders sheet: " + sheetUrl_() + "\n"
  });
}

/* ---------- EMAIL SA BUYER ---------- */

function emailBuyerNew_(r) {
  var amount = amount_(r);
  var quote = r.amount === "";
  var first = firstName_(r.name);
  var pay = quote
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
      "Hi " + first + ",\n\n" +
      "Salamat! Natanggap namin ang order mo.\n\n" +
      "Reference : " + r.ref + "   ← i-save ito\n" +
      "Product   : " + r.product + (r.qty > 1 ? " x" + r.qty : "") + "\n" +
      "Halaga    : " + amount + "\n" +
      "Bayad via : " + r.method + "\n\n" +
      pay + "\n" +
      "I-TRACK ANG ORDER MO\n" +
      "  " + NOTIFIER.siteUrl + "/track/?ref=" + encodeURIComponent(r.ref) + "\n\n" +
      "Para sa seguridad mo: hindi kami humihingi ng password, OTP, o card details — kailanman.\n" +
      "Isang GCash at isang bank account lang ang gamit namin (ang nasa itaas at sa website).\n" +
      "Kung may nag-message sa iyo ng ibang account number, hindi iyon kami.\n\n" +
      "May tanong? I-reply lang ang email na ito o i-message kami sa Facebook.\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

function emailBuyerPaid_(r) {
  var amount = amount_(r);
  var first = firstName_(r.name);
  var next;
  if (r.slug === "bayadtrack") {
    next = "Pagka-verify ng payment, iko-coordinate namin ang client-list import, Google Drive setup,\n" +
           "at walkthrough ng BayadTrack — kakausapin ka namin sa Messenger o email na ito.";
  } else if (r.slug === "gds-ont-flasher") {
    next = "Pagka-verify ng bayad, ipapadala namin ang download link at license key via email o Messenger,\n" +
           "kasama ang gabay sa paggamit. Paalala: 1 license key = 1 PC.";
  } else {
    next = "Pagka-verify ng bayad, kakausapin ka namin para sa susunod na hakbang.";
  }

  MailApp.sendEmail({
    to: r.email, replyTo: NOTIFIER.replyTo, name: NOTIFIER.businessName,
    subject: "[" + NOTIFIER.businessName + "] Natanggap ang resibo mo — " + r.ref,
    body:
      "Hi " + first + ",\n\n" +
      "Natanggap namin ang resibo mo para sa order " + r.ref + " (" + r.product + ", " + amount + ").\n\n" +
      "ANO ANG SUSUNOD\n" +
      "  Manu-mano naming che-check ang bayad — " + NOTIFIER.deliveryPromise + ".\n" +
      "  " + next + "\n\n" +
      "I-TRACK ANG ORDER MO\n" +
      "  " + NOTIFIER.siteUrl + "/track/?ref=" + encodeURIComponent(r.ref) + "\n\n" +
      "Kung lampas na sa sinabi naming oras at wala pa, i-reply lang ang email na ito kasama ang reference mo.\n\n" +
      "— " + NOTIFIER.businessName + "\n" + NOTIFIER.siteUrl + "\n"
  });
}

/* ---------- pagbasa ng sheet ---------- */

function readOrders_() {
  var ss;
  try { ss = SpreadsheetApp.openById(NOTIFIER.sheetId); }
  catch (e) { console.error("Hindi mabuksan ang sheet — na-share ba ito sa account na ito? " + e); return null; }

  var sh = ss.getSheetByName(NOTIFIER.sheetName);
  if (!sh) { console.error("Walang tab na '" + NOTIFIER.sheetName + "'."); return null; }

  var data = sh.getDataRange().getValues();
  if (data.length < 2) return [];

  var H = data[0].map(function (h) { return String(h).trim(); });
  var col = function (name) { return H.indexOf(name); };
  var get = function (row, name) { var i = col(name); return i < 0 ? "" : row[i]; };

  var out = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    out.push({
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
      lastUpdate: get(row, "Last Update")
    });
  }
  return out;
}

/* ---------- state (ano na ang na-notify) ---------- */

function loadState_() {
  var raw = PropertiesService.getScriptProperties().getProperty("STATE");
  var s = raw ? JSON.parse(raw) : { orders: {} };
  if (!s.orders) s.orders = {};
  // Migration mula sa lumang bersyon ({status, paidNotified}) — huwag i-email ang buyer nang retroactive
  Object.keys(s.orders).forEach(function (k) {
    var o = s.orders[k];
    if (o.newOwner === undefined) {
      var paid = !!o.paidNotified;
      s.orders[k] = { status: o.status, newOwner: true, newBuyer: true, paidOwner: paid, paidBuyer: paid };
    }
  });
  return s;
}

function saveState_(state) {
  // Panatilihing maliit: itago lang ang huling 400 na reference
  var keys = Object.keys(state.orders);
  if (keys.length > 400) {
    keys.sort().slice(0, keys.length - 400).forEach(function (k) { delete state.orders[k]; });
  }
  PropertiesService.getScriptProperties().setProperty("STATE", JSON.stringify(state));
}

function markAllSeen_() {
  var rows = readOrders_() || [];
  var state = { orders: {} };
  rows.forEach(function (r) {
    if (r.ref) state.orders[r.ref] = { status: r.status, newOwner: true, newBuyer: true, paidOwner: isPaid_(r.status), paidBuyer: isPaid_(r.status) };
  });
  saveState_(state);
}

/* ---------- helpers ---------- */

function isPaid_(status) {
  // "Payment Received", "Verified", at "Delivered" ay lahat lampas na sa pag-upload ng resibo
  var s = String(status || "").toLowerCase();
  return s === "payment received" || s === "verified" || s === "delivered";
}

function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || "")); }

function myEmail_() { return Session.getEffectiveUser().getEmail(); }

function sheetUrl_() { return "https://docs.google.com/spreadsheets/d/" + NOTIFIER.sheetId; }

function amount_(r) {
  return r.amount === "" ? "(ipapadala ang quote)" : "₱" + Number(r.amount).toLocaleString("en-PH");
}

function firstName_(name) {
  var n = String(name || "").trim().split(/\s+/)[0];
  return n || "there";
}

function fmt_(d) {
  if (!d) return "";
  try { return Utilities.formatDate(new Date(d), NOTIFIER.timeZone, "MMM d, yyyy h:mm a"); }
  catch (e) { return String(d); }
}
