const menuToggle = document.querySelector("[data-menu-toggle]");
const siteMenu = document.querySelector("[data-site-menu]");
const header = document.querySelector("[data-site-header]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealGroups = [...document.querySelectorAll(".reveal-group")];
const themedSections = [...document.querySelectorAll("[data-page-section][data-theme]")];
const themeColor = document.querySelector('meta[name="theme-color"]');

const themeColors = {
  hero: "#f4f0e8",
  equipment: "#fffdf8",
  value: "#e7eadf",
  service: "#17313a",
  about: "#f2ede4",
  final: "#fffdf8",
};

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
    { threshold: 0.12, rootMargin: "0px 0px -8%" },
  );
  revealGroups.forEach((group) => revealObserver.observe(group));
} else {
  revealGroups.forEach((group) => group.classList.add("is-visible"));
}

updateActiveTheme();
