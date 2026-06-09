"use strict";

document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart_data")) || [];

    const cartDrawer = document.getElementById("js-cart-drawer");
    const cartTrigger = document.getElementById("js-cart-trigger");
    const cartClose = document.getElementById("js-cart-close");
    const cartOverlay = document.getElementById("js-cart-overlay");
    const cartEmpty = document.getElementById("js-cart-empty");
    const cartFilled = document.getElementById("js-cart-filled");
    const cartList = document.getElementById("js-cart-list");
    const cartTotalPrice = document.getElementById("js-cart-total-price");
    const headerCartCount = document.getElementById("js-cart-count");

    const contactsModal = document.getElementById("js-contacts-modal");
    const contactsTrigger = document.getElementById("js-contacts-trigger");
    const contactsClose = document.getElementById("js-contacts-close");
    const footerContactsTrigger = document.querySelector(".js-contacts-open");

    const searchInput = document.getElementById("js-search-input");
    const searchForm = document.getElementById("js-search-form");
    
    const searchCards = document.querySelectorAll(".card--dish, .card--restaurant");

    const topLogo = document.getElementById("js-logo-trigger");
    const footerLogo = document.querySelector(".footer__logo");

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (topLogo) topLogo.addEventListener("click", handleScrollToTop);
    if (footerLogo) footerLogo.addEventListener("click", handleScrollToTop);

    const saveCart = () => {
        localStorage.setItem("cart_data", JSON.stringify(cart));
        renderCart();
    };

    const renderCart = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        headerCartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartEmpty.classList.remove("is-hidden");
            cartFilled.classList.add("is-hidden");
            return;
        }

        cartEmpty.classList.add("is-hidden");
        cartFilled.classList.remove("is-hidden");
        cartList.innerHTML = "";
        
        let totalSum = 0;

        cart.forEach(item => {
            const itemCost = item.price * item.quantity;
            totalSum += itemCost;

            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <div>
                    <p class="cart-item__title">${item.name}</p>
                    <p class="cart-item__price">${item.price} ₸</p>
                </div>
                <div class="cart-item__controls">
                    <button type="button" class="cart-item__btn js-minus" data-id="${item.id}">-</button>
                    <span class="cart-item__qty">${item.quantity}</span>
                    <button type="button" class="cart-item__btn js-plus" data-id="${item.id}">+</button>
                </div>
            `;
            cartList.appendChild(li);
        });

        cartTotalPrice.textContent = `${totalSum.toLocaleString()} ₸`;
    };