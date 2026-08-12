const story = document.querySelector("[data-assembly-story]");
const video = document.querySelector("[data-assembly-video]");
const mediaFrame = document.querySelector("[data-media-frame]");
const progressOutput = document.querySelector("[data-progress-output]");
const assemblyState = document.querySelector("[data-assembly-state]");
const middleMessage = document.querySelector(".hero-message-middle");
const completeMessage = document.querySelector(".hero-message-complete");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themedSections = [...document.querySelectorAll("[data-page-section][data-theme]")];
const revealGroups = [...document.querySelectorAll(".reveal-group")];
const themeColor = document.querySelector('meta[name="theme-color"]');

let duration = 0;
let frameRequested = false;

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function getProgress() {
  if (!story) return 0;
  const rect = story.getBoundingClientRect();
  const travel = Math.max(1, story.offsetHeight - window.innerHeight);
  return clamp(-rect.top / travel);
}

function describeProgress(progress) {
  if (progress >= 0.96) return "מוכן לעבודה";
  if (progress >= 0.62) return "הרכבה סופית";
  if (progress >= 0.24) return "מתחבר";
  return "מפורק";
}

function render() {
  frameRequested = false;
  if (!story || reducedMotion.matches) return;

  const progress = getProgress();
  const openingOpacity = clamp(1 - progress / 0.34);
  const middleOpacity = clamp(1 - Math.abs(progress - 0.52) / 0.22);
  const completeOpacity = clamp((progress - 0.74) / 0.18);

  story.style.setProperty("--progress", progress.toFixed(4));
  story.style.setProperty("--opening-opacity", openingOpacity.toFixed(3));
  story.style.setProperty("--middle-opacity", middleOpacity.toFixed(3));
  story.style.setProperty("--complete-opacity", completeOpacity.toFixed(3));

  if (progressOutput) {
    progressOutput.value = `${Math.round(progress * 100)}%`;
    progressOutput.textContent = `${Math.round(progress * 100)}%`;
  }

  if (assemblyState) {
    assemblyState.textContent = describeProgress(progress);
  }

  if (completeMessage) {
    const completeIsVisible = completeOpacity >= 0.85;
    completeMessage.setAttribute("aria-hidden", String(!completeIsVisible));
    completeMessage.toggleAttribute("inert", !completeIsVisible);
  }

  if (middleMessage) {
    middleMessage.setAttribute("aria-hidden", String(middleOpacity < 0.85));
  }

  if (video && duration > 0) {
    const targetTime = clamp(progress * duration, 0, Math.max(0, duration - 0.02));
    if (Math.abs(video.currentTime - targetTime) > 1 / 48) {
      video.currentTime = targetTime;
    }
  }
}

function requestRender() {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(render);
}

function showFallback() {
  mediaFrame?.classList.add("is-fallback");
}

function initializeVideo() {
  if (!video) return;
  duration = Number.isFinite(video.duration) ? video.duration : 0;
  video.pause();
  render();
}

if (video && story && !reducedMotion.matches) {
  video.pause();
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    initializeVideo();
  } else {
    video.addEventListener("loadedmetadata", initializeVideo, { once: true });
  }
  video.addEventListener("error", showFallback);
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  requestRender();
} else if (reducedMotion.matches) {
  showFallback();
  completeMessage?.removeAttribute("aria-hidden");
  completeMessage?.removeAttribute("inert");
}

function updateActiveTheme() {
  if (!themedSections.length) return;

  const activationLine = window.innerHeight * 0.48;
  let activeSection = themedSections[0];
  let smallestDistance = Number.POSITIVE_INFINITY;

  themedSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const distance =
      activationLine >= rect.top && activationLine <= rect.bottom
        ? 0
        : Math.min(
            Math.abs(rect.top - activationLine),
            Math.abs(rect.bottom - activationLine),
          );

    if (distance < smallestDistance) {
      activeSection = section;
      smallestDistance = distance;
    }
  });

  const theme = activeSection.dataset.theme || "workflow";
  if (document.body.dataset.activeTheme !== theme) {
    document.body.dataset.activeTheme = theme;
    const background = getComputedStyle(document.querySelector(".content-shell"))
      .getPropertyValue("--section-bg")
      .trim();
    if (background) themeColor?.setAttribute("content", background);
  }
}

if (themedSections.length) {
  const themeObserver = new IntersectionObserver(updateActiveTheme, {
    rootMargin: "-42% 0px -42% 0px",
    threshold: [0, 0.01, 0.5, 1],
  });

  themedSections.forEach((section) => themeObserver.observe(section));
  window.addEventListener("resize", updateActiveTheme, { passive: true });
  updateActiveTheme();
}

if (!reducedMotion.matches && revealGroups.length) {
  document.body.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );

  revealGroups.forEach((group) => revealObserver.observe(group));
}

reducedMotion.addEventListener("change", () => window.location.reload());
