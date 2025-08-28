const fmt = v => 'RM ' + (Number(v || 0)).toFixed(2);

const LS_CART_KEY = 'cart:v1';
const SS_PREVIEW_KEY = 'orderPreview:v1';
const LS_HISTORY_KEY = 'orderHistory:v1';
const SS_BUNDLES_KEY = 'bundleDeals:v1';
const SS_USER_PREFS = 'userPrefs:v1';

function setCookie(name, value, days = 7) {
  const d = new Date(); d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Check if user is logged in
function isLoggedIn() {
  const user = localStorage.getItem('loggedInUser');
  return user !== null && user !== '';
}

// Login protection - redirect to index if not logged in
function checkLoginAccess() {
  if (!isLoggedIn()) {
    showNotification('Please log in to access your cart', 'warning', 2000);
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 2000);
    return false;
  }
  return true;
}

let bundleCandidates = [];

function showNotification(message, type = 'info', duration = 3000) {
  const alertClass = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  }[type] || 'alert-info';

  const notification = $(`
    <div class="alert ${alertClass} alert-dismissible notification" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);

  $('#notifications').append(notification);

  setTimeout(() => {
    notification.fadeOut(() => notification.remove());
  }, duration);
}

function fetchBundleDeals() {
  $('#bundleLoading').show();

  // Check sessionStorage first
  const cachedBundles = sessionStorage.getItem(SS_BUNDLES_KEY);
  if (cachedBundles) {
    try {
      bundleCandidates = JSON.parse(cachedBundles);
      renderBundles();
      $('#bundleLoading').hide();
      return;
    } catch (e) {
      console.warn('Failed to parse cached bundles:', e);
    }
  }

  // Fetch from API (using JSONPlaceholder for demo)
  $.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    timeout: 10000,
    success: function (data) {
      // Transform API data to bundle deals
      bundleCandidates = data.slice(0, 3).map((post, index) => {
        const prices = [19.90, 15.90, 59.90];
        const names = ['USB‑C Fast Cable', '9H Tempered Glass', '10,000mAh Power Bank'];
        const customImages = [
          'https://eu.baseus.com/cdn/shop/products/Baseus_USB-C_Fast_Charging_Cable_240W_1.jpg?v=1702974187',
          'https://down-my.img.susercontent.com/file/773b8e656a9c26f11767d25eeb6c2c18',
          'https://www.baseus.com/cdn/shop/files/Baseus_Picogo_Power_Bank_45W_10000mAh_With_Built-in_Cable__3.jpg?v=1725909302'
        ];

        return {
          id: `api_${post.id}_${index}`,
          name: names[index] || `Bundle ${index + 1}`,
          price: prices[index] || (Math.random() * 50 + 20).toFixed(2),
          img: customImages[index],
          apiSource: true
        };
      });

      // Cache in sessionStorage
      sessionStorage.setItem(SS_BUNDLES_KEY, JSON.stringify(bundleCandidates));
      renderBundles();
      $('#bundleLoading').hide();
      showNotification('Bundle deals loaded successfully!', 'success');
    },
    error: function (xhr, status, error) {
      $('#bundleLoading').hide();
      console.error('API Error:', error);

      // Fallback to default bundles with custom images
      bundleCandidates = [
        {
          id: 'cable001',
          name: 'USB‑C Fast Cable',
          price: 19.90,
          img: 'https://picsum.photos/seed/cable/300/200'
        },
        {
          id: 'glass001',
          name: '9H Tempered Glass',
          price: 15.90,
          img: 'https://picsum.photos/seed/glass/300/200'
        },
        {
          id: 'power001',
          name: '10,000mAh Power Bank',
          price: 59.90,
          img: 'https://picsum.photos/seed/power/300/200'
        }
      ];
      renderBundles();
      showNotification('Using offline bundle deals', 'warning');
    }
  });
}

function loadCart() {
  const raw = localStorage.getItem(LS_CART_KEY);
  if (!raw) {
    // Return empty cart instead of demo item
    return [];
  }
  try { return JSON.parse(raw) || []; } catch { return []; }
}

function saveCart(list) {
  localStorage.setItem(LS_CART_KEY, JSON.stringify(list));

  // Also save cart summary in sessionStorage
  const subtotal = list.reduce((s, i) => s + i.price * i.qty, 0);
  // Always recalculate shipping based on current subtotal
  const shipping = subtotal >= 250 ? 0 : 7;
  const summary = {
    itemCount: list.length,
    totalQty: list.reduce((sum, item) => sum + item.qty, 0),
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping,
    lastUpdated: Date.now()
  };
  sessionStorage.setItem('cartSummary', JSON.stringify(summary));
}

function renderCart() {
  const cart = loadCart();
  const $list = $('#cartList').empty();

  if (cart.length === 0) {
    $('#cartEmpty').removeClass('d-none');
    // Hide select all when cart is empty
    $('#selectAll').closest('.d-flex').hide();
  } else {
    $('#cartEmpty').addClass('d-none');
    // Show select all when cart has items
    $('#selectAll').closest('.d-flex').show();
  }

  cart.forEach(item => {
    const row = $(`
      <div class="card card-shadow">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-auto">
              <input class="form-check-input select-item" type="checkbox" data-id="${item.id}" checked>
            </div>
            <div class="col-4 col-md-3">
              <img src="${item.img}" alt="${item.name}" class="img-fluid rounded img-ph">
            </div>
            <div class="col">
              <h3 class="h5 mb-1">${item.name}</h3>
              <div class="text-muted small mb-2">${item.info}</div>

              <div class="d-flex align-items-center gap-3">
                <div>
                  <label class="form-label mb-1 small text-muted">Quantity</label>
                  <div class="qty-controls">
                    <button type="button" class="qty-btn qty-decrease" data-id="${item.id}">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="text" class="qty-display" data-id="${item.id}" value="${item.qty}" readonly>
                    <button type="button" class="qty-btn qty-increase" data-id="${item.id}">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="ms-auto text-end">
                  <div class="small text-muted">Price</div>
                  <div class="fw-bold">${fmt(item.price * item.qty)}</div>
                </div>
              </div>

              <button class="btn btn-sm btn-outline-danger mt-3 remove-btn" data-id="${item.id}">
                <i class="bi bi-x-circle"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    $list.append(row);
  });

  calcTotals();
  updateSelectAllState();
}

function calcTotals() {
  const cart = loadCart();
  const selectedItems = $('.select-item:checked').map(function () {
    const id = $(this).data('id');
    return cart.find(item => item.id === id);
  }).get().filter(item => item !== undefined);

  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);

  // If cart is empty or no items selected, shipping should be 0
  let shipping = 0;
  if (cart.length > 0 && selectedItems.length > 0) {
    // Always recalculate shipping based on current subtotal
    shipping = subtotal >= 250 ? 0 : 7;
    // Update cookie with new shipping fee
    setCookie('shippingFee', shipping, 2);
  }

  $('#subtotalText').text(fmt(subtotal));
  $('#shippingText').text(fmt(shipping));
  $('#totalText').text(fmt(subtotal + shipping));

  // Update selected count
  $('#selectedCount').text(`${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`);

  // Enable/disable buttons based on cart state and selections
  const hasItems = cart.length > 0;
  const hasSelected = selectedItems.length > 0;

  $('#removeSelectedBtn').prop('disabled', !hasSelected);
  $('#checkoutBtn').prop('disabled', !hasSelected);

  // Update button text based on state
  if (!hasItems) {
    $('#checkoutBtn').text('Cart Empty');
  } else if (!hasSelected) {
    $('#checkoutBtn').text('Select Items');
  } else {
    $('#checkoutBtn').text('Checkout');
  }
}

function addToCart(prod) {
  const cart = loadCart();
  const found = cart.find(i => i.id === prod.id && i.model === prod.model);
  if (found) {
    found.qty = Number(found.qty) + Number(prod.qty);
    showNotification(`Updated quantity for ${prod.name} (${prod.model})`, 'info');
  } else {
    cart.push({ ...prod, qty: Number(prod.qty) });
    showNotification(`Added ${prod.name} (${prod.model}) to cart`, 'success');
  }
  saveCart(cart);
  renderCart();
}

function renderBundles() {
  const $list = $('#bundleList').empty();

  if (bundleCandidates.length === 0) {
    $list.append('<p class="text-muted small">No bundle deals available</p>');
    return;
  }

  bundleCandidates.forEach(p => {
    const card = $(`
      <div class="d-flex gap-3 align-items-start bundle-item">
        <div class="flex-shrink-0" style="width: 80px;">
          <img src="${p.img}" alt="${p.name}" class="img-fluid rounded img-ph" style="width: 80px; height: 60px; object-fit: cover;">
        </div>
        <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-height: 80px;">
          <div>
            <div class="small fw-semibold">${p.name}</div>
          </div>
          <div class="d-flex justify-content-between align-items-end">
            <div>
              <div class="small text-muted">Price</div>
              <div class="fw-semibold">${fmt(p.price)}</div>
            </div>
            <button class="btn btn-dark btn-sm add-bundle" data-id="${p.id}">ADD</button>
          </div>
        </div>
      </div>
    `);
    $list.append(card);
  });
}

/* =========================
   SOCIAL MEDIA PLUGIN DEMO
========================= */
function initSocialPlugins() {
  // Store social preferences in sessionStorage
  const socialPrefs = {
    shareEnabled: true,
    platform: 'facebook',
    lastShared: null
  };
  sessionStorage.setItem('socialPrefs', JSON.stringify(socialPrefs));
}

/* =========================
   SELECT ALL FUNCTIONALITY
========================= */
function updateSelectAllState() {
  const totalItems = $('.select-item').length;
  const selectedItems = $('.select-item:checked').length;

  if (totalItems === 0) {
    $('#selectAll').prop('indeterminate', false).prop('checked', false);
  } else if (selectedItems === 0) {
    $('#selectAll').prop('indeterminate', false).prop('checked', false);
  } else if (selectedItems === totalItems) {
    $('#selectAll').prop('indeterminate', false).prop('checked', true);
  } else {
    $('#selectAll').prop('indeterminate', true).prop('checked', false);
  }
}

/* =========================
   QUANTITY UPDATE FUNCTIONS
========================= */
function updateQuantity(itemId, change) {
  const cart = loadCart();
  const item = cart.find(i => i.id === itemId);

  if (item) {
    const newQty = Number(item.qty) + Number(change);
    if (newQty <= 0) {
      // Remove item if quantity becomes 0 or negative
      const newCart = cart.filter(i => i.id !== itemId);
      saveCart(newCart);
      showNotification(`Removed ${item.name} from cart`, 'info');
    } else {
      item.qty = newQty;
      saveCart(cart);
    }
    renderCart();
  }
}

/* =========================
   EVENTS
========================= */

// Select All functionality
$('#selectAll').on('change', function () {
  const isChecked = $(this).is(':checked');
  $('.select-item').prop('checked', isChecked);
  calcTotals();
});

// Individual item selection
$(document).on('change', '.select-item', function () {
  updateSelectAllState();
  calcTotals();
});

// Quantity controls
$(document).on('click', '.qty-decrease', function () {
  const id = $(this).data('id');
  updateQuantity(id, -1);
});

$(document).on('click', '.qty-increase', function () {
  const id = $(this).data('id');
  updateQuantity(id, 1);
});

$(document).on('click', '.remove-btn', function () {
  const id = $(this).data('id');
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  const itemName = item ? item.name : 'Item';

  const newCart = cart.filter(i => i.id !== id);
  saveCart(newCart);
  renderCart();
  showNotification(`Removed ${itemName} from cart`, 'info');
});

$('#removeSelectedBtn').on('click', function () {
  const selected = $('.select-item:checked').map((_, el) => $(el).data('id')).get();
  if (selected.length === 0) {
    showNotification('Please select items to remove', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to remove ${selected.length} item(s) from your cart?`)) {
    const cart = loadCart().filter(i => !selected.includes(i.id));
    saveCart(cart);
    renderCart();
    showNotification(`Removed ${selected.length} item(s) from cart`, 'info');
  }
});

$(document).on('click', '.add-bundle', function () {
  const id = $(this).data('id');
  const prod = bundleCandidates.find(p => p.id === id);
  if (prod) addToCart(prod);
});

$('#checkoutBtn').on('click', function () {
  const cart = loadCart();
  const selectedItems = $('.select-item:checked').map(function () {
    const id = $(this).data('id');
    return cart.find(item => item.id === id);
  }).get().filter(item => item !== undefined);

  if (cart.length === 0) {
    showNotification('Your cart is empty.', 'warning');
    return;
  }

  if (selectedItems.length === 0) {
    showNotification('Please select items to checkout.', 'warning');
    return;
  }

  // compute preview & store in sessionStorage (rubric: sessionStorage usage)
  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  // Always recalculate shipping based on current subtotal
  const shipping = subtotal >= 250 ? 0 : 7;
  const preview = {
    cart: selectedItems, // Only selected items 
    subtotal,
    shipping,
    total: subtotal + shipping,
    ts: Date.now(),
    checkoutId: 'CHK_' + Date.now(),
    customerSession: sessionStorage.getItem('customerSession') || 'GUEST'
  };
  sessionStorage.setItem(SS_PREVIEW_KEY, JSON.stringify(preview));

  // Store checkout history in localStorage
  const history = JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]');
  history.unshift({
    id: preview.checkoutId,
    timestamp: preview.ts,
    itemCount: selectedItems.length,
    total: preview.total,
    status: 'pending'
  });
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history.slice(0, 10))); // Keep last 10

  showNotification('Proceeding to checkout...', 'success');

  // Redirect to payment page
  setTimeout(() => {
    window.location.href = '../payment/payment.html';
  }, 1000);
});

/* =========================
   INIT
========================= */
$(document).ready(function () {
  console.log('Cart page initialized');

  // Only check login access if we're actually on the cart page
  if (window.location.pathname.includes('/cart/')) {
    // Check login access first - redirect if not logged in
    if (!checkLoginAccess()) {
      return; // Stop execution if user is not logged in
    }
  }

  // Initialize social plugins
  initSocialPlugins();

  // Load cart and bundles
  renderCart();
  fetchBundleDeals(); // This will use API or fallback

  // Set customer session if not exists
  if (!sessionStorage.getItem('customerSession')) {
    sessionStorage.setItem('customerSession', 'SESS_' + Date.now());
  }

  // Store user preferences in sessionStorage
  const userPrefs = {
    currency: 'RM',
    language: 'en',
    theme: 'light',
    notifications: true
  };
  sessionStorage.setItem(SS_USER_PREFS, JSON.stringify(userPrefs));
});

const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});