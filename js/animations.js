/**
 * anime.js v4 animation layer.
 *
 * Everything here is a progressive enhancement: if the CDN is unreachable or
 * the module fails, the `.js` class is never added and all content stays
 * visible. Users with reduced-motion enabled get the static site immediately.
 */
import {
  animate,
  createTimeline,
  createScope,
  stagger,
} from "https://esm.sh/animejs@4.5.0";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tells the early fail-safe in <head> that the animation module arrived.
window.__animeReady = true;

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/* ------------------------------------------------------------------ */
/* Hero intro                                                          */
/* ------------------------------------------------------------------ */
function playIntro() {
  const timeline = createTimeline({
    defaults: { ease: "outExpo" },
  });

  timeline
    .add(".hero-eyebrow", {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 650,
    })
    .add(
      ".hero-line",
      {
        opacity: [0, 1],
        translateY: [58, 0],
        duration: 1050,
        delay: stagger(110),
      },
      "-=420"
    )
    .add(
      ".hero-lede",
      {
        opacity: [0, 1],
        translateY: [22, 0],
        duration: 800,
      },
      "-=720"
    )
    .add(
      ".hero-actions",
      {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 700,
      },
      "-=620"
    )
    .add(
      ".hero-tags",
      {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 650,
      },
      "-=560"
    )
    .add(
      ".terminal-card",
      {
        opacity: [0, 1],
        translateY: [44, 0],
        scale: [0.96, 1],
        duration: 1100,
      },
      "-=1080"
    )
    .add(
      ".floating-badge",
      {
        opacity: [0, 1],
        scale: [0.82, 1],
        duration: 650,
        delay: stagger(140),
      },
      "-=680"
    )
    .add(
      ".stats-strip .stat",
      {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 600,
        delay: stagger(80),
      },
      "-=520"
    );
}

/* ------------------------------------------------------------------ */
/* Ambient background motion                                          */
/* ------------------------------------------------------------------ */
function playAmbient() {
  animate(".orb", {
    translateY: [0, -28],
    translateX: [0, 18],
    scale: [1, 1.07],
    duration: 11000,
    loop: true,
    alternate: true,
    ease: "inOutSine",
    delay: stagger(900),
  });
}

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                      */
/* ------------------------------------------------------------------ */
function setupReveals() {
  const targets = $$("[data-reveal], [data-reveal-group]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        instance.unobserve(element);

        const isGroup = element.hasAttribute("data-reveal-group");
        const items = isGroup ? $$(".reveal-item", element) : [element];
        if (!items.length) return;

        animate(items, {
          opacity: [0, 1],
          translateY: [26, 0],
          duration: 900,
          delay: isGroup ? stagger(100) : 0,
          ease: "outExpo",
        });
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

/* ------------------------------------------------------------------ */
/* Animated counters                                                   */
/* ------------------------------------------------------------------ */
function setupCounters() {
  if (reduceMotion) return;

  const strip = $(".stats-strip");
  if (!strip) return;

  const observer = new IntersectionObserver(
    (entries, instance) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      instance.disconnect();

      $$("[data-count]", strip).forEach((element, index) => {
        const end = parseFloat(element.dataset.count || "0");
        const decimals = parseInt(element.dataset.decimals || "0", 10);
        const state = { value: 0 };

        animate(state, {
          value: end,
          duration: 1500,
          delay: 1100 + index * 120,
          ease: "outExpo",
          onUpdate: () => {
            element.textContent = decimals
              ? state.value.toFixed(decimals)
              : String(Math.round(state.value));
          },
          onComplete: () => {
            element.textContent = decimals ? end.toFixed(decimals) : String(end);
          },
        });
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(strip);
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
try {
  if (!reduceMotion) {
    root.classList.remove("no-js");
    root.classList.add("js");
  }

  const scope = createScope({ root });

  scope.add(() => {
    if (reduceMotion) return;
    playIntro();
    playAmbient();
  });

  if (!reduceMotion) {
    setupReveals();
  }

  setupCounters();
} catch (error) {
  // Fail open: show every section if anything goes wrong.
  root.classList.remove("js");
  console.error("[portfolio] Animation setup failed:", error);
}
