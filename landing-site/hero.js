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
const pageProgress = document.querySelector("[data-page-progress]");
const contentShell = document.querySelector(".content-shell");
const mobileAction = document.querySelector("[data-mobile-action]");
const currentSection = document.querySelector("[data-current-section]");
const sectionLinks = [...document.querySelectorAll('.section-links a[href^="#"]')];

const sectionLabels = {
  equipment: "ציוד",
  advantage: "היתרון",
  partners: "יצרנים",
  support: "שירות וחלפים",
  about: "אודות",
  final: "הכלי הבא",
};

let duration = 0;
let frameRequested = false;
let videoTargetTime = 0;
let videoScrubFrame = 0;
let videoLastRequestedTime = -1;
let unlockedVideoSource = "";
let unlockingVideoSource = "";

const videoFrameTolerance = 1 / 120;
const videoFramesPerSecond = 24;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

document.body.classList.add("ux-ready");

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
  return "בדרך לעבודה";
}

function scrubVideo() {
  videoScrubFrame = 0;
  if (!video || !video.isConnected || video.readyState < 1 || duration <= 0) return;
  if (video.seeking) return;

  const difference = videoTargetTime - video.currentTime;
  if (Math.abs(difference) <= videoFrameTolerance) return;
  if (Math.abs(videoTargetTime - videoLastRequestedTime) <= videoFrameTolerance) return;
  videoLastRequestedTime = videoTargetTime;
  video.currentTime = videoTargetTime;
}

function seekVideo(progress, immediate = false) {
  if (!video) return;
  video.dataset.scrollProgress = String(progress);
  video.pause();
  if (video.readyState < 1 || duration <= 0) return;

  const maximumTime = Math.max(0, duration - 0.001);
  const targetFrame = Math.round(clamp(progress) * maximumTime * videoFramesPerSecond);
  videoTargetTime = clamp(targetFrame / videoFramesPerSecond, 0, maximumTime);
  if (immediate) {
    if (videoScrubFrame) window.cancelAnimationFrame(videoScrubFrame);
    videoScrubFrame = 0;
    videoLastRequestedTime = videoTargetTime;
    if (Math.abs(video.currentTime - videoTargetTime) > videoFrameTolerance) {
      video.currentTime = videoTargetTime;
    }
    return;
  }

  if (
    !videoScrubFrame &&
    Math.abs(videoTargetTime - videoLastRequestedTime) > videoFrameTolerance
  ) {
    videoScrubFrame = window.requestAnimationFrame(scrubVideo);
  }
}

function unlockVideoLoading() {
  if (!video) return;
  const source = video.currentSrc || video.src;
  if (!source || unlockedVideoSource === source || unlockingVideoSource === source) return;

  video.muted = true;
  const finishUnlock = () => {
    if (unlockingVideoSource === source) unlockingVideoSource = "";
    if (!video.isConnected) return;
    if ((video.currentSrc || video.src) !== source) {
      unlockVideoLoading();
      return;
    }
    video.pause();
    unlockedVideoSource = source;
    seekVideo(Number(video.dataset.scrollProgress || 0), true);
  };

  try {
    const playAttempt = video.play();
    if (playAttempt?.then) {
      unlockingVideoSource = source;
      playAttempt
        .then(() => window.requestAnimationFrame(finishUnlock))
        .catch(() => {
          if (unlockingVideoSource === source) unlockingVideoSource = "";
        });
      return;
    }
  } catch {
    return;
  }

  finishUnlock();
}

function render() {
  frameRequested = false;

  const pageTravel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pageScrollProgress = clamp(window.scrollY / pageTravel);
  if (pageProgress) pageProgress.style.transform = `scaleX(${pageScrollProgress.toFixed(4)})`;

  if (mobileAction && contentShell) {
    const contentHasArrived = contentShell.getBoundingClientRect().top <= window.innerHeight * 0.72;
    mobileAction.classList.toggle("is-visible", contentHasArrived);
  }

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
  if (assemblyState) assemblyState.textContent = describeProgress(progress);
  if (completeMessage) {
    const visible = completeOpacity >= 0.85;
    completeMessage.setAttribute("aria-hidden", String(!visible));
    completeMessage.toggleAttribute("inert", !visible);
  }
  if (middleMessage) middleMessage.setAttribute("aria-hidden", String(middleOpacity < 0.85));
  if (video && duration > 0) seekVideo(progress);
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
  seekVideo(Number(video.dataset.scrollProgress || getProgress()), true);
  requestRender();
}

if (video && story && !reducedMotion.matches) {
  video.pause();
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) initializeVideo();
  else video.addEventListener("loadedmetadata", initializeVideo, { once: true });
  video.addEventListener("error", showFallback);
  video.addEventListener("seeked", () => {
    if (
      !videoScrubFrame &&
      Math.abs(videoTargetTime - videoLastRequestedTime) > videoFrameTolerance
    ) {
      videoScrubFrame = window.requestAnimationFrame(scrubVideo);
    }
  });
  unlockVideoLoading();
  window.addEventListener("touchstart", unlockVideoLoading, { passive: true });
  window.addEventListener("pointerdown", unlockVideoLoading, { passive: true });
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
    const distance = activationLine >= rect.top && activationLine <= rect.bottom
      ? 0
      : Math.min(Math.abs(rect.top - activationLine), Math.abs(rect.bottom - activationLine));
    if (distance < smallestDistance) {
      activeSection = section;
      smallestDistance = distance;
    }
  });

  const theme = activeSection.dataset.theme || "equipment";
  const activeSectionId = activeSection.id;
  sectionLinks.forEach((link) => {
    if (link.hash === `#${activeSectionId}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  if (currentSection) currentSection.textContent = sectionLabels[theme] || "Lift Pro 26";
  if (document.body.dataset.activeTheme !== theme) {
    document.body.dataset.activeTheme = theme;
    const background = getComputedStyle(contentShell).getPropertyValue("--section-bg").trim();
    if (background) themeColor?.setAttribute("content", background);
  }
}

function updatePageState() {
  updateActiveTheme();
  requestRender();
}

window.addEventListener("scroll", updatePageState, { passive: true });
window.addEventListener("resize", updatePageState, { passive: true });

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
    { threshold: 0.13, rootMargin: "0px 0px -8%" },
  );
  revealGroups.forEach((group) => revealObserver.observe(group));
} else {
  revealGroups.forEach((group) => group.classList.add("is-visible"));
}

reducedMotion.addEventListener("change", () => window.location.reload());
updateActiveTheme();
requestRender();
