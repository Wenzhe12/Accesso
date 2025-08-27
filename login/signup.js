const toggleInput = document.getElementById('theme-toggle');
if (sessionStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleInput.checked = true;
}
toggleInput.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        sessionStorage.setItem('theme', 'dark');
    } else {
        sessionStorage.setItem('theme', 'light');
    }
});

$('#close-btn').on('click', function () {
    window.history.back();
});

// Hash password before storing
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Mock API to simulate signup with hashed password
async function signupAPI(email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        throw "This email is already registered. Please log in instead.";
    }

    const hashedPassword = await hashPassword(password);

    // Add new user
    users.push({ email, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));
    return "Sign up successful! You can now log in.";
}

// Signup validation and API call
$('#signupForm').on('submit', async function (e) {
    e.preventDefault();

    let email = $('#email').val().trim();
    let password = $('#password').val().trim();
    let isValid = true;

    $('#email-error, #password-error').hide();

    // Email validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        $('#email-error').text('Please enter a valid email address.').show();
        isValid = false;
    }

    // Password length validation
    if (password.length < 8) {
        $('#password-error').text('Password must be at least 8 characters long.').show();
        isValid = false;
    }

    if (!isValid) return;

    try {
        const msg = await signupAPI(email, password);
        alert(msg);
        window.location.href = "login.html";
    } catch (err) {
        alert(err);
    }
});