const cards = [...document.querySelectorAll("[data-model]")];
const families = [...document.querySelectorAll("[data-family]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const clearSearch = document.querySelector("[data-clear-search]");
const guideForm = document.querySelector("[data-guide-form]");
const guideResult = document.querySelector("[data-guide-result]");
const modelDialog = document.querySelector("[data-model-dialog]");
const dialogClose = document.querySelector("[data-dialog-close]");
const dialogMedia = document.querySelector("[data-dialog-media]");
const dialogMeta = document.querySelector("[data-dialog-meta]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogSpecs = document.querySelector("[data-dialog-specs]");
const dialogNote = document.querySelector("[data-dialog-note]");
const dialogActions = document.querySelector("[data-dialog-actions]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionAnimations = new WeakMap();
const motionEaseOut = "cubic-bezier(0.16, 1, 0.3, 1)";

const filterNames = {
  all: "כל הדגמים",
  mini: "מיני מחפרים",
  excavator: "מחפרים",
  loader: "מעמיסים",
  electric: "ציוד חשמלי",
};

const electricFamilyCopy = {
  excavators: {
    title: "מחפרים חשמליים",
    description: "מחפרים חשמליים כבדים לעבודות תשתית, אבן ועפר, בהנעה חשמלית ובתצורות המפורטות במסמכי היצרן.",
  },
  loaders: {
    title: "מעמיסים חשמליים",
    description: "מעמיסים אופניים חשמליים להעמסה, מחצבות, תשתיות, אתרי עבודה ומערכים תפעוליים.",
  },
};

const defaultFamilyCopy = new Map(
  families.map((family) => [
    family,
    {
      title: family.querySelector(".family-heading h2")?.textContent.trim() || "",
      description: family.querySelector(".family-heading p")?.textContent.trim() || "",
    },
  ]),
);

const allowedFilters = new Set(Object.keys(filterNames));
const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase("he").trim();
const slugifyModel = (value) => value
  .normalize("NFKC")
  .toLocaleLowerCase("en")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const initialFilter = new URLSearchParams(window.location.search).get("filter");
let activeFilter = allowedFilters.has(initialFilter) ? initialFilter : "all";
let searchTerm = "";
let lastPreviewTrigger = null;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function cloneChildren(source, destination) {
  if (!destination) return;
  destination.replaceChildren(...[...(source?.childNodes || [])].map((node) => node.cloneNode(true)));
}

function setActiveFilter(filter, { updateUrl = true } = {}) {
  activeFilter = allowedFilters.has(filter) ? filter : "all";
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  });

  if (!updateUrl) return;
  const url = new URL(window.location.href);
  if (activeFilter === "all") url.searchParams.delete("filter");
  else url.searchParams.set("filter", activeFilter);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function updateFamilyCopy(family) {
  const heading = family.querySelector(".family-heading h2");
  const description = family.querySelector(".family-heading p");
  const copy = activeFilter === "electric"
    ? electricFamilyCopy[family.id] || defaultFamilyCopy.get(family)
    : defaultFamilyCopy.get(family);

  if (heading && copy?.title) heading.textContent = copy.title;
  if (description && copy?.description) description.textContent = copy.description;
}

function runMotion(element, keyframes, options, id) {
  if (reducedMotion.matches || !element || typeof element.animate !== "function") return null;
  motionAnimations.get(element)?.cancel();
  const animation = element.animate(keyframes, options);
  animation.id = id;
  motionAnimations.set(element, animation);

  const release = () => {
    if (motionAnimations.get(element) === animation) motionAnimations.delete(element);
  };
  animation.addEventListener("finish", release, { once: true });
  animation.addEventListener("cancel", release, { once: true });
  return animation;
}

function captureVisibleCardLayout() {
  const layout = new Map();
  if (reducedMotion.matches) return layout;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (!card.hidden && rect.bottom > -180 && rect.top < window.innerHeight + 180) {
      layout.set(card, rect);
    }
    motionAnimations.get(card)?.cancel();
  });
  return layout;
}

function animateCatalogueChange(visibleCards, previousLayout, familyHeadings, showEmpty, cause) {
  if (reducedMotion.matches) return;
  window.requestAnimationFrame(() => {
    let sequence = 0;
    visibleCards.forEach((card) => {
      const next = card.getBoundingClientRect();
      if (next.bottom < -180 || next.top > window.innerHeight + 180) return;

      const previous = previousLayout.get(card);
      const deltaX = previous ? previous.left - next.left : 0;
      const deltaY = previous ? previous.top - next.top : 0;
      const moved = Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1;
      const canFlip = previous
        && moved
        && Math.abs(deltaX) < window.innerWidth * 0.55
        && Math.abs(deltaY) < Math.min(window.innerHeight * 0.65, 520);

      if (previous && !moved) return;
      const delay = cause === "search" ? 0 : Math.min(sequence, 5) * 30;
      const duration = cause === "search" ? 220 : 340;
      const keyframes = canFlip
        ? [
            { opacity: 0.78, transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.992)` },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ]
        : [
            { opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.985)" },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ];

      runMotion(card, keyframes, { duration, delay, easing: motionEaseOut }, "catalogue-card-reflow");
      sequence += 1;
    });

    familyHeadings.forEach((heading, index) => {
      const rect = heading.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
      runMotion(
        heading,
        [
          { opacity: 0.35, transform: "translate3d(0, 8px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 260, delay: index * 35, easing: motionEaseOut },
        "catalogue-family-heading",
      );
    });

    runMotion(
      resultCount,
      [
        { opacity: 0.35, transform: "translate3d(0, -4px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      { duration: 180, easing: motionEaseOut },
      "catalogue-result-count",
    );

    if (showEmpty) {
      runMotion(
        emptyState,
        [
          { opacity: 0, transform: "translate3d(0, 8px, 0) scale(0.99)" },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        { duration: 260, easing: motionEaseOut },
        "catalogue-empty-state",
      );
    }
  });
}

function acknowledgeSelection(button) {
  runMotion(
    button,
    [
      { transform: "scale(0.97)" },
      { transform: "scale(1)" },
    ],
    { duration: 180, easing: motionEaseOut },
    "catalogue-filter-feedback",
  );
}

function updateCatalogue({ animate = true, cause = "filter" } = {}) {
  const previousLayout = animate ? captureVisibleCardLayout() : new Map();
  const previousFamilyState = new Map(
    families.map((family) => [
      family,
      {
        visible: !family.hidden,
        title: family.querySelector(".family-heading h2")?.textContent.trim() || "",
      },
    ]),
  );
  const emptyWasVisible = emptyState ? !emptyState.hidden : false;
  let visibleCount = 0;
  const visibleCards = [];
  const familyHeadings = [];

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
    updateFamilyCopy(family);
    family.hidden = !family.querySelector("[data-model]:not([hidden])");
    const previous = previousFamilyState.get(family);
    const title = family.querySelector(".family-heading h2")?.textContent.trim() || "";
    if (!family.hidden && (!previous?.visible || previous.title !== title)) {
      const heading = family.querySelector(".family-heading");
      if (heading) familyHeadings.push(heading);
    }
  });

  if (resultCount) {
    resultCount.textContent = visibleCount === 0
      ? "לא נמצאו דגמים תואמים"
      : `${visibleCount} ${visibleCount === 1 ? "דגם מוצג" : "דגמים מוצגים"}`;
  }
  if (emptyState) emptyState.hidden = visibleCount !== 0;
  if (animate) {
    animateCatalogueChange(
      visibleCards,
      previousLayout,
      familyHeadings,
      visibleCount === 0 && !emptyWasVisible,
      cause,
    );
  }
}

function openPreview(card, trigger) {
  if (!modelDialog || typeof modelDialog.showModal !== "function") return;
  const image = card.querySelector(".model-visual img")?.cloneNode(true);
  const meta = card.querySelector(".model-meta");
  const title = card.querySelector("h3");
  const specs = card.querySelector(".key-specs");
  const note = card.querySelector(".model-note");
  const sourceActions = card.querySelector(".source-actions");

  if (dialogMedia) dialogMedia.replaceChildren(...(image ? [image] : []));
  cloneChildren(meta, dialogMeta);
  if (dialogTitle) dialogTitle.textContent = title?.textContent.trim() || "פרטי הדגם";
  cloneChildren(specs, dialogSpecs);
  cloneChildren(note, dialogNote);
  cloneChildren(sourceActions, dialogActions);
  if (dialogActions) {
    const detailLink = document.createElement("a");
    detailLink.className = "dialog-detail-link";
    detailLink.href = `./product/index.html?model=${encodeURIComponent(slugifyModel(title?.textContent || ""))}`;
    detailLink.textContent = "לעמוד הדגם המלא";
    dialogActions.prepend(detailLink);
  }
  lastPreviewTrigger = trigger;
  modelDialog.classList.remove("is-closing");
  modelDialog.getAnimations().forEach((animation) => {
    if (animation.id === "catalogue-dialog-close") animation.cancel();
  });
  document.body.classList.add("dialog-open");
  const sourceRect = card.getBoundingClientRect();
  modelDialog.showModal();
  const dialogRect = modelDialog.getBoundingClientRect();
  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const originX = clamp(((sourceCenterX - dialogRect.left) / dialogRect.width) * 100, 4, 96);
  const originY = clamp(((sourceCenterY - dialogRect.top) / dialogRect.height) * 100, 4, 96);
  const shiftY = clamp(sourceCenterY - (dialogRect.top + dialogRect.height / 2), -24, 24);
  modelDialog.style.setProperty("--dialog-origin-x", `${originX.toFixed(2)}%`);
  modelDialog.style.setProperty("--dialog-origin-y", `${originY.toFixed(2)}%`);
  modelDialog.style.setProperty("--dialog-shift-y", `${shiftY.toFixed(1)}px`);
  dialogClose?.focus();
}

function closePreview() {
  if (!modelDialog?.open || modelDialog.classList.contains("is-closing")) return;
  if (reducedMotion.matches || typeof modelDialog.animate !== "function") {
    modelDialog.close();
    return;
  }

  modelDialog.classList.add("is-closing");
  const shiftY = modelDialog.style.getPropertyValue("--dialog-shift-y") || "0px";
  const closing = runMotion(
    modelDialog,
    [
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0, 0, 0) scale(1)" },
      { opacity: 0, filter: "blur(5px)", transform: `translate3d(0, ${shiftY}, 0) scale(0.96)` },
    ],
    { duration: 200, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
    "catalogue-dialog-close",
  );
  if (!closing) {
    modelDialog.close();
    return;
  }
  closing.finished.then(() => {
    if (modelDialog.open) modelDialog.close();
  }).catch(() => {});
}

cards.forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim() || "הדגם";
  const detailHref = `./product/index.html?model=${encodeURIComponent(slugifyModel(title))}`;
  const heading = card.querySelector("h3");
  if (heading) {
    const headingLink = document.createElement("a");
    headingLink.className = "model-title-link";
    headingLink.href = detailHref;
    headingLink.append(...heading.childNodes);
    heading.replaceChildren(headingLink);
  }

  const primaryActions = document.createElement("div");
  primaryActions.className = "model-primary-actions";
  const detailLink = document.createElement("a");
  detailLink.className = "model-detail-link";
  detailLink.href = detailHref;
  detailLink.textContent = "עמוד הדגם";
  detailLink.setAttribute("aria-label", `פתיחת עמוד הדגם ${title}`);

  const previewButton = document.createElement("button");
  previewButton.type = "button";
  previewButton.className = "model-preview";
  previewButton.textContent = "הצצה מהירה";
  previewButton.setAttribute("aria-label", `פתיחת תצוגה מקדימה עבור ${title}`);
  primaryActions.append(detailLink, previewButton);
  card.querySelector(".source-actions")?.before(primaryActions);

  previewButton.addEventListener("click", () => openPreview(card, previewButton));
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input, label")) return;
    window.location.href = detailHref;
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter || "all");
    updateCatalogue({ cause: "filter" });
    acknowledgeSelection(button);
  });
});

searchInput?.addEventListener("input", () => {
  searchTerm = normalize(searchInput.value);
  updateCatalogue({ cause: "search" });
});

clearSearch?.addEventListener("click", () => {
  searchTerm = "";
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  setActiveFilter("all");
  updateCatalogue({ cause: "reset" });
});

guideForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const filter = String(new FormData(guideForm).get("task") || "all");
  setActiveFilter(filter);
  searchTerm = "";
  if (searchInput) searchInput.value = "";
  updateCatalogue({ cause: "filter" });
  if (guideResult) {
    guideResult.textContent = `נקודת התחלה: ${filterNames[filter] || filterNames.all}. כעת פתחו דגם ואמתו את התצורה במסמך היצרן.`;
  }
});

dialogClose?.addEventListener("click", closePreview);

modelDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePreview();
});

modelDialog?.addEventListener("click", (event) => {
  if (event.target !== modelDialog) return;
  const rect = modelDialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right
    && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) closePreview();
});

modelDialog?.addEventListener("close", () => {
  modelDialog.classList.remove("is-closing");
  document.body.classList.remove("dialog-open");
  lastPreviewTrigger?.focus();
  lastPreviewTrigger = null;
});

setActiveFilter(activeFilter, { updateUrl: false });
updateCatalogue({ animate: false });
