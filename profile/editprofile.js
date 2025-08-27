

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

document.getElementById("fullName").value = user.firstName + " " + user.lastName || "";
document.getElementById("email").value = user.email || "";
document.getElementById("phone").value = user.phone || "";
document.getElementById("address").value = user.address || "";
document.getElementById("gender").value = user.gender || "";
document.getElementById("dob").value = user.dob || "";
if (user.profilePic) document.getElementById("previewPic").src = user.profilePic;

document.getElementById("profilePic").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) { document.getElementById("previewPic").src = evt.target.result; }
        reader.readAsDataURL(file);
    }
});

document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const [firstName, ...lastNameParts] = document.getElementById("fullName").value.trim().split(" ");
    const lastName = lastNameParts.join(" ");

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = document.getElementById("email").value;
    user.phone = document.getElementById("phone").value;
    user.address = document.getElementById("address").value;
    user.gender = document.getElementById("gender").value;
    user.dob = document.getElementById("dob").value;

    const picFile = document.getElementById("profilePic").files[0];
    if (picFile) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            user.profilePic = evt.target.result;
            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Profile updated successfully!");
            window.location.href = "userprofile.html";
        }
        reader.readAsDataURL(picFile);
    } else {
        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Profile updated successfully!");
        window.location.href = "userprofile.html";
    }
});

document.getElementById("signOutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("You have been signed out.");
    window.location.href = "../login/login.html";
});
