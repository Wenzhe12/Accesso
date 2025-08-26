document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".submenu-toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function () {
            const submenu = this.nextElementSibling;
            submenu.classList.toggle("active");
        });
    });
});

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Expanded products object to include all products from the listing page
const products = {
    "Bunny": {
        name: "Bunny With Plaid",
        price: "RM 200.00",
        img: "../img/BunnyWithPlaid.png",
        description: "A cute bunny with a plaid design, perfect as a gift."
    },
    "Bobo": {
        name: "Big Bobo",
        price: "RM 200.00",
        img: "../img/BigBobo.png",
        description: "A large huggable plush with a charming smile that makes the best cuddle buddy."
    },
    "NiceDay": {
        name: "Whosming-NiceDay",
        price: "RM 200.00",
        img: "../img/Whosming-NiceDay.png",
        description: "A cheerful plush toy designed to brighten up your day with positive vibes."
    },
    "Daisy": {
        name: "Daisy By Katie's Collective",
        price: "RM 250.00",
        img: "../img/DaisyByKatie-s Collective.png",
        description: "A floral-themed collectible plush with delicate daisy details."
    },
    "YogaCat": {
        name: "Yoga Cat",
        price: "RM 230.00",
        img: "../img/YogaCat.png",
        description: "A quirky plush cat striking yoga poses, bringing fun and relaxation vibes."
    },
    "Retro": {
        name: "Camera Case-Retro",
        price: "RM 200.00",
        img: "../img/CameraCase-Retro.png",
        description: "A vintage-style protective camera case for retro lovers."
    },
    "Lottery": {
        name: "I Wanna Win Lottery",
        price: "RM 200.00",
        img: "../img/WinLottery.png",
        description: "A playful plush figure inspired by the dream of hitting the jackpot."
    },
    "Coffee": {
        name: "Whosming-Good Coffee",
        price: "RM 200.00",
        img: "../img/Whosming-goodCoffee.png",
        description: "A cozy plush that captures the warmth of a fresh cup of coffee, perfect for coffee lovers."
    },
    "PartyCat": {
        name: "Party Cat",
        price: "RM 200.00",
        img: "../img/PartyCat.png",
        description: "A lively cat plush dressed for celebration, full of party spirit."
    },
    "Periwinkle": {
        name: "Ripple Case-Periwinkle",
        price: "RM 200.00",
        img: "../img/RippleCase-Periwinkle.png",
        description: "A sleek periwinkle phone case with a ripple texture for extra grip."
    },
    "Oat": {
        name: "Ripple Case-Oat",
        price: "RM 200.00",
        img: "../img/RippleCase-Oat.png",
        description: "A minimalist oat-colored phone case with a soft ripple finish."
    },
    "Strawberry": {
        name: "Strawberry Plaid",
        price: "RM 180.00",
        img: "../img/Strawberry Plaid.png",
        description: "A sweet strawberry-themed plush with a plaid accent."
    },
    "Only": {
        name: "ONLY",
        price: "RM 200.00",
        img: "../img/Only.png",
        description: "A simple and stylish plush designed with a minimalist aesthetic."
    },
    "Heart": {
        name: "Heart",
        price: "RM 200.00",
        img: "../img/Heart.png",
        description: "A heart-shaped plush symbolizing love and comfort."
    },
    "Monday": {
        name: "Monday-",
        price: "RM 200.00",
        img: "../img/Monday-.png",
        description: "A relatable plush reflecting the mood of Monday mornings."
    },
    "PeriwinkleAirpods": {
        name: "Ripple Case-Periwinkle(AirPods 4)",
        price: "RM 180.00",
        img: "../img/RippleCase-Periwinkle(pod).png",
        description: "Matching AirPods case in ripple periwinkle design."
    },
    "Butterfly": {
        name: "Butterfly Folk(AirPods 4)",
        price: "RM 180.00",
        img: "../img/Butterflyfolk.png",
        description: "A delicate butterfly-inspired AirPods case for a whimsical touch."
    },
    "DaintyFlowers": {
        name: "Dainty Flowers(AirPods 4)",
        price: "RM 180.00",
        img: "../img/DaintyFlowers.png",
        description: "A floral-patterned AirPods case for a soft, elegant style."
    },
    "Skateboarding": {
        name: "Skate Boadring(AirPods 4)",
        price: "RM 180.00",
        img: "../img/Skateboarding.png",
        description: "A sporty AirPods case with a skateboarder attitude."
    },
    "UltraBounce": {
        name: "Ultra Bounce Carabiner-Indigo",
        price: "RM 150.00",
        img: "../img/UltraBounceCarabiner-Indigo.png",
        description: "A sturdy indigo carabiner clip for carrying your tech gear."
    },
    "HeartCharm": {
        name: "Heart Phone Charm-Heart of Steel",
        price: "RM 180.00",
        img: "../img/Heart Phone Charm - Heart of Steel.png",
        description: "A stylish heart-shaped charm to accessorize your phone."
    },
    "RopeStrap": {
        name: "Rope Wrist Strap-Cabalt Blue (Braided)",
        price: "RM 180.00",
        img: "../img/Rope Wrist Strap - Cobalt Blue (Braided).png",
        description: "A durable braided wrist strap for secure carrying."
    },
    "Horoscope": {
        name: "Horoscope Phone Charm",
        price: "RM 180.00",
        img: "../img/Horoscope Phone Charm.png",
        description: "A personalized charm inspired by zodiac constellations."
    },
    "Cable": {
        name: "Cable",
        price: "RM 99.00",
        img: "../img/cable.jpeg",
        description: "A durable charging cable for daily use."
    },
    "Magsafe": {
        name: "Magsafe Charger",
        price: "RM 99.00",
        img: "../img/Macsafe Charger.png",
        description: "A fast wireless charger compatible with MagSafe devices."
    },
    "Finewoven": {
        name: "Finewoven",
        price: "RM 180.00",
        img: "../img/Finewoven Wallet.jpeg",
        description: "A premium woven wallet designed to attach to your MagSafe phone."
    }

};

document.getElementById("cancelBtn").addEventListener("click", function () {
    window.history.back();
});

document.getElementById("addToCart").addEventListener("click", function () {
    let model = document.getElementById("model").value;
    let qty = document.getElementById("qty").value;

    const p = products[productId];
    let cleanedString = p.price.replace(/[^0-9.]/g, '');
    let priceDoubleRegex = parseFloat(cleanedString);

    const cartItem = {
        id: productId,
        name: p.name,
        info: p.description,
        price: priceDoubleRegex,
        qty: qty,
        model: model,
        img: p.img,
    };
    addToCart(cartItem);
    alert(`Added ${qty} item(s) of ${model} to cart!`);

    console.log(p);
    console.log(cartItem);
});

// product.js
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function loadProduct() {
    const productId = getQueryParam("id");  // e.g. ?id=Bobo
    const product = products[productId];

    if (product) {
        document.getElementById("productImage").src = product.img;
        document.getElementById("productImage").alt = product.name;

        // Optional: also update text fields if you have them
        if (document.getElementById("productName")) {
            document.getElementById("productName").textContent = product.name;
        }
        if (document.getElementById("productPrice")) {
            document.getElementById("productPrice").textContent = product.price;
        }
        if (document.getElementById("productDescription")) {
            document.getElementById("productDescription").textContent = product.description;
        }
    } else {
        console.error("Product not found:", productId);
    }
}

window.onload = loadProduct;

