// MONI CAFE — interactions, motion and optional sound
const preloader = document.getElementById("preloader");
window.addEventListener("load", () => setTimeout(() => preloader.classList.add("done"), 650));

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.setAttribute("aria-label", opened ? "Close menu" : "Open menu");
  playSound("tap");
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  playSound("tap");
}));

// Optional cafe sound effects. Browser autoplay rules require a visitor click.
let soundOn = false;
let audioContext;

function getAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  if (!audioContext) audioContext = new Audio();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}
function note(freq, start, length, volume, wave = "sine") {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, start + length);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + length + .04);
}
function playPourSound() {
  const ctx = getAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const length = Math.floor(ctx.sampleRate * 1.6);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const fadeIn = Math.min(1, i / (ctx.sampleRate * .15));
    const fadeOut = Math.min(1, (length - i) / (ctx.sampleRate * .35));
    samples[i] = (Math.random() * 2 - 1) * .2 * fadeIn * fadeOut;
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.value = 950;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.05, now + .2);
  gain.gain.setValueAtTime(.05, now + .8);
  gain.gain.exponentialRampToValueAtTime(.0001, now + 1.55);
  source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  source.start(now); source.stop(now + 1.65);
  note(1046.5, now + 1.3, .32, .02);
}
function playSound(type = "tap") {
  if (!soundOn) return;
  const ctx = getAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  if (type === "welcome") {
    note(523.25, now, .38, .035);
    note(659.25, now + .12, .42, .03);
    note(783.99, now + .25, .5, .025);
    setTimeout(playPourSound, 350);
  } else if (type === "sparkle") {
    note(880, now, .15, .012);
    note(1174.66, now + .08, .2, .009);
  } else {
    note(420, now, .075, .018, "triangle");
  }
}
const soundButton = document.getElementById("soundToggle");
const soundLabel = document.getElementById("soundLabel");
soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  soundButton.classList.toggle("active", soundOn);
  soundButton.setAttribute("aria-pressed", String(soundOn));
  soundButton.setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
  soundLabel.textContent = soundOn ? "SOUND ON" : "SOUND OFF";
  if (soundOn) playSound("welcome");
});

// Interactive menu category filters
const filterButtons = document.querySelectorAll(".menu-tab");
const menuItems = document.querySelectorAll(".menu-item");
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  menuItems.forEach(item => {
    const visible = filter === "all" || item.dataset.category === filter;
    item.classList.toggle("hidden", !visible);
  });
  playSound("tap");
}));

// Motion gracefully falls back to the static design if GSAP/CDN is unavailable.
if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-copy > *", { y: 32, opacity: 0, duration: .85, stagger: .12, ease: "power3.out", delay: .2 });
  gsap.from(".hero-photo", { scale: .9, opacity: 0, duration: 1.15, ease: "power3.out", delay: .3 });
  gsap.from(".coffee-3d-scene", { y: 45, opacity: 0, scale: .75, duration: 1.35, ease: "back.out(1.5)", delay: .55 });
  gsap.to(".floating-note", { y: -9, duration: 2.3, repeat: -1, yoyo: true, stagger: .35, ease: "sine.inOut" });
  gsap.to(".hero-roundel", { rotation: 360, duration: 24, repeat: -1, ease: "none" });
  if (window.ScrollTrigger) {
    gsap.utils.toArray(".section-meta,.intro-layout,.story-photo,.menu-heading,.menu-item,.experience-copy,.visit-copy,.visit-panel").forEach(el => {
      gsap.from(el, {
        y: 36, opacity: 0, duration: .8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true, onEnter: () => playSound("sparkle") }
      });
    });
    gsap.to(".story-photo img", {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: ".story-photo", start: "top bottom", end: "bottom top", scrub: true }
    });
  }
}
document.querySelectorAll(".btn,.arrow-link,.hero-scroll").forEach(el => el.addEventListener("click", () => playSound("tap")));
