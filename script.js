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

        navbar.style.background = "rgba(5,8,22,0.92)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
    }
    else{

        navbar.style.background = "rgba(5,8,22,0.75)";
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
