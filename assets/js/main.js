/* REAP West Africa — interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  // Sticky header shadow on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("open"); });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Animated stat counters
  var nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && nums.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute("data-count")),
            suffix = el.getAttribute("data-suffix") || "", dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.textContent = (target >= 10000 ? val.toLocaleString() : String(val)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { co.observe(el); });
  }

  // Donate amount selector
  var amounts = document.querySelector(".amounts");
  if (amounts) {
    amounts.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      amounts.querySelectorAll("button").forEach(function (b) { b.classList.remove("sel"); });
      btn.classList.add("sel");
    });
  }

  // Contact form (front-end only; wire to a backend / form service when deployed)
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      if (note) {
        note.textContent = "Thank you — your message has been recorded. We’ll be in touch shortly.";
        note.style.display = "block";
      }
      form.reset();
    });
  }

  // Footer year
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ===========================================================
   Programs carousel — auto-play, infinite loop, swipe, dots
   Vanilla JS, no dependencies. Keeps card markup untouched.
   =========================================================== */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initCarousel(root) {
    var viewport = root.querySelector(".carousel-viewport");
    var track = root.querySelector(".carousel-track");
    var dotsWrap = root.querySelector(".carousel-dots");
    var prevBtn = root.querySelector(".carousel-arrow.prev");
    var nextBtn = root.querySelector(".carousel-arrow.next");
    var reals = Array.prototype.slice.call(track.querySelectorAll(".carousel-slide"));
    var N = reals.length;
    if (!N) return;

    var GAP = 24, AUTOPLAY = 4500;
    var perView = 1, step = 0, index = 0, timer = null;
    var dragging = false, didDrag = false, startX = 0, dragDX = 0;

    function perViewFor(w) { return w <= 640 ? 1 : (w <= 1024 ? 2 : 3); }

    function clearClones() {
      Array.prototype.slice.call(track.querySelectorAll(".is-clone")).forEach(function (c) { c.remove(); });
    }

    function build() {
      clearClones();
      perView = Math.min(perViewFor(window.innerWidth), N);
      // clone last `perView` to the front, first `perView` to the back
      for (var i = N - perView; i < N; i++) {
        var c = reals[i].cloneNode(true); c.classList.add("is-clone"); c.setAttribute("aria-hidden", "true");
        track.insertBefore(c, track.firstChild);
      }
      for (var j = 0; j < perView; j++) {
        var c2 = reals[j].cloneNode(true); c2.classList.add("is-clone"); c2.setAttribute("aria-hidden", "true");
        track.appendChild(c2);
      }
      var vw = viewport.clientWidth;
      step = (vw + GAP) / perView;
      var slideW = step - GAP;
      Array.prototype.slice.call(track.children).forEach(function (s) {
        s.style.width = slideW + "px";
        s.style.marginRight = GAP + "px";
      });
      index = perView;             // first real slide
      setTranslate(false);
      buildDots();
      updateDots();
      root.classList.add("is-ready");
    }

    function setTranslate(animate) {
      track.style.transition = (animate && !reduceMotion)
        ? "transform .55s cubic-bezier(.22,1,.36,1)" : "none";
      track.style.transform = "translateX(" + (-(index * step) + dragDX) + "px)";
    }

    function realIndex() { return ((index - perView) % N + N) % N; }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i < N; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("role", "tab");
          b.setAttribute("aria-label", "Go to program " + (i + 1));
          b.addEventListener("click", function () { goTo(perView + i); restart(); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }
    function updateDots() {
      if (!dotsWrap) return;
      var active = realIndex();
      Array.prototype.slice.call(dotsWrap.children).forEach(function (d, i) {
        d.classList.toggle("is-active", i === active);
        if (i === active) d.setAttribute("aria-selected", "true"); else d.removeAttribute("aria-selected");
      });
    }

    function goTo(i, animate) { index = i; setTranslate(animate !== false); updateDots(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    track.addEventListener("transitionend", function () {
      if (index >= perView + N) { index -= N; setTranslate(false); }
      else if (index < perView) { index += N; setTranslate(false); }
      updateDots();
    });

    // ---- Autoplay ----
    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(next, AUTOPLAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

    // ---- Arrows ----
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // ---- Pointer/touch swipe ----
    viewport.addEventListener("pointerdown", function (e) {
      dragging = true; didDrag = false; startX = e.clientX; dragDX = 0;
      stop(); track.style.transition = "none";
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dragDX = e.clientX - startX;
      if (Math.abs(dragDX) > 6) didDrag = true;
      setTranslate(false);
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      var moved = dragDX; dragDX = 0;
      if (Math.abs(moved) > step * 0.18) { (moved < 0 ? next : prev)(); }
      else { setTranslate(true); }
      start();
    }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", function () { if (dragging) endDrag(); });
    // Block link clicks that happen at the end of a drag
    viewport.addEventListener("click", function (e) {
      if (didDrag) { e.preventDefault(); e.stopPropagation(); didDrag = false; }
    }, true);

    // ---- Resize (debounced rebuild) ----
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { var keep = realIndex(); build(); goTo(perView + keep, false); }, 180);
    });

    build();
    start();
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
})();
