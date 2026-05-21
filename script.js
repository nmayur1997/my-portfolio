/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("show"); });
}, { threshold: 0.12 });
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

/* ── NAVBAR SCROLL EFFECT ── */
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 50);
});

/* ── TYPING EFFECT ── */
const words = [
  "Trading Operations Specialist",
  "Risk Management Professional",
  "NSE · BSE · MCX Certified",
  "NISM Certified Expert"
];
let wi = 0, ci = 0, deleting = false;
const el = document.getElementById("typing-target");

function type() {
  if (!el) return;
  const word = words[wi];
  el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  let speed = deleting ? 40 : 85;
  if (!deleting && ci === word.length + 1) { speed = 1800; deleting = true; }
  else if (deleting && ci === -1) { deleting = false; wi = (wi + 1) % words.length; ci = 0; speed = 300; }
  setTimeout(type, speed);
}
type();

/* ── LIVE MARKET DATA (US COMEX / Yahoo Finance) ── */
const PROXY = "https://corsproxy.io/?";

function fmtChange(change, pct) {
  const cls = change >= 0 ? "up" : "dn";
  const sign = change >= 0 ? "+" : "";
  return `<span class="${cls}">${sign}${pct.toFixed(2)}%</span>`;
}

async function fetchQuote(symbol) {
  const url = `${PROXY}${encodeURIComponent("https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d&range=1d")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const json = await res.json();
  const meta = json.chart.result[0].meta;
  return { price: meta.regularMarketPrice, prev: meta.chartPreviousClose };
}

async function loadMarkets() {
  /* NIFTY */
  try {
    const q = await fetchQuote("^NSEI");
    const chg = q.price - q.prev;
    const pct = (chg / q.prev) * 100;
    const niftyEl = document.getElementById("nifty-price");
    if (niftyEl) {
      niftyEl.innerHTML =
        q.price.toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " " + fmtChange(chg, pct);
    }
  } catch(e) {
    const niftyEl = document.getElementById("nifty-price");
    if (niftyEl) niftyEl.textContent = "N/A";
  }

  /* GOLD — show raw USD/oz (COMEX) */
  try {
    const q = await fetchQuote("GC=F");
    const chg = q.price - q.prev;
    const pct = (chg / q.prev) * 100;
    const goldEl = document.getElementById("gold-price");
    if (goldEl) {
      goldEl.innerHTML =
        "$" + q.price.toLocaleString("en-US", { maximumFractionDigits: 1 }) + " " + fmtChange(chg, pct);
    }
  } catch(e) {
    const goldEl = document.getElementById("gold-price");
    if (goldEl) goldEl.textContent = "N/A";
  }

  /* SILVER — show raw USD/oz (COMEX) */
  try {
    const q = await fetchQuote("SI=F");
    const chg = q.price - q.prev;
    const pct = (chg / q.prev) * 100;
    const silverEl = document.getElementById("silver-price");
    if (silverEl) {
      silverEl.innerHTML =
        "$" + q.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + fmtChange(chg, pct);
    }
  } catch(e) {
    const silverEl = document.getElementById("silver-price");
    if (silverEl) silverEl.textContent = "N/A";
  }
}

loadMarkets();
setInterval(loadMarkets, 60000);

/* ── CARD MOUSE-TRACKING GLOW ── */
document.querySelectorAll('.glass-card, .project-card, .cert-card-container').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

/* ── 3D PARALLAX TILT EFFECT ON CARDS (Idea 1) ── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.glass-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const normX = (x / width) - 0.5;
      const normY = (y / height) - 0.5;
      
      const maxRotate = 12; // Sleek and controlled angle
      const rotateX = -normY * maxRotate;
      const rotateY = normX * maxRotate;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.boxShadow = `0 15px 35px rgba(0, 212, 255, 0.12)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.boxShadow = ``;
    });
  });
}

/* ── DYNAMIC LIQUID FLUID GLOWS WITH SPRING PHYSICS (Idea 3) ── */
const glow1 = document.getElementById("glow-1");
const glow2 = document.getElementById("glow-2");

let targetMouse = { x: window.innerWidth / 4, y: window.innerHeight / 4 };
let currentGlow1 = { x: -150, y: -150, vx: 0, vy: 0 };
let currentGlow2 = { x: window.innerWidth + 150, y: window.innerHeight + 150, vx: 0, vy: 0 };

const spring = 0.02;   // Spring force
const damping = 0.88;   // Damping ratio

window.addEventListener("mousemove", (e) => {
  targetMouse.x = e.clientX;
  targetMouse.y = e.clientY;
});

function animateGlows() {
  // Glow 1 tracks mouse coordinates
  let ax1 = (targetMouse.x - currentGlow1.x) * spring;
  let ay1 = (targetMouse.y - currentGlow1.y) * spring;
  currentGlow1.vx = (currentGlow1.vx + ax1) * damping;
  currentGlow1.vy = (currentGlow1.vy + ay1) * damping;
  currentGlow1.x += currentGlow1.vx;
  currentGlow1.y += currentGlow1.vy;

  // Glow 2 tracks diagonally opposite mouse coordinate
  let targetX2 = window.innerWidth - targetMouse.x;
  let targetY2 = window.innerHeight - targetMouse.y;
  let ax2 = (targetX2 - currentGlow2.x) * spring;
  let ay2 = (targetY2 - currentGlow2.y) * spring;
  currentGlow2.vx = (currentGlow2.vx + ax2) * damping;
  currentGlow2.vy = (currentGlow2.vy + ay2) * damping;
  currentGlow2.x += currentGlow2.vx;
  currentGlow2.y += currentGlow2.vy;

  if (glow1) {
    // 300px offset is half of 600px width/height of the glow
    glow1.style.transform = `translate3d(${currentGlow1.x - 300}px, ${currentGlow1.y - 300}px, 0)`;
  }
  if (glow2) {
    glow2.style.transform = `translate3d(${currentGlow2.x - 300}px, ${currentGlow2.y - 300}px, 0)`;
  }

  requestAnimationFrame(animateGlows);
}
animateGlows();

/* ── SEQUENTIAL TEXT SPLIT-REVEAL FOR SECTION TITLES (Idea 4) ── */
document.querySelectorAll(".section-title").forEach(title => {
  const text = title.textContent.trim();
  title.textContent = "";
  
  const words = text.split(" ");
  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";
    
    Array.from(word).forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.className = "reveal-char";
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });
    
    title.appendChild(wordSpan);
    
    if (wordIdx < words.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.innerHTML = "&nbsp;";
      spaceSpan.style.display = "inline-block";
      title.appendChild(spaceSpan);
    }
  });
  
  // Set incremental delay on characters
  title.querySelectorAll(".reveal-char").forEach((charSpan, index) => {
    charSpan.style.transitionDelay = `${index * 0.035}s`;
  });
});

/* ── NISM CERTIFICATIONS VIEW CONTROLS & FLIP (Idea 5) ── */
const viewGridBtn = document.getElementById("view-grid");
const viewCarouselBtn = document.getElementById("view-carousel");
const carouselNav = document.getElementById("carousel-nav");
const certGrid = document.getElementById("cert-grid");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

if (viewGridBtn && viewCarouselBtn && certGrid && carouselNav) {
  viewGridBtn.addEventListener("click", () => {
    viewGridBtn.classList.add("active");
    viewCarouselBtn.classList.remove("active");
    certGrid.classList.remove("carousel-mode");
    carouselNav.style.display = "none";
  });

  viewCarouselBtn.addEventListener("click", () => {
    viewCarouselBtn.classList.add("active");
    viewGridBtn.classList.remove("active");
    certGrid.classList.add("carousel-mode");
    carouselNav.style.display = "flex";
  });
}

if (certGrid && prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    certGrid.scrollBy({ left: -340, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    certGrid.scrollBy({ left: 340, behavior: "smooth" });
  });
}

// 3D Flip toggle for mobile/touch screen support
document.querySelectorAll(".cert-card-container").forEach(cardContainer => {
  cardContainer.addEventListener("click", () => {
    cardContainer.classList.toggle("active");
    // Close other flipped cards
    document.querySelectorAll(".cert-card-container").forEach(otherCard => {
      if (otherCard !== cardContainer) {
        otherCard.classList.remove("active");
      }
    });
  });
});

/* ── TRADING GRID & CHART LINE CANVAS (Idea 3 - Grid Canvas) ── */
const canvas = document.getElementById("trading-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Nodes setup
  const isMobile = window.innerWidth < 768;
  const nodeCount = isMobile ? 25 : 60;
  const nodes = [];

  const colors = ["rgba(0, 212, 255,", "rgba(124, 58, 237,"]; // Cyan & Purple base

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
    ctx.lineWidth = 1;
    const gridSize = 80;

    // Draw vertical lines
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawGrid();

    // Draw and update nodes
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Boundaries bounce
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Mouse interactive force
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + " 0.25)";
      ctx.fill();

      // Connections
      for (let j = i + 1; j < nodes.length; j++) {
        const p2 = nodes[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (120 - dist) / 120 * 0.06; // faint connections
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (mouse.radius - dist) / mouse.radius * 0.08;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
