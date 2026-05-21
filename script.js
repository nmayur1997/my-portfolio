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
