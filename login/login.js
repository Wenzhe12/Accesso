$(document).ready(function () {
    if (sessionStorage.getItem('theme') === 'dark') {
        $("body").addClass("dark-mode");
        $("#theme-toggle").prop("checked", true);
    }
    $("#theme-toggle").on("change", function () {
        $("body").toggleClass("dark-mode");
        if ($("body").hasClass("dark-mode")) {
            sessionStorage.setItem("theme", "dark");
        } else {
            sessionStorage.setItem("theme", "light");
        }
    });

    $("#close-btn").on("click", function () {
        window.history.back();
    });

    // Hash password
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    $("#loginForm").on("submit", async function (e) {
        e.preventDefault();
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let valid = true;

        $(".error-msg").hide();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $("#email-error").show();
            valid = false;
        }
        if (!password) {
            $("#password-error").show();
            valid = false;
        }
        if (!valid) return;

        // Read stored users from local storage
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Hash input password
        const hashedPassword = await hashPassword(password);

        // Find user
        const user = users.find(u => u.email === email && u.password === hashedPassword);

        if (user) {
            // Save session info
            sessionStorage.setItem("loggedInUser", JSON.stringify({ email: user.email }));
            alert("Login successful!");
            window.location.href = "../index.html";
        } else {
            alert("Invalid email or password. Please try again.");
        }
    });
});