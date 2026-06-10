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
    
    document.querySelectorAll(".js-add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".card--dish");
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name || card.querySelector(".card__title")?.textContent.trim() || "Блюдо";
            const price = parseInt(card.dataset.price, 10) || 0;

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            saveCart();
        });
    });

    cartList.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        const currentItem = cart.find(item => item.id === id);
        if (!currentItem) return;

        if (e.target.classList.contains("js-plus")) {
            currentItem.quantity += 1;
        } else if (e.target.classList.contains("js-minus")) {
            currentItem.quantity -= 1;
            if (currentItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }
        saveCart();
    });
    
    const toggleCartDrawer = () => cartDrawer.classList.toggle("cart-drawer--open");
    if (cartTrigger) cartTrigger.addEventListener("click", toggleCartDrawer);
    if (cartClose) cartClose.addEventListener("click", toggleCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", toggleCartDrawer);

    const openContacts = () => contactsModal.showModal();
    const closeContacts = () => contactsModal.close();

    if (contactsTrigger) contactsTrigger.addEventListener("click", openContacts);
    if (contactsClose) contactsClose.addEventListener("click", closeContacts);
    if (footerContactsTrigger) {
        footerContactsTrigger.addEventListener("click", openContacts);
    }

    const phoneInput = document.getElementById("form-phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let matrix = "+7 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = e.target.value.replace(/\D/g, "");
            
            if (def.length >= val.length) val = def;
            
            e.target.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
            });
        });
    }

    const feedbackForm = document.getElementById("js-feedback-form");
    
    const showError = (inputEl, errorEl, message) => {
        inputEl.classList.add("modal-dialog__input--error");
        errorEl.textContent = message;
    };

    const clearError = (inputEl, errorEl) => {
        inputEl.classList.remove("modal-dialog__input--error");
        errorEl.textContent = "";
    };

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById("form-name");
            const errorName = document.getElementById("error-name");
            if (nameInput.value.trim().length < 2) {
                showError(nameInput, errorName, "Имя должно содержать не менее 2 символов");
                isValid = false;
            } else {
                clearError(nameInput, errorName);
            }

            const emailInput = document.getElementById("form-email");
            const errorEmail = document.getElementById("error-email");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, errorEmail, "Введите корректный email");
                isValid = false;
            } else {
                clearError(emailInput, errorEmail);
            }

            const errorPhone = document.getElementById("error-phone");
            if (phoneInput && phoneInput.value.replace(/\D/g, "").length < 11) {
                showError(phoneInput, errorPhone, "Введите полный номер телефона");
                isValid = false;
            } else {
                if (phoneInput) clearError(phoneInput, errorPhone);
            }

            const messageInput = document.getElementById("form-message");
            const errorMessage = document.getElementById("error-message");
            if (messageInput.value.trim().length < 10) {
                messageInput.classList.add("modal-dialog__textarea--error");
                errorMessage.textContent = "Сообщение должно быть длиннее 10 символов";
                isValid = false;
            } else {
                messageInput.classList.remove("modal-dialog__textarea--error");
                errorMessage.textContent = "";
            }

            if (isValid) {
                feedbackForm.reset();
                contactsModal.close();
                console.log("Форма успешно отправлена.");
            }
        });
    }
    
    const filterSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        let hasVisibleRestaurants = false;
        let hasVisibleDishes = false;

        searchCards.forEach(card => {
            let name = card.dataset.name ? card.dataset.name.toLowerCase().trim() : "";
            
            if (!name) {
                const titleEl = card.querySelector(".card__title");
                if (titleEl) {
                    name = titleEl.textContent.toLowerCase().trim();
                }
            }
            
            if (name.includes(query)) {
                card.classList.remove("is-hidden");
                
                if (card.classList.contains("card--restaurant")) {
                    hasVisibleRestaurants = true;
                }
                if (card.classList.contains("card--dish")) {
                    hasVisibleDishes = true;
                }
            } else {
                card.classList.add("is-hidden");
            }
        });

        const restaurantsSection = document.getElementById("restaurants");
        const dishesSection = document.getElementById("dishes");

        if (query === "") {
            if (restaurantsSection) restaurantsSection.classList.remove("is-hidden");
            if (dishesSection) dishesSection.classList.remove("is-hidden");
        } else {
            if (restaurantsSection) {
                if (hasVisibleRestaurants) {
                    restaurantsSection.classList.remove("is-hidden");
                } else {
                    restaurantsSection.classList.add("is-hidden");
                }
            }
            if (dishesSection) {
                if (hasVisibleDishes) {
                    dishesSection.classList.remove("is-hidden");
                } else {
                    dishesSection.classList.add("is-hidden");
                }
            }
        }
    };