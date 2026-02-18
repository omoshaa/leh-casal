/* 
   NOSSO UNIVERSO  script.js
    */

//  PERSONALIZE AQUI 
const RELATIONSHIP_START_DATE = "2025-06-14T00:00:00"; // 14/06/2025
const ANNIVERSARY_DATE        = "2026-06-14T00:00:00"; // 1 ano juntos
const SECRET_PASSWORD         = "amor";
// 

/* 
   0. FADE DE ENTRADA
    */
const pageFade = document.getElementById("page-fade");
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (pageFade) pageFade.classList.add("gone");
  });
});

/* 
   1. SPLASH SCREEN
    */
const splash = document.getElementById("splash");
window.addEventListener("load", () => {
  setTimeout(() => { if (splash) splash.classList.add("hidden"); }, 2700);
});

/* 
   2. CURSOR PERSONALIZADO
    */
const cursorDot  = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener("mousemove", (e) => { dotX = e.clientX; dotY = e.clientY; });

function animateCursor() {
  ringX += (dotX - ringX) * 0.14;
  ringY += (dotY - ringY) * 0.14;
  if (cursorDot)  { cursorDot.style.left  = dotX  + "px"; cursorDot.style.top   = dotY  + "px"; }
  if (cursorRing) { cursorRing.style.left = ringX + "px"; cursorRing.style.top  = ringY + "px"; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* 
   3. CONTADOR DE TEMPO REAL + ANIVERSÁRIO
    */
const startDate      = new Date(RELATIONSHIP_START_DATE);
const anniversaryDate = new Date(ANNIVERSARY_DATE);

const daysEl           = document.getElementById("days");
const hoursEl          = document.getElementById("hours");
const minutesEl        = document.getElementById("minutes");
const secondsEl        = document.getElementById("seconds");
const startDateLabelEl = document.getElementById("relationship-start-label");
const daysBigEl        = document.getElementById("days-big");
const annDaysEl        = document.getElementById("ann-days");
const annHoursEl       = document.getElementById("ann-hours");
const annMinutesEl     = document.getElementById("ann-minutes");
const annSecondsEl     = document.getElementById("ann-seconds");
const anniversaryWrap  = document.getElementById("anniversary-wrap");

function pad(n) { return String(n).padStart(2, "0"); }

function updateCounter() {
  const now          = Date.now();
  const diff         = Math.max(0, now - startDate);
  const totalSeconds = Math.floor(diff / 1000);
  const totalDays    = Math.floor(totalSeconds / 86400);

  if (daysEl)    daysEl.textContent    = pad(totalDays);
  if (hoursEl)   hoursEl.textContent   = pad(Math.floor((totalSeconds % 86400) / 3600));
  if (minutesEl) minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  if (secondsEl) secondsEl.textContent = pad(totalSeconds % 60);
  if (daysBigEl) daysBigEl.textContent = totalDays;

  if (annDaysEl) {
    const diffAnn = Math.max(0, anniversaryDate - now);
    if (diffAnn === 0) {
      const lbl = anniversaryWrap && anniversaryWrap.querySelector(".anniversary-label");
      if (lbl) lbl.textContent = " Hoje é nosso aniversário!";
      annDaysEl.textContent = annHoursEl.textContent =
      annMinutesEl.textContent = annSecondsEl.textContent = "00";
    } else {
      const t = Math.floor(diffAnn / 1000);
      annDaysEl.textContent    = Math.floor(t / 86400);
      annHoursEl.textContent   = pad(Math.floor((t % 86400) / 3600));
      annMinutesEl.textContent = pad(Math.floor((t % 3600) / 60));
      annSecondsEl.textContent = pad(t % 60);
    }
  }
}

if (!Number.isNaN(startDate.getTime())) {
  if (startDateLabelEl) {
    startDateLabelEl.textContent = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long"
    }).format(startDate);
  }
  updateCounter();
  setInterval(updateCounter, 1000);
}

/* 
   4. REVEAL AO ROLAR (fade-in + stagger)
    */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* 
   5. NAV LATERAL  destaque da seção ativa
    */
const pillDots   = document.querySelectorAll(".pill-dot");
const navTargets = [...pillDots].map((d) =>
  document.querySelector(d.getAttribute("href"))
).filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pillDots.forEach((d) => {
          d.classList.toggle("active", d.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { threshold: 0.35 }
);
navTargets.forEach((el) => navObserver.observe(el));

/* 
   6. CANVAS  CHUVA DE PÉTALAS E CORAÇÕES
    */
const canvas = document.getElementById("emotion-rain");
const ctx    = canvas.getContext("2d");

const PARTICLE_COUNT = 40;
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function rand(min, max) { return Math.random() * (max - min) + min; }

const PETAL_COLORS = [
  ["#8b1b3f","#c0395e"],
  ["#6a0e26","#9e2a4a"],
  ["#7b1e3b","#b5304f"],
  ["#5e0b15","#8b1b3f"],
];

class Particle {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x        = rand(0, canvas.width);
    this.y        = init ? rand(0, canvas.height) : rand(-80, -10);
    this.size     = rand(8, 22);
    this.vy       = rand(0.3, 0.9);
    this.vx       = rand(-0.2, 0.2);
    this.rot      = rand(0, Math.PI * 2);
    this.rotS     = rand(-0.009, 0.009);
    this.alpha    = rand(0.10, 0.36);
    this.alphaDir = rand(0.0005, 0.0014);
    this.swing    = rand(0.4, 1.2);
    this.swingF   = rand(0.007, 0.018);
    this.isHeart  = Math.random() > 0.52;
    const pair    = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    this.col1 = pair[0];
    this.col2 = pair[1];
  }

  update() {
    this.y   += this.vy;
    this.x   += this.vx + Math.sin(this.y * this.swingF) * this.swing;
    this.rot += this.rotS;
    this.alpha += this.alphaDir;
    if (this.alpha > 0.38 || this.alpha < 0.08) this.alphaDir *= -1;
    if (this.y > canvas.height + 30 || this.x < -40 || this.x > canvas.width + 40)
      this.reset(false);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = Math.max(0, this.alpha);
    if (this.isHeart) {
      ctx.fillStyle = this.col1;
      drawHeart(0, 0, this.size * 0.85);
    } else {
      drawPetal(0, 0, this.size, this.col1, this.col2);
    }
    ctx.restore();
  }
}

function drawHeart(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.25);
  ctx.bezierCurveTo(x, y,           x - s*.5, y,          x - s*.5, y + s*.25);
  ctx.bezierCurveTo(x - s*.5, y + s*.55, x,   y + s*.78,  x, y + s);
  ctx.bezierCurveTo(x, y + s*.78,   x + s*.5, y + s*.55,  x + s*.5, y + s*.25);
  ctx.bezierCurveTo(x + s*.5, y,    x,         y,          x, y + s*.25);
  ctx.fill();
}

function drawPetal(x, y, s, col1, col2) {
  const grd = ctx.createRadialGradient(x, y - s * 0.22, s * 0.05, x, y, s * 0.72);
  grd.addColorStop(0, col2);
  grd.addColorStop(1, col1);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(x, y - s * 0.55);
  ctx.bezierCurveTo(x + s * 0.42, y - s * 0.45, x + s * 0.38, y + s * 0.45, x, y + s * 0.55);
  ctx.bezierCurveTo(x - s * 0.38, y + s * 0.45, x - s * 0.42, y - s * 0.45, x, y - s * 0.55);
  ctx.fill();
}

function loopRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => { p.update(); p.draw(); });
  requestAnimationFrame(loopRain);
}

function initRain() {
  resizeCanvas();
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  loopRain();
}

window.addEventListener("resize", resizeCanvas);
initRain();

/* 
   7. ENVELOPE  CARTA + TYPEWRITER
    */
const envelope        = document.getElementById("envelope");
const letterArticle   = document.getElementById("letter-article");
const letterParagraph = document.getElementById("letter-text");
const letterSignature = document.getElementById("letter-signature");

const LETTER_TEXT = letterParagraph
  ? letterParagraph.textContent.trim().replace(/\s+/g, " ")
  : "";

if (letterParagraph) {
  letterParagraph.textContent = "";
  letterSignature.style.opacity    = "0";
  letterSignature.style.transition = "opacity 1.1s ease";
}

function typewriter(el, text, onDone) {
  const cursor = Object.assign(document.createElement("span"), { className: "typewriter-cursor" });
  el.appendChild(cursor);
  let i = 0;
  function tick() {
    if (i < text.length) {
      const ch = text[i++];
      cursor.insertAdjacentText("beforebegin", ch);
      setTimeout(tick, ch === "." ? 310 : ch === "," ? 120 : 28);
    } else {
      setTimeout(() => { cursor.remove(); onDone && onDone(); }, 800);
    }
  }
  tick();
}

let letterOpened = false;

function openEnvelope() {
  if (letterOpened) return;
  letterOpened = true;
  envelope.classList.add("opened");
  letterArticle.classList.add("revealed");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      letterArticle.classList.add("visible");
      setTimeout(() => {
        typewriter(letterParagraph, LETTER_TEXT, () => {
          letterSignature.style.opacity = "1";
        });
      }, 500);
    });
  });
}

if (envelope) {
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openEnvelope(); });
  envelope.setAttribute("tabindex", "0");
  envelope.setAttribute("role", "button");
}

/* 
   8. LIGHTBOX
    */
const lightbox        = document.getElementById("lightbox");
const lightboxImg     = document.getElementById("lightbox-img");
const lightboxClose   = document.getElementById("lightbox-close");
const lightboxCaption = document.getElementById("lightbox-caption");

document.querySelectorAll(".photo-card img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    const caption = img.closest("figure")?.dataset?.caption || "";
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* 
   9. FAB  EXPLOSÃO DE CORAÇÕES
    */
const fabHeart = document.getElementById("fab-heart");
const BURST_COLORS = ["#8b1b3f","#c0395e","#d4af37","#7b1e3b","#e8669a","#e8c0b0"];

function explodeHearts() {
  const rect = fabHeart.getBoundingClientRect();
  const ox   = rect.left + rect.width  / 2;
  const oy   = rect.top  + rect.height / 2;
  const bursts = Array.from({ length: 48 }, () => ({
    x: ox, y: oy,
    vx: (Math.random() - 0.5) * 18,
    vy: -(Math.random() * 16 + 3),
    size: rand(8, 22),
    alpha: 1,
    gravity: 0.44,
    color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
  }));
  let frame = 0;
  function loop() {
    frame++;
    bursts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
      p.alpha = Math.max(0, p.alpha - 0.017);
    });
    const alive = bursts.filter((p) => p.alpha > 0);
    if (!alive.length || frame > 190) return;
    alive.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      drawHeart(0, 0, p.size * 0.9);
      ctx.restore();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

if (fabHeart) {
  fabHeart.addEventListener("click", () => {
    explodeHearts();
    fabHeart.style.cssText += "transform:scale(1.45);color:var(--gold);box-shadow:0 0 35px rgba(212,175,55,.65);";
    setTimeout(() => {
      fabHeart.style.transform = "";
      fabHeart.style.color     = "";
      fabHeart.style.boxShadow = "";
    }, 480);
  });
}

/* 
   10. RAZÕES  flip ao toque (mobile)
    */
document.querySelectorAll(".reason-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

/* 
   11. MENSAGEM SECRETA
    */
const secretInput  = document.getElementById("secret-input");
const secretBtn    = document.getElementById("secret-btn");
const secretReveal = document.getElementById("secret-reveal");

function trySecret() {
  if (!secretInput) return;
  const val = secretInput.value.trim().toLowerCase();
  if (val === SECRET_PASSWORD.toLowerCase()) {
    secretReveal.classList.add("open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => secretReveal.classList.add("visible"));
    });
    secretInput.disabled  = true;
    secretBtn.disabled    = true;
    secretBtn.textContent = "";
    explodeHearts();
  } else {
    secretInput.style.borderColor = "#c0395e";
    secretInput.style.boxShadow   = "0 0 0 3px rgba(192,57,94,.3)";
    setTimeout(() => {
      secretInput.style.borderColor = "";
      secretInput.style.boxShadow   = "";
    }, 900);
  }
}

if (secretBtn)   secretBtn.addEventListener("click", trySecret);
if (secretInput) secretInput.addEventListener("keydown", (e) => { if (e.key === "Enter") trySecret(); });
