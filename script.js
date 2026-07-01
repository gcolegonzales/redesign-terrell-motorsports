/* ============================================================
   Terrell Motorsports LLC — interactions
   Vanilla JS, no dependencies. Progressive enhancement.
   ============================================================ */
(function () {
  "use strict";

  var doc = document;

  /* ---- current year ---- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- sticky header shrink ---- */
  var header = doc.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav toggle ---- */
  var navToggle = doc.getElementById("navToggle");
  var mobileNav = doc.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    var setNav = function (open) {
      navToggle.setAttribute("aria-expanded", String(open));
      if (open) {
        mobileNav.hidden = false;
        navToggle.setAttribute("aria-label", "Close menu");
      } else {
        mobileNav.hidden = true;
        navToggle.setAttribute("aria-label", "Open menu");
      }
    };
    navToggle.addEventListener("click", function () {
      setNav(mobileNav.hidden);
    });
    // close when a link is tapped
    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setNav(false);
    });
    // close on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setNav(false);
    });
  }

  /* ---- scroll reveal via IntersectionObserver ---- */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- quote form (non-wired demo) ---- */
  var form = doc.getElementById("quoteForm");
  var note = doc.getElementById("formNote");
  if (form) {
    var markValidity = function (field) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      if (field.checkValidity()) wrap.classList.remove("invalid");
      else wrap.classList.add("invalid");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var ok = true;
      Array.prototype.forEach.call(required, function (field) {
        markValidity(field);
        if (!field.checkValidity()) ok = false;
      });

      if (!ok) {
        if (note) {
          note.textContent = "Please fill in the highlighted fields so we can reach you.";
          note.classList.remove("success");
        }
        var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var name = (form.querySelector("#name") || {}).value || "";
      var firstName = name.trim().split(" ")[0];
      if (note) {
        note.textContent = firstName
          ? "Thanks, " + firstName + "! Request received (demo) — we'd call you back fast to confirm pricing & a time."
          : "Request received (demo) — we'd call you back fast to confirm pricing & a time.";
        note.classList.add("success");
      }
      form.reset();
    });

    // clear invalid state as the user fixes fields
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t && t.matches("[required]")) markValidity(t);
    });
  }

  /* ---- smooth-scroll offset for sticky header on anchor clicks ----
     (native smooth-scroll handles the animation; this just accounts
     for the sticky header height so targets aren't hidden under it) */
  var headerH = function () { return header ? header.offsetHeight : 0; };
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerH() - 12;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      // move focus for a11y after scroll
      target.setAttribute("tabindex", "-1");
      window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduce ? 0 : 500);
    });
  });
})();
