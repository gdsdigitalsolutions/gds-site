/* ============================================================
   GDS — homepage-only behaviour (index.html)
   - scroll reveal para sa [data-reveal]
   - mouse tilt ng 3D hero scene ([data-tilt])
   Parehong nire-respeto ang prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* ---------- reveal on scroll ---------- */
  var els = document.querySelectorAll("[data-reveal]");
  function show(el) { el.classList.add("is-in"); }
  // Ang nasa unang screen ay ipakita agad (walang paghihintay sa observer)
  var vh = window.innerHeight || 800;
  els.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh * 0.92) show(el);
  });
  // Safety net: kahit anong mangyari, lalabas ang lahat pagkalipas ng ilang segundo
  window.setTimeout(function () { els.forEach(show); }, 4000);
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- hero tilt (desktop pointer lang) ---------- */
  var scene = document.querySelector("[data-tilt]");
  var finePointer = false;
  try { finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) {}
  if (scene && !reduce && finePointer) {
    var hero = scene.closest(".hero") || scene;
    var raf = null, px = 0, py = 0;

    function apply() {
      raf = null;
      scene.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
      scene.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg");
    }
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = window.requestAnimationFrame(apply);
    });
    hero.addEventListener("pointerleave", function () {
      px = 0; py = 0;
      if (!raf) raf = window.requestAnimationFrame(apply);
    });
  }
})();
