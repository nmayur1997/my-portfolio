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
    document.getElementById("nifty-price").innerHTML =
      q.price.toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " " + fmtChange(chg, pct);
  } catch(e) {
    document.getElementById("nifty-price").textContent = "N/A";
  }

  /* GOLD — show raw USD/oz (COMEX) */
  try {
    const q = await fetchQuote("GC=F");
    const chg = q.price - q.prev;
    const pct = (chg / q.prev) * 100;
    document.getElementById("gold-price").innerHTML =
      "$" + q.price.toLocaleString("en-US", { maximumFractionDigits: 1 }) + " " + fmtChange(chg, pct);
  } catch(e) {
    document.getElementById("gold-price").textContent = "N/A";
  }

  /* SILVER — show raw USD/oz (COMEX) */
  try {
    const q = await fetchQuote("SI=F");
    const chg = q.price - q.prev;
    const pct = (chg / q.prev) * 100;
    document.getElementById("silver-price").innerHTML =
      "$" + q.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + fmtChange(chg, pct);
  } catch(e) {
    document.getElementById("silver-price").textContent = "N/A";
  }
}

loadMarkets();
setInterval(loadMarkets, 60000);

/* ── CARD MOUSE-TRACKING GLOW (Idea 2) ── */
document.querySelectorAll('.glass-card, .project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

/* ── TRADING GRID & CHART LINE CANVAS (Idea 3) ── */
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
