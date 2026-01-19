/* =========================================================
   SCRIPT.JS (COMPLETO + LIMPO)
   - GRID quebrado responsivo (DESKTOP/TABLET/MOBILE) ✅ (não vira lista)
   - Mantém: BG shuffle, efeitos de texto, rotate imagens+texto, flip, intro, depth reveal
========================================================= */

/* ===================== SELECTORS GERAIS ===================== */
const bgCards = [...document.querySelectorAll(".bg-card")];
const cards   = [...document.querySelectorAll(".card")];
const section = document.getElementById("projetos");

console.log("cards:", cards.length, "bgCards:", bgCards.length);

/* ===================== HELPERS ===================== */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;

function shuffle(array){
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function preload(src){
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(src);
    im.onerror = reject;
    im.src = src;
  });
}

/* ===================== REVEAL (cards) ===================== 
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
}, { threshold: 0.12 });
cards.forEach(c => io.observe(c));*/

/* ===================== FUNDO (BG shuffle) ===================== 
const BG_SLOTS = [
  { x: -18, y: -12, w: 78, h: 92, r: -6 },
  { x:  40, y: -10, w: 80, h: 94, r:  5 },
  { x: -10, y:  18, w: 92, h: 78, r:  2 },
  { x:  18, y:  -6, w: 86, h: 90, r: -3 },
];

const BG_MAP_A = [0, 1];
const BG_MAP_B = [2, 0];
const BG_MAP_C = [1, 3];

function applyBgMap(map1, map2, t){
  if (bgCards.length < 2) return;

  bgCards.forEach((el, i) => {
    const s1 = BG_SLOTS[map1[i] ?? 0] ?? BG_SLOTS[0];
    const s2 = BG_SLOTS[map2[i] ?? 1] ?? BG_SLOTS[1];

    el.style.left   = lerp(s1.x, s2.x, t) + "%";
    el.style.top    = lerp(s1.y, s2.y, t) + "%";
    el.style.width  = lerp(s1.w, s2.w, t) + "%";
    el.style.height = lerp(s1.h, s2.h, t) + "%";
    el.style.transform = `rotate(${lerp(s1.r, s2.r, t)}deg)`;
  });
}*/

/* ===================== PROGRESSO (0..1) ===================== */
function getProgress(){
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = vh * 0.12;
  const end   = -(rect.height - vh) - vh * 0.12;
  return clamp((start - rect.top) / (start - end), 0, 1);
}

/* ===================== ESTADO SCROLL (idle/scrolling) ===================== */
let stopTimer = null;

function setState(scrolling){
  document.documentElement.classList.toggle("is-scrolling", scrolling);
  document.documentElement.classList.toggle("is-idle", !scrolling);
}
setState(false);

/* =========================================================
   GRID QUEBRADO RESPONSIVO (ÚNICO)
   - Desktop: SLOTS_DESKTOP
   - Tablet : SLOTS_TABLET
   - Mobile : SLOTS_MOBILE (continua quebrado!)
========================================================= 
const mqMobile = window.matchMedia("(max-width: 750px)");
const mqTablet = window.matchMedia("(max-width: 1024px)");

function isMobileGrid(){ return mqMobile.matches; }
function isTabletGrid(){ return mqTablet.matches; }

/* slots desktop 
const SLOTS_DESKTOP = [
  { x:  0, y: 28, w: 40, h: 52, z: 12, r: -2 },
  { x: 62, y: 12, w: 36, h: 62, z: 11, r:  2 },
  { x: 44, y: 60, w: 20, h: 26, z: 14, r: -3 },
  { x: 80, y: 46, w: 18, h: 26, z: 15, r:  3 },
  { x: 48, y: 82, w: 44, h: 18, z: 13, r:  1 },
  { x:  6, y:  8, w: 20, h: 18, z: 10, r:  2 },
];

/* slots tablet 
const SLOTS_TABLET = [
  { x:  4, y: 22, w: 48, h: 52, z: 12, r: -1 },
  { x: 52, y: 10, w: 44, h: 60, z: 11, r:  1 },
  { x: 36, y: 58, w: 26, h: 28, z: 14, r: -2 },
  { x: 72, y: 48, w: 24, h: 26, z: 15, r:  2 },
  { x: 10, y: 72, w: 52, h: 18, z: 13, r:  1 },
  { x:  8, y:  6, w: 24, h: 18, z: 10, r:  1 },
];

/* ✅ slots mobile (continua grid quebrado, mas tudo cabe) 
const SLOTS_MOBILE = [
  { x:  6, y:  8, w: 44, h: 26, z: 12, r: -2 }, // topo-esq
  { x: 52, y:  6, w: 42, h: 30, z: 11, r:  2 }, // topo-dir
  { x:  8, y: 40, w: 86, h: 22, z: 13, r:  1 }, // faixa grande
  { x:  6, y: 66, w: 48, h: 26, z: 14, r: -2 }, // baixo-esq
  { x: 52, y: 64, w: 42, h: 30, z: 15, r:  2 }, // baixo-dir
  { x: 24, y: 22, w: 52, h: 20, z: 10, r:  1 }, // meio
];

function getSlots(){
  if (isMobileGrid()) return SLOTS_MOBILE;
  if (isTabletGrid()) return SLOTS_TABLET;
  return SLOTS_DESKTOP;
}

/* mapas 
const MAP_A = [0,1,2,3,4,5];
const MAP_B = [1,0,3,2,5,4];
const MAP_C = [2,3,1,5,0,4];

function safeMap(baseMap, count, slotsLen){
  const m = [];
  for (let i = 0; i < count; i++) m.push(baseMap[i] ?? (i % slotsLen));
  return m;
}

function applyMap(map1, map2, t){
  const SLOTS = getSlots();
  const m1 = safeMap(map1, cards.length, SLOTS.length);
  const m2 = safeMap(map2, cards.length, SLOTS.length);

  cards.forEach((card, i) => {
    const s1 = SLOTS[m1[i]] ?? SLOTS[i % SLOTS.length];
    const s2 = SLOTS[m2[i]] ?? SLOTS[(i + 1) % SLOTS.length];

    card.style.left   = lerp(s1.x, s2.x, t) + "%";
    card.style.top    = lerp(s1.y, s2.y, t) + "%";
    card.style.width  = lerp(s1.w, s2.w, t) + "%";
    card.style.height = lerp(s1.h, s2.h, t) + "%";
    card.style.zIndex = String(Math.round(lerp(s1.z, s2.z, t)));

    card.classList.add("is-visible");
    card.style.transform = `translate3d(0,0,0) rotate(${lerp(s1.r, s2.r, t).toFixed(2)}deg)`;
  });
}

/* render único (BG + FG) 
function renderGrid(){Gr
  const p = getProgress();

  // BG (pode manter no mobile, fica bonito. Se pesar, dá pra desativar aqui.)
  if (p < 0.5) applyBgMap(BG_MAP_A, BG_MAP_B, p / 0.5);
  else         applyBgMap(BG_MAP_B, BG_MAP_C, (p - 0.5) / 0.5);

  // FG
  if (p < 0.5) applyMap(MAP_A, MAP_B, p / 0.5);
  else         applyMap(MAP_B, MAP_C, (p - 0.5) / 0.5);
}

/* scroll otimizado (único) 
let ticking = false;

addEventListener("scroll", () => {
  setState(true);
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => setState(false), 140);

  if (!ticking){
    ticking = true;
    requestAnimationFrame(() => {
      renderGrid();
      ticking = false;
    });
  }
}, { passive:true });

/* resize: recalcula 
addEventListener("resize", () => {
  renderGrid();
}, { passive:true });

/* init 
renderGrid();*/

/* ===================== HERO TEXT EFFECTS ===================== */
/* --- TextScramble (só se existir #scrambleText) --- */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 22);
      this.queue.push({ from, to, start, end, char: "" });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="opacity:.55">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) this.resolve();
    else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

(function initScramble(){
  const el = document.getElementById("scrambleText");
  if (!el) return;

  const fx = new TextScramble(el);
  const phrases = [
    "Design que se move. Experiência que fica.",
    "Interfaces vivas, estética real.",
    "Do conceito ao código, com intenção.",
    "Portfólio — UI • Web • Motion",
  ];

  let i = 0;
  const next = () => {
    fx.setText(phrases[i]).then(() => setTimeout(next, 1800));
    i = (i + 1) % phrases.length;
  };
  next();
})();

/* --- Scatter (LETRAS VINDO DOS CANTOS) - #scatterText --- */
function scatterText(el, { spread = 180, rotate = 22, stagger = 16 } = {}) {
  const text = el.textContent;
  el.textContent = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = char === " " ? "\u00A0" : char;

    const dx = (Math.random() * 2 - 1) * spread;
    const dy = (Math.random() * 2 - 1) * spread;
    const dr = (Math.random() * 2 - 1) * rotate;

    span.style.setProperty("--dx", dx + "px");
    span.style.setProperty("--dy", dy + "px");
    span.style.setProperty("--dr", dr + "deg");
    span.style.transitionDelay = (i * stagger) + "ms";

    el.appendChild(span);
  });

  requestAnimationFrame(() => el.classList.add("is-in"));
}

(function initScatter(){
  const el = document.getElementById("scatterText");
  if (!el) return;
  scatterText(el);
})();

/* ===================== CONTENT (texto grudado na imagem) ===================== */
const contentPools = {
  anomaly: [
    { src: "images/01.png", title: "Roxo",    sub: "", desc: "Colocando criatividade em todos os projetos.", list: ["", "", ""] },
    { src: "images/02.png", title: "Textura", sub: "Paper / Grain", desc: "Texturas com presença tátil e luz suave.", list: ["Tipo: Texture", "Clima: Calmo", "Uso: Overlays / UI"] },
    { src: "images/03.png", title: "Neblina", sub: "Atmosphere", desc: "Camadas leves e distantes, sensação tranquila.", list: ["Tipo: Gradient", "Clima: Tranquilo", "Uso: Hero / Cards"] },
    { src: "images/04.png", title: "Impulso", sub: "Color Field", desc: "Cor controlada + contraste macio.", list: ["Tipo: Abstract", "Clima: Enérgico", "Uso: Destaque"] },
    { src: "images/05.png", title: "Massa",   sub: "Impasto", desc: "Pintura espessa e orgânica com profundidade.", list: ["Tipo: Paint", "Clima: Quente", "Uso: Background / Capa"] },
    { src: "images/06.png", title: "Maré",    sub: "Blue Study", desc: "Azuis densos e recortes suaves.", list: ["Tipo: Abstract", "Clima: Frio", "Uso: Editorial"] },
    { src: "images/07.png", title: "Sol",     sub: "Warm Wash", desc: "Aquarela quente, leve e minimal.", list: ["Tipo: Wash", "Clima: Tranquilo", "Uso: Cards / Sections"] },
    { src: "images/08.png", title: "Branco",  sub: "Texture", desc: "Textura clean para respiro no layout.", list: ["Tipo: Texture", "Clima: Neutro", "Uso: Base / Overlay"] },
  ]
};

const contentBySrc = Object.fromEntries(contentPools.anomaly.map(item => [item.src, item]));

function applyCardContent(card, item){
  const ft  = card.querySelector(".front-title");
  const fs  = card.querySelector(".front-sub");
  const bt  = card.querySelector(".back-title");
  const bd  = card.querySelector(".back-desc");
  const li1 = card.querySelector(".back-li1");
  const li2 = card.querySelector(".back-li2");
  const li3 = card.querySelector(".back-li3");

  if (ft) ft.textContent = item.title ?? "";
  if (fs) fs.textContent = item.sub ?? "";
  if (bt) bt.textContent = item.title ?? "";
  if (bd) bd.textContent = item.desc ?? "";
  if (li1) li1.textContent = item.list?.[0] ?? "";
  if (li2) li2.textContent = item.list?.[1] ?? "";
  if (li3) li3.textContent = item.list?.[2] ?? "";
}

function syncTextWithImage(card){
  const img = card.querySelector("img[data-type='anomaly']");
  if (!img) return;
  const src = img.getAttribute("src");
  const item = contentBySrc[src];
  if (!item) return;
  applyCardContent(card, item);
}

/* ===================== ROTATE IMAGES (sem repetir no mesmo ciclo e sem migrar) ===================== */
const cardDecks = new WeakMap();

function initDecks(){
  const pool = contentPools.anomaly;
  document.querySelectorAll(".card").forEach(card => {
    cardDecks.set(card, { deck: shuffle(pool), idx: 0 });
  });
}

function nextFromDeck(card, usedThisTick){
  const state = cardDecks.get(card);
  if (!state) return null;

  const img = card.querySelector("img[data-type='anomaly']");
  const current = img?.getAttribute("src") ?? "";

  for (let tries = 0; tries < state.deck.length; tries++){
    const item = state.deck[state.idx % state.deck.length];
    state.idx = (state.idx + 1) % state.deck.length;

    if (item.src === current) continue;
    if (usedThisTick.has(item.src)) continue;

    return item;
  }
  return null;
}

async function rotatePerCard(){
  if (document.documentElement.classList.contains("has-open")) return;

  const usedThisTick = new Set();
  const allCards = [...document.querySelectorAll(".card")];

  for (const card of allCards){
    const img = card.querySelector("img[data-type='anomaly']");
    if (!img) continue;

    const item = nextFromDeck(card, usedThisTick);
    if (!item) continue;

    try{
      await preload(item.src);
      usedThisTick.add(item.src);

      img.style.opacity = 0;
      setTimeout(() => {
        img.src = item.src;
        syncTextWithImage(card);
        img.style.opacity = 1;
      }, 250);

    } catch {
      console.warn("Imagem não carregou:", item.src);
    }
  }
}

initDecks();
document.querySelectorAll(".card").forEach(syncTextWithImage);
setInterval(rotatePerCard, 5000);

/* ===================== FLIP ON CLICK (robusto com overlay) ===================== */
(function initFlipCards(){
  const overlay = document.createElement("div");
  overlay.className = "card-overlay";
  document.body.appendChild(overlay);

  function closeAll(){
    document.querySelectorAll(".card.is-open").forEach(c => c.classList.remove("is-open"));
    document.documentElement.classList.remove("has-open");
    overlay.classList.remove("on");
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");

    if (card){
      e.preventDefault();

      const wasOpen = card.classList.contains("is-open");
      closeAll();

      if (!wasOpen){
        card.classList.add("is-open");
        document.documentElement.classList.add("has-open");
        overlay.classList.add("on");
      }
      return;
    }

    if (e.target === overlay) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();

/* ===================== INTRO SCREEN (foto antes) ===================== */
(function initIntro(){
  const intro = document.getElementById("intro");
  const btn = document.getElementById("enterBtn");
  if (!intro || !btn) return;

  function leaveIntro(){
    intro.classList.add("is-leaving");

    setTimeout(() => {
      intro.classList.add("is-gone");

      const hero = document.getElementById("scatterText");
      if (hero){
        hero.classList.remove("is-in");
        const plain = hero.dataset.plain || hero.textContent;
        hero.dataset.plain = plain;
        hero.textContent = plain;
        scatterText(hero);
      }
    }, 750);
  }

  btn.addEventListener("click", leaveIntro);

  intro.addEventListener("click", (e) => {
    if (e.target === intro || e.target.classList.contains("intro-overlay")) leaveIntro();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !intro.classList.contains("is-leaving")) leaveIntro();
  });
})();

/* ===================== DEPTH REVEAL (letras vindo de trás) ===================== */
function buildDepthText(el, {
  spread = 14,
  depthMin = -220,
  depthMax = -90,
  rotate = 10,
  stagger = 22
} = {}) {
  const text = el.dataset.plainText || el.textContent.trim();
  el.dataset.plainText = text;
  el.textContent = "";

  [...text].forEach((char, i) => {
    const s = document.createElement("span");
    s.className = "ch3d";
    s.textContent = (char === " ") ? "\u00A0" : char;

    const dx = (Math.random() * 2 - 1) * spread;
    const dy = (Math.random() * 2 - 1) * spread;
    const dz = depthMin + Math.random() * (depthMax - depthMin);
    const dr = (Math.random() * 2 - 1) * rotate;

    s.style.setProperty("--dx", dx + "px");
    s.style.setProperty("--dy", dy + "px");
    s.style.setProperty("--dz", dz + "px");
    s.style.setProperty("--dr", dr + "deg");
    s.style.setProperty("--delay", (i * stagger) + "ms");

    el.appendChild(s);
  });

  const totalMs = ([...text].length * stagger) + 950;
  clearTimeout(el._cleanupTimer);

  el._cleanupTimer = setTimeout(() => {
    el.classList.remove("is-in");
    el.textContent = text;
  }, totalMs);
}

(function initDepthReveal(){
  const els = [...document.querySelectorAll(".depth-reveal")];
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting){
        buildDepthText(el);
        requestAnimationFrame(() => el.classList.add("is-in"));
      } else {
        if (el.dataset.plainText){
          el.classList.remove("is-in");
          el.textContent = el.dataset.plainText;
        }
      }
    });
  }, { threshold: 0.35 });

  els.forEach(el => obs.observe(el));
})();



document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const cards = [...document.querySelectorAll(".card")];
  const orb = stage?.querySelector(".orb");
  const finalPhrase = document.getElementById("finalPhrase");

  if (!stage || cards.length === 0 || !orb || !finalPhrase) return;

  // ========= CONFIG =========
  const COLS = 4;
  const ROWS = 2;
  const GRID_DELAY  = 1200;
  const ORB_START   = 2200;
  const HIDE_DELAY  = 6200;
  const FINAL_DELAY = 7200;
  const HOP_GAP     = 520;

  // ========= 1) START “EMBARALHADO” =========
  function randomStartLayout(){
    cards.forEach((card) => {
      const w = 18 + Math.random() * 22;
      const h = 18 + Math.random() * 28;
      const x = Math.random() * (100 - w);
      const y = Math.random() * (100 - h);

      card.style.left = x + "%";
      card.style.top = y + "%";
      card.style.width = w + "%";
      card.style.height = h + "%";
      card.style.zIndex = String(10 + Math.floor(Math.random() * 10));
      card.style.transform =
        `translate3d(0,0,0) rotate(${(-6 + Math.random()*12).toFixed(2)}deg)`;

      card.classList.add("is-visible");
      card.style.opacity = "1";
    });
  }
  randomStartLayout();

  // ========= helpers px =========
  function capturePositionsPx(){
    const stageRect = stage.getBoundingClientRect();
    return cards.map(card => {
      const r = card.getBoundingClientRect();
      return { left: r.left - stageRect.left, top: r.top - stageRect.top, w: r.width, h: r.height };
    });
  }

  function applyPxPositions(pos){
    cards.forEach((card, i) => {
      card.style.left   = pos[i].left + "px";
      card.style.top    = pos[i].top  + "px";
      card.style.width  = pos[i].w    + "px";
      card.style.height = pos[i].h    + "px";
      card.style.zIndex = "50";
      card.style.transform = "translate3d(0,0,0)";
    });
  }

  // ========= 2) GRID 4x2 =========
  function gridPositions(){
    const stageRect = stage.getBoundingClientRect();
    const gap = 18;

    const maxW = stageRect.width  - gap * (COLS + 1);
    const maxH = stageRect.height - gap * (ROWS + 1);

    const size = Math.min(220, Math.floor(maxW / COLS), Math.floor(maxH / ROWS));

    const gridW = (size * COLS) + gap * (COLS - 1);
    const gridH = (size * ROWS) + gap * (ROWS - 1);

    const startX = (stageRect.width  - gridW) / 2;
    const startY = (stageRect.height - gridH) / 2;

    return cards.map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return {
        left: startX + col * (size + gap),
        top:  startY + row * (size + gap),
        w: size,
        h: size
      };
    });
  }

  // ========= 3) ORDEM ZIG-ZAG =========
  function zigzagOrder(){
    return [0,1,2,3,7,6,5,4].filter(i => i < cards.length);
  }

  // ========= 4) LIMITAR A ORB DENTRO DO CARD =========
  function orbPosInsideCard(card){
    const stageRect = stage.getBoundingClientRect();
    const r = card.getBoundingClientRect();

    const ow = orb.offsetWidth  || 28;
    const oh = orb.offsetHeight || 28;

    const pad = 10;

    const leftMin = (r.left - stageRect.left) + pad + ow/2;
    const leftMax = (r.right - stageRect.left) - pad - ow/2;

    const topMin  = (r.top - stageRect.top) + pad + oh/2;
    const topMax  = (r.bottom - stageRect.top) - pad - oh/2;

    const cx = (r.left - stageRect.left) + r.width/2;
    const cy = (r.top  - stageRect.top)  + r.height/2;

    return {
      x: Math.max(leftMin, Math.min(leftMax, cx)),
      y: Math.max(topMin,  Math.min(topMax,  cy))
    };
  }

  function moveOrbToCard(card){
    const { x, y } = orbPosInsideCard(card);

    orb.style.left = x + "px";
    orb.style.top  = y + "px";
    orb.style.opacity = "1";

    card.classList.remove("is-pulse","is-hit");
void card.offsetWidth; // reflow
card.classList.add("is-pulse","is-hit");


    // rastro
const t = document.createElement("div");
t.className = "orb-trail";
t.style.left = orb.style.left;
t.style.top  = orb.style.top;
stage.appendChild(t);
setTimeout(() => t.remove(), 1000);

// pulse no card
card.classList.remove("is-pulse");
void card.offsetWidth;
card.classList.add("is-pulse");


    orb.classList.remove("is-hop");
    void orb.offsetWidth; // reinicia animação
    orb.classList.add("is-hop");
  }

  function runOrb(){
    const order = zigzagOrder();
    if (!order.length) return;

    moveOrbToCard(cards[order[0]]);

    let step = 1;
    const loop = setInterval(() => {
      if (stage.classList.contains("is-hide")) {
        clearInterval(loop);
        orb.style.opacity = "0";
        return;
      }
      moveOrbToCard(cards[order[step % order.length]]);
      step++;
    }, HOP_GAP);
  }

  // ========= 5) SEQUÊNCIA =========
  let started = false;

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || started) return;
    started = true;

    const initial = capturePositionsPx();
    applyPxPositions(initial);

    stage.classList.add("is-seq"); // seu flip geral

    setTimeout(() => {
      stage.classList.add("is-grid");
      applyPxPositions(gridPositions());
    }, GRID_DELAY);

    setTimeout(() => {
      runOrb();
    }, ORB_START);

    setTimeout(() => {
      stage.classList.add("is-hide");
      orb.style.opacity = "0";
    }, HIDE_DELAY);

    setTimeout(() => {
      stage.classList.add("is-final");
    }, FINAL_DELAY);

    io.disconnect();
  }, { threshold: 0.55 });

  io.observe(stage);

  window.addEventListener("resize", () => {
    if (!started) return;
    if (!stage.classList.contains("is-grid")) return;
    applyPxPositions(gridPositions());
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const spreads = [...document.querySelectorAll(".spread")];
  if (!spreads.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,                 // menor = mais fácil ativar no mobile
    rootMargin: "0px 0px -15% 0px"   // ativa um pouco antes de chegar no centro
  });

  spreads.forEach(spread => io.observe(spread));
});


document.addEventListener("DOMContentLoaded", () => {
  // Mais confiável que (hover:none) — funciona em emulador também
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const blocks = document.querySelectorAll(".story-block");
  if (!blocks.length) return;

  // no touch: tap abre/fecha
  if (isCoarsePointer) {
    blocks.forEach(b => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();

        const willOpen = !b.classList.contains("is-open");
        blocks.forEach(x => x.classList.remove("is-open"));
        if (willOpen) b.classList.add("is-open");
      });
    });

    document.addEventListener("click", () => {
      blocks.forEach(x => x.classList.remove("is-open"));
    });
  }
});





/* =========================
   FINAL DO PORTFÓLIO (fim real do scroll)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("endOverlay");
  if (!overlay) return;

  let played = false;

  function lockScroll(lock){
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function atPageEnd(){
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const viewport = window.innerHeight || doc.clientHeight;
    const height = Math.max(doc.scrollHeight, document.body.scrollHeight);

    // margem pequena (2px) por causa de arredondamento
    return (scrollTop + viewport) >= (height - 2);
  }

  function runEnd(){
  if (played) return;
  played = true;

  const phraseEl = document.getElementById("endPhrase");
  const base = phraseEl?.querySelector(".base");

  overlay.classList.add("is-show");
  overlay.setAttribute("aria-hidden", "false");
  lockScroll(true);

  // cria camadas pra parecer “desfazendo”
  if (phraseEl && base){
    // limpa camadas antigas (segurança)
    phraseEl.querySelectorAll(".layer").forEach(n => n.remove());

    const LAYERS = 10; // 8~12 fica ótimo
    for (let i = 0; i < LAYERS; i++){
      const s = document.createElement("span");
      s.className = "layer";
      s.textContent = base.textContent;

      // espalha para direções diferentes
      const x = (Math.random() * 2 - 1) * (18 + i * 3);
      const y = (-18 - Math.random() * 26) - i * 2;

      s.style.setProperty("--x", `${x.toFixed(1)}px`);
      s.style.setProperty("--y", `${y.toFixed(1)}px`);
      s.style.setProperty("--d", `${i * 45}ms`);

      phraseEl.appendChild(s);
    }
  }

  // fica na tela 5s
  setTimeout(() => {
    overlay.classList.add("is-dissolve");

    // dissolve rápido + fade do overlay
    setTimeout(() => {
      overlay.classList.add("is-hide");

      setTimeout(() => {
        overlay.classList.remove("is-show","is-dissolve","is-hide");
        overlay.setAttribute("aria-hidden", "true");
        lockScroll(false);
      }, 950);

    }, 750);

  }, 5000);
}


  // checa no scroll (passive) + um fallback no resize
  function onCheck(){
    if (!played && atPageEnd()) runEnd();
  }

  window.addEventListener("scroll", onCheck, { passive: true });
  window.addEventListener("resize", onCheck, { passive: true });

  // caso a página já abra no fim (raríssimo)
  onCheck();
});









(() => {
  const endfx = document.getElementById("endfx");
  if (!endfx) return;

  let locked = false;

  function atBottom() {
    const near = 2; // precisa encostar no fim MESMO
    return (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - near);
  }

  function runEndFx() {
    if (locked) return;
    locked = true;

    endfx.classList.add("is-on");

    // glitch rápido
    setTimeout(() => endfx.classList.add("is-glitch"), 560);
    setTimeout(() => endfx.classList.remove("is-glitch"), 1050);

    // fica ~5s e sai
    setTimeout(() => endfx.classList.add("is-out"), 5200);

    // remove (pra não travar a página)
    setTimeout(() => {
      endfx.classList.remove("is-on", "is-out", "is-glitch");
    }, 6000);
  }

  window.addEventListener("scroll", () => {
    if (atBottom()) runEndFx();
  }, { passive: true });
})();



