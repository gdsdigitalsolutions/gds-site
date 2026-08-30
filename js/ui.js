/* ============================================================
   GDS — shared UI behaviour
   Umaasa sa: config.js at products.js (naka-load bago ito)
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.GDS_CONFIG || {};
  var PRODUCTS = window.GDS_PRODUCTS || [];

  /* ---------- helpers ---------- */

  // "contact.email" -> value, o "" kapag wala
  function get(path, fallback) {
    var v = path.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : undefined;
    }, CFG);
    if (v === undefined || v === null || v === "") return fallback === undefined ? "" : fallback;
    return v;
  }

  function bySlug(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }

  function money(n) {
    var sym = get("order.currencySymbol", "₱");
    return sym + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function priceLabel(p) {
    if (p.quoteOnly) return "Libreng quote";
    if (!get("site.showPrices", true) || p.price === null || p.price === undefined) return "Message for price";
    return money(p.price);
  }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Nagbibigay ng tamang relative path depende sa lalim ng page
  function root() {
    var d = document.documentElement.getAttribute("data-root");
    return d === null ? "" : d;
  }

  /* ---------- config slots ----------
     <span data-gds-text="contact.email"></span>
     <a data-gds-href="contact.messenger">...</a>
     <div data-gds-require="payment.gcash.accountNumber">...</div>  (itinatago kapag wala)
     <div data-gds-unless="order.endpoint">...</div>                (ipinapakita kapag wala) */
  function fillSlots(scope) {
    scope = scope || document;

    scope.querySelectorAll("[data-gds-text]").forEach(function (el) {
      var v = get(el.getAttribute("data-gds-text"));
      if (v) el.textContent = v;
      else if (el.hasAttribute("data-gds-fallback")) el.textContent = el.getAttribute("data-gds-fallback");
    });

    scope.querySelectorAll("[data-gds-href]").forEach(function (el) {
      var key = el.getAttribute("data-gds-href");
      var v = get(key);
      if (!v) return; // iniiwan ang nakasulat na fallback href
      if (key === "contact.email") v = "mailto:" + v;
      else if (key === "contact.mobile") v = "tel:" + v.replace(/[^\d+]/g, "");
      el.setAttribute("href", v);
    });

    scope.querySelectorAll("[data-gds-require]").forEach(function (el) {
      var keys = el.getAttribute("data-gds-require").split(",");
      var ok = keys.every(function (k) { return !!get(k.trim()); });
      if (!ok) el.hidden = true;
    });

    // Lumalabas lang kapag LAHAT ng nakalistang key ay blangko —
    // hal. ang "inaayos pa" na notice, na dapat mawala sa sandaling
    // may isa nang paraan ng bayad o contact na naka-set.
    scope.querySelectorAll("[data-gds-unless]").forEach(function (el) {
      var keys = el.getAttribute("data-gds-unless").split(",");
      var allMissing = keys.every(function (k) { return !get(k.trim()); });
      el.hidden = !allMissing;
    });
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- copy buttons ----------
     <button class="copy-btn" data-copy="0917...">Kopyahin</button> */
  function initCopy() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".copy-btn");
      if (!btn) return;
      var text = btn.getAttribute("data-copy");
      if (!text) {
        var t = document.querySelector(btn.getAttribute("data-copy-from") || "");
        text = t ? t.textContent.trim() : "";
      }
      if (!text) return;

      var done = function () {
        var label = btn.querySelector(".copy-btn__label");
        var prev = label ? label.textContent : null;
        btn.classList.add("is-copied");
        if (label) label.textContent = "Nakopya";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          if (label && prev) label.textContent = prev;
        }, 1800);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) { /* walang magagawa */ }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- product cards ---------- */
  function cardHTML(p) {
    var href = root() + "products/" + p.slug + "/";
    var specs = Object.keys(p.specs || {}).slice(0, 2).map(function (k) {
      return "<li>" + esc(p.specs[k]) + "</li>";
    }).join("");

    return '' +
      '<article class="product-card" data-category="' + esc(p.category) + '">' +
        '<a class="product-card__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + root() + 'assets/products/' + esc(p.image) + '" alt="" loading="lazy" width="1600" height="1000">' +
          '<span class="tag">' + esc(p.categoryLabel) + '</span>' +
        '</a>' +
        '<div class="product-card__body">' +
          '<h3><a href="' + href + '">' + esc(p.name) + '</a></h3>' +
          '<p class="product-card__desc">' + esc(p.short) + '</p>' +
          '<ul class="product-card__specs">' + specs + '</ul>' +
          '<div class="product-card__foot">' +
            '<span class="price' + (p.quoteOnly || p.price == null ? " price--quote" : "") + '">' + esc(priceLabel(p)) + '</span>' +
            '<a class="btn btn--outline btn--sm" href="' + href + '">Tingnan' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function initGrids() {
    document.querySelectorAll("[data-gds-grid]").forEach(function (el) {
      var mode = el.getAttribute("data-gds-grid");
      var limit = parseInt(el.getAttribute("data-gds-limit") || "0", 10);
      var exclude = el.getAttribute("data-gds-exclude") || "";
      var list = PRODUCTS.filter(function (p) {
        if (p.slug === exclude) return false;
        if (mode === "featured") return p.featured;
        if (mode === "all") return true;
        return p.category === mode;
      });
      if (limit > 0) list = list.slice(0, limit);
      el.innerHTML = list.map(cardHTML).join("");
    });
  }

  /* ---------- catalog filter ---------- */
  function initFilter() {
    var bar = document.querySelector("[data-gds-filter]");
    if (!bar) return;
    var grid = document.querySelector("[data-gds-grid]");
    var empty = document.querySelector("[data-gds-empty]");

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-cat]");
      if (!btn) return;
      var cat = btn.getAttribute("data-cat");

      bar.querySelectorAll("button[data-cat]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      var shown = 0;
      grid.querySelectorAll(".product-card").forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-category") === cat;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;

      var url = new URL(window.location.href);
      if (cat === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", cat);
      history.replaceState(null, "", url);
    });

    var initial = new URLSearchParams(window.location.search).get("cat");
    if (initial) {
      var target = bar.querySelector('button[data-cat="' + CSS.escape(initial) + '"]');
      if (target) target.click();
    }
  }

  /* ---------- product gallery ---------- */
  function initGallery() {
    var thumbs = document.querySelector(".gallery__thumbs");
    if (!thumbs) return;
    var main = document.querySelector(".gallery__main img");
    thumbs.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn || !main) return;
      main.src = btn.querySelector("img").src;
      thumbs.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-current", b === btn ? "true" : "false");
      });
    });
  }

  /* ---------- misc ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // Idinadagdag ang UTM source sa order link kapag galing sa social post
  function carryUTM() {
    var params = new URLSearchParams(window.location.search);
    var src = params.get("utm_source");
    if (!src) return;
    try { sessionStorage.setItem("gds_src", src); } catch (e) { /* private mode */ }
  }

  /* ---------- expose ---------- */
  window.GDS = {
    cfg: CFG,
    products: PRODUCTS,
    get: get,
    bySlug: bySlug,
    money: money,
    priceLabel: priceLabel,
    esc: esc,
    root: root,
    fillSlots: fillSlots
  };

  document.addEventListener("DOMContentLoaded", function () {
    fillSlots();
    initNav();
    initCopy();
    initGrids();
    initFilter();
    initGallery();
    initYear();
    carryUTM();
  });
})();
