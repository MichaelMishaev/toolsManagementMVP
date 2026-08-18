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
const whatsappDestination = document.body.dataset.whatsappDestination?.replace(/\D/g, "") || "";

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

function createWhatsAppIcon() {
  const namespace = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(namespace, "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");

  const bubble = document.createElementNS(namespace, "path");
  bubble.setAttribute("d", "M20.4 11.6a8.4 8.4 0 0 1-12.5 7.3L3.5 20l1.2-4.2a8.4 8.4 0 1 1 15.7-4.2Z");
  const phone = document.createElementNS(namespace, "path");
  phone.setAttribute("d", "M8.2 7.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.5l.8 2c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.8 2.7.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.5.3.5.5 0 .3-.2 1.5-1 2.1-.7.6-1.7.8-2.7.5-1.1-.3-2.5-.9-4.1-2.3-1.3-1.2-2.2-2.7-2.5-3.7-.4-1.1 0-2.1.4-2.5.2-.2.5-.6.8-1Z");
  icon.append(bubble, phone);
  return icon;
}

function createWhatsAppLink(modelName, manufacturer) {
  if (!whatsappDestination) return null;
  const currentUrl = new URL(window.location.href);
  currentUrl.hash = "";
  const message = [
    "שלום לצוות Lift Pro 26,",
    `אני מתעניין/ת בדגם ${manufacturer} ${modelName} שראיתי באתר.`,
    "אשמח לקבל מידע על מחיר, זמינות והתאמה לצורך שלי.",
  ];
  if (currentUrl.protocol === "http:" || currentUrl.protocol === "https:") message.push(currentUrl.href);

  const link = document.createElement("a");
  link.className = "button product-whatsapp-link";
  link.href = `https://wa.me/${whatsappDestination}?text=${encodeURIComponent(message.join("\n"))}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `פתיחת WhatsApp לשאלה על דגם ${modelName}`);

  const label = document.createElement("strong");
  label.className = "product-whatsapp-label";
  const channel = document.createElement("bdi");
  channel.dir = "ltr";
  channel.textContent = "WhatsApp";
  label.append("שאלו ב־", channel);
  link.append(createWhatsAppIcon(), label);
  return link;
}

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
  const manufacturer = card.querySelector(".model-meta bdi")?.textContent.trim() || "";
  const productImage = card.querySelector(".model-visual img")?.cloneNode(true);
  const sourceActions = card.querySelector(".source-actions")?.cloneNode(true);

  media.replaceChildren(...(productImage ? [productImage] : []));
  cloneChildren(card.querySelector(".model-meta"), meta);
  title.textContent = modelName;
  cloneChildren(card.querySelector(".key-specs"), specs);
  cloneChildren(card.querySelector(".model-note"), note);
  actions.replaceChildren();

  if (sourceActions) {
    const sourceLink = sourceActions.querySelector(".source-link");
    if (sourceLink) {
      const sourceMeta = sourceLink.querySelector("span")?.textContent.trim() || "PDF";
      const sourceMetaLabel = document.createElement("span");
      sourceMetaLabel.textContent = sourceMeta;
      sourceLink.classList.add("button", "product-source-link");
      sourceLink.replaceChildren("מפרט היצרן", sourceMetaLabel);
    }
    const backLink = document.createElement("a");
    backLink.className = "product-compare-link";
    backLink.href = `../index.html?filter=${encodeURIComponent((card.dataset.category || "all").split(/\s+/)[0])}#models`;
    backLink.textContent = "השוואה לדגמים";
    actions.append(...sourceActions.children, backLink);
    const whatsappLink = createWhatsAppLink(modelName, manufacturer);
    if (whatsappLink) actions.prepend(whatsappLink);
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
