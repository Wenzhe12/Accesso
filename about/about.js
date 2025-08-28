const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const productToggle = document.getElementById('product-toggle');
const expandable = productToggle.parentElement;
const mobileToggle = document.getElementById('theme-toggle'); // switch in mobile menu
const desktopToggle = document.getElementById('theme-toggle-desktop'); // icon in header

//consistent theme
if (sessionStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
}

if (sessionStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (mobileToggle) mobileToggle.checked = true;
}

// toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    sessionStorage.setItem('theme', isDark ? 'dark' : 'light');

    // sync mobile switch with desktop icon
    if (mobileToggle) mobileToggle.checked = isDark;
}

// mobile switch listener
if (mobileToggle) {
    mobileToggle.addEventListener('change', toggleTheme);
}

// desktop theme toggle listener
if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleTheme);
}

//hamburger list
hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', menu.classList.contains('active'));
});

// close menu when click outside
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});