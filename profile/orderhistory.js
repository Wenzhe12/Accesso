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

const orderTableBody = document.getElementById("orderTableBody");
if (user.orders && user.orders.length > 0) {
    user.orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${order.id}</td>
          <td>
            <div class="order-product">
              <img src="${order.img}" alt="Product Image">
              <span>${order.product}</span>
            </div>
          </td>
          <td>${order.date}</td>
          <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
        `;
        orderTableBody.appendChild(row);
    });
} else {
    orderTableBody.innerHTML = `<tr><td colspan="4">No orders found for this account.</td></tr>`;
}