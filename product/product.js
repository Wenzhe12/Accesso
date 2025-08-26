
let allProducts = [];
let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    allProducts = Array.from(document.querySelectorAll('.product-card'));
    updateProductCount();
});

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
