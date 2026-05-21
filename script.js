/* SCROLL REVEAL */

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

},{
    threshold:0.15
});

document.querySelectorAll(".fade-in").forEach((el)=>{
    observer.observe(el);
});

/* NAVBAR EFFECT */

window.addEventListener("scroll",()=>{

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.background = "rgba(2,6,23,0.92)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
    }
    else{

        navbar.style.background = "rgba(2,6,23,0.75)";
        navbar.style.boxShadow = "none";
    }

});

/* TYPING EFFECT */

const words = [
    "Trading Operations Specialist",
    "Risk Management Expert",
    "HFT Systems Professional",
    "NSE • BSE • MCX"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.querySelector(".hero-subtitle");

function typeEffect(){

    const currentWord = words[wordIndex];

    if(isDeleting){

        typingElement.textContent =
        currentWord.substring(0,charIndex--);

    }
    else{

        typingElement.textContent =
        currentWord.substring(0,charIndex++);

    }

    let speed = isDeleting ? 40 : 90;

    if(!isDeleting && charIndex === currentWord.length){

        speed = 1500;
        isDeleting = true;
    }

    else if(isDeleting && charIndex === 0){

        isDeleting = false;
        wordIndex++;

        if(wordIndex >= words.length){
            wordIndex = 0;
        }
    }

    setTimeout(typeEffect,speed);
}

typeEffect();

/* LIVE MARKET DATA via Yahoo Finance */

const CORS_PROXY = "https://corsproxy.io/?";

const symbols = {
    nifty:  "^NSEI",
    gold:   "GC=F",
    silver: "SI=F"
};

function formatPrice(price, isINR = false){
    const prefix = isINR ? "₹" : "$";
    return prefix + price.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function formatChange(change, changePct){
    const color  = change >= 0 ? "#00ff95" : "#ff4d6d";
    const arrow  = change >= 0 ? "+" : "";
    return `<span style="color:${color}">${arrow}${changePct.toFixed(2)}%</span>`;
}

async function fetchQuote(symbol){
    const url = `${CORS_PROXY}https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res  = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json.chart.result[0].meta;
    return {
        price:     meta.regularMarketPrice,
        prevClose: meta.chartPreviousClose,
        currency:  meta.currency
    };
}

async function loadMarketData(){

    /* --- NIFTY --- */
    try {
        const q = await fetchQuote(symbols.nifty);
        const change    = q.price - q.prevClose;
        const changePct = (change / q.prevClose) * 100;
        document.getElementById("nifty-price").innerHTML =
            q.price.toLocaleString("en-IN", { maximumFractionDigits: 2 }) +
            " " + formatChange(change, changePct);
    } catch(e){
        document.getElementById("nifty-price").textContent = "N/A";
        console.error("Nifty fetch error:", e);
    }

    /* --- GOLD (USD → INR approx) --- */
    try {
        const q = await fetchQuote(symbols.gold);
        /* Gold futures are in USD/troy oz; convert to ₹/10g for MCX context
           1 troy oz = 31.1035 g  → 1 oz price / 3.11035 = price per 10g in USD
           Multiply by ~83.5 (approx USD/INR) for indicative INR value          */
        const USD_INR   = 83.5;
        const priceINR  = (q.price / 3.11035) * USD_INR;
        const prevINR   = (q.prevClose / 3.11035) * USD_INR;
        const change    = priceINR - prevINR;
        const changePct = (change / prevINR) * 100;
        document.getElementById("gold-price").innerHTML =
            "₹" + Math.round(priceINR).toLocaleString("en-IN") +
            " " + formatChange(change, changePct);
    } catch(e){
        document.getElementById("gold-price").textContent = "N/A";
        console.error("Gold fetch error:", e);
    }

    /* --- SILVER (USD → INR approx) --- */
    try {
        const q = await fetchQuote(symbols.silver);
        /* Silver futures: USD/troy oz → ₹/kg
           1 troy oz = 0.0311035 kg → price / 0.0311035 = USD per kg
           Multiply by ~83.5 for INR per kg                                       */
        const USD_INR   = 83.5;
        const priceINR  = (q.price / 0.0311035) * USD_INR;
        const prevINR   = (q.prevClose / 0.0311035) * USD_INR;
        const change    = priceINR - prevINR;
        const changePct = (change / prevINR) * 100;
        document.getElementById("silver-price").innerHTML =
            "₹" + Math.round(priceINR).toLocaleString("en-IN") +
            " " + formatChange(change, changePct);
    } catch(e){
        document.getElementById("silver-price").textContent = "N/A";
        console.error("Silver fetch error:", e);
    }
}

/* Load on page start, then refresh every 60 seconds */
loadMarketData();
setInterval(loadMarketData, 60000);
