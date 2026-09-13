/**
 * ============================================================
 * GDS Digital Solutions — Order backend
 * ------------------------------------------------------------
 * Tumatanggap ng orders mula sa website, nagsusulat sa Google Sheet,
 * nagse-save ng proof of payment sa Drive, at nagpapadala ng email.
 *
 * Basahin ang SETUP.md para sa hakbang-hakbang na pag-install.
 * ============================================================
 */

/* ============================================================
   1. SETTINGS — ito lang ang kailangan mong baguhin
   ============================================================ */
var SETTINGS = {
  // Email na tatanggap ng notification kada bagong order
  ownerEmail: "gdsdigisol@gmail.com",

  // Pangalan ng negosyo — lumalabas sa mga email
  businessName: "GDS Digital Solutions",

  // Live URL ng website mo, walang slash sa dulo.
  // Halimbawa: "https://gdsdigital.github.io/gds-site"
  siteUrl: "https://gdsdigitalsolutions.github.io/gds-site",

  // Pangalan ng sheet tab na pagsusulatan (gagawin kung wala pa)
  sheetName: "Orders",

  // Folder sa Drive kung saan ise-save ang mga resibo
  driveFolder: "GDS Orders",

  // Pangako sa delivery — lumalabas sa email ng customer
  deliveryPromise: "within 1-6 oras pagka-verify ng bayad",

  // Payment details na isasama sa email ng customer
  gcash: { name: "GE***D S.", number: "0919 703 0111" },
  bank:  { name: "PALITAN", accountName: "PALITAN", accountNumber: "PALITAN" },

  // Pinakamalaking tinatanggap na resibo (MB)
  maxProofMB: 6,

  // Ilang order lang kada email sa loob ng isang oras (anti-spam)
  maxOrdersPerHour: 5
};

/* ============================================================
   2. Mga column ng sheet — huwag baguhin ang pagkakasunod-sunod
   ============================================================ */
var HEADERS = [
  "Timestamp", "Reference", "Status", "Product", "Slug", "Qty",
  "Unit Price", "Amount", "Payment Method", "Name", "Email", "Mobile",
  "Messenger", "Notes", "Source", "Proof of Payment", "Payment Ref No.",
  "Last Update", "Internal Notes"
];
var COL = {};
HEADERS.forEach(function (h, i) { COL[h] = i + 1; });

/* ============================================================
   3. Entry points
   ============================================================ */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ ok: false, error: "Walang natanggap na data." });

    var body = JSON.parse(e.postData.contents);

    // Honeypot — kapag may laman, bot ito. Magsasabi tayo ng "ok"
    // pero walang itatala, para hindi nila malaman na na-block sila.
    if (body.website) return json({ ok: true, ref: "GDS-0000-0000" });

    if (body.action === "create") return json(createOrder(body));
    if (body.action === "proof")  return json(attachProof(body));

    return json({ ok: false, error: "Hindi kilalang action." });
  } catch (err) {
    logError("doPost", err);
    return json({ ok: false, error: "May problema sa server. Subukan ulit o i-message mo kami." });
  }
}

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.action === "status") return json(orderStatus(p.ref));
    if (p.action === "ping")   return json({ ok: true, service: "GDS order backend" });
    return json({ ok: false, error: "Hindi kilalang action." });
  } catch (err) {
    logError("doGet", err);
    return json({ ok: false, error: "May problema sa server." });
  }
}

/* ============================================================
   4. Paggawa ng order
   ============================================================ */

function createOrder(b) {
  var name  = clean(b.name, 120);
  var email = clean(b.email, 160);

  if (!name)  return { ok: false, error: "Kailangan ang pangalan." };
  if (!isEmail(email)) return { ok: false, error: "Hindi tama ang email address." };
  if (!clean(b.product, 200)) return { ok: false, error: "Kailangan ang product." };

  if (isRateLimited(email)) {
    return { ok: false, error: "Marami ka nang order sa nakaraang oras. Message mo na lang kami sa Facebook." };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  var ref;
  try {
    ref = nextReference();

    var sheet = getSheet();
    var now = new Date();
    sheet.appendRow([
      now,
      ref,
      "Pending",
      clean(b.product, 200),
      clean(b.productSlug, 100),
      Number(b.qty) || 1,
      b.unitPrice === "" || b.unitPrice === null ? "" : Number(b.unitPrice),
      b.amount === "" || b.amount === null ? "" : Number(b.amount),
      clean(b.paymentMethod, 60),
      name,
      email,
      clean(b.mobile, 40),
      clean(b.messenger, 160),
      clean(b.notes, 2000),
      clean(b.source, 60),
      "",
      "",
      now,
      ""
    ]);
  } finally {
    lock.releaseLock();
  }

  // Ang email ay hindi dapat pumigil sa order kapag nabigo
  try { emailCustomerNewOrder(ref, b, name, email); } catch (err) { logError("emailCustomer", err); }
  try { emailOwnerNewOrder(ref, b, name, email); }    catch (err) { logError("emailOwner", err); }

  return { ok: true, ref: ref };
}

/* ============================================================
   5. Proof of payment
   ============================================================ */

function attachProof(b) {
  var ref = clean(b.ref, 40).toUpperCase();
  if (!ref) return { ok: false, error: "Walang reference number." };
  if (!b.file || !b.file.data) return { ok: false, error: "Walang natanggap na file." };

  var approxMB = (String(b.file.data).length * 0.75) / (1024 * 1024);
  if (approxMB > SETTINGS.maxProofMB) {
    return { ok: false, error: "Masyadong malaki ang file. Hanggang " + SETTINGS.maxProofMB + "MB lang." };
  }

  var allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.indexOf(b.file.type) === -1) {
    return { ok: false, error: "JPG, PNG, o PDF lang ang tinatanggap." };
  }

  var found = findRow(ref);
  if (!found) return { ok: false, error: "Walang order na tumutugma sa reference na ito." };

  var ext = b.file.type === "application/pdf" ? "pdf"
          : b.file.type === "image/png" ? "png"
          : b.file.type === "image/webp" ? "webp" : "jpg";

  var blob = Utilities.newBlob(
    Utilities.base64Decode(b.file.data),
    b.file.type,
    ref + "-proof." + ext
  );

  var folder = monthFolder();
  var file = folder.createFile(blob);
  file.setDescription("Proof of payment — " + ref);

  var sheet = getSheet();
  sheet.getRange(found.row, COL["Proof of Payment"]).setValue(file.getUrl());
  sheet.getRange(found.row, COL["Payment Ref No."]).setValue(clean(b.paidRef, 80));
  sheet.getRange(found.row, COL["Status"]).setValue("Payment Received");
  sheet.getRange(found.row, COL["Last Update"]).setValue(new Date());

  try { emailOwnerProof(ref, found, file.getUrl()); } catch (err) { logError("emailOwnerProof", err); }

  return { ok: true, ref: ref };
}

/* ============================================================
   6. Status lookup — status lang, walang personal na datos
   ============================================================ */

function orderStatus(refRaw) {
  var ref = clean(refRaw, 40).toUpperCase();
  if (!ref) return { ok: false, error: "Walang reference number." };

  var found = findRow(ref);
  if (!found) return { ok: false, error: "Walang order na tumutugma sa reference na ito." };

  var updated = found.values[COL["Last Update"] - 1];
  return {
    ok: true,
    ref: ref,
    status: String(found.values[COL["Status"] - 1] || "Pending"),
    updated: updated ? Utilities.formatDate(new Date(updated), Session.getScriptTimeZone(), "MMM d, yyyy 'ng' h:mm a") : ""
  };
}

/* ============================================================
   7. Mga email
   ============================================================ */

function emailCustomerNewOrder(ref, b, name, email) {
  var amount = b.amount === "" || b.amount === null ? null : Number(b.amount);
  var isBank = String(b.paymentMethod).toLowerCase().indexOf("bank") > -1;

  var payBlock = amount === null
    ? "<p>Ipapadala namin sa iyo ang eksaktong halaga at ang payment details sa lalong madaling panahon.</p>"
    : "<table cellpadding='0' cellspacing='0' style='width:100%;border-collapse:collapse;margin:16px 0'>" +
        row("Halagang babayaran", "<strong style='font-size:18px;color:#0065eb'>PHP " + fmt(amount) + "</strong>") +
        (isBank
          ? row("Bangko", esc(SETTINGS.bank.name)) +
            row("Account name", esc(SETTINGS.bank.accountName)) +
            row("Account number", "<strong>" + esc(SETTINGS.bank.accountNumber) + "</strong>")
          : row("GCash name", esc(SETTINGS.gcash.name)) +
            row("GCash number", "<strong>" + esc(SETTINGS.gcash.number) + "</strong>")) +
        row("Ilagay sa notes", "<strong>" + ref + "</strong>") +
      "</table>";

  var trackUrl = SETTINGS.siteUrl ? SETTINGS.siteUrl + "/track/?ref=" + encodeURIComponent(ref) : "";

  var html = wrap(
    "Natanggap namin ang order mo",
    "<p>Salamat, " + esc(name) + "! Ito ang detalye ng order mo.</p>" +
    "<div style='background:#00102c;color:#03c6fa;font-family:monospace;font-size:18px;font-weight:bold;" +
      "padding:14px 18px;border-radius:10px;text-align:center;letter-spacing:1px;margin:18px 0'>" + ref + "</div>" +
    "<table cellpadding='0' cellspacing='0' style='width:100%;border-collapse:collapse'>" +
      row("Product", esc(b.product)) +
      row("Dami", String(Number(b.qty) || 1)) +
      row("Paraan ng bayad", esc(b.paymentMethod)) +
    "</table>" +
    "<h3 style='font-size:16px;margin:26px 0 8px'>Paano magbayad</h3>" +
    payBlock +
    "<p><strong>Mahalaga:</strong> ilagay ang reference na <strong>" + ref + "</strong> sa notes o message " +
      "ng bayad mo para agad namin itong matukoy.</p>" +
    "<p>Pagkatapos magbayad, i-upload ang screenshot ng resibo o ipadala ito sa amin sa Messenger. " +
      "Ve-verify namin ito at ipapadala ang file mo " + esc(SETTINGS.deliveryPromise) + ".</p>" +
    (trackUrl
      ? "<p style='margin-top:24px'><a href='" + trackUrl + "' style='background:#0065eb;color:#fff;text-decoration:none;" +
        "padding:12px 22px;border-radius:10px;display:inline-block;font-weight:600'>I-track ang order</a></p>"
      : "") +
    "<p style='margin-top:24px;font-size:13px;color:#6a7b96'>Hindi kami humihingi ng password, OTP, o card details. " +
      "Kung may nag-message sa iyo na humihingi nito, hindi iyon kami.</p>"
  );

  MailApp.sendEmail({
    to: email,
    subject: SETTINGS.businessName + " — Order " + ref,
    htmlBody: html,
    name: SETTINGS.businessName
  });
}

function emailOwnerNewOrder(ref, b, name, email) {
  if (!SETTINGS.ownerEmail || SETTINGS.ownerEmail.indexOf("PALITAN") === 0) return;

  var html = wrap(
    "Bagong order: " + ref,
    "<table cellpadding='0' cellspacing='0' style='width:100%;border-collapse:collapse'>" +
      row("Reference", "<strong>" + ref + "</strong>") +
      row("Product", esc(b.product) + " x" + (Number(b.qty) || 1)) +
      row("Halaga", b.amount === "" ? "(walang presyo — quote)" : "PHP " + fmt(Number(b.amount))) +
      row("Bayad", esc(b.paymentMethod)) +
      row("Pangalan", esc(name)) +
      row("Email", esc(email)) +
      row("Mobile", esc(b.mobile)) +
      row("Messenger", esc(b.messenger) || "—") +
      row("Notes", esc(b.notes) || "—") +
      row("Galing sa", esc(b.source) || "direkta") +
    "</table>"
  );

  MailApp.sendEmail({
    to: SETTINGS.ownerEmail,
    subject: "[Order] " + ref + " — " + b.product,
    htmlBody: html,
    name: SETTINGS.businessName
  });
}

function emailOwnerProof(ref, found, fileUrl) {
  if (!SETTINGS.ownerEmail || SETTINGS.ownerEmail.indexOf("PALITAN") === 0) return;

  MailApp.sendEmail({
    to: SETTINGS.ownerEmail,
    subject: "[Bayad] " + ref + " — may proof of payment",
    htmlBody: wrap(
      "May proof of payment: " + ref,
      "<table cellpadding='0' cellspacing='0' style='width:100%;border-collapse:collapse'>" +
        row("Reference", "<strong>" + ref + "</strong>") +
        row("Product", esc(String(found.values[COL["Product"] - 1]))) +
        row("Pangalan", esc(String(found.values[COL["Name"] - 1]))) +
        row("Halaga", String(found.values[COL["Amount"] - 1] || "—")) +
      "</table>" +
      "<p style='margin-top:20px'><a href='" + fileUrl + "'>Tingnan ang resibo</a></p>" +
      "<p style='font-size:13px;color:#6a7b96'>Kapag tama na, palitan ang Status sa sheet ng " +
        "<strong>Verified</strong>, at <strong>Delivered</strong> kapag naipadala mo na ang file.</p>"
    ),
    name: SETTINGS.businessName
  });
}

/* ============================================================
   8. Mga katulong
   ============================================================ */

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SETTINGS.sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS.sheetName);
    sheet.appendRow(HEADERS);
    var head = sheet.getRange(1, 1, 1, HEADERS.length);
    head.setFontWeight("bold").setBackground("#00102c").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(COL["Notes"], 260);
    sheet.setColumnWidth(COL["Proof of Payment"], 220);

    // Dropdown para sa Status column
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending", "Payment Received", "Verified", "Delivered", "Cancelled"], true)
      .setAllowInvalid(true).build();
    sheet.getRange(2, COL["Status"], 2000, 1).setDataValidation(rule);
  }
  return sheet;
}

function nextReference() {
  var props = PropertiesService.getScriptProperties();
  var now = new Date();
  var period = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyMM");

  var lastPeriod = props.getProperty("REF_PERIOD");
  var counter = Number(props.getProperty("REF_COUNTER") || 0);

  if (lastPeriod !== period) { counter = 0; props.setProperty("REF_PERIOD", period); }

  counter++;
  props.setProperty("REF_COUNTER", String(counter));

  return "GDS-" + period + "-" + ("0000" + counter).slice(-4);
}

function findRow(ref) {
  var sheet = getSheet();
  var last = sheet.getLastRow();
  if (last < 2) return null;

  var refs = sheet.getRange(2, COL["Reference"], last - 1, 1).getValues();
  for (var i = 0; i < refs.length; i++) {
    if (String(refs[i][0]).toUpperCase().trim() === ref) {
      var row = i + 2;
      return { row: row, values: sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0] };
    }
  }
  return null;
}

function monthFolder() {
  var root = folderByName(DriveApp.getRootFolder(), SETTINGS.driveFolder);
  var month = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  return folderByName(root, month);
}

function folderByName(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function isRateLimited(email) {
  var cache = CacheService.getScriptCache();
  var key = "rate_" + Utilities.base64Encode(email.toLowerCase()).replace(/[^A-Za-z0-9]/g, "").slice(0, 40);
  var count = Number(cache.get(key) || 0);
  if (count >= SETTINGS.maxOrdersPerHour) return true;
  cache.put(key, String(count + 1), 3600);
  return false;
}

function clean(v, max) {
  return String(v === undefined || v === null ? "" : v).trim().slice(0, max || 500);
}
function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }
function fmt(n) { return Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function esc(s) {
  return String(s === undefined || s === null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function row(label, value) {
  return "<tr><td style='padding:9px 0;border-bottom:1px solid #eef2f8;color:#51617b;font-size:14px;width:42%'>" +
    esc(label) + "</td><td style='padding:9px 0;border-bottom:1px solid #eef2f8;font-size:14px'>" + value + "</td></tr>";
}
function wrap(title, inner) {
  return "<div style=\"font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;" +
    "max-width:560px;margin:0 auto;padding:28px 24px;color:#0b1b36;line-height:1.6\">" +
    "<div style='font-weight:800;font-size:15px;letter-spacing:-.3px;color:#00102c;margin-bottom:4px'>" +
      esc(SETTINGS.businessName) + "</div>" +
    "<div style='height:3px;width:52px;background:linear-gradient(90deg,#0065eb,#03c6fa);margin-bottom:22px'></div>" +
    "<h2 style='font-size:20px;margin:0 0 14px'>" + esc(title) + "</h2>" +
    inner +
    "<div style='margin-top:32px;padding-top:16px;border-top:1px solid #eef2f8;font-size:12px;color:#6a7b96'>" +
      esc(SETTINGS.businessName) + (SETTINGS.siteUrl ? " &middot; <a href='" + SETTINGS.siteUrl + "' style='color:#0065eb'>" + esc(SETTINGS.siteUrl) + "</a>" : "") +
    "</div></div>";
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function logError(where, err) {
  console.error(where + ": " + (err && err.stack ? err.stack : err));
}

/* ============================================================
   9. Test — patakbuhin ito sa editor para tiyaking gumagana
   ============================================================ */

function testSetup() {
  var sheet = getSheet();
  Logger.log("Sheet: " + sheet.getName() + " (" + sheet.getLastRow() + " na row)");
  Logger.log("Timezone: " + Session.getScriptTimeZone());
  Logger.log("Susunod na reference: " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMM"));
  Logger.log("Drive folder: " + monthFolder().getName());
  Logger.log("Owner email: " + SETTINGS.ownerEmail);
  if (SETTINGS.ownerEmail.indexOf("PALITAN") === 0) {
    Logger.log("!! Palitan ang ownerEmail sa SETTINGS bago gamitin.");
  }
}

function testOrder() {
  var res = createOrder({
    action: "create",
    product: "Test Product",
    productSlug: "test",
    qty: 1,
    unitPrice: 500,
    amount: 500,
    paymentMethod: "GCash",
    name: "Test Customer",
    email: SETTINGS.ownerEmail,
    mobile: "09171234567",
    messenger: "",
    notes: "Test order lang ito — burahin ang row na ito pagkatapos.",
    source: "test"
  });
  Logger.log(JSON.stringify(res));
}

/* ============================================================
   10. Auto-update ng "Last Update" kapag pinalitan ang Status
   ------------------------------------------------------------
   Simple trigger — kusang tumatakbo tuwing may ine-edit sa sheet.
   Walang kailangang i-deploy ulit; i-save lang ang script.
   ============================================================ */

function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (sheet.getName() !== SETTINGS.sheetName) return;

    // Status column lang ang binabantayan, at hindi ang header row
    if (e.range.getColumn() !== COL["Status"]) return;

    var start = Math.max(e.range.getRow(), 2);
    var end = e.range.getRow() + e.range.getNumRows() - 1;
    for (var r = start; r <= end; r++) {
      sheet.getRange(r, COL["Last Update"]).setValue(new Date());
    }
  } catch (err) {
    // Ang edit ay hindi dapat masira kahit pumalya ito
  }
}
