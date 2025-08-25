const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const productToggle = document.getElementById('product-toggle');
const expandable = productToggle.parentElement;
const themeToggle = document.getElementById('theme-toggle');

// consistent theme
if (sessionStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', menu.classList.contains('active'));
});

productToggle.addEventListener('click', (e) => {
    e.preventDefault();
    expandable.classList.toggle('active');
    productToggle.setAttribute('aria-expanded', expandable.classList.contains('active'));
});

// close menu when click outside
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});
