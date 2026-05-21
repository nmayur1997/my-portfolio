window.addEventListener("scroll", () => {

    document.querySelectorAll(".fade-in").forEach((el) => {

        const top = el.getBoundingClientRect().top;

        if(top < window.innerHeight - 100){
            el.classList.add("show");
        }

    });

});

/* NAVBAR EFFECT */

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){
        navbar.style.background = "rgba(5,8,22,0.92)";
    }
    else{
        navbar.style.background = "rgba(5,8,22,0.75)";
    }

});

/* TYPING EFFECT */

const text = [
    "Trading Operations Specialist",
    "Risk Management Expert",
    "HFT Systems Professional",
    "MCX • NSE • BSE"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type(){

    if(count === text.length){
        count = 0;
    }

    currentText = text[count];

    letter = currentText.slice(0, ++index);

    document.querySelector(".hero-subtitle").textContent = letter;

    if(letter.length === currentText.length){

        setTimeout(() => {

            index = 0;
            count++;

            setTimeout(type, 300);

        }, 1800);

    }
    else{
        setTimeout(type, 70);
    }

})();
