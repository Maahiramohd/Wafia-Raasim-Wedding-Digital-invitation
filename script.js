/* =====================================================
   NIKAH INVITATION — INTERACTION LOGIC
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initSealOpening();
  initMusicControl();
  initCountdown();
  initScrollReveal();
});

/* -----------------------------------------------------
   1. AMBIENT FLOATING GOLD PARTICLES (background canvas)
   ----------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;
  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = width < 600 ? 22 : 40;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.25 + 0.05,
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(245, 217, 126, 1)";
    particles.forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.speed;
      p.x += p.drift * 0.3;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize();
  createParticles();
  tick();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* -----------------------------------------------------
   2. SEAL OPENING SEQUENCE
   ----------------------------------------------------- */
function initSealOpening() {
  const sealButton = document.getElementById("seal-button");
  const openingScreen = document.getElementById("opening-screen");
  const invitation = document.getElementById("invitation");
  const sparkleLayer = document.getElementById("sparkle-layer");

  if (!sealButton || !openingScreen || !invitation) return;

  sealButton.addEventListener("click", () => {
    if (sealButton.classList.contains("is-tapped")) return;
    sealButton.classList.add("is-tapped");

    burstSparkles(sparkleLayer);

    // IMPORTANT: audio.play() must be called synchronously inside the
    // click handler itself — not inside a setTimeout — or browsers will
    // treat it as unrelated to the user gesture and silently block it.
    const audio = document.getElementById("nasheed-audio");
    const musicToggle = document.getElementById("music-toggle");
    if (audio) {
      audio.volume = 0.85;
      audio.play()
        .then(() => musicToggle && musicToggle.classList.add("is-playing"))
        .catch(() => {
          /* Autoplay may still be blocked on some browsers (e.g. if the
             tab is muted at the OS level); the visitor can start
             playback via the music button. */
        });
    }

    // Reveal invitation shortly after the seal shrinks + sparkle plays
    setTimeout(() => {
      openingScreen.classList.add("is-hidden");
      invitation.hidden = false;
      document.body.style.overflow = "";

      // Trigger reveal check for any sections already in view
      checkRevealElements();
    }, 650);
  });

  // Lock scroll while the opening screen is showing
  document.body.style.overflow = "hidden";
}

function burstSparkles(layer) {
  if (!layer) return;
  const count = 26;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 140;
    const sx = Math.cos(angle) * distance;
    const sy = Math.sin(angle) * distance;

    sparkle.style.setProperty("--sx", `${sx}px`);
    sparkle.style.setProperty("--sy", `${sy}px`);
    sparkle.style.left = "50%";
    sparkle.style.top = "50%";
    sparkle.style.animationDelay = `${Math.random() * 0.15}s`;

    layer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1400);
  }
}

/* -----------------------------------------------------
   3. MUSIC CONTROL (play / pause / mute)
   ----------------------------------------------------- */
function initMusicControl() {
  const toggle = document.getElementById("music-toggle");
  const audio = document.getElementById("nasheed-audio");
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");

  if (!toggle || !audio) return;

  function setPlayingState(isPlaying) {
    toggle.classList.toggle("is-playing", isPlaying);
    iconPlay.style.display = isPlaying ? "none" : "block";
    iconPause.style.display = isPlaying ? "block" : "none";
    toggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setPlayingState(true)).catch(() => {});
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
}

/* -----------------------------------------------------
   4. LIVE COUNTDOWN
   ----------------------------------------------------- */
function initCountdown() {
  const container = document.getElementById("countdown");
  if (!container) return;

  const targetDate = new Date(container.dataset.target).getTime();
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function update(el, value) {
    if (el.textContent === value) return;
    el.classList.add("is-updating");
    requestAnimationFrame(() => {
      el.textContent = value;
      requestAnimationFrame(() => el.classList.remove("is-updating"));
    });
  }

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      update(elDays, "00");
      update(elHours, "00");
      update(elMinutes, "00");
      update(elSeconds, "00");
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    update(elDays, pad(days));
    update(elHours, pad(hours));
    update(elMinutes, pad(minutes));
    update(elSeconds, pad(seconds));
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* -----------------------------------------------------
   5. SCROLL REVEAL (Intersection Observer, fires once)
   ----------------------------------------------------- */
let revealObserver;

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => revealObserver.observe(el));
}

function checkRevealElements() {
  // Re-run a manual pass in case the invitation was hidden while
  // the observer initialized (elements with display:none never fire).
  if (!revealObserver) return;
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    revealObserver.observe(el);
  });
}
