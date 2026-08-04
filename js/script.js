(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  var useCursorFx = supportsFinePointer && !prefersReducedMotion;

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     NAV: solid background after scrolling past hero
     ============================================================ */
  var siteNav = document.getElementById("siteNav");
  function onScrollNav() {
    if (!siteNav) return;
    siteNav.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Close mobile menu after a link is tapped */
  var navMenu = document.getElementById("navMenu");
  if (navMenu) {
    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navMenu.classList.contains("show") && window.bootstrap) {
          var collapse = window.bootstrap.Collapse.getOrCreateInstance(navMenu);
          collapse.hide();
        }
      });
    });
  }

  /* ============================================================
     SCROLL REVEAL. ()Effects()
     ============================================================ */
  var revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ============================================================
     SECTION PROGRESS RAIL
     ============================================================ */
  var railStops = document.querySelectorAll(".rail-stop");
  var railFill = document.getElementById("railFill");
  var railSectionIds = ["about", "experience", "skills", "education", "projects", "contact"];
  var railSections = railSectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (railStops.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            railStops.forEach(function (stop) {
              stop.classList.toggle("active", stop.getAttribute("data-rail") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    railSections.forEach(function (sec) { sectionObserver.observe(sec); });
  }

  function onScrollRail() {
    if (!railFill) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    railFill.style.height = pct + "%";
  }
  window.addEventListener("scroll", onScrollRail, { passive: true });
  onScrollRail();

  /* ============================================================
     CONTACT FORM -> mailto fallback (static site direct gmail)
     ============================================================ */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (note) note.textContent = "Please fill in all fields before sending.";
        return;
      }
      var name = form.fromName.value.trim();
      var email = form.fromEmail.value.trim();
      var msg = form.messageBody.value.trim();
      var subject = encodeURIComponent("Portfolio contact from " + name);
      var body = encodeURIComponent(msg + "\n\n\u2014 " + name + " (" + email + ")");
      window.location.href = "mailto:catrizbernardo27@email.com?subject=" + subject + "&body=" + body;
      if (note) note.textContent = "Opening your email client to send this message\u2026";
    });
  }

  /* ============================================================
     CURSOR EFFECTS (Fading Dots)
     ============================================================ */
  if (!useCursorFx) return;

  var trailContainer = document.querySelector(".cursor-trail");
  var heroPhoto = document.getElementById("heroPhoto");
  var overImage = false;

  if (heroPhoto) {
    heroPhoto.addEventListener("mouseenter", function () {
      overImage = true;
      heroPhoto.style.transform = "translate(0px,0px)";
    });
    heroPhoto.addEventListener("mouseleave", function () {
      overImage = false;
    });

    /* Subtle parallax tilt on the photo — paused while the
       pointer is actually over the photo, so it sits still there. (*fading dots hide when at the Photo) */
    window.addEventListener("mousemove", function (e) {
      if (overImage) return;
      var relX = (e.clientX / window.innerWidth - 0.5) * 2;
      var relY = (e.clientY / window.innerHeight - 0.5) * 2;
      heroPhoto.style.transform = "translate(" + relX * 8 + "px," + relY * 8 + "px)";
    });
  }

  if (trailContainer) {
    var lastX = null, lastY = null;
    var MIN_DIST = 10; // px moved before the next dot is stamped

    window.addEventListener("mousemove", function (e) {
      if (overImage) return; // no effect while hovering the portrait

      if (lastX !== null) {
        var dx = e.clientX - lastX, dy = e.clientY - lastY;
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
      }
      lastX = e.clientX;
      lastY = e.clientY;

      var dot = document.createElement("span");
      dot.className = "trail-dot";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      trailContainer.appendChild(dot);

      dot.addEventListener("animationend", function () { dot.remove(); });
      setTimeout(function () { if (dot.parentNode) dot.remove(); }, 700); // safety cleanup
    });
  }

  /* Magnetic pull on the primary call-to-action */
  var magnets = document.querySelectorAll(".btn-send, .nav-cta");
  magnets.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var relX = e.clientX - rect.left - rect.width / 2;
      var relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = "translate(" + relX * 0.25 + "px," + relY * 0.25 + "px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });
})();
