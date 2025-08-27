$(document).ready(function() {
    // Theme toggle functionality
    const themeToggle = $('#theme-toggle');
    const body = $('body');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.addClass('dark');
    }
    
    themeToggle.on('click', function() {
        body.toggleClass('dark');
        const isDark = body.hasClass('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Cookie functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
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
    
    // Show alert function
    function showAlert(message, type = 'danger') {
        const alert = $('#login-alert');
        alert.removeClass('alert-danger alert-success').addClass(`alert-${type}`);
        $('#alert-message').text(message);
        alert.removeClass('d-none');
        
        setTimeout(() => {
            alert.addClass('d-none');
        }, 5000);
    }
    
    // Check if user is already logged in
    const loggedInUser = getCookie('loggedInUser');
    if (loggedInUser) {
        showAlert(`Already logged in as ${loggedInUser}`, 'success');
        // Optionally redirect to dashboard or home page
        // window.location.href = 'dashboard.html';
    }
    
    // Login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const rememberMe = $('#remember-me').is(':checked');
        
        if (!email || !password) {
            showAlert('Please fill in all fields');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find matching user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Successful login
            const cookieDays = rememberMe ? 30 : 1; // 30 days if remember me, 1 day otherwise
            setCookie('loggedInUser', user.email, cookieDays);
            setCookie('userFullName', `${user.firstName} ${user.lastName}`, cookieDays);
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            const userIndex = users.findIndex(u => u.email === email);
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            showAlert('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                // Redirect to home page or dashboard
                window.location.href = '../index.html'; // Change to your main page
            }, 1500);
            
        } else {
            showAlert('Invalid email or password');
        }
    });
    
    // Auto-focus on first input
    $('#email').focus();
});