
// Theme Toggle with sessionStorage
const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Bubble rotation
const bubbles = document.querySelectorAll('.bubble');
let bubbleIndex = 0;
setInterval(() => {
    bubbles.forEach(b => b.style.opacity = 0);
    bubbles[bubbleIndex].style.opacity = 1;
    bubbleIndex = (bubbleIndex + 1) % bubbles.length;
}, 3000);

// Promo rotation
const promoImages = [
    { src: "img/promo1.png", alt: "Free gift box packaging for every set of purchase." },
    { src: "img/promo2.png", alt: "Free shipping for orders over RM250!" },
    { src: "img/promo3.png", alt: "Free 1 screen protector for purchase of 2 cases." }
];

let promoIndex = 0;
setInterval(() => {
    promoIndex = (promoIndex + 1) % promoImages.length;
    const promoImg = document.querySelector(".promo-img");
    promoImg.src = promoImages[promoIndex].src;
    promoImg.alt = promoImages[promoIndex].alt;
}, 5000);

// New arrivals rotation
const newArrivals = [
    { img: "img/new1.png", link: "Product-details.html?id=PartyCat", desc: "Phone Case – Party Cat" },
    { img: "img/new2.png", link: "Non-CasingDetails.html?id=Skateboarding", desc: "Airpods Case – Skateboarding" },
    { img: "img/new3.png", link: "Non-CasingDetails.html?id=HeartOfSteel", desc: "Phone Charm – Heart of Steel" },
    { img: "img/new4.jpeg", link: "Non-CasingDetails.html?id=Finewoven", desc: "Accessories – Finewoven Wallet" }
];

let arrivalIndex = 0;
setInterval(() => {
    arrivalIndex = (arrivalIndex + 1) % newArrivals.length;
    const img = document.querySelector(".new-arrival-img");
    const anchor = document.getElementById("new-arrival-link");
    const desc = document.getElementById("new-arrival-desc");

    img.src = newArrivals[arrivalIndex].img;
    anchor.href = newArrivals[arrivalIndex].link;
    desc.textContent = newArrivals[arrivalIndex].desc;
}, 5000);

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Mobile submenu toggle
const mobileExpandable = mobileMenu.querySelector('.expandable a');
const mobileExpandableParent = mobileMenu.querySelector('.expandable');
mobileExpandable.addEventListener('click', (e) => {
    e.preventDefault();
    mobileExpandableParent.classList.toggle('active');
});
