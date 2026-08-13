const cards = [...document.querySelectorAll("[data-model]")];
const families = [...document.querySelectorAll("[data-family]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const viewButtons = [...document.querySelectorAll("[data-view]")];
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const clearSearch = document.querySelector("[data-clear-search]");
const guideForm = document.querySelector("[data-guide-form]");
const guideResult = document.querySelector("[data-guide-result]");
const themeSections = [...document.querySelectorAll("[data-theme]")];
const pageProgress = document.querySelector("[data-page-progress]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compareTray = document.querySelector("[data-compare-tray]");
const compareCount = document.querySelector("[data-compare-count]");
const compareStatus = document.querySelector("[data-compare-status]");
const compareOpen = document.querySelector("[data-compare-open]");
const comparisonSection = document.querySelector("[data-comparison-section]");
const comparisonTable = document.querySelector("[data-comparison-table]");
const comparisonClear = document.querySelector("[data-comparison-clear]");

const themeColors = {
  "catalogue-intro": "#070a0c",
  "catalogue-mini": "#101611",
  "catalogue-excavator": "#111416",
  "catalogue-loader": "#16170d",
  "catalogue-sources": "#07110d",
};

const filterNames = {
  all: "כל הדגמים",
  mini: "מיני מחפרים",
  excavator: "מחפרים",
  loader: "מעמיסים",
  electric: "ציוד חשמלי",
};

let activeFilter = "all";
let searchTerm = "";
let frameRequested = false;
const selectedCards = new Set();

const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase("he").trim();

function setActiveFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
}

function animateVisibleCards(visibleCards) {
  if (reducedMotion.matches) return;
  visibleCards.slice(0, 9).forEach((card, index) => {
    if (typeof card.animate !== "function") return;
    card.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, delay: index * 24, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  });
}

function updateCatalogue({ animate = true } = {}) {
  let visibleCount = 0;
  const visibleCards = [];

  cards.forEach((card) => {
    const categories = card.dataset.category?.split(/\s+/) || [];
    const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
    const matchesSearch = !searchTerm || normalize(card.dataset.searchable || "").includes(searchTerm);
    const visible = matchesFilter && matchesSearch;
    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
      visibleCards.push(card);
    }
  });

  families.forEach((family) => {
    family.hidden = !family.querySelector("[data-model]:not([hidden])");
  });

  if (resultCount) {
    resultCount.classList.add("is-updating");
    resultCount.textContent = visibleCount === 0
      ? "לא נמצאו דגמים תואמים"
      : `${visibleCount} ${visibleCount === 1 ? "דגם מוצג" : "דגמים מוצגים"}`;
    window.requestAnimationFrame(() => resultCount.classList.remove("is-updating"));
  }

  if (emptyState) emptyState.hidden = visibleCount !== 0;
  if (animate) animateVisibleCards(visibleCards);
  requestPageUpdate();
}

function getCardData(card) {
  const specs = new Map();
  card.querySelectorAll(".key-specs div").forEach((row) => {
    const label = row.querySelector("dt")?.textContent.trim();
    const value = row.querySelector("dd")?.textContent.trim();
    if (label && value) specs.set(label, value);
  });

  return {
    card,
    name: card.querySelector("h3")?.textContent.trim() || "דגם",
    type: card.querySelector(".model-meta span")?.textContent.trim() || "ציוד",
    specs,
    source: card.querySelector(".source-link")?.href || "",
  };
}

function appendCell(row, tagName, text) {
  const cell = document.createElement(tagName);
  cell.textContent = text;
  row.append(cell);
  return cell;
}

function renderComparison() {
  if (!comparisonTable) return;
  comparisonTable.replaceChildren();
  const items = [...selectedCards].map(getCardData);
  if (items.length < 2) return;

  const table = document.createElement("table");
  table.className = "comparison-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  appendCell(headRow, "th", "נתון");
  items.forEach((item) => appendCell(headRow, "th", item.name));
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  const typeRow = document.createElement("tr");
  appendCell(typeRow, "th", "משפחה");
  items.forEach((item) => appendCell(typeRow, "td", item.type));
  tbody.append(typeRow);

  const specLabels = [...new Set(items.flatMap((item) => [...item.specs.keys()]))];
  specLabels.forEach((label) => {
    const row = document.createElement("tr");
    appendCell(row, "th", label);
    items.forEach((item) => appendCell(row, "td", item.specs.get(label) || "—"));
    tbody.append(row);
  });

  const sourceRow = document.createElement("tr");
  appendCell(sourceRow, "th", "מסמך מקור");
  items.forEach((item) => {
    const cell = document.createElement("td");
    const link = document.createElement("a");
    link.href = item.source;
    link.textContent = "פתיחת מפרט יצרן";
    cell.append(link);
    sourceRow.append(cell);
  });
  tbody.append(sourceRow);

  table.append(thead, tbody);
  comparisonTable.append(table);
}

function updateCompareTray(message = "") {
  const count = selectedCards.size;
  if (compareCount) compareCount.textContent = String(count);
  if (compareTray) compareTray.hidden = count === 0;
  if (compareOpen) compareOpen.disabled = count < 2;
  if (compareStatus) {
    compareStatus.textContent = message || (count === 1
      ? "נבחר דגם אחד. בחרו דגם נוסף כדי להשוות."
      : count > 1 ? `${count} דגמים מוכנים להשוואה.` : "ההשוואה נוקתה.");
  }
  if (comparisonSection && count < 2) comparisonSection.hidden = true;
}

function clearComparison() {
  selectedCards.clear();
  cards.forEach((card) => {
    card.classList.remove("is-compared");
    const checkbox = card.querySelector("[data-compare-checkbox]");
    if (checkbox) checkbox.checked = false;
  });
  if (comparisonTable) comparisonTable.replaceChildren();
  updateCompareTray();
}

cards.forEach((card) => {
  const name = card.querySelector("h3")?.textContent.trim() || "הדגם";
  const compareLabel = document.createElement("label");
  compareLabel.className = "model-compare";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.compareCheckbox = "";
  checkbox.setAttribute("aria-label", `הוספת ${name} להשוואה`);
  const labelText = document.createElement("span");
  labelText.textContent = "השוו";
  compareLabel.append(checkbox, labelText);
  card.prepend(compareLabel);

  const sourceActions = card.querySelector(".source-actions");
  if (sourceActions) {
    const sourceBadge = document.createElement("span");
    sourceBadge.className = "source-verified";
    sourceBadge.textContent = "נתונים ממסמך יצרן";
    sourceActions.before(sourceBadge);
  }

  checkbox.addEventListener("change", () => {
    if (checkbox.checked && selectedCards.size >= 3) {
      checkbox.checked = false;
      updateCompareTray("ניתן להשוות עד שלושה דגמים בכל פעם.");
      return;
    }

    if (checkbox.checked) selectedCards.add(card);
    else selectedCards.delete(card);
    card.classList.toggle("is-compared", checkbox.checked);
    updateCompareTray();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter || "all");
    updateCatalogue();
  });
});

searchInput?.addEventListener("input", () => {
  searchTerm = normalize(searchInput.value);
  updateCatalogue();
});

clearSearch?.addEventListener("click", () => {
  searchTerm = "";
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  setActiveFilter("all");
  updateCatalogue();
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.catalogueView = button.dataset.view || "grid";
    viewButtons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
  });
});

guideForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(guideForm);
  const task = String(data.get("task") || "");
  if (!task) return;
  setActiveFilter(task);
  searchTerm = "";
  if (searchInput) searchInput.value = "";
  updateCatalogue();
  if (guideResult) {
    guideResult.textContent = `נקודת התחלה: ${filterNames[task]}. הצגנו את המשפחה הרלוונטית; כעת השוו נתוני מפתח ואמתו את התצורה במסמך היצרן.`;
  }
  const firstVisibleFamily = families.find((family) => !family.hidden);
  firstVisibleFamily?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
});

compareOpen?.addEventListener("click", () => {
  if (selectedCards.size < 2 || !comparisonSection) return;
  renderComparison();
  comparisonSection.hidden = false;
  comparisonSection.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
});

comparisonClear?.addEventListener("click", clearComparison);

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

document.body.dataset.catalogueView = "grid";
updateCatalogue({ animate: false });
updateCompareTray();
requestPageUpdate();
