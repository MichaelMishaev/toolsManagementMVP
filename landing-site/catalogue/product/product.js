const stage = document.querySelector("[data-product-stage]");
const media = document.querySelector("[data-product-media]");
const meta = document.querySelector("[data-product-meta]");
const title = document.querySelector("[data-product-title]");
const specs = document.querySelector("[data-product-specs]");
const note = document.querySelector("[data-product-note]");
const actions = document.querySelector("[data-product-actions]");
const breadcrumb = document.querySelector("[data-breadcrumb-model]");
const related = document.querySelector("[data-related-models]");
const errorState = document.querySelector("[data-product-error]");

const slugifyModel = (value) => value
  .normalize("NFKC")
  .toLocaleLowerCase("en")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const cloneChildren = (source, destination) => {
  if (!destination) return;
  destination.replaceChildren(...[...(source?.childNodes || [])].map((node) => node.cloneNode(true)));
};

const catalogueUrl = new URL("../index.html", window.location.href);

function resolveCardAssets(card) {
  card.querySelectorAll("img[src]").forEach((image) => {
    image.src = new URL(image.getAttribute("src"), catalogueUrl).href;
    image.loading = "eager";
    image.decoding = "async";
  });
  card.querySelectorAll("a[href]").forEach((link) => {
    link.href = new URL(link.getAttribute("href"), catalogueUrl).href;
  });
}

function createRelatedCard(card) {
  const cardTitle = card.querySelector("h3")?.textContent.trim() || "דגם";
  const image = card.querySelector(".model-visual img")?.cloneNode(true);
  const cardMeta = card.querySelector(".model-meta")?.cloneNode(true);
  const link = document.createElement("a");
  link.className = "related-card";
  link.href = `./index.html?model=${encodeURIComponent(slugifyModel(cardTitle))}`;

  const visual = document.createElement("span");
  visual.className = "related-card-visual";
  if (image) {
    image.src = new URL(image.getAttribute("src"), catalogueUrl).href;
    image.loading = "lazy";
    image.alt = "";
    visual.append(image);
  }

  const copy = document.createElement("span");
  copy.className = "related-card-copy";
  if (cardMeta) copy.append(cardMeta);
  const heading = document.createElement("strong");
  heading.dir = "ltr";
  heading.textContent = cardTitle;
  const label = document.createElement("span");
  label.textContent = "לעמוד הדגם ←";
  copy.append(heading, label);
  link.append(visual, copy);
  return link;
}

async function loadProduct() {
  const requestedModel = slugifyModel(new URLSearchParams(window.location.search).get("model") || "");
  if (!requestedModel) throw new Error("missing-model");

  const response = await fetch(catalogueUrl);
  if (!response.ok) throw new Error(`catalogue-${response.status}`);
  const catalogueHtml = await response.text();
  const documentCopy = new DOMParser().parseFromString(catalogueHtml, "text/html");
  const cards = [...documentCopy.querySelectorAll("[data-model]")];
  const card = cards.find((candidate) => slugifyModel(candidate.querySelector("h3")?.textContent || "") === requestedModel);
  if (!card) throw new Error("unknown-model");

  resolveCardAssets(card);
  const modelName = card.querySelector("h3")?.textContent.trim() || "דגם";
  const productImage = card.querySelector(".model-visual img")?.cloneNode(true);
  const sourceActions = card.querySelector(".source-actions")?.cloneNode(true);

  media.replaceChildren(...(productImage ? [productImage] : []));
  cloneChildren(card.querySelector(".model-meta"), meta);
  title.textContent = modelName;
  cloneChildren(card.querySelector(".key-specs"), specs);
  cloneChildren(card.querySelector(".model-note"), note);
  actions.replaceChildren();

  if (sourceActions) {
    sourceActions.querySelectorAll("a").forEach((link) => link.classList.add("button"));
    const backLink = document.createElement("a");
    backLink.className = "button button-secondary";
    backLink.href = `../index.html?filter=${encodeURIComponent((card.dataset.category || "all").split(/\s+/)[0])}#models`;
    backLink.textContent = "השוואה לדגמים נוספים";
    actions.append(...sourceActions.children, backLink);
  }

  breadcrumb.textContent = modelName;
  document.title = `${modelName} | Lift Pro 26 Israel`;
  stage.setAttribute("aria-busy", "false");

  const primaryCategory = (card.dataset.category || "").split(/\s+/)[0];
  const relatedCards = cards
    .filter((candidate) => candidate !== card && (candidate.dataset.category || "").split(/\s+/).includes(primaryCategory))
    .slice(0, 3);
  related.replaceChildren(...relatedCards.map(createRelatedCard));
}

loadProduct().catch(() => {
  stage.hidden = true;
  document.querySelector(".product-assurance").hidden = true;
  document.querySelector(".related-models").hidden = true;
  errorState.hidden = false;
  document.title = "הדגם לא נמצא | Lift Pro 26 Israel";
});
