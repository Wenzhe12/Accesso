const themeToggle = document.getElementById('themeToggle');
if (sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
const loggedInUserEmail = getCookie("loggedInUser") || localStorage.getItem("loggedInUser");

if (!loggedInUserEmail) {
    alert("Please log in to view your profile.");
    window.location.href = "../login/login.html";
} else {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === loggedInUserEmail);

    if (!user) {
        alert("User not found. Please log in again.");
        window.location.href = "../login/login.html";
    } else {
        document.getElementById("displayFullName").textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById("displayEmail").textContent = user.email || "Not set";
        document.getElementById("displayPhone").textContent = user.phone || "Not set";
        document.getElementById("displayAddress").textContent = user.address || "Not set";
        document.getElementById("displayGender").textContent = user.gender || "Not set";
        document.getElementById("displayDOB").textContent = user.dob || "Not set";
        if (user.profilePic) {
            document.getElementById("userImage").src = user.profilePic;
        }
    }
}

document.getElementById('signOutBtn').addEventListener('click', function () {
    document.cookie = "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('loggedInUser');
    window.location.href = "../login/login.html";
});
