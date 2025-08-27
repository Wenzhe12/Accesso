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
    
    // Show alert function
    function showAlert(message, type = 'danger') {
        const alert = $('#signup-alert');
        alert.removeClass('alert-danger alert-success').addClass(`alert-${type}`);
        $('#alert-message').text(message);
        alert.removeClass('d-none');
        
        setTimeout(() => {
            alert.addClass('d-none');
        }, 5000);
    }
    
    // Password strength checker
    function checkPasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password)
        };
        
        // Update requirement indicators
        $('#length-req').toggleClass('valid', requirements.length);
        $('#uppercase-req').toggleClass('valid', requirements.uppercase);
        $('#lowercase-req').toggleClass('valid', requirements.lowercase);
        $('#number-req').toggleClass('valid', requirements.number);
        
        // Update checkmarks
        $('.requirement.valid .check').text('✓');
        $('.requirement:not(.valid) .check').text('');
        
        // Calculate strength
        const validCount = Object.values(requirements).filter(Boolean).length;
        const strength = validCount / 4;
        
        // Update strength bar
        const strengthBar = $('#password-strength-bar');
        strengthBar.css('width', `${strength * 100}%`);
        
        if (strength <= 0.25) {
            strengthBar.css('background-color', '#dc3545'); // Red
        } else if (strength <= 0.5) {
            strengthBar.css('background-color', '#fd7e14'); // Orange
        } else if (strength <= 0.75) {
            strengthBar.css('background-color', '#ffc107'); // Yellow
        } else {
            strengthBar.css('background-color', '#28a745'); // Green
        }
        
        return validCount === 4;
    }
    
    // Password input handler
    $('#password').on('input', function() {
        checkPasswordStrength($(this).val());
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone number formatting (optional)
    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        $(this).val(value);
    });
    
    // Form submission
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: $('#first-name').val().trim(),
            lastName: $('#last-name').val().trim(),
            email: $('#email').val().trim().toLowerCase(),
            phone: $('#phone').val().trim(),
            password: $('#password').val(),
            confirmPassword: $('#confirm-password').val(),
            terms: $('#terms').is(':checked'),
            newsletter: $('#newsletter').is(':checked')
        };
        
        // Validation
        if (!formData.firstName || !formData.lastName) {
            showAlert('Please enter your first and last name');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showAlert('Please enter a valid email address');
            return;
        }
        
        if (!checkPasswordStrength(formData.password)) {
            showAlert('Password does not meet requirements');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            showAlert('Passwords do not match');
            return;
        }
        
        if (!formData.terms) {
            showAlert('Please accept the Terms of Service and Privacy Policy');
            return;
        }
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.some(user => user.email === formData.email)) {
            showAlert('An account with this email already exists');
            return;
        }
        
        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password, // In real app, this should be hashed
            newsletter: formData.newsletter,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        // Save user to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Show success message
        showAlert('Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
    
    // Auto-focus on first input
    $('#first-name').focus();
});