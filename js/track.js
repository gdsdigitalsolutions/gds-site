/* ============================================================
   GDS — order status lookup
   Status lang ang kinukuha — walang personal na impormasyon.
   ============================================================ */
(function () {
  "use strict";

  var G = window.GDS;
  if (!G) return;

  var endpoint = G.get("order.endpoint");
  var form = document.getElementById("track-form");
  if (!form) return;

  var input = document.getElementById("f-ref");
  var btn = document.getElementById("track-btn");
  var errBox = document.getElementById("track-error");
  var errMsg = document.getElementById("track-error-msg");
  var result = document.getElementById("track-result");

  // Ang ladder — kailangang tumugma sa Status column ng Google Sheet
  var STAGES = [
    { key: "pending",  label: "Order na-receive",   note: "Nasa amin na ang detalye ng order mo." },
    { key: "received", label: "Natanggap ang bayad", note: "Nakita namin ang proof of payment mo." },
    { key: "verified", label: "Verified",            note: "Tama ang bayad. Inihahanda na ang file mo." },
    { key: "delivered", label: "Naipadala na",       note: "Nasa email o Messenger mo na ang file at tutorial." }
  ];

  var BADGES = {
    pending:   { text: "Hinihintay ang bayad", cls: "tag--amber" },
    received:  { text: "Tinitingnan ang bayad", cls: "tag--amber" },
    verified:  { text: "Verified", cls: "tag--green" },
    delivered: { text: "Naipadala na", cls: "tag--green" },
    cancelled: { text: "Kanselado", cls: "tag--red" }
  };

  function normalize(s) {
    s = String(s || "").toLowerCase().trim();
    if (s.indexOf("deliver") > -1 || s.indexOf("naipadala") > -1) return "delivered";
    if (s.indexOf("verif") > -1) return "verified";
    if (s.indexOf("receiv") > -1 || s.indexOf("paid") > -1 || s.indexOf("bayad") > -1) return "received";
    if (s.indexOf("cancel") > -1 || s.indexOf("kansela") > -1) return "cancelled";
    return "pending";
  }

  function renderLadder(status) {
    var idx = STAGES.map(function (s) { return s.key; }).indexOf(status);
    var cancelled = status === "cancelled";

    document.getElementById("res-ladder").innerHTML = STAGES.map(function (st, i) {
      var cls = "";
      if (!cancelled) {
        if (i < idx) cls = "is-done";
        else if (i === idx) cls = "is-current";
      }
      var dot = i < idx && !cancelled
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
        : String(i + 1);
      return '<li class="' + cls + '">' +
        '<span class="ladder__dot">' + dot + "</span>" +
        "<div><strong>" + st.label + "</strong><span>" + st.note + "</span></div></li>";
    }).join("");
  }

  function showError(msg) {
    result.hidden = true;
    errMsg.textContent = " " + msg;
    errBox.hidden = false;
  }

  function lookup(ref) {
    errBox.hidden = true;
    result.hidden = true;

    if (!endpoint) {
      showError("Hindi pa aktibo ang online tracking. I-message mo kami kasama ang reference mo at che-check namin.");
      return;
    }

    btn.dataset.label = btn.textContent;
    btn.textContent = "Hinahanap…";
    btn.setAttribute("aria-disabled", "true");

    var url = endpoint + "?action=status&ref=" + encodeURIComponent(ref);

    fetch(url, { method: "GET" })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var data;
        try { data = JSON.parse(txt); }
        catch (e) { throw new Error("Hindi maintindihan ang sagot ng server. Subukan ulit mamaya."); }
        if (!data.ok) throw new Error(data.error || "Walang order na tumutugma sa reference na ito. Tiyakin mong tama ang pagkakasulat.");

        var status = normalize(data.status);
        document.getElementById("res-ref").textContent = data.ref || ref;

        var badge = BADGES[status] || BADGES.pending;
        var b = document.getElementById("res-badge");
        b.textContent = badge.text;
        b.className = "tag " + badge.cls;

        renderLadder(status);

        document.getElementById("res-updated").textContent =
          data.updated ? "Huling update: " + data.updated : "";

        result.hidden = false;
      })
      .catch(function (err) { showError(err.message); })
      .finally(function () {
        btn.textContent = btn.dataset.label || "Tingnan ang status";
        btn.removeAttribute("aria-disabled");
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ref = input.value.trim().toUpperCase();
    var field = input.closest(".field");
    if (!ref) {
      field.classList.add("has-error");
      input.focus();
      return;
    }
    field.classList.remove("has-error");

    var url = new URL(window.location.href);
    url.searchParams.set("ref", ref);
    history.replaceState(null, "", url);

    lookup(ref);
  });

  // Awtomatikong hanapin kapag may ?ref= sa link (galing sa email o confirmation page)
  var initial = new URLSearchParams(window.location.search).get("ref");
  if (initial) {
    input.value = initial.toUpperCase();
    lookup(input.value);
  }
})();
