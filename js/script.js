console.log("Script Loaded");

const productContainer = document.getElementById("productContainer");

console.log(productContainer);

let adminProducts = JSON.parse(localStorage.getItem("products")) || [];

console.log(adminProducts);

// ===============================
// Load Admin Products
// ===============================

if (productContainer && adminProducts.length > 0) {

    adminProducts.forEach(product => {

        productContainer.innerHTML += `

            <div class="col-lg-3 col-md-4 col-sm-6">

                <div class="product-card"
                    data-name="${product.name}"
                    data-category="${product.category.toLowerCase()}">

                    <img
                        src="${product.image}"
                        class="img-fluid rounded">

                    <button class="wishlist-btn">
                        <i class="bi bi-heart"></i>
                    </button>

                    <div class="product-info">

                        <h5>${product.name}</h5>

                        <p class="text-muted">${product.category}</p>

                        <h4 class="text-success">
                            ₹${product.price}
                        </h4>

                        <a
                            href="product-details.html"
                            class="btn btn-success w-100 view-details"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}"
                            data-description="Best quality ${product.name} available at SiddhiVinayak Supermart.">

                            View Details

                        </a>

                        <div class="quantity-box d-flex justify-content-center align-items-center my-2">

                            <button class="btn btn-outline-secondary qty-minus">-</button>

                            <input
                                type="text"
                                class="form-control text-center qty-input mx-2"
                                value="1"
                                readonly>

                            <button class="btn btn-outline-secondary qty-plus">+</button>

                        </div>

                        <button
                            class="btn btn-warning w-100 mt-2 add-to-cart"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}">

                            <i class="bi bi-cart-plus"></i>

                            Add To Cart

                        </button>

                        <div class="rating mt-3">

                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-half text-warning"></i>

                            <small class="text-muted ms-2">
                                (4.5)
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });
    attachEvents();

}
// ===============================
// SiddhiVinayak Supermart
// Live Product Search
// ===============================

const searchBox = document.getElementById("searchInput");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const searchValue = searchBox.value.toLowerCase();

        const products = document.querySelectorAll(".product-card");

        products.forEach(function (product) {

            const productName = product.getAttribute("data-name").toLowerCase();

            if (productName.includes(searchValue)) {

                product.parentElement.style.display = "block";

            } else {

                product.parentElement.style.display = "none";

            }

        });

    });

}
// ===============================
// Category Filter
// ===============================

const filterButtons = document.querySelectorAll(".filter-buttons .btn");

filterButtons.forEach(function(button){

    button.addEventListener("click", function(){

        // Remove active class from all buttons
        filterButtons.forEach(function(btn){

            btn.classList.remove("active");

        });

        // Add active class to clicked button
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");

        const products = document.querySelectorAll(".product-card");

        products.forEach(function(product){

            const category = product.getAttribute("data-category");

            if(filter === "all" || category === filter){

                product.parentElement.style.display = "block";

            }else{

                product.parentElement.style.display = "none";

            }

        });

    });

});
// ===============================
// Add To Cart System
// ===============================

let cart = [];

const addButtons = document.querySelectorAll(".add-to-cart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// Load Cart
if(localStorage.getItem("cart")){
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCart();
}

// ===============================
// Add Product
// ===============================
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        if (!item.qty) item.qty = 1;

        total += item.price * item.qty;
        cartItems.innerHTML += `

        <div class="cart-item d-flex align-items-center mb-3">

            <img src="${item.image}"
                width="60"
                height="60"
                class="rounded me-3">

            <div class="flex-grow-1">

                <h6>${item.name}</h6>

                <p class="mb-1">₹${item.price}</p>

                <div>

                    <button class="btn btn-sm btn-secondary"
                        onclick="decreaseQty(${index})">-</button>

                    <span class="mx-2">${item.qty}</span>

                    <button class="btn btn-sm btn-success"
                        onclick="increaseQty(${index})">+</button>

                </div>

            </div>

            <button class="btn btn-danger btn-sm"
                onclick="removeItem(${index})">

                <i class="bi bi-trash"></i>

            </button>

        </div>

        `;
        });

    cartCount.innerHTML = cart.length;
    cartTotal.innerHTML = total;

    localStorage.setItem("cart", JSON.stringify(cart));

    if (cart.length == 0) {

        cartItems.innerHTML = `
            <p class="text-center text-muted mt-5">
                Cart is Empty
            </p>
        `;

        cartTotal.innerHTML = 0;
    }
}


// Remove Product
function removeItem(index){

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    updateCart();

}
function increaseQty(index) {

    cart[index].qty++;

    updateCart();

}

function decreaseQty(index) {

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();

}
// ===============================
// Shopping Cart Sidebar
// ===============================

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");

if (cartBtn && cartSidebar) {

    cartBtn.addEventListener("click", function () {
        cartSidebar.classList.add("active");
    });

}

if (closeCart && cartSidebar) {

    closeCart.addEventListener("click", function () {
        cartSidebar.classList.remove("active");
    });

}


// =========================
// Product Details Modal
// =========================
const detailButtons = document.querySelectorAll(".view-details");

detailButtons.forEach(button => {

    button.addEventListener("click", function () {

        document.getElementById("modalTitle").innerHTML = this.dataset.name;

        document.getElementById("modalName").innerHTML = this.dataset.name;

        document.getElementById("modalPrice").innerHTML = this.dataset.price;

        document.getElementById("modalImage").src = this.dataset.image;

        document.getElementById("modalDescription").innerHTML = this.dataset.description;

    });

});
// ==========================
// Wishlist Toggle (Flipkart Style)
// ==========================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.querySelectorAll(".wishlist-btn").forEach(button => {

    const card = button.closest(".product-card");

    const product = {

        name: card.querySelector("h5").innerText,

        price: Number(card.querySelector("h4").innerText.replace("₹", "")),

        image: card.querySelector("img").src

    };

    const icon = button.querySelector("i");

    // Page load la red heart dakhav
    if (wishlist.some(item => item.name === product.name)) {

        icon.classList.remove("bi-heart");

        icon.classList.add("bi-heart-fill", "text-danger");

    }

    // Toggle Wishlist
    button.addEventListener("click", function () {

        const index = wishlist.findIndex(item => item.name === product.name);

        if (index > -1) {

            // Remove
            wishlist.splice(index, 1);

            icon.classList.remove("bi-heart-fill", "text-danger");

            icon.classList.add("bi-heart");

        }

        else {

            // Add
            wishlist.push(product);

            icon.classList.remove("bi-heart");

            icon.classList.add("bi-heart-fill", "text-danger");

        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

    });

});
// ==========================
// Quantity Selector
// ==========================

const plusBtns = document.querySelectorAll(".qty-plus");
const minusBtns = document.querySelectorAll(".qty-minus");

plusBtns.forEach(btn=>{

    btn.addEventListener("click",function(){

        const input=this.parentElement.querySelector(".qty-input");

        input.value=parseInt(input.value)+1;

    });

});

minusBtns.forEach(btn=>{

    btn.addEventListener("click",function(){

        const input=this.parentElement.querySelector(".qty-input");

        if(parseInt(input.value)>1){

            input.value=parseInt(input.value)-1;

        }

    });

});
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        window.location.href = "checkout.html";
    });
}
// ===============================
// View Product Details
// ===============================

document.querySelectorAll(".view-details").forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        const product = {

            name: this.dataset.name,
            price: this.dataset.price,
            image: this.dataset.image,
            description: this.dataset.description

        };

        localStorage.setItem(
            "selectedProduct",
            JSON.stringify(product)
        );

        window.location.href = "product-details.html";

    });

});
function attachEvents() {

    // Add To Cart
    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.onclick = function () {

            const qtyInput = this.parentElement.querySelector(".qty-input");

            const product = {

                name: this.dataset.name,
                price: Number(this.dataset.price),
                image: this.dataset.image,
                qty: qtyInput ? Number(qtyInput.value) : 1

            };

            cart.push(product);

            localStorage.setItem("cart", JSON.stringify(cart));

            updateCart();

            const toastElement = document.getElementById("cartToast");

            if (toastElement) {

                const toast = new bootstrap.Toast(toastElement);

                toast.show();

            }

        };

    });
}
