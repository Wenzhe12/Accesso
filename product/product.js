
let allProducts = [];
let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    allProducts = Array.from(document.querySelectorAll('.product-card'));
    updateProductCount();

    // Login Modal functionality
    initializeLoginModal();
});

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
    return getCookie('loggedInUser') !== null;
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

function initializeLoginModal() {
    const cartLink = document.getElementById('cart-link');
    const profileLink = document.getElementById('profile-link');
    const modal = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalLogin = document.getElementById('modalLogin');

    // Cart link click handler
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            if (!isLoggedIn()) {
                e.preventDefault(); // Prevent navigation
                showLoginModal();
            }
            // If logged in, allow normal navigation to cart/cart.html
        });
    }

    // Profile link click handler
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            if (!isLoggedIn()) {
                e.preventDefault(); // Prevent navigation
                showLoginModal();
            }
            // If logged in, allow normal navigation to profile/userprofile.html
        });
    }

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', hideLoginModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', hideLoginModal);
    }

    // Login button handler
    if (modalLogin) {
        modalLogin.addEventListener('click', function() {
            // Redirect to login page
            window.location.href = '../login/login.html';
        });
    }

    // Close modal when clicking outside of it
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideLoginModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            hideLoginModal();
        }
    });
}

// Function to navigate to product details page
function goToProductDetails(productId) {
    window.location.href = `../product-detail/product-details.html?id=${productId}`;
}

// Filter products by category
function filterProducts(category) {
    currentFilter = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter products
    allProducts.forEach(product => {
        if (category === 'all') {
            product.classList.remove('hidden');
        } else {
            const categories = product.getAttribute('data-category').split(' ');
            if (categories.includes(category)) {
                product.classList.remove('hidden');
            } else {
                product.classList.add('hidden');
            }
        }
    });

    // Clear search
    document.getElementById('searchInput').value = '';
    updateProductCount();
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let visibleCount = 0;

    if (searchTerm === '') {
        // If search is empty, show products based on current filter
        filterProductsByCategory();
        return;
    }

    allProducts.forEach(product => {
        const productName = product.getAttribute('data-name');
        const productPrice = product.getAttribute('data-price');
        const categories = product.getAttribute('data-category');

        // Check if search term matches name, price, or category
        if (productName.includes(searchTerm) ||
            productPrice.includes(searchTerm) ||
            categories.includes(searchTerm)) {
            product.classList.remove('hidden');
            visibleCount++;
        } else {
            product.classList.add('hidden');
        }
    });

    updateSearchResults(searchTerm, visibleCount);
}

// Filter products by current category (helper function)
function filterProductsByCategory() {
    allProducts.forEach(product => {
        if (currentFilter === 'all') {
            product.classList.remove('hidden');
        } else {
            const categories = product.getAttribute('data-category').split(' ');
            if (categories.includes(currentFilter)) {
                product.classList.remove('hidden');
            } else {
                product.classList.add('hidden');
            }
        }
    });
    updateProductCount();
}

// Update search results display
function updateSearchResults(searchTerm, count) {
    const resultsDiv = document.getElementById('searchResults');
    if (searchTerm) {
        resultsDiv.innerHTML = `Found ${count} product(s) matching "${searchTerm}"`;
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.style.display = 'none';
    }
}

// Update product count display
function updateProductCount() {
    const visibleProducts = allProducts.filter(product => !product.classList.contains('hidden'));
    const resultsDiv = document.getElementById('searchResults');

    if (currentFilter === 'all') {
        resultsDiv.innerHTML = `Showing all ${visibleProducts.length} products`;
    } else {
        const categoryName = getCategoryDisplayName(currentFilter);
        resultsDiv.innerHTML = `Showing ${visibleProducts.length} ${categoryName}`;
    }
    resultsDiv.style.display = 'block';

    // Hide after 3 seconds if not searching
    if (!document.getElementById('searchInput').value) {
        setTimeout(() => {
            resultsDiv.style.display = 'none';
        }, 3000);
    }
}

// Get display name for category
function getCategoryDisplayName(category) {
    switch (category) {
        case 'hot-seller': return 'Hot Sellers';
        case 'phone-case': return 'Phone Cases';
        case 'airpods-case': return 'AirPods Cases';
        case 'accessories': return 'Accessories';
        default: return 'Products';
    }
}

// Handle Enter key in search
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
