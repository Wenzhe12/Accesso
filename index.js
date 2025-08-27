// Cookie functions
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCookie('loggedInUser') !== null || localStorage.getItem('loggedInUser') !== null;
}

// Modal functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Theme Toggle with sessionStorage
const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Cart and Profile link handlers
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.getElementById('cart-link');
    const profileLink = document.getElementById('profile-link');
    const modal = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalLogin = document.getElementById('modalLogin');

    // Cart link click handler
    cartLink.addEventListener('click', function(e) {
        if (!isLoggedIn()) {
            e.preventDefault(); // Prevent navigation
            showLoginModal();
        }
        // If logged in, allow normal navigation to cart/cart.html
    });

    // Profile link click handler
    profileLink.addEventListener('click', function(e) {
        if (!isLoggedIn()) {
            e.preventDefault(); // Prevent navigation
            showLoginModal();
        }
        // If logged in, allow normal navigation to profile/userprofile.html
    });

    // Modal close handlers
    modalClose.addEventListener('click', hideLoginModal);
    modalCancel.addEventListener('click', hideLoginModal);

    // Login button handler
    modalLogin.addEventListener('click', function() {
        // Redirect to login page
        window.location.href = 'login/login.html';
    });

    // Close modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideLoginModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideLoginModal();
        }
    });
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
    { img: "img/new1.png", link: "product-detail/product-details.html?id=PartyCat", desc: "Phone Case – Party Cat" },
    { img: "img/new2.png", link: "product-detail/product-details.html?id=Skateboarding", desc: "Airpods Case – Skateboarding" },
    { img: "img/new3.png", link: "product-detail/product-details.html?id=HeartCharm", desc: "Phone Charm – Heart of Steel" },
    { img: "img/new4.jpeg", link: "product-detail/product-details.html?id=Finewoven", desc: "Accessories – Finewoven Wallet" }
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
if (mobileExpandable && mobileExpandableParent) {
    mobileExpandable.addEventListener('click', (e) => {
        e.preventDefault();
        mobileExpandableParent.classList.toggle('active');
    });
}