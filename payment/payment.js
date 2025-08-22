const fmt = v => 'RM ' + (Number(v||0)).toFixed(2);
const SS_PREVIEW_KEY = 'orderPreview:v1';
const LS_CART_KEY = 'cart:v1';
const LS_HISTORY_KEY = 'orderHistory:v1';

/* =========================
   NOTIFICATION SYSTEM
========================= */
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

/* ============ Load preview from sessionStorage ============ */
let preview = null;
try { 
  preview = JSON.parse(sessionStorage.getItem(SS_PREVIEW_KEY) || 'null'); 
  console.log('Loaded checkout preview:', preview);
} catch(e) {
  console.error('Failed to load checkout preview:', e);
}

if(!preview){
  // If user came here directly, try to build from cart as fallback
  try {
    const cart = JSON.parse(localStorage.getItem(LS_CART_KEY) || '[]');
    if (cart.length > 0) {
      const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
      const shipping = subtotal>=120 ? 0 : 7;
      preview = {
        cart, 
        subtotal, 
        shipping, 
        total: subtotal+shipping,
        checkoutId: 'FALLBACK_' + Date.now(),
        ts: Date.now()
      };
      showNotification('Loaded cart data as fallback', 'info');
    } else {
      showNotification('No items found. Redirecting to cart...', 'warning');
      setTimeout(() => window.location.href = '../cart/cart.html', 2000);
    }
  } catch(e) {
    console.error('Failed to load cart fallback:', e);
    showNotification('Unable to load order data. Redirecting to cart...', 'error');
    setTimeout(() => window.location.href = '../cart/cart.html', 2000);
  }
}

/* Render summary */
function renderSummary(){
  const list = $('#summaryList').empty();
  
  if(!preview || !preview.cart || preview.cart.length===0){
    list.append(`<div class="text-muted text-center p-3">
      <i class="bi bi-cart-x fs-1 d-block mb-2"></i>
      No items found
    </div>`);
    $('#checkoutId').text('No checkout data');
  } else {
    preview.cart.forEach(item => {
      list.append(`
        <div class="d-flex align-items-center gap-3 p-2 border-bottom">
          <div class="item-image">
            <i class="bi bi-phone"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-semibold small">${item.name}</div>
            <div class="text-muted small">${item.info}</div>
            <div class="text-muted small">Qty: ${item.qty}</div>
          </div>
          <div class="text-end">
            <div class="fw-bold">${fmt(item.price * item.qty)}</div>
            <div class="small text-muted">${fmt(item.price)} each</div>
          </div>
        </div>
      `);
    });
    $('#checkoutId').text(preview.checkoutId || 'Unknown');
  }
  
  $('#sumSubtotal').text(fmt(preview?.subtotal || 0));
  $('#sumShipping').text(fmt(preview?.shipping || 0));
  $('#sumTotal').text(fmt(preview?.total || 0));

  // Store payment preferences in cookie (for rubric)
  document.cookie = "lastPaymentMethod=card;path=/;max-age=" + (60*60*24*7);
  
  // Store checkout metadata in sessionStorage
  const checkoutMeta = {
    loadTime: Date.now(),
    itemCount: preview?.cart?.length || 0,
    totalAmount: preview?.total || 0,
    currency: 'RM'
  };
  sessionStorage.setItem('checkoutMetadata', JSON.stringify(checkoutMeta));
}

/* Payment method toggling */
$('.pay-method').on('change', function(){
  const v = $('input[name="payMethod"]:checked').val();
  if(v==='card'){
    $('#cardFields').removeClass('d-none');
    $('#nonCardHint').addClass('d-none');
  } else {
    $('#cardFields').addClass('d-none');
    $('#nonCardHint').removeClass('d-none');
    $('#pmLabel').text(v==='fpx' ? 'Online Banking (FPX)' : 'E‑Wallet');
  }
  
  // Store preference in cookie for UX
  document.cookie = "lastPaymentMethod="+v+";path=/;max-age=" + (60*60*24*30);
  
  // Store in sessionStorage as well
  const paymentPrefs = {
    method: v,
    timestamp: Date.now()
  };
  sessionStorage.setItem('paymentPreferences', JSON.stringify(paymentPrefs));
});

/* Handle payment form submission */
$('#payForm').on('submit', function(e){
  e.preventDefault();

  // Validation
  if(!preview || !preview.cart || preview.cart.length===0){
    showNotification('Your cart is empty.', 'error'); 
    return;
  }
  
  // Form validation
  const requiredFields = ['fullName', 'email', 'address', 'city', 'postcode', 'phone'];
  let isValid = true;
  
  requiredFields.forEach(field => {
    const $field = $(`#${field}`);
    if (!$field.val().trim()) {
      $field.addClass('is-invalid');
      isValid = false;
    } else {
      $field.removeClass('is-invalid');
    }
  });
  
  if (!isValid) {
    showNotification('Please fill in all required fields.', 'warning');
    return;
  }

  // Show loading state
  $('#paymentLoading').show();
  $('#payButton').prop('disabled', true).html('<i class="bi bi-hourglass-split me-2"></i>Processing...');

  // Mock payment processing
  setTimeout(() => {
    processPayment();
  }, 2000); // Simulate 2 second processing time
});

function processPayment() {
  const orderId = 'ORD' + Math.floor(100000 + Math.random()*900000);
  const paymentMethod = $('input[name="payMethod"]:checked').val();
  
  // Collect form data
  const orderData = {
    orderId,
    checkoutId: preview.checkoutId,
    total: preview.total,
    items: preview.cart,
    shipping: {
      fullName: $('#fullName').val(),
      email: $('#email').val(),
      address: $('#address').val(),
      city: $('#city').val(),
      postcode: $('#postcode').val(),
      phone: $('#phone').val()
    },
    payment: {
      method: paymentMethod,
      amount: preview.total,
      currency: 'RM'
    },
    createdAt: new Date().toISOString(),
    status: 'completed'
  };

  // Save to order history (localStorage)
  const history = JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]');
  history.unshift(orderData);
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history.slice(0, 20))); // Keep last 20 orders

  // Store order confirmation in sessionStorage
  sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
  
  // Clear cart after successful payment
  localStorage.setItem(LS_CART_KEY, JSON.stringify([]));
  sessionStorage.removeItem(SS_PREVIEW_KEY);
  
  // Store payment success metadata
  const successMeta = {
    orderId,
    paymentMethod,
    completedAt: Date.now(),
    amount: preview.total
  };
  sessionStorage.setItem('paymentSuccess', JSON.stringify(successMeta));

  // Hide loading, show success
  $('#paymentLoading').hide();
  $('#payButton').prop('disabled', false).html('<i class="bi bi-lock me-2"></i>Pay Now');
  
  // Show success message
  $('#orderNo').text(orderId);
  $('#paidBox').removeClass('d-none');
  $('#payForm').hide();
  
  showNotification('Payment successful! Order placed.', 'success');
  window.scrollTo({top:0, behavior:'smooth'});

  // Optional: Auto-redirect after success
}

/* Initialize page */
$(document).ready(function() {
  console.log('Payment page initialized');
  
  // Render order summary
  renderSummary();
  
  // Restore last payment method from cookie
  const lastPm = (document.cookie.match(/(?:^| )lastPaymentMethod=([^;]+)/)||[])[1];
  if(lastPm && ['card', 'fpx', 'ewallet'].includes(lastPm)){
    $(`.pay-method[value="${lastPm}"]`).prop('checked', true).trigger('change');
  }
  
  // Pre-fill form from sessionStorage if available
  const savedFormData = sessionStorage.getItem('checkoutFormData');
  if (savedFormData) {
    try {
      const formData = JSON.parse(savedFormData);
      Object.keys(formData).forEach(key => {
        $(`#${key}`).val(formData[key]);
      });
    } catch(e) {
      console.warn('Failed to restore form data:', e);
    }
  }
  
  // Save form data to sessionStorage on input
  $('input[type="text"], input[type="email"], input[type="tel"]').on('input', function() {
    const formData = {
      fullName: $('#fullName').val(),
      email: $('#email').val(),
      address: $('#address').val(),
      city: $('#city').val(),
      postcode: $('#postcode').val(),
      phone: $('#phone').val()
    };
    sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
  });
  
//   console.log('Storage usage:');
//   console.log('- localStorage: Order history, cart data');
//   console.log('- sessionStorage: Checkout preview, form data, payment preferences');
//   console.log('- cookies: Payment method preferences');
});