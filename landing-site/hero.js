(() => {
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteMenu = document.querySelector("[data-site-menu]");
const header = document.querySelector("[data-site-header]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealGroups = [...document.querySelectorAll(".reveal-group")];
const themedSections = [...document.querySelectorAll("[data-page-section][data-theme]")];
const themeColor = document.querySelector('meta[name="theme-color"]');
const whatsappDestination = document.body.dataset.whatsappDestination?.replace(/\D/g, "") || "";
const whatsappLinks = [...document.querySelectorAll("[data-whatsapp-link]")];
const leadLinks = [...document.querySelectorAll("[data-lead-channel]")];

const themeColors = {
  hero: "#f4f0e8",
  equipment: "#fffdf8",
  value: "#e7eadf",
  service: "#17313a",
  about: "#f2ede4",
  final: "#fffdf8",
};

const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function cleanAttributionValue(value) {
  return value?.trim().slice(0, 80) || "";
}

function getCampaignAttribution() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    campaignKeys
      .map((key) => [key, cleanAttributionValue(params.get(key))])
      .filter(([, value]) => value),
  );
}

function buildWhatsAppHref() {
  if (!whatsappDestination) return "";
  const attribution = getCampaignAttribution();
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = "";
  const message = [
    "שלום לצוות Lift Pro 26,",
    "הגעתי דרך האתר ואני רוצה להתייעץ לגבי ציוד.",
    "סוג העבודה / הציוד: ___",
    "אזור בארץ: ___",
    "מועד רכישה משוער: ___",
    `עמוד באתר: ${pageUrl.href}`,
  ];
  const campaign = attribution.utm_campaign || attribution.utm_source;
  if (campaign) message.push(`מקור הקמפיין: ${campaign}`);
  return `https://wa.me/${whatsappDestination}?text=${encodeURIComponent(message.join("\n"))}`;
}

function emitLeadIntent(link) {
  const attribution = getCampaignAttribution();
  const detail = {
    event: "lead_intent_opened",
    channel: link.dataset.leadChannel || "unknown",
    placement: link.dataset.leadContext || "unknown",
    page_path: window.location.pathname,
    ...attribution,
  };
  window.dispatchEvent(new CustomEvent("liftpro:lead-intent", { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
}

const whatsappHref = buildWhatsAppHref();
if (whatsappHref) whatsappLinks.forEach((link) => { link.href = whatsappHref; });
leadLinks.forEach((link) => link.addEventListener("click", () => emitLeadIntent(link)));

function closeMenu({ returnFocus = false } = {}) {
  if (!menuToggle || !siteMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "פתיחת תפריט");
  siteMenu.classList.remove("is-open");
  if (returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "פתיחת תפריט" : "סגירת תפריט");
  siteMenu?.classList.toggle("is-open", !isOpen);
});

siteMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!siteMenu?.classList.contains("is-open")) return;
  if (header?.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteMenu?.classList.contains("is-open")) {
    closeMenu({ returnFocus: true });
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMenu();
}, { passive: true });

function updateActiveTheme() {
  if (!themedSections.length) return;
  const activationLine = window.innerHeight * 0.46;
  let activeSection = themedSections[0];
  let smallestDistance = Number.POSITIVE_INFINITY;

  themedSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const distance = activationLine >= rect.top && activationLine <= rect.bottom
      ? 0
      : Math.min(Math.abs(rect.top - activationLine), Math.abs(rect.bottom - activationLine));
    if (distance < smallestDistance) {
      activeSection = section;
      smallestDistance = distance;
    }
  });

  const theme = activeSection.dataset.theme || "hero";
  if (document.body.dataset.activeTheme === theme) return;
  document.body.dataset.activeTheme = theme;
  themeColor?.setAttribute("content", themeColors[theme] || themeColors.hero);
}

let frameRequested = false;
function requestThemeUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(() => {
    frameRequested = false;
    updateActiveTheme();
  });
}

window.addEventListener("scroll", requestThemeUpdate, { passive: true });
window.addEventListener("resize", requestThemeUpdate, { passive: true });

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.01, rootMargin: "20% 0px 20%" },
  );
  const initialActivationLine = window.innerHeight * 1.2;
  revealGroups.forEach((group) => {
    if (group.getBoundingClientRect().top <= initialActivationLine) {
      revealObserver.observe(group);
      return;
    }
    group.classList.add("is-visible");
  });

  const revealReachedGroups = () => {
    const activationLine = window.innerHeight * 1.2;
    revealGroups.forEach((group) => {
      if (group.classList.contains("is-visible") || group.getBoundingClientRect().top > activationLine) return;
      group.classList.add("is-visible");
      revealObserver.unobserve(group);
    });
  };
  window.addEventListener("scroll", revealReachedGroups, { passive: true });
  window.addEventListener("resize", revealReachedGroups, { passive: true });
  revealReachedGroups();

  // Entrance motion must never become a content-visibility dependency. This
  // fail-safe covers fast scrollbar drags, anchor jumps and throttled observers.
  window.setTimeout(() => {
    revealGroups.forEach((group) => {
      group.classList.add("is-visible");
      revealObserver.unobserve(group);
    });
  }, 1200);
} else {
  revealGroups.forEach((group) => group.classList.add("is-visible"));
}

updateActiveTheme();
})();
