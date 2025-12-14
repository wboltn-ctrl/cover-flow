/*

TemplateMo 595 3d coverflow

https://templatemo.com/tm-595-3d-coverflow

QuickBite food delivery single-page app built on top of this template.
*/

// JavaScript Document

(function () {
    "use strict";

    const STORAGE_KEYS = {
        users: "qb_users",
        restaurants: "qb_restaurants",
        orders: "qb_orders",
        addresses: "qb_addresses",
        cart: "qb_cart",
        session: "qb_session"
    };

    const ORDER_STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

    const DEMO_RESTAURANTS = [
        {
            id: "rest-urban-burger",
            name: "Urban Burger Co.",
            category: "Fast Food",
            cuisines: ["Burgers", "Fries", "American"],
            rating: 4.7,
            ratingCount: 1320,
            eta: "20–30 min",
            deliveryFee: 2.99,
            image: "images/mountain-landscape.jpg",
            tagline: "Smash burgers, crispy fries, late-night vibes.",
            isFeatured: true,
            menu: [
                {
                    id: "ub-classic-cheese",
                    name: "Classic Cheeseburger",
                    description: "Griddled beef, aged cheddar, lettuce, tomato, pickles, house sauce on a brioche bun.",
                    price: 9.5,
                    category: "Burgers",
                    image: "images/mountain-landscape.jpg",
                    isPopular: true
                },
                {
                    id: "ub-spicy-smash",
                    name: "Spicy Smash Burger",
                    description: "Double smashed patty, jalapeños, pepper jack, chili aioli.",
                    price: 11.25,
                    category: "Burgers",
                    image: "images/ocean-sunset-golden-hour.jpg",
                    isPopular: true
                },
                {
                    id: "ub-truffle-fries",
                    name: "Truffle Parmesan Fries",
                    description: "Crispy shoestring fries, truffle oil, grated parmesan, herbs.",
                    price: 5.25,
                    category: "Sides",
                    image: "images/rolling-sand-dunes.jpg"
                },
                {
                    id: "ub-oreo-shake",
                    name: "Midnight Oreo Shake",
                    description: "Vanilla bean ice cream, crushed cookies, dark chocolate drizzle.",
                    price: 4.75,
                    category: "Drinks",
                    image: "images/starry-night.jpg"
                }
            ]
        },
        {
            id: "rest-green-bowl",
            name: "Green Bowl Salads",
            category: "Healthy",
            cuisines: ["Salads", "Bowls"],
            rating: 4.8,
            ratingCount: 980,
            eta: "15–25 min",
            deliveryFee: 1.5,
            image: "images/forest-path.jpg",
            tagline: "Colorful, nutrient-dense bowls that actually taste good.",
            isFeatured: true,
            menu: [
                {
                    id: "gb-power-bowl",
                    name: "Power Greens Bowl",
                    description: "Kale, quinoa, roasted sweet potato, chickpeas, avocado, lemon tahini dressing.",
                    price: 10.75,
                    category: "Bowls",
                    image: "images/forest-path.jpg",
                    isPopular: true
                },
                {
                    id: "gb-mediterranean",
                    name: "Mediterranean Crunch",
                    description: "Romaine, cucumber, tomato, olives, feta, crispy chickpeas, oregano vinaigrette.",
                    price: 9.9,
                    category: "Salads",
                    image: "images/serene-water-mirroring.jpg"
                },
                {
                    id: "gb-citrus-fizz",
                    name: "Citrus Ginger Fizz",
                    description: "Sparkling water, orange, lime, ginger syrup.",
                    price: 3.95,
                    category: "Drinks",
                    image: "images/cascading-waterfall.jpg"
                }
            ]
        },
        {
            id: "rest-midnight-desserts",
            name: "Midnight Desserts Lab",
            category: "Desserts",
            cuisines: ["Cakes", "Ice Cream"],
            rating: 4.9,
            ratingCount: 640,
            eta: "25–35 min",
            deliveryFee: 2.25,
            image: "images/starry-night.jpg",
            tagline: "Over-the-top sweets for your late-night sweet tooth.",
            isFeatured: true,
            menu: [
                {
                    id: "md-lava-cake",
                    name: "Molten Lava Cake",
                    description: "Warm dark chocolate cake with molten center and vanilla ice cream.",
                    price: 7.9,
                    category: "Cakes",
                    image: "images/starry-night.jpg",
                    isPopular: true
                },
                {
                    id: "md-salted-caramel",
                    name: "Salted Caramel Sundae",
                    description: "Caramel ice cream, sea salt, roasted almonds, caramel drizzle.",
                    price: 6.75,
                    category: "Ice Cream",
                    image: "images/ocean-sunset-golden-hour.jpg"
                },
                {
                    id: "md-affogato",
                    name: "Espresso Affogato",
                    description: "Vanilla bean ice cream drowned in hot espresso.",
                    price: 5.5,
                    category: "Coffee",
                    image: "images/mountain-landscape.jpg"
                }
            ]
        }
    ];

    const DEMO_USERS = [
        {
            id: "u-demo",
            name: "Demo Customer",
            email: "customer@example.com",
            password: "demo123",
            role: "customer"
        },
        {
            id: "u-admin",
            name: "Admin",
            email: "admin@example.com",
            password: "admin123",
            role: "admin"
        },
        {
            id: "u-partner",
            name: "Partner Restaurant",
            email: "partner@example.com",
            password: "partner123",
            role: "partner",
            restaurantId: "rest-urban-burger"
        }
    ];

    const state = {
        user: null,
        users: [],
        restaurants: [],
        orders: [],
        addresses: [],
        cart: null,
        activeView: "home",
        selectedRestaurantId: null,
        trackingOrderId: null,
        filters: {
            category: "all",
            search: ""
        },
        postAuthAction: null
    };

    let mainEl;
    let cartDrawerEl;
    let cartBackdropEl;
    let cartItemsEl;
    let cartSummaryEl;
    let cartEmptyEl;
    let authModalEl;
    let authLoginFormEl;
    let authSignupFormEl;
    let loginBtnEl;
    let userMenuEl;
    let userMenuTriggerEl;
    let userMenuDropdownEl;
    let mobileToggleEl;
    let mobileNavEl;
    let toastContainerEl;
    let footerYearEl;
    let trackOrderHeaderBtnEl;
    let cartButtonEl;

    let checkoutMap = null;
    let checkoutMarker = null;

    function loadJSON(key, fallback) {
        try {
            const raw = window.localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        try {
            if (value === undefined) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch {
            // ignore storage errors in demo
        }
    }

    function createId(prefix) {
        return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function toCurrency(amount) {
        return `${amount.toFixed(2)}`;
    }

    function findRestaurant(id) {
        return state.restaurants.find(r => r.id === id) || null;
    }

    function getUserAddresses() {
        if (!state.user) return [];
        return state.addresses.filter(a => a.userId === state.user.id);
    }

    function persistAll() {
        saveJSON(STORAGE_KEYS.users, state.users);
        saveJSON(STORAGE_KEYS.restaurants, state.restaurants);
        saveJSON(STORAGE_KEYS.orders, state.orders);
        saveJSON(STORAGE_KEYS.addresses, state.addresses);
        if (state.cart) {
            saveJSON(STORAGE_KEYS.cart, state.cart);
        } else {
            saveJSON(STORAGE_KEYS.cart, null);
        }
        if (state.user) {
            saveJSON(STORAGE_KEYS.session, { userId: state.user.id });
        } else {
            saveJSON(STORAGE_KEYS.session, null);
        }
    }

    function loadInitialState() {
        const storedUsers = loadJSON(STORAGE_KEYS.users, []);
        const byEmail = new Map(storedUsers.map(u => [u.email.toLowerCase(), u]));
        let changedUsers = false;

        DEMO_USERS.forEach(demo => {
            const existing = byEmail.get(demo.email.toLowerCase());
            if (!existing) {
                storedUsers.push({ ...demo });
                changedUsers = true;
            }
        });

        if (changedUsers) {
            saveJSON(STORAGE_KEYS.users, storedUsers);
        }
        state.users = storedUsers;

        const storedRestaurants = loadJSON(STORAGE_KEYS.restaurants, []);
        if (Array.isArray(storedRestaurants) && storedRestaurants.length) {
            state.restaurants = storedRestaurants;
        } else {
            state.restaurants = DEMO_RESTAURANTS;
            saveJSON(STORAGE_KEYS.restaurants, state.restaurants);
        }

        state.orders = loadJSON(STORAGE_KEYS.orders, []);
        state.addresses = loadJSON(STORAGE_KEYS.addresses, []);
        state.cart = loadJSON(STORAGE_KEYS.cart, null);

        const session = loadJSON(STORAGE_KEYS.session, null);
        if (session && session.userId) {
            const existing = state.users.find(u => u.id === session.userId);
            if (existing) {
                state.user = existing;
            }
        }
    }

    function initDomRefs() {
        mainEl = document.getElementById("main-content");
        cartDrawerEl = document.getElementById("cart-drawer");
        cartBackdropEl = document.getElementById("cart-backdrop");
        cartItemsEl = document.getElementById("cart-items");
        cartSummaryEl = document.getElementById("cart-summary");
        cartEmptyEl = document.getElementById("cart-empty");
        authModalEl = document.getElementById("auth-modal");
        authLoginFormEl = document.getElementById("login-form");
        authSignupFormEl = document.getElementById("signup-form");
        loginBtnEl = document.getElementById("login-btn");
        userMenuEl = document.getElementById("user-menu");
        userMenuTriggerEl = document.getElementById("user-menu-trigger");
        userMenuDropdownEl = document.getElementById("user-menu-dropdown");
        mobileToggleEl = document.getElementById("mobile-menu-toggle");
        mobileNavEl = document.getElementById("mobile-nav");
        toastContainerEl = document.getElementById("toast-container");
        footerYearEl = document.getElementById("footer-year");
        trackOrderHeaderBtnEl = document.getElementById("track-order-header-btn");
        cartButtonEl = document.getElementById("cart-btn");
    }

    function showToast(message, type) {
        if (!toastContainerEl) return;
        const toastEl = document.createElement("div");
        toastEl.className = "toast" + (type === "error" ? " toast--error" : type === "success" ? " toast--success" : "");
        toastEl.textContent = message;
        toastContainerEl.appendChild(toastEl);
        setTimeout(() => {
            toastEl.style.opacity = "0";
            toastEl.style.transform = "translateY(4px)";
        }, 2600);
        setTimeout(() => {
            toastEl.remove();
        }, 3200);
    }

    function updateHeaderAuthUI() {
        const nameEl = document.getElementById("user-menu-name");
        if (!loginBtnEl || !userMenuEl || !nameEl) return;

        if (!state.user) {
            loginBtnEl.classList.remove("hidden");
            userMenuEl.classList.add("hidden");
            nameEl.textContent = "Guest";
        } else {
            loginBtnEl.classList.add("hidden");
            userMenuEl.classList.remove("hidden");
            const firstName = state.user.name ? state.user.name.split(" ")[0] : "Account";
            nameEl.textContent = firstName;
        }
    }

    function updateCartUI() {
        const countEl = document.getElementById("cart-count");
        let totalQty = 0;
        if (state.cart && Array.isArray(state.cart.items)) {
            totalQty = state.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
        if (countEl) {
            countEl.textContent = String(totalQty);
        }

        if (!cartDrawerEl) return;
        if (!state.cart || !state.cart.items || state.cart.items.length === 0) {
            cartEmptyEl && cartEmptyEl.classList.remove("hidden");
            cartItemsEl && cartItemsEl.classList.add("hidden");
            cartSummaryEl && cartSummaryEl.classList.add("hidden");
            return;
        }

        if (!cartItemsEl || !cartSummaryEl) return;
        cartEmptyEl && cartEmptyEl.classList.add("hidden");
        cartItemsEl.classList.remove("hidden");
        cartSummaryEl.classList.remove("hidden");

        const restaurant = findRestaurant(state.cart.restaurantId);
        const itemsHtml = state.cart.items.map(item => {
            const price = toCurrency(item.price * item.quantity);
            return `
                <div class="cart-item" data-cart-item-id="${item.id}">
                    <div class="cart-item__info">
                        <div class="cart-item__name">${item.name}</div>
                        <div class="cart-item__meta">${restaurant ? restaurant.name : ""}</div>
                    </div>
                    <div class="cart-item__controls">
                        <div class="cart-item__price">${price}</div>
                        <div class="quantity-input">
                            <button type="button" data-qty-change="-1">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-qty-change="1">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        cartItemsEl.innerHTML = itemsHtml;

        const subtotal = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
        const total = subtotal + deliveryFee;

        cartSummaryEl.innerHTML = `
            <div class="cart-summary__row">
                <span class="cart-summary__label">Subtotal</span>
                <span>${toCurrency(subtotal)}</span>
            </div>
            <div class="cart-summary__row">
                <span class="cart-summary__label">Delivery fee</span>
                <span>${toCurrency(deliveryFee)}</span>
            </div>
            <div class="cart-summary__row">
                <span class="cart-summary__label">Order total</span>
                <span class="cart-summary__value--strong">${toCurrency(total)}</span>
            </div>
        `;
    }

    function openCartDrawer() {
        if (!cartDrawerEl || !cartBackdropEl) return;
        cartDrawerEl.classList.remove("hidden");
        cartDrawerEl.classList.add("open");
        cartBackdropEl.classList.remove("hidden");
        cartBackdropEl.classList.add("visible");
        updateCartUI();
    }

    function closeCartDrawer() {
        if (!cartDrawerEl || !cartBackdropEl) return;
        cartDrawerEl.classList.remove("open");
        cartBackdropEl.classList.remove("visible");
        setTimeout(() => {
            cartDrawerEl.classList.add("hidden");
            cartBackdropEl.classList.add("hidden");
        }, 220);
    }

    function recalcCartTotals() {
        if (!state.cart || !state.cart.items) return;
        const restaurant = findRestaurant(state.cart.restaurantId);
        const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
        const subtotal = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        state.cart.subtotal = subtotal;
        state.cart.deliveryFee = deliveryFee;
        state.cart.total = subtotal + deliveryFee;
    }

    function ensureCartForRestaurant(restaurantId) {
        if (!state.cart || state.cart.restaurantId !== restaurantId) {
            state.cart = {
                restaurantId,
                items: []
            };
        }
    }

    function addItemToCart(restaurantId, menuItem, quantity) {
        const qty = quantity || 1;
        if (!menuItem) return;

        if (state.cart && state.cart.restaurantId && state.cart.restaurantId !== restaurantId) {
            const confirmSwitch = window.confirm("Your cart contains items from a different restaurant. Start a new order?");
            if (!confirmSwitch) return;
            state.cart = null;
        }

        ensureCartForRestaurant(restaurantId);
        const existing = state.cart.items.find(i => i.menuItemId === menuItem.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            state.cart.items.push({
                id: createId("cartItem"),
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: qty
            });
        }

        state.cart.items = state.cart.items.filter(i => i.quantity > 0);
        if (!state.cart.items.length) {
            state.cart = null;
        }
        if (state.cart) {
            recalcCartTotals();
        }
        saveJSON(STORAGE_KEYS.cart, state.cart);
        updateCartUI();
        showToast(`${menuItem.name} added to cart`, "success");
    }

    function handleCartItemQtyChange(event) {
        const button = event.target.closest("button[data-qty-change]");
        if (!button || !state.cart || !state.cart.items) return;
        const change = parseInt(button.getAttribute("data-qty-change"), 10) || 0;
        const itemEl = button.closest(".cart-item");
        if (!itemEl) return;
        const id = itemEl.getAttribute("data-cart-item-id");
        const item = state.cart.items.find(i => i.id === id);
        if (!item) return;
        item.quantity += change;
        if (item.quantity <= 0) {
            state.cart.items = state.cart.items.filter(i => i.id !== id);
        }
        if (!state.cart.items.length) {
            state.cart = null;
        }
        if (state.cart) {
            recalcCartTotals();
        }
        saveJSON(STORAGE_KEYS.cart, state.cart);
        updateCartUI();
    }

    function requireAuth(view, options) {
        if (state.user) return true;
        state.postAuthAction = view ? { view, options: options || {} } : null;
        openAuthModal("login");
        return false;
    }

    function openAuthModal(initialTab) {
        if (!authModalEl) return;
        authModalEl.classList.remove("hidden");
        setAuthTab(initialTab || "login");
    }

    function closeAuthModal() {
        if (!authModalEl) return;
        authModalEl.classList.add("hidden");
    }

    function setAuthTab(tab) {
        const loginFormVisible = tab === "login";
        if (authLoginFormEl && authSignupFormEl) {
            if (loginFormVisible) {
                authLoginFormEl.classList.remove("hidden");
                authSignupFormEl.classList.add("hidden");
            } else {
                authSignupFormEl.classList.remove("hidden");
                authLoginFormEl.classList.add("hidden");
            }
        }
        const tabs = authModalEl ? authModalEl.querySelectorAll(".modal__tab") : [];
        tabs.forEach(button => {
            const value = button.getAttribute("data-auth-tab");
            if (value === tab) {
                button.classList.add("modal__tab--active");
                button.setAttribute("aria-selected", "true");
            } else {
                button.classList.remove("modal__tab--active");
                button.setAttribute("aria-selected", "false");
            }
        });
    }

    function handleLoginSubmit(event) {
        event.preventDefault();
        if (!authLoginFormEl) return;

        const email = authLoginFormEl.email.value.trim().toLowerCase();
        const password = authLoginFormEl.password.value;

        const user = state.users.find(u => u.email.toLowerCase() === email && u.password === password);
        if (!user) {
            showToast("Incorrect email or password.", "error");
            return;
        }

        state.user = user;
        saveJSON(STORAGE_KEYS.session, { userId: user.id });
        updateHeaderAuthUI();
        closeAuthModal();
        showToast(`Welcome back, ${user.name.split(" ")[0]}!`, "success");

        if (state.postAuthAction) {
            const { view, options } = state.postAuthAction;
            state.postAuthAction = null;
            setActiveView(view, options);
        }
    }

    function handleSignupSubmit(event) {
        event.preventDefault();
        if (!authSignupFormEl) return;

        const name = authSignupFormEl.name.value.trim();
        const emailRaw = authSignupFormEl.email.value.trim();
        const password = authSignupFormEl.password.value;

        const email = emailRaw.toLowerCase();
        if (!name || !email || !password) return;

        const existing = state.users.find(u => u.email.toLowerCase() === email);
        if (existing) {
            showToast("An account with this email already exists.", "error");
            return;
        }

        const user = {
            id: createId("user"),
            name,
            email,
            password,
            role: "customer"
        };

        state.users.push(user);
        state.user = user;
        persistAll();
        updateHeaderAuthUI();
        closeAuthModal();
        showToast("Account created. You're logged in.", "success");

        if (state.postAuthAction) {
            const { view, options } = state.postAuthAction;
            state.postAuthAction = null;
            setActiveView(view, options);
        }
    }

    function logout() {
        state.user = null;
        saveJSON(STORAGE_KEYS.session, null);
        updateHeaderAuthUI();
        showToast("Signed out.", "success");
        setActiveView("home");
    }

    function setNavActive(view) {
        const desktopLinks = document.querySelectorAll(".app-nav .nav-link");
        desktopLinks.forEach(btn => {
            const target = btn.getAttribute("data-view");
            if (target === view) {
                btn.classList.add("nav-link--active");
            } else {
                btn.classList.remove("nav-link--active");
            }
        });
    }

    function renderRestaurantCards(restaurants) {
        if (!restaurants.length) {
            return `<p style="font-size:0.9rem;color:var(--qb-text-muted);margin-top:4px;">No restaurants match your filters yet.</p>`;
        }
        return `
            <div class="restaurant-grid">
                ${restaurants.map(rest => `
                    <article class="restaurant-card" data-restaurant-id="${rest.id}">
                        <div class="restaurant-card__image">
                            <img src="${rest.image}" alt="${rest.name}">
                            <div class="restaurant-card__pill">${rest.category}</div>
                        </div>
                        <div class="restaurant-card__body">
                            <div class="restaurant-card__name">${rest.name}</div>
                            <div class="restaurant-card__meta">
                                <span>⭐ ${rest.rating.toFixed(1)} (${rest.ratingCount})</span>
                                <span>•</span>
                                <span>${rest.eta}</span>
                                <span>•</span>
                                <span>${toCurrency(rest.deliveryFee)} fee</span>
                            </div>
                            <div class="restaurant-card__tags">
                                ${rest.cuisines.join(" • ")}
                            </div>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }

    function renderHomeView() {
        const featured = state.restaurants.filter(r => r.isFeatured).slice(0, 6);
        const heroRestaurant = featured[0] || state.restaurants[0];

        const heroCard = heroRestaurant ? `
            <div class="hero-visual__card">
                <div class="hero-visual__image">
                    <img src="${heroRestaurant.image}" alt="${heroRestaurant.name} restaurant">
                </div>
                <div class="hero-visual__body">
                    <div class="hero-visual__title">${heroRestaurant.name}</div>
                    <div class="hero-visual__meta">
                        <span class="hero-visual__badge">⭐ ${heroRestaurant.rating.toFixed(1)}</span>
                        <span class="hero-visual__badge">${heroRestaurant.eta}</span>
                        <span class="hero-visual__badge">${heroRestaurant.category}</span>
                    </div>
                    <div class="hero-visual__footer">
                        <span>From ${toCurrency(heroRestaurant.menu[0]?.price || 8)}</span>
                        <button class="btn btn-outline btn-outline--sm" type="button" data-hero-open-restaurant="${heroRestaurant.id}">View menu</button>
                    </div>
                </div>
            </div>
        ` : "";

        mainEl.innerHTML = `
            <section class="hero">
                <div>
                    <p class="hero__eyebrow">DELIVERY IN UNDER 30 MIN</p>
                    <h1 class="hero__title">
                        Food delivery that <span>feels crafted</span> around you.
                    </h1>
                    <p class="hero__subtitle">
                        Browse curated local restaurants, build your perfect order, and watch it move to your door in real time.
                    </p>
                    <div class="hero__search">
                        <input id="hero-search-input" class="hero__search-input" type="search" placeholder="Search restaurants or cuisines">
                        <button id="hero-search-button" class="btn btn-primary" type="button">Find food</button>
                    </div>
                    <div class="hero__meta">
                        <div class="hero__meta-pill">
                            <span>⏱</span>
                            <span><strong>20–35 min</strong> average delivery</span>
                        </div>
                        <div class="hero__meta-pill">
                            <span>⭐</span>
                            <span><strong>4.7</strong> average rating</span>
                        </div>
                    </div>
                </div>
                <div class="hero-visual">
                    ${heroCard}
                </div>
            </section>

            <section class="section-block" aria-label="Featured restaurants">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">Featured nearby</h2>
                        <p class="section-block__subtitle">Popular picks from local favorites.</p>
                    </div>
                    <button type="button" class="btn btn-outline" id="home-view-all">View all</button>
                </div>
                ${renderRestaurantCards(featured)}
            </section>
        `;

        const heroSearchInput = document.getElementById("hero-search-input");
        const heroSearchButton = document.getElementById("hero-search-button");
        if (heroSearchButton && heroSearchInput) {
            heroSearchButton.addEventListener("click", () => {
                state.filters.search = heroSearchInput.value.trim();
                state.filters.category = "all";
                setActiveView("restaurants");
            });
            heroSearchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    state.filters.search = heroSearchInput.value.trim();
                    state.filters.category = "all";
                    setActiveView("restaurants");
                }
            });
        }

        const viewAllBtn = document.getElementById("home-view-all");
        if (viewAllBtn) {
            viewAllBtn.addEventListener("click", () => {
                state.filters.category = "all";
                setActiveView("restaurants");
            });
        }

        mainEl.querySelectorAll("[data-restaurant-id]").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-restaurant-id");
                if (id) {
                    setActiveView("restaurant-detail", { restaurantId: id });
                }
            });
        });

        const heroOpenBtn = mainEl.querySelector("[data-hero-open-restaurant]");
        if (heroOpenBtn) {
            heroOpenBtn.addEventListener("click", () => {
                const id = heroOpenBtn.getAttribute("data-hero-open-restaurant");
                if (id) {
                    setActiveView("restaurant-detail", { restaurantId: id });
                }
            });
        }
    }

    function applyRestaurantFilters(restaurants) {
        let result = [...restaurants];
        if (state.filters.category && state.filters.category !== "all") {
            result = result.filter(r => r.category.toLowerCase() === state.filters.category.toLowerCase());
        }
        if (state.filters.search) {
            const q = state.filters.search.toLowerCase();
            result = result.filter(r =>
                r.name.toLowerCase().includes(q) ||
                r.cuisines.some(c => c.toLowerCase().includes(q))
            );
        }
        return result;
    }

    function renderRestaurantsView() {
        const filtered = applyRestaurantFilters(state.restaurants);

        mainEl.innerHTML = `
            <section class="section-block" aria-label="All restaurants">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">Restaurants</h2>
                        <p class="section-block__subtitle">
                            Choose from fast food, healthy bowls, desserts and more.
                        </p>
                    </div>
                </div>
                <div class="filter-bar">
                    ${["all", "Fast Food", "Healthy", "Desserts"].map(cat => {
                        const value = cat === "all" ? "all" : cat;
                        const label = cat === "all" ? "All" : cat;
                        const active = state.filters.category.toLowerCase() === value.toLowerCase();
                        return `<button type="button" class="filter-chip${active ? " filter-chip--active" : ""}" data-category="${value}">${label}</button>`;
                    }).join("")}
                </div>
                <div class="hero__search" style="margin-bottom:10px;">
                    <input id="restaurants-search-input" class="hero__search-input" type="search" placeholder="Search by restaurant or cuisine" value="${state.filters.search || ""}">
                    <button id="restaurants-search-button" class="btn btn-outline btn-outline--sm" type="button">Search</button>
                    <button id="restaurants-clear-button" class="btn btn-ghost btn-outline--sm" type="button">Clear</button>
                </div>
                ${renderRestaurantCards(filtered)}
            </section>
        `;

        mainEl.querySelectorAll(".filter-chip").forEach(btn => {
            btn.addEventListener("click", () => {
                const cat = btn.getAttribute("data-category") || "all";
                state.filters.category = cat;
                renderRestaurantsView();
            });
        });

        const searchInput = document.getElementById("restaurants-search-input");
        const searchBtn = document.getElementById("restaurants-search-button");
        const clearBtn = document.getElementById("restaurants-clear-button");
        if (searchBtn && searchInput) {
            searchBtn.addEventListener("click", () => {
                state.filters.search = searchInput.value.trim();
                renderRestaurantsView();
            });
            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    state.filters.search = searchInput.value.trim();
                    renderRestaurantsView();
                }
            });
        }
        if (clearBtn && searchInput) {
            clearBtn.addEventListener("click", () => {
                state.filters.search = "";
                searchInput.value = "";
                renderRestaurantsView();
            });
        }

        mainEl.querySelectorAll("[data-restaurant-id]").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-restaurant-id");
                if (id) {
                    setActiveView("restaurant-detail", { restaurantId: id });
                }
            });
        });
    }

    function renderRestaurantDetailView() {
        const id = state.selectedRestaurantId;
        const restaurant = id ? findRestaurant(id) : null;

        if (!restaurant) {
            mainEl.innerHTML = `
                <section class="section-block">
                    <p style="font-size:0.9rem;color:var(--qb-text-muted);margin-bottom:10px;">Restaurant not found.</p>
                    <button class="btn btn-outline" type="button" data-view="restaurants">Back to restaurants</button>
                </section>
            `;
            const backBtn = mainEl.querySelector("[data-view='restaurants']");
            backBtn && backBtn.addEventListener("click", () => setActiveView("restaurants"));
            return;
        }

        const groupedByCategory = restaurant.menu.reduce((acc, item) => {
            const cat = item.category || "Menu";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});

        const categoriesHtml = Object.keys(groupedByCategory).map(category => {
            const items = groupedByCategory[category];
            return `
                <section class="section-block" aria-label="${category}">
                    <div class="section-block__header">
                        <div>
                            <h3 class="section-block__title">${category}</h3>
                        </div>
                    </div>
                    <div class="restaurant-grid">
                        ${items.map(item => `
                            <article class="restaurant-card" data-menu-item-id="${item.id}" data-restaurant-id="${restaurant.id}">
                                <div class="restaurant-card__image">
                                    <img src="${item.image || restaurant.image}" alt="${item.name}">
                                    ${item.isPopular ? `<div class="restaurant-card__pill">Popular</div>` : ""}
                                </div>
                                <div class="restaurant-card__body">
                                    <div class="restaurant-card__name">${item.name}</div>
                                    <div class="restaurant-card__tags">${item.description}</div>
                                    <div class="restaurant-card__meta">
                                        <span>${toCurrency(item.price)}</span>
                                        <span>•</span>
                                        <button class="btn btn-outline btn-outline--sm" type="button" data-add-to-cart="${item.id}">Add</button>
                                    </div>
                                </div>
                            </article>
                        `).join("")}
                    </div>
                </section>
            `;
        }).join("");

        mainEl.innerHTML = `
            <section class="section-block">
                <button type="button" class="btn btn-ghost btn-outline--sm" id="restaurant-back-btn">← All restaurants</button>
                <div class="hero" style="padding-top:18px;padding-bottom:8px;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:20px;">
                    <div>
                        <h2 class="section-block__title" style="font-size:1.4rem;">${restaurant.name}</h2>
                        <p class="section-block__subtitle" style="margin-bottom:8px;">${restaurant.tagline}</p>
                        <div class="hero__meta" style="margin-bottom:6px;">
                            <div class="hero__meta-pill">
                                <span>⭐</span>
                                <span><strong>${restaurant.rating.toFixed(1)}</strong> (${restaurant.ratingCount} reviews)</span>
                            </div>
                            <div class="hero__meta-pill">
                                <span>⏱</span>
                                <span>${restaurant.eta}</span>
                            </div>
                            <div class="hero__meta-pill">
                                <span>🚚</span>
                                <span>${toCurrency(restaurant.deliveryFee)} delivery</span>
                            </div>
                        </div>
                        <div class="chip-row">
                            ${restaurant.cuisines.map(c => `<span class="chip">${c}</span>`).join("")}
                        </div>
                    </div>
                    <div class="hero-visual">
                        <div class="hero-visual__card">
                            <div class="hero-visual__image">
                                <img src="${restaurant.image}" alt="${restaurant.name} hero">
                            </div>
                            <div class="hero-visual__body">
                                <div class="hero-visual__title">${restaurant.name}</div>
                                <div class="hero-visual__meta">
                                    <span class="hero-visual__badge">${restaurant.category}</span>
                                    <span class="hero-visual__badge">${restaurant.eta}</span>
                                </div>
                                <div class="hero-visual__footer">
                                    <span>From ${toCurrency(restaurant.menu[0]?.price || 8)}</span>
                                    <button class="btn btn-primary btn-outline--sm" type="button" id="restaurant-open-cart">
                                        View cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${categoriesHtml}
            </section>
        `;

        const backBtn = document.getElementById("restaurant-back-btn");
        if (backBtn) {
            backBtn.addEventListener("click", () => setActiveView("restaurants"));
        }

        const openCartBtn = document.getElementById("restaurant-open-cart");
        if (openCartBtn) {
            openCartBtn.addEventListener("click", () => openCartDrawer());
        }

        mainEl.querySelectorAll("[data-add-to-cart]").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const itemId = button.getAttribute("data-add-to-cart");
                const menuItem = restaurant.menu.find(m => m.id === itemId);
                addItemToCart(restaurant.id, menuItem, 1);
            });
        });
    }

    function initCheckoutMap(selectedAddress) {
        const mapEl = document.getElementById("checkout-map");
        if (!mapEl) return;
        if (typeof window.L === "undefined") {
            mapEl.innerHTML = "<p style='font-size:0.8rem;color:var(--qb-text-muted);padding:8px;'>Map is unavailable (Leaflet not loaded).</p>";
            return;
        }
        const fallbackCenter = [37.7749, -122.4194];
        const center = selectedAddress && typeof selectedAddress.lat === "number" && typeof selectedAddress.lng === "number"
            ? [selectedAddress.lat, selectedAddress.lng]
            : fallbackCenter;

        if (checkoutMap) {
            checkoutMap.setView(center, 13);
            if (checkoutMarker) {
                checkoutMarker.setLatLng(center);
            } else {
                checkoutMarker = window.L.marker(center, { draggable: true }).addTo(checkoutMap);
            }
        } else {
            checkoutMap = window.L.map(mapEl).setView(center, 13);
            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap"
            }).addTo(checkoutMap);
            checkoutMarker = window.L.marker(center, { draggable: true }).addTo(checkoutMap);
        }

        checkoutMarker.on("dragend", () => {
            const pos = checkoutMarker.getLatLng();
            const latInput = document.getElementById("address-latitude");
            const lngInput = document.getElementById("address-longitude");
            if (latInput && lngInput) {
                latInput.value = pos.lat.toFixed(6);
                lngInput.value = pos.lng.toFixed(6);
            }
        });

        const locateBtn = document.getElementById("checkout-locate-me");
        if (locateBtn) {
            locateBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!navigator.geolocation) {
                    showToast("Geolocation not supported in this browser.", "error");
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords = [position.coords.latitude, position.coords.longitude];
                        checkoutMap.setView(coords, 14);
                        checkoutMarker.setLatLng(coords);
                        const latInput = document.getElementById("address-latitude");
                        const lngInput = document.getElementById("address-longitude");
                        if (latInput && lngInput) {
                            latInput.value = coords[0].toFixed(6);
                            lngInput.value = coords[1].toFixed(6);
                        }
                    },
                    () => {
                        showToast("Unable to get your location.", "error");
                    }
                );
            });
        }
    }

    function renderCheckoutView() {
        if (!state.cart || !state.cart.items || !state.cart.items.length) {
            mainEl.innerHTML = `
                <section class="section-block">
                    <h2 class="section-block__title">Your cart is empty</h2>
                    <p class="section-block__subtitle">Add items from a restaurant to start checkout.</p>
                    <button type="button" class="btn btn-primary" data-view="restaurants">Browse restaurants</button>
                </section>
            `;
            const btn = mainEl.querySelector("[data-view='restaurants']");
            btn && btn.addEventListener("click", () => setActiveView("restaurants"));
            return;
        }

        if (!state.user) {
            if (!requireAuth("checkout")) return;
        }

        const restaurant = findRestaurant(state.cart.restaurantId);
        const addresses = getUserAddresses();
        const selectedAddress = addresses[0] || null;

        const addressListHtml = addresses.length
            ? `
                <div class="address-list">
                    ${addresses.map(addr => `
                        <label class="address-card">
                            <input class="address-card__radio" type="radio" name="checkout-address" value="${addr.id}" ${selectedAddress && addr.id === selectedAddress.id ? "checked" : ""}>
                            <div>
                                <div class="address-card__label">${addr.label}</div>
                                <div class="address-card__meta">${addr.line1}${addr.city ? ", " + addr.city : ""}</div>
                            </div>
                        </label>
                    `).join("")}
                </div>
            `
            : `<p style="font-size:0.8rem;color:var(--qb-text-muted);margin-bottom:6px;">Add a delivery address to place your order.</p>`;

        const cartItemsHtml = state.cart.items.map(item => `
            <div class="cart-item">
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__meta">x${item.quantity}</div>
                </div>
                <div class="cart-item__price">${toCurrency(item.price * item.quantity)}</div>
            </div>
        `).join("");

        const subtotal = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
        const total = subtotal + deliveryFee;

        mainEl.innerHTML = `
            <section class="section-block">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">Checkout</h2>
                        <p class="section-block__subtitle">Confirm your details and place your order.</p>
                    </div>
                </div>
                <div class="checkout-layout">
                    <div class="checkout-main">
                        <section class="checkout-section">
                            <h3 class="checkout-section__title">Delivery address</h3>
                            <p class="checkout-section__subtitle">Choose an existing address or add a new one.</p>
                            ${addressListHtml}
                            <form id="checkout-address-form" class="auth-form" autocomplete="on">
                                <div class="form-group">
                                    <label for="address-label">Label (Home, Work, etc.)</label>
                                    <input id="address-label" name="label" type="text" placeholder="Home">
                                </div>
                                <div class="form-group">
                                    <label for="address-line1">Street & number</label>
                                    <input id="address-line1" name="line1" type="text" placeholder="123 Market St" required>
                                </div>
                                <div class="form-group">
                                    <label for="address-city">City</label>
                                    <input id="address-city" name="city" type="text" placeholder="San Francisco">
                                </div>
                                <input id="address-latitude" type="hidden" name="latitude">
                                <input id="address-longitude" type="hidden" name="longitude">
                                <button type="submit" class="btn btn-ghost btn-ghost--full">Save address</button>
                            </form>
                            <div class="checkout-map-wrapper">
                                <p class="checkout-section__subtitle" style="margin-top:10px;margin-bottom:6px;">Adjust the pin to your exact location.</p>
                                <div id="checkout-map" class="checkout-map"></div>
                                <button id="checkout-locate-me" class="btn btn-outline btn-outline--sm" type="button" style="margin-top:6px;">Use my location</button>
                            </div>
                        </section>
                        <section class="checkout-section">
                            <h3 class="checkout-section__title">Payment</h3>
                            <p class="checkout-section__subtitle">Select how you'd like to pay.</p>
                            <div class="payment-methods">
                                <label class="payment-method payment-method--selected">
                                    <input type="radio" name="payment-method" value="card" checked style="margin-right:6px;">
                                    <span>Credit / debit card</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="payment-method" value="wallet" style="margin-right:6px;">
                                    <span>Digital wallet</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="payment-method" value="cod" style="margin-right:6px;">
                                    <span>Cash on delivery</span>
                                </label>
                            </div>
                            <div class="auth-form" id="payment-details-card">
                                <div class="form-group">
                                    <label for="card-number">Card number</label>
                                    <input id="card-number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242">
                                </div>
                                <div class="form-group">
                                    <label for="card-exp">Expiry</label>
                                    <input id="card-exp" type="text" placeholder="MM/YY" autocomplete="cc-exp">
                                </div>
                            </div>
                        </section>
                    </div>
                    <aside class="checkout-summary">
                        <h3 class="checkout-section__title">Order summary</h3>
                        <p class="checkout-section__subtitle">${restaurant ? restaurant.name : ""}</p>
                        <div>${cartItemsHtml}</div>
                        <div class="cart-summary" style="margin-top:10px;">
                            <div class="cart-summary__row">
                                <span class="cart-summary__label">Subtotal</span>
                                <span>${toCurrency(subtotal)}</span>
                            </div>
                            <div class="cart-summary__row">
                                <span class="cart-summary__label">Delivery</span>
                                <span>${toCurrency(deliveryFee)}</span>
                            </div>
                            <div class="cart-summary__row">
                                <span class="cart-summary__label">Total</span>
                                <span class="cart-summary__value--strong">${toCurrency(total)}</span>
                            </div>
                        </div>
                        <button id="place-order-btn" class="btn btn-primary btn-primary--full" type="button" style="margin-top:10px;">
                            Place order
                        </button>
                        <p class="checkout-section__subtitle" style="margin-top:6px;">
                            Payments and addresses are stored locally in this demo. Integrate your gateway & backend for production.
                        </p>
                    </aside>
                </div>
            </section>
        `;

        checkoutMap = null;
        checkoutMarker = null;
        initCheckoutMap(selectedAddress);

        const addressForm = document.getElementById("checkout-address-form");
        if (addressForm) {
            addressForm.addEventListener("submit", (e) => {
                e.preventDefault();
                if (!state.user) {
                    requireAuth("checkout");
                    return;
                }
                const label = addressForm.label.value.trim() || "Home";
                const line1 = addressForm.line1.value.trim();
                if (!line1) {
                    showToast("Please provide a street and number.", "error");
                    return;
                }
                const city = addressForm.city.value.trim();
                const lat = parseFloat(addressForm.latitude.value) || null;
                const lng = parseFloat(addressForm.longitude.value) || null;
                const address = {
                    id: createId("addr"),
                    userId: state.user.id,
                    label,
                    line1,
                    city,
                    lat,
                    lng
                };
                state.addresses.push(address);
                saveJSON(STORAGE_KEYS.addresses, state.addresses);
                showToast("Address saved.", "success");
                renderCheckoutView();
            });
        }

        const addressRadios = mainEl.querySelectorAll("input[name='checkout-address']");
        addressRadios.forEach(radio => {
            radio.addEventListener("change", () => {
                const selectedId = radio.value;
                const addr = getUserAddresses().find(a => a.id === selectedId);
                initCheckoutMap(addr || null);
            });
        });

        const paymentMethodInputs = mainEl.querySelectorAll("input[name='payment-method']");
        paymentMethodInputs.forEach(input => {
            input.addEventListener("change", () => {
                const cards = mainEl.querySelectorAll(".payment-method");
                cards.forEach(card => {
                    card.classList.remove("payment-method--selected");
                });
                const card = input.closest(".payment-method");
                if (card) card.classList.add("payment-method--selected");
            });
        });

        const placeOrderBtn = document.getElementById("place-order-btn");
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener("click", () => {
                placeOrderFromCheckout();
            });
        }
    }

    function placeOrderFromCheckout() {
        if (!state.cart || !state.cart.items || !state.cart.items.length) {
            showToast("Your cart is empty.", "error");
            return;
        }
        if (!state.user) {
            requireAuth("checkout");
            return;
        }

        const restaurant = findRestaurant(state.cart.restaurantId);
        const addressRadio = document.querySelector("input[name='checkout-address']:checked");
        const addresses = getUserAddresses();
        const selectedAddress = addressRadio ? addresses.find(a => a.id === addressRadio.value) : null;

        if (!selectedAddress) {
            showToast("Please select or add a delivery address.", "error");
            return;
        }

        const paymentMethodInput = document.querySelector("input[name='payment-method']:checked");
        const paymentMethod = paymentMethodInput ? paymentMethodInput.value : "card";

        const orderId = createId("order");
        const now = new Date();
        const subtotal = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
        const total = subtotal + deliveryFee;

        const order = {
            id: orderId,
            userId: state.user.id,
            restaurantId: state.cart.restaurantId,
            items: state.cart.items.map(i => ({ ...i })),
            subtotal,
            deliveryFee,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "PENDING" : "PAID",
            status: "PLACED",
            statusTimeline: [
                { status: "PLACED", at: now.toISOString(), by: "customer" }
            ],
            createdAt: now.toISOString(),
            trackingCode: orderId
        };

        state.orders.push(order);
        state.trackingOrderId = order.id;
        state.cart = null;
        persistAll();
        updateCartUI();
        showToast("Order placed. Tracking started.", "success");
        simulateOrderLifecycle(order.id);
        setActiveView("track-order", { orderId: order.id });
    }

    function simulateOrderLifecycle(orderId) {
        const steps = [
            { status: "ACCEPTED", delayMs: 8000 },
            { status: "PREPARING", delayMs: 16000 },
            { status: "OUT_FOR_DELIVERY", delayMs: 36000 },
            { status: "DELIVERED", delayMs: 52000 }
        ];

        let accumulated = 0;
        steps.forEach(step => {
            accumulated += step.delayMs;
            setTimeout(() => {
                const order = state.orders.find(o => o.id === orderId);
                if (!order) return;
                const currentIndex = ORDER_STATUSES.indexOf(order.status);
                const stepIndex = ORDER_STATUSES.indexOf(step.status);
                if (stepIndex <= currentIndex) return;

                order.status = step.status;
                order.statusTimeline.push({
                    status: step.status,
                    at: new Date().toISOString(),
                    by: "system"
                });
                saveJSON(STORAGE_KEYS.orders, state.orders);
                if (state.activeView === "track-order" && state.trackingOrderId === orderId) {
                    renderTrackOrderView();
                }
            }, accumulated);
        });
    }

    function renderTrackOrderView() {
        const userOrders = state.user ? state.orders.filter(o => o.userId === state.user.id) : [];
        let selectedOrder = null;

        if (state.trackingOrderId) {
            selectedOrder = state.orders.find(o => o.id === state.trackingOrderId) || null;
        }
        if (!selectedOrder && userOrders.length) {
            selectedOrder = userOrders[userOrders.length - 1];
            state.trackingOrderId = selectedOrder.id;
        }

        const recentHtml = userOrders.length
            ? userOrders.slice(-5).reverse().map(order => {
                const restaurant = findRestaurant(order.restaurantId);
                return `
                    <button type="button" class="address-card" data-select-order-id="${order.id}" style="margin-bottom:4px;">
                        <div>
                            <div class="address-card__label">${restaurant ? restaurant.name : "Order"}</div>
                            <div class="address-card__meta">
                                ${order.id}<br>
                                ${ORDER_STATUSES.indexOf(order.status) >= ORDER_STATUSES.indexOf("DELIVERED") ? "Delivered" : "In progress"} • ${new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </div>
                    </button>
                `;
            }).join("")
            : `<p style="font-size:0.8rem;color:var(--qb-text-muted);">No orders yet. Place an order to start tracking.</p>`;

        const timelineHtml = selectedOrder
            ? (() => {
                const currentIndex = ORDER_STATUSES.indexOf(selectedOrder.status);
                return ORDER_STATUSES.map((status, index) => {
                    const completed = index < currentIndex;
                    const current = index === currentIndex;
                    const label = status === "PLACED" ? "Order placed"
                        : status === "ACCEPTED" ? "Restaurant accepted"
                            : status === "PREPARING" ? "Preparing your food"
                                : status === "OUT_FOR_DELIVERY" ? "Out for delivery"
                                    : "Delivered";
                    const timelineEntry = selectedOrder.statusTimeline.find(e => e.status === status);
                    const meta = timelineEntry ? new Date(timelineEntry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
                    return `
                        <div class="timeline-step ${completed ? "timeline-step--completed" : ""} ${current ? "timeline-step--current" : ""}">
                            <div class="timeline-step__dot"></div>
                            <div class="timeline-step__body">
                                <div class="timeline-step__label">${label}</div>
                                ${meta ? `<div class="timeline-step__meta">${meta}</div>` : ""}
                            </div>
                        </div>
                    `;
                }).join("");
            })()
            : `<p style="font-size:0.85rem;color:var(--qb-text-muted);">Enter your order ID to see its status.</p>`;

        mainEl.innerHTML = `
            <section class="section-block">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">Track your order</h2>
                        <p class="section-block__subtitle">Follow your delivery from the kitchen to your door.</p>
                    </div>
                </div>
                <div class="track-layout">
                    <div class="track-card">
                        <h3 class="track-card__title">Find an order</h3>
                        <p class="track-card__subtitle">Paste your order ID or pick one of your recent orders.</p>
                        <form id="track-search-form" class="auth-form">
                            <div class="form-group">
                                <label for="track-search-input">Order ID</label>
                                <input id="track-search-input" type="text" placeholder="e.g. order_xxx" value="${selectedOrder ? selectedOrder.id : ""}">
                            </div>
                            <button type="submit" class="btn btn-outline btn-outline--sm">Track</button>
                        </form>
                        <h4 class="track-card__title" style="margin-top:12px;font-size:0.9rem;">Recent orders</h4>
                        ${recentHtml}
                    </div>
                    <div class="track-card">
                        <h3 class="track-card__title">Status</h3>
                        ${selectedOrder ? `
                            <p class="track-card__subtitle">
                                Order <strong>${selectedOrder.id}</strong> • ${findRestaurant(selectedOrder.restaurantId)?.name || ""}<br>
                                Current status: <strong>${selectedOrder.status.replace(/_/g, " ").toLowerCase()}</strong>
                            </p>
                            <div class="timeline">
                                ${timelineHtml}
                            </div>
                        ` : `<p class="track-card__subtitle">No order selected yet.</p>`}
                    </div>
                </div>
            </section>
        `;

        const searchForm = document.getElementById("track-search-form");
        const searchInput = document.getElementById("track-search-input");
        if (searchForm && searchInput) {
            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const id = searchInput.value.trim();
                if (!id) return;
                const order = state.orders.find(o => o.id === id);
                if (!order) {
                    showToast("No order found with that ID.", "error");
                    return;
                }
                state.trackingOrderId = order.id;
                renderTrackOrderView();
            });
        }

        mainEl.querySelectorAll("[data-select-order-id]").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-select-order-id");
                state.trackingOrderId = id;
                renderTrackOrderView();
            });
        });
    }

    function renderAdminView() {
        if (!state.user) {
            mainEl.innerHTML = `
                <section class="section-block">
                    <h2 class="section-block__title">Admin / partner dashboard</h2>
                    <p class="section-block__subtitle">Sign in as an admin or restaurant partner to manage orders.</p>
                    <button type="button" class="btn btn-primary" id="admin-login-btn">Login</button>
                </section>
            `;
            const btn = document.getElementById("admin-login-btn");
            btn && btn.addEventListener("click", () => openAuthModal("login"));
            return;
        }
        if (state.user.role !== "admin" && state.user.role !== "partner") {
            mainEl.innerHTML = `
                <section class="section-block">
                    <h2 class="section-block__title">Admin / partner dashboard</h2>
                    <p class="section-block__subtitle">Your account does not have admin or partner permissions.</p>
                </section>
            `;
            return;
        }

        const isAdmin = state.user.role === "admin";
        const relevantOrders = state.user.role === "partner"
            ? state.orders.filter(o => o.restaurantId === state.user.restaurantId)
            : state.orders;

        const totalRevenue = relevantOrders.reduce((sum, o) => sum + o.total, 0);
        const totalOrders = relevantOrders.length;

        mainEl.innerHTML = `
            <section class="section-block">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">${isAdmin ? "Admin" : "Partner"} dashboard</h2>
                        <p class="section-block__subtitle">${isAdmin ? "Manage restaurants, users and orders." : "Review orders for your restaurant and update their status."}</p>
                    </div>
                </div>
                <div class="dashboard">
                    <div class="dashboard__tabs">
                        <button type="button" class="dashboard__tab dashboard__tab--active" data-admin-tab="overview">Overview</button>
                        <button type="button" class="dashboard__tab" data-admin-tab="orders">Orders</button>
                        ${isAdmin ? `<button type="button" class="dashboard__tab" data-admin-tab="restaurants">Restaurants</button>` : ""}
                        ${isAdmin ? `<button type="button" class="dashboard__tab" data-admin-tab="users">Users</button>` : ""}
                    </div>
                    <div id="admin-tab-content">
                        <div class="dashboard__grid">
                            <article class="stat-card">
                                <div class="stat-card__label">Orders</div>
                                <div class="stat-card__value">${totalOrders}</div>
                            </article>
                            <article class="stat-card">
                                <div class="stat-card__label">Revenue</div>
                                <div class="stat-card__value">${toCurrency(totalRevenue)}</div>
                            </article>
                            <article class="stat-card">
                                <div class="stat-card__label">${isAdmin ? "Restaurants" : "Your restaurants"}</div>
                                <div class="stat-card__value">${isAdmin ? state.restaurants.length : 1}</div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        `;

        const tabContentEl = document.getElementById("admin-tab-content");
        const tabs = mainEl.querySelectorAll("[data-admin-tab]");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-admin-tab");
                tabs.forEach(t => t.classList.remove("dashboard__tab--active"));
                tab.classList.add("dashboard__tab--active");
                if (!tabContentEl) return;
                if (target === "orders") {
                    const ordersHtml = relevantOrders.length
                        ? `
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Restaurant</th>
                                        <th>User</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${relevantOrders.slice().reverse().map(o => {
                                        const restaurant = findRestaurant(o.restaurantId);
                                        const user = state.users.find(u => u.id === o.userId);
                                        return `
                                            <tr data-admin-order-id="${o.id}">
                                                <td>${o.id}</td>
                                                <td>${restaurant ? restaurant.name : ""}</td>
                                                <td>${user ? user.email : ""}</td>
                                                <td>${toCurrency(o.total)}</td>
                                                <td>
                                                    <select data-admin-order-status="${o.id}">
                                                        ${ORDER_STATUSES.map(s => `
                                                            <option value="${s}" ${s === o.status ? "selected" : ""}>${s.replace(/_/g, " ")}</option>
                                                        `).join("")}
                                                    </select>
                                                </td>
                                            </tr>
                                        `;
                                    }).join("")}
                                </tbody>
                            </table>
                        `
                        : `<p style="font-size:0.85rem;color:var(--qb-text-muted);">No orders yet.</p>`;
                    tabContentEl.innerHTML = ordersHtml;
                    tabContentEl.querySelectorAll("[data-admin-order-status]").forEach(select => {
                        select.addEventListener("change", () => {
                            const id = select.getAttribute("data-admin-order-status");
                            const newStatus = select.value;
                            const order = state.orders.find(o => o.id === id);
                            if (!order) return;
                            order.status = newStatus;
                            order.statusTimeline.push({
                                status: newStatus,
                                at: new Date().toISOString(),
                                by: state.user.role
                            });
                            saveJSON(STORAGE_KEYS.orders, state.orders);
                            if (state.activeView === "track-order" && state.trackingOrderId === id) {
                                renderTrackOrderView();
                            }
                        });
                    });
                } else if (target === "restaurants") {
                    const list = state.restaurants;
                    tabContentEl.innerHTML = list.length
                        ? `
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Rating</th>
                                        <th>Eta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${list.map(r => `
                                        <tr>
                                            <td>${r.name}</td>
                                            <td>${r.category}</td>
                                            <td>${r.rating.toFixed(1)}</td>
                                            <td>${r.eta}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `
                        : `<p style="font-size:0.85rem;color:var(--qb-text-muted);">No restaurants configured.</p>`;
                } else if (target === "users") {
                    const list = state.users;
                    tabContentEl.innerHTML = list.length
                        ? `
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${list.map(u => `
                                        <tr>
                                            <td>${u.email}</td>
                                            <td>${u.name}</td>
                                            <td>${u.role}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `
                        : `<p style="font-size:0.85rem;color:var(--qb-text-muted);">No users registered yet.</p>`;
                } else {
                    tabContentEl.innerHTML = `
                        <div class="dashboard__grid">
                            <article class="stat-card">
                                <div class="stat-card__label">Orders</div>
                                <div class="stat-card__value">${relevantOrders.length}</div>
                            </article>
                            <article class="stat-card">
                                <div class="stat-card__label">Revenue</div>
                                <div class="stat-card__value">${toCurrency(totalRevenue)}</div>
                            </article>
                            <article class="stat-card">
                                <div class="stat-card__label">${isAdmin ? "Restaurants" : "Your restaurants"}</div>
                                <div class="stat-card__value">${isAdmin ? state.restaurants.length : 1}</div>
                            </article>
                        </div>
                    `;
                }
            });
        });
    }

    function renderAddressesView() {
        if (!state.user) {
            if (!requireAuth("addresses")) return;
        }
        const addresses = getUserAddresses();
        const listHtml = addresses.length
            ? `
                <div class="address-list">
                    ${addresses.map(addr => `
                        <div class="address-card">
                            <div>
                                <div class="address-card__label">${addr.label}</div>
                                <div class="address-card__meta">${addr.line1}${addr.city ? ", " + addr.city : ""}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `
            : `<p style="font-size:0.85rem;color:var(--qb-text-muted);">No saved addresses yet. You can add one during checkout.</p>`;

        mainEl.innerHTML = `
            <section class="section-block">
                <div class="section-block__header">
                    <div>
                        <h2 class="section-block__title">My addresses</h2>
                        <p class="section-block__subtitle">Addresses saved from previous orders.</p>
                    </div>
                </div>
                ${listHtml}
            </section>
        `;
    }

    function setActiveView(view, options) {
        state.activeView = view;
        if (view === "restaurant-detail" && options && options.restaurantId) {
            state.selectedRestaurantId = options.restaurantId;
        }
        if (view === "track-order" && options && options.orderId) {
            state.trackingOrderId = options.orderId;
        }

        setNavActive(view);

        if (view === "home") {
            renderHomeView();
        } else if (view === "restaurants") {
            renderRestaurantsView();
        } else if (view === "restaurant-detail") {
            renderRestaurantDetailView();
        } else if (view === "checkout") {
            renderCheckoutView();
        } else if (view === "track-order") {
            renderTrackOrderView();
        } else if (view === "admin") {
            renderAdminView();
        } else if (view === "addresses") {
            renderAddressesView();
        } else {
            renderHomeView();
        }
    }

    function bindGlobalEvents() {
        document.querySelectorAll("[data-view]").forEach(el => {
            el.addEventListener("click", () => {
                const view = el.getAttribute("data-view");
                if (view) {
                    if (view === "admin") {
                        setActiveView("admin");
                    } else if (view === "track-order") {
                        setActiveView("track-order");
                    } else if (view === "restaurants") {
                        setActiveView("restaurants");
                    } else {
                        setActiveView("home");
                    }
                    if (mobileNavEl) {
                        mobileNavEl.classList.remove("open");
                    }
                }
            });
        });

        if (loginBtnEl) {
            loginBtnEl.addEventListener("click", () => openAuthModal("login"));
        }

        const authCloseBtn = document.getElementById("auth-close-btn");
        if (authCloseBtn) {
            authCloseBtn.addEventListener("click", () => closeAuthModal());
        }

        if (authModalEl) {
            authModalEl.querySelectorAll(".modal__tab").forEach(btn => {
                btn.addEventListener("click", () => {
                    const tab = btn.getAttribute("data-auth-tab") || "login";
                    setAuthTab(tab);
                });
            });
        }

        if (authLoginFormEl) {
            authLoginFormEl.addEventListener("submit", handleLoginSubmit);
        }
        if (authSignupFormEl) {
            authSignupFormEl.addEventListener("submit", handleSignupSubmit);
        }

        if (userMenuTriggerEl && userMenuDropdownEl) {
            userMenuTriggerEl.addEventListener("click", () => {
                const visible = userMenuDropdownEl.classList.contains("visible");
                userMenuDropdownEl.classList.toggle("visible", !visible);
                userMenuTriggerEl.setAttribute("aria-expanded", (!visible).toString());
            });

            document.addEventListener("click", (e) => {
                if (!userMenuDropdownEl.contains(e.target) && !userMenuTriggerEl.contains(e.target)) {
                    userMenuDropdownEl.classList.remove("visible");
                    userMenuTriggerEl.setAttribute("aria-expanded", "false");
                }
            });

            userMenuDropdownEl.querySelectorAll(".user-menu__item").forEach(item => {
                item.addEventListener("click", () => {
                    const action = item.getAttribute("data-user-action");
                    if (action === "logout") {
                        logout();
                    } else if (action === "admin") {
                        setActiveView("admin");
                    } else if (action === "addresses") {
                        setActiveView("addresses");
                    } else if (action === "orders") {
                        setActiveView("track-order");
                    }
                    userMenuDropdownEl.classList.remove("visible");
                    userMenuTriggerEl.setAttribute("aria-expanded", "false");
                });
            });
        }

        if (cartButtonEl) {
            cartButtonEl.addEventListener("click", () => openCartDrawer());
        }
        const cartCloseBtn = document.getElementById("cart-close-btn");
        if (cartCloseBtn) {
            cartCloseBtn.addEventListener("click", () => closeCartDrawer());
        }
        if (cartBackdropEl) {
            cartBackdropEl.addEventListener("click", () => closeCartDrawer());
        }
        if (cartItemsEl) {
            cartItemsEl.addEventListener("click", handleCartItemQtyChange);
        }

        const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
        if (cartCheckoutBtn) {
            cartCheckoutBtn.addEventListener("click", () => {
                if (!state.cart || !state.cart.items || !state.cart.items.length) {
                    showToast("Add items before checking out.", "error");
                    return;
                }
                closeCartDrawer();
                if (!requireAuth("checkout")) return;
                setActiveView("checkout");
            });
        }

        if (mobileToggleEl && mobileNavEl) {
            mobileToggleEl.addEventListener("click", () => {
                const isOpen = mobileNavEl.classList.contains("open");
                mobileNavEl.classList.toggle("open", !isOpen);
            });
        }

        if (trackOrderHeaderBtnEl) {
            trackOrderHeaderBtnEl.addEventListener("click", () => setActiveView("track-order"));
        }
    }

    function initFooter() {
        if (footerYearEl) {
            footerYearEl.textContent = String(new Date().getFullYear());
        }
    }

    function init() {
        loadInitialState();
        initDomRefs();
        initFooter();
        updateHeaderAuthUI();
        updateCartUI();
        bindGlobalEvents();
        setActiveView("home");
    }

    document.addEventListener("DOMContentLoaded", init);
})();