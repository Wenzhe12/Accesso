
const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

const users = JSON.parse(localStorage.getItem("users")) || [];
const loggedInUserEmail = localStorage.getItem("loggedInUser");

if (!loggedInUserEmail) {
    alert("Please log in first.");
    window.location.href = "../login/login.html";
}

const userIndex = users.findIndex(u => u.email === loggedInUserEmail);
if (userIndex === -1) {
    alert("User not found. Please log in again.");
    window.location.href = "../login/login.html";
}

const user = users[userIndex];

document.getElementById("signOutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("You have been signed out.");
    window.location.href = "../login/login.html";
});

const form = document.getElementById("passwordForm");
const msg = document.getElementById("passwordMessage");

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const current = document.getElementById("currentPassword").value.trim();
    const newPass = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (current !== user.password) {
        msg.textContent = "❌ Current password is incorrect.";
        msg.style.color = "red";
        return;
    }
    if (newPass !== confirm) {
        msg.textContent = "❌ New password and confirmation do not match.";
        msg.style.color = "red";
        return;
    }
    if (newPass.length < 6) {
        msg.textContent = "❌ New password must be at least 6 characters.";
        msg.style.color = "red";
        return;
    }

    users[userIndex].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    msg.textContent = "✅ Password updated successfully.";
    msg.style.color = "green";
    form.reset();
});
