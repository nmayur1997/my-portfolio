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

/* PREMIUM NAVBAR */

window.addEventListener("scroll",()=>{

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.background = "rgba(5,8,22,0.92)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
    }
    else{

        navbar.style.background = "rgba(5,8,22,0.75)";
        navbar.style.boxShadow = "none";
    }

});

/* PREMIUM TYPING EFFECT */

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

/* CARD 3D EFFECT */

document.querySelectorAll(
    ".project-card,.cert-card,.skill-item"
).forEach((card)=>{

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / 20);
        const rotateY = ((centerX - x) / 20);

        card.style.transform =
        `perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-10px)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";
    });

});

/* MOUSE GLOW EFFECT */

const glow = document.createElement("div");

glow.style.position = "fixed";
glow.style.width = "300px";
glow.style.height = "300px";
glow.style.borderRadius = "50%";
glow.style.pointerEvents = "none";
glow.style.background =
"radial-gradient(circle, rgba(0,212,255,0.15), transparent 70%)";

glow.style.zIndex = "0";
glow.style.transform = "translate(-50%, -50%)";

document.body.appendChild(glow);

document.addEventListener("mousemove",(e)=>{

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";

});

/* FLOATING HERO EFFECT */

const hero = document.querySelector(".hero-content");

window.addEventListener("mousemove",(e)=>{

    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;

    hero.style.transform =
    `translateX(${x}px) translateY(${y}px)`;

});
