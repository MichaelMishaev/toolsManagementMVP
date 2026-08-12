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
const workflowSteps = [...document.querySelectorAll(".workflow-list > li")];
const roleCarousel = document.querySelector("[data-role-carousel]");
const roleCards = [...document.querySelectorAll("[data-role-card]")];
const previousRole = document.querySelector("[data-role-prev]");
const nextRole = document.querySelector("[data-role-next]");
const rolePosition = document.querySelector("[data-role-position]");
const roleViewport = window.matchMedia("(max-width: 47.99rem)");

const sectionLabels = {
  workflow: "מהלך השירות",
  roles: "תפקידי המערכת",
  field: "עבודה בשטח",
  records: "דוחות והיסטוריה",
  mvp: "גבולות ה-MVP",
  final: "הדגמה מלאה",
};

let duration = 0;
let frameRequested = false;
let activeRoleIndex = 0;
let videoTargetTime = 0;
let videoScrubFrame = 0;
let videoScrubTimestamp = 0;
let resumeAfterSeek = null;
let unlockedVideoSource = "";
let unlockingVideoSource = "";

const videoFrameTolerance = 1 / 120;
const videoSmoothingMilliseconds = 55;

document.body.classList.add("ux-ready");

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

function scrubVideo(timestamp) {
  videoScrubFrame = 0;
  if (!video || !video.isConnected || video.readyState < 1 || duration <= 0) return;

  if (video.seeking) {
    if (!resumeAfterSeek) {
      resumeAfterSeek = () => {
        resumeAfterSeek = null;
        if (!videoScrubFrame) {
          videoScrubFrame = window.requestAnimationFrame(scrubVideo);
        }
      };
      video.addEventListener("seeked", resumeAfterSeek, { once: true });
    }
    return;
  }

  const difference = videoTargetTime - video.currentTime;
  if (Math.abs(difference) <= videoFrameTolerance) {
    video.currentTime = videoTargetTime;
    videoScrubTimestamp = 0;
    return;
  }

  const elapsed = videoScrubTimestamp
    ? Math.min(50, timestamp - videoScrubTimestamp)
    : 16.667;
  const smoothing = 1 - Math.exp(-elapsed / videoSmoothingMilliseconds);
  videoScrubTimestamp = timestamp;
  video.currentTime += difference * smoothing;
  videoScrubFrame = window.requestAnimationFrame(scrubVideo);
}

function seekVideo(progress, immediate = false) {
  if (!video) return;
  video.dataset.scrollProgress = String(progress);
  video.pause();
  if (video.readyState < 1 || duration <= 0) return;

  videoTargetTime = clamp(progress * duration, 0, Math.max(0, duration - 0.001));

  if (immediate) {
    if (videoScrubFrame) window.cancelAnimationFrame(videoScrubFrame);
    if (resumeAfterSeek) {
      video.removeEventListener("seeked", resumeAfterSeek);
      resumeAfterSeek = null;
    }
    videoScrubFrame = 0;
    videoScrubTimestamp = 0;
    if (Math.abs(video.currentTime - videoTargetTime) > videoFrameTolerance) {
      video.currentTime = videoTargetTime;
    }
    return;
  }

  if (!videoScrubFrame) {
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

  const pageTravel = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const pageScrollProgress = clamp(window.scrollY / pageTravel);
  if (pageProgress) {
    pageProgress.style.transform = `scaleX(${pageScrollProgress.toFixed(4)})`;
  }

  if (mobileAction && contentShell) {
    const contentHasArrived =
      contentShell.getBoundingClientRect().top <= window.innerHeight * 0.72;
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
    seekVideo(progress);
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
  seekVideo(Number(video.dataset.scrollProgress || getProgress()), true);
  requestRender();
}

if (video && story && !reducedMotion.matches) {
  video.pause();
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    initializeVideo();
  } else {
    video.addEventListener("loadedmetadata", initializeVideo, { once: true });
  }
  video.addEventListener("error", showFallback);
  unlockVideoLoading();
  window.addEventListener("touchstart", unlockVideoLoading, { passive: true });
  window.addEventListener("pointerdown", unlockVideoLoading, { passive: true });
} else if (reducedMotion.matches) {
  showFallback();
  completeMessage?.removeAttribute("aria-hidden");
  completeMessage?.removeAttribute("inert");
}

window.addEventListener("scroll", requestRender, { passive: true });
window.addEventListener("resize", requestRender, { passive: true });
requestRender();

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
  const activeSectionId = activeSection.id;

  sectionLinks.forEach((link) => {
    const isCurrent = link.hash === `#${activeSectionId}`;
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (currentSection) {
    currentSection.textContent = sectionLabels[theme] || "LiftVoltraq";
  }

  if (document.body.dataset.activeTheme !== theme) {
    document.body.dataset.activeTheme = theme;
    const background = getComputedStyle(document.querySelector(".content-shell"))
      .getPropertyValue("--section-bg")
      .trim();
    if (background) themeColor?.setAttribute("content", background);
  }
}

function updateActiveWorkflowStep() {
  if (!workflowSteps.length) return;

  const activationLine = window.innerHeight * 0.5;
  let activeStep = workflowSteps[0];
  let smallestDistance = Number.POSITIVE_INFINITY;

  workflowSteps.forEach((step) => {
    const rect = step.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - activationLine);
    if (distance < smallestDistance) {
      activeStep = step;
      smallestDistance = distance;
    }
  });

  workflowSteps.forEach((step) => {
    const isActive = step === activeStep;
    step.classList.toggle("is-active", isActive);
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });
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

if (workflowSteps.length) {
  const workflowObserver = new IntersectionObserver(updateActiveWorkflowStep, {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0, 0.25, 0.5, 1],
  });

  workflowSteps.forEach((step) => workflowObserver.observe(step));
  window.addEventListener("resize", updateActiveWorkflowStep, { passive: true });
  updateActiveWorkflowStep();
}

function getActiveRoleIndex() {
  if (!roleCarousel || !roleCards.length) return 0;

  const carouselRect = roleCarousel.getBoundingClientRect();
  const carouselCenter = carouselRect.left + carouselRect.width / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  roleCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(cardCenter - carouselCenter);
    if (distance < closestDistance) {
      closestIndex = index;
      closestDistance = distance;
    }
  });

  return closestIndex;
}

function updateRoleControls() {
  if (!roleCards.length) return;
  const nextRoleIndex = getActiveRoleIndex();
  const roleChanged = nextRoleIndex !== activeRoleIndex;
  activeRoleIndex = nextRoleIndex;

  if (rolePosition && roleChanged) {
    rolePosition.value = `${activeRoleIndex + 1} / ${roleCards.length}`;
    rolePosition.textContent = `${activeRoleIndex + 1} / ${roleCards.length}`;
  }

  if (previousRole) previousRole.disabled = activeRoleIndex === 0;
  if (nextRole) nextRole.disabled = activeRoleIndex === roleCards.length - 1;
}

function moveToRole(offset) {
  const targetIndex = clamp(activeRoleIndex + offset, 0, roleCards.length - 1);
  roleCards[targetIndex]?.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "nearest",
    inline: "center",
  });
}

if (roleCarousel && roleCards.length) {
  let roleFrameRequested = false;
  const requestRoleUpdate = () => {
    if (roleFrameRequested) return;
    roleFrameRequested = true;
    window.requestAnimationFrame(() => {
      roleFrameRequested = false;
      updateRoleControls();
    });
  };

  roleCarousel.tabIndex = roleViewport.matches ? 0 : -1;
  roleCarousel.addEventListener("scroll", requestRoleUpdate, { passive: true });
  previousRole?.addEventListener("click", () => moveToRole(-1));
  nextRole?.addEventListener("click", () => moveToRole(1));
  roleViewport.addEventListener("change", (event) => {
    roleCarousel.tabIndex = event.matches ? 0 : -1;
    updateRoleControls();
  });
  updateRoleControls();
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
