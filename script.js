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

  /* ---- sticky header: shrink + reveal on any upward scroll ---- */
  var header = doc.querySelector(".site-header");
  var lastY = window.scrollY;
  var onScroll = function () {
    if (!header) return;
    var y = window.scrollY;
    if (y > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    // hide on downward scroll, reveal instantly on ANY upward scroll
    if (y > lastY && y > 120) header.classList.add("hidden-up");
    else if (y < lastY) header.classList.remove("hidden-up");
    if (y <= 4) header.classList.remove("hidden-up");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav drawer ---- */
  var navToggle = doc.getElementById("navToggle");
  var mobileNav = doc.getElementById("mobileNav");
  var navScrim = doc.getElementById("navScrim");

  // Relocate drawer + scrim to <body> so no transformed/filtered ancestor
  // (the header uses backdrop-filter) becomes their containing block.
  if (mobileNav && mobileNav.parentElement !== doc.body) doc.body.appendChild(mobileNav);
  if (navScrim && navScrim.parentElement !== doc.body) doc.body.appendChild(navScrim);

  if (navToggle && mobileNav && navScrim) {
    // Drawer + scrim stay in the DOM at all times; open/close is purely the
    // .open class (closed = translated off-canvas + visibility:hidden). This
    // avoids display:none -> transition races so the slide always animates.
    mobileNav.hidden = false;
    navScrim.hidden = false;
    var navOpen = false;

    // Everything on the page that should be hidden from AT / tab order when the
    // drawer is open (the drawer + toggle stay reachable).
    var pageRegions = [doc.querySelector(".site-header"), doc.getElementById("main"), doc.querySelector(".site-footer"), doc.querySelector(".mobile-call-bar")];
    var setInert = function (on) {
      pageRegions.forEach(function (el) {
        if (!el) return;
        if (on) { el.setAttribute("aria-hidden", "true"); el.setAttribute("inert", ""); }
        else { el.removeAttribute("aria-hidden"); el.removeAttribute("inert"); }
      });
    };

    var focusableInDrawer = function () {
      return Array.prototype.filter.call(
        mobileNav.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null || el.getClientRects().length; }
      );
    };

    var onTrapKey = function (e) {
      if (e.key !== "Tab") return;
      var f = focusableInDrawer();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    var setNav = function (open) {
      navOpen = open;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileNav.classList.toggle("open", open);
      navScrim.classList.toggle("open", open);
      doc.documentElement.style.overflow = open ? "hidden" : "";
      doc.body.style.overflow = open ? "hidden" : "";
      // When closed, take the off-canvas links out of the tab order entirely.
      mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        setInert(true);
        mobileNav.addEventListener("keydown", onTrapKey);
        var f = focusableInDrawer();
        if (f.length) window.setTimeout(function () { f[0].focus(); }, 60);
      } else {
        setInert(false);
        mobileNav.removeEventListener("keydown", onTrapKey);
      }
    };
    // initialize closed state (removes drawer links from tab order)
    mobileNav.setAttribute("aria-hidden", "true");
    navToggle.addEventListener("click", function () {
      var willOpen = !navOpen;
      setNav(willOpen);
      if (!willOpen) navToggle.focus();
    });
    // close when a link is tapped (let the anchor navigate; return focus to toggle)
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    // close when the scrim (page area) is tapped
    navScrim.addEventListener("click", function () {
      setNav(false);
      navToggle.focus();
    });
    // close on Escape, returning focus to the toggle
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navOpen) { setNav(false); navToggle.focus(); }
    });
    // reset drawer + toggle state when crossing the desktop breakpoint
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760 && navOpen) setNav(false);
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
