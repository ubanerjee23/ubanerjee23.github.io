/**
 * Interface behaviour that does not depend on anime.js:
 * navigation, scroll progress, scroll spy, copy-to-clipboard and the
 * pointer spotlight on project cards.
 */
(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /* ---------------------------------------------------------------- */
  /* Header state + scroll progress                                    */
  /* ---------------------------------------------------------------- */
  const header = $("#site-header");
  const progressBar = $("#scroll-progress-bar");

  const updateScroll = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }
  };

  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);

  /* ---------------------------------------------------------------- */
  /* Mobile navigation                                                 */
  /* ---------------------------------------------------------------- */
  const toggle = $("#nav-toggle");
  const navLinks = $("#nav-links");

  const closeNav = () => {
    if (!toggle || !navLinks) return;
    navLinks.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  };

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const willOpen = !navLinks.classList.contains("is-open");
      navLinks.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", willOpen);
    });

    $$("a", navLinks).forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------------------------------------------------------------- */
  /* Active section in navigation                                      */
  /* ---------------------------------------------------------------- */
  const links = $$(".nav-link");
  const navCta = $(".nav-cta");
  const trackedLinks = navCta ? [...links, navCta] : links;
  const sections = trackedLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
          if (navCta) {
            navCta.classList.toggle("is-active", navCta.getAttribute("href") === id);
          }
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => spy.observe(section));
  }

  /* ---------------------------------------------------------------- */
  /* Copy email                                                        */
  /* ---------------------------------------------------------------- */
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Fall through to the legacy path (e.g. clipboard permission denied).
      }
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(field);

    if (!copied) throw new Error("Copy command was rejected");
  };

  $$("[data-copy-email]").forEach((button) => {
    const original = button.textContent.trim();

    button.addEventListener("click", async () => {
      const email = button.dataset.email || "ubanerjee2001@gmail.com";

      try {
        await copyText(email);
        button.textContent = "Copied ✓";
        button.classList.add("is-copied");
      } catch (error) {
        button.textContent = "Copy failed";
      }

      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1800);
    });
  });

  /* ---------------------------------------------------------------- */
  /* Pointer spotlight on cards                                        */
  /* ---------------------------------------------------------------- */
  $$("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    });
  });

  /* ---------------------------------------------------------------- */
  /* Footer year                                                       */
  /* ---------------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
