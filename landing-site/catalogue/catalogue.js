const cards = [...document.querySelectorAll("[data-model]")];
const families = [...document.querySelectorAll("[data-family]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const themeSections = [...document.querySelectorAll("[data-theme]")];
const pageProgress = document.querySelector("[data-page-progress]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const themeColors = {
  "catalogue-intro": "#070a0c",
  "catalogue-mini": "#101611",
  "catalogue-excavator": "#111416",
  "catalogue-loader": "#16170d",
  "catalogue-sources": "#07110d",
};

let activeFilter = "all";
let searchTerm = "";
let frameRequested = false;

const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase("he").trim();

function updateCatalogue() {
  let visibleCount = 0;

  cards.forEach((card) => {
    const categories = card.dataset.category?.split(/\s+/) || [];
    const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
    const matchesSearch = !searchTerm || normalize(card.dataset.searchable || "").includes(searchTerm);
    const visible = matchesFilter && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  families.forEach((family) => {
    family.hidden = !family.querySelector("[data-model]:not([hidden])");
  });

  if (resultCount) {
    resultCount.textContent = visibleCount === 0
      ? "לא נמצאו דגמים תואמים. נסו חיפוש או קטגוריה אחרים."
      : `${visibleCount} ${visibleCount === 1 ? "דגם מוצג" : "דגמים מוצגים"}`;
  }

  requestPageUpdate();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    updateCatalogue();
  });
});

searchInput?.addEventListener("input", () => {
  searchTerm = normalize(searchInput.value);
  updateCatalogue();
});

function updatePageState() {
  frameRequested = false;
  const pageTravel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / pageTravel));
  if (pageProgress) pageProgress.style.transform = `scaleX(${progress.toFixed(4)})`;

  const activationLine = window.innerHeight * 0.48;
  let activeSection = themeSections.find((section) => !section.hidden) || themeSections[0];
  let smallestDistance = Number.POSITIVE_INFINITY;

  themeSections.forEach((section) => {
    if (section.hidden) return;
    const rect = section.getBoundingClientRect();
    const distance = activationLine >= rect.top && activationLine <= rect.bottom
      ? 0
      : Math.min(Math.abs(rect.top - activationLine), Math.abs(rect.bottom - activationLine));
    if (distance < smallestDistance) {
      activeSection = section;
      smallestDistance = distance;
    }
  });

  const theme = activeSection?.dataset.theme || "catalogue-intro";
  if (document.body.dataset.activeTheme !== theme) {
    document.body.dataset.activeTheme = theme;
    themeColor?.setAttribute("content", themeColors[theme] || themeColors["catalogue-intro"]);
  }
}

function requestPageUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(updatePageState);
}

window.addEventListener("scroll", requestPageUpdate, { passive: true });
window.addEventListener("resize", requestPageUpdate, { passive: true });

const revealGroups = [...document.querySelectorAll(".reveal-group")];
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
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );
  revealGroups.forEach((group) => revealObserver.observe(group));
} else {
  revealGroups.forEach((group) => group.classList.add("is-visible"));
}

updateCatalogue();
requestPageUpdate();
