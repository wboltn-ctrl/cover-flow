/*

TemplateMo 595 3d coverflow – repurposed as QuickBite food delivery UI
Client‑side prototype: auth, restaurants, menu, cart, tracking, admin & partner views.

*/

(function () {
    const $ = (sel) => document.querySelector(sel);
    const $ = (sel) => Array.from(document.querySelectorAll(sel));

    // -----------------------
    // Demo data
    // -----------------------
    const restaurants = [
        {
            id: "r-burger-district",
            name: "Burger District",
            category: "fast-food",
            categoryLabel: "Fast food",
            rating: 4.7,
            eta: "20–30 min",
            deliveryFee: 3.99,
            image: "images/ocean-sunset-golden-hour.jpg",
            tags: ["Burgers", "Fries", "American"],
            isOpen: true,
            menu: [
                {
                    id: "bd-classic-burger",
                    name: "Classic Cheeseburger",
                    description: "Beef patty, cheddar, lettuce, tomato, pickles & house sauce.",
                    price: 10.5,
                    category: "Burgers",
                },
                {
                    id: "bd-double-stack",
                    name: "Double Stack",
                    description: "Two beef patties, double cheese, caramelized onions.",
                    price: 13.2,
                    category: "Burgers",
                },
                {
                    id: "bd-fries",
                    name: "Skin-on Fries",
                    description: "Crispy fries with sea salt.",
                    price: 4.0,
                    category: "Sides",
                },
                {
                    id: "bd-shake",
                    name: "Vanilla Shake",
                    description: "Thick vanilla milkshake.",
                    price: 5.2,
                    category: "Drinks",
                },
            ],
        },
        {
            id: "r-fresh-greens",
            name: "Fresh Greens",
            category: "healthy",
            categoryLabel: "Healthy",
            rating: 4.8,
            eta: "18–28 min",
            deliveryFee: 2.5,
            image: "images/serene-water-mirroring.jpg",
            tags: ["Salads", "Bowls", "Vegan options"],
            isOpen: true,
            menu: [
                {
                    id: "fg-buddha-bowl",
                    name: "Buddha Bowl",
                    description: "Quinoa, roasted veggies, chickpeas, tahini dressing.",
                    price: 11.9,
                    category: "Bowls",
                },
                {
                    id: "fg-caesar",
                    name: "Grilled Chicken Caesar",
                    description: "Romaine, parmesan, grilled chicken, house caesar.",
                    price: 12.4,
                    category: "Salads",
                },
                {
                    id: "fg-green-juice",
                    name: "Green Juice",
                    description: "Kale, apple, cucumber, lemon, ginger.",
                    price: 6.3,
                    category: "Drinks",
                },
            ],
        },
        {
            id: "r-sweet-side",
            name: "Sweet Side Desserts",
            category: "desserts",
            categoryLabel: "Desserts",
            rating: 4.6,
            eta: "25–35 min",
            deliveryFee: 2.99,
            image: "images/starry-night.jpg",
            tags: ["Cakes", "Ice cream", "Coffee"],
            isOpen: true,
            menu: [
                {
                    id: "ss-chocolate-cake",
                    name: "Molten Chocolate Cake",
                    description: "Warm cake with a gooey chocolate center.",
                    price: 7.5,
                    category: "Cakes",
                },
                {
                    id: "ss-ice-cream",
                    name: "Vanilla Ice Cream (2 scoops)",
                    description: "Madagascar vanilla beans & waffle crumble.",
                    price: 5.0,
                    category: "Ice cream",
                },
                {
                    id: "ss-espresso",
                    name: "Espresso",
                    description: "Freshly pulled double shot.",
                    price: 3.3,
                    category: "Coffee",
                },
            ],
        },
    ];

    const categoryFiltersConfig = [
        { id: "all", label: "All" },
        { id: "fast-food", label: "Fast food" },
        { id: "healthy", label: "Healthy" },
        { id: "desserts", label: "Desserts" },
    ];

    const TRACK_STATUSES = ["placed", "confirmed", "out-for-delivery", "delivered"];

    // -----------------------
    // Global state (in-memory + localStorage)
    // -----------------------
    const state = {
        user: null,
        users: [],
        selectedRestaurantId: null,
        cart: [],
        currentOrder: null,
        orders: [],
        addresses: [],
    };

    const STORAGE_KEYS = {
        USERS: "qb_users",
        SESSION: "qb_session",
        ADDRESSES: "qb_addresses",
        ORDERS: "qb_orders",
    };

    function loadState() {
        try {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
            const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || "null");
            const addresses = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES) || "[]");
            const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
            state.users = users;
            state.user = session;
            state.addresses = addresses;
            state.orders = orders;
        } catch {
            // ignore parse errors; keep defaults
        }
    }

    function persistState() {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(state.user));
        localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(state.addresses));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(state.orders));
    }

    // -----------------------
    // Utility helpers
    // -----------------------
    function formatMoney(value) {
        return `${value.toFixed(2)}`;
    }

    function generateOrderId() {
        const base = "QB-2025";
        const random = Math.floor(Math.random() * 9000) + 1000;
        return `${base}-${random}`;
    }

    function smoothScrollTo(id) {
        const el = document.querySelector(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }

    // -----------------------
    // Header / navigation
    // -----------------------
    function initHeader() {
        const menuToggle = $("#menuToggle");
        const mainMenu = $("#mainMenu");
        const header = $("#header");
        const scrollToTopBtn = $("#scrollToTop");

        if (!menuToggle || !mainMenu) return;

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle("active");
            mainMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                menuToggle.classList.remove("active");
                mainMenu.classList.remove("active");
            }
        });

        $(".menu-item[href^='#']").forEach((item) => {
            item.addEventListener("click", (e) => {
                const targetId = item.getAttribute("href");
                if (!targetId) return;
                e.preventDefault();
                smoothScrollTo(targetId);
                menuToggle.classList.remove("active");
                mainMenu.classList.remove("active");
            });
        });

        document.querySelector(".logo-container")?.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        function onScroll() {
            const scrollPosition = window.scrollY + 120;
            const sections = $(".section");
            const menuItems = $(".menu-item[href^='#']");

            sections.forEach((section) => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = `#${section.id}`;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    menuItems.forEach((mi) => mi.classList.remove("active"));
                    const activeItem = document.querySelector(`.menu-item[href='${id}']`);
                    if (activeItem) activeItem.classList.add("active");
                }
            });

            if (window.scrollY > 50) header.classList.add("scrolled");
            else header.classList.remove("scrolled");

            if (window.scrollY > 400) scrollToTopBtn.classList.add("visible");
            else scrollToTopBtn.classList.remove("visible");
        }

        window.addEventListener("scroll", onScroll);
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        onScroll();
    }

    // -----------------------
    // Authentication modal
    // -----------------------
    function initAuth() {
        const authTrigger = $("#authTrigger");
        const modal = $("#authModal");
        const modalClose = $("#authModalClose");
        const loginForm = $("#loginForm");
        const signupForm = $("#signupForm");

        function updateAuthUI() {
            const label = authTrigger?.querySelector(".auth-label");
            if (!label) return;
            label.textContent = state.user ? state.user.name || "Account" : "Sign in";
        }

        function openModal() {
            modal?.classList.add("visible");
        }

        function closeModal() {
            modal?.classList.remove("visible");
        }

        authTrigger?.addEventListener("click", () => {
            if (state.user) {
                // simple toggle: sign out on click if already logged in
                state.user = null;
                persistState();
                updateAuthUI();
            } else {
                openModal();
            }
        });

        modalClose?.addEventListener("click", closeModal);
        modal?.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        // Tabs
        $(".tabs .tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                $(".tabs .tab").forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                const id = tab.getAttribute("data-auth-tab");
                if (id === "login") {
                    loginForm?.classList.remove("hidden");
                    signupForm?.classList.add("hidden");
                } else {
                    loginForm?.classList.add("hidden");
                    signupForm?.classList.remove("hidden");
                }
            });
        });

        signupForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = $("#signupName").value.trim() || "User";
            const email = $("#signupEmail").value.trim();
            const password = $("#signupPassword").value;
            if (!email || !password) return;

            const existing = state.users.find((u) => u.email === email);
            if (!existing) {
                state.users.push({ name, email, password, role: "customer" });
            }
            state.user = { name, email, role: "customer" };
            persistState();
            updateAuthUI();
            closeModal();
        });

        loginForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = $("#loginEmail").value.trim();
            const password = $("#loginPassword").value;
            if (!email || !password) return;
            const existing = state.users.find((u) => u.email === email && u.password === password);
            if (existing) {
                state.user = { name: existing.name, email: existing.email, role: existing.role };
            } else {
                // demo: accept any login; in real app check server
                state.user = { name: email.split("@")[0] || "User", email, role: "customer" };
                if (!state.users.find((u) => u.email === email)) {
                    state.users.push({ name: state.user.name, email, password, role: "customer" });
                }
            }
            persistState();
            updateAuthUI();
            closeModal();
        });

        updateAuthUI();
    }

    // -----------------------
    // Hero search / location
    // -----------------------
    function initHero() {
        const heroForm = $("#heroSearchForm");
        const useLocationBtn = $("#useLocationBtn");
        const addressInput = $("#heroAddress");

        heroForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            smoothScrollTo("#restaurants");
        });

        useLocationBtn?.addEventListener("click", () => {
            if (!navigator.geolocation) return;
            useLocationBtn.disabled = true;
            navigator.geolocation.getCurrentPosition(
                () => {
                    addressInput.value = "Using current location";
                    useLocationBtn.disabled = false;
                },
                () => {
                    useLocationBtn.disabled = false;
                },
                { timeout: 8000 }
            );
        });

        $("[data-category-filter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const cat = btn.getAttribute("data-category-filter");
                if (cat) {
                    applyCategoryFilter(cat);
                    smoothScrollTo("#restaurants");
                }
            });
        });
    }

    // -----------------------
    // Restaurants listing
    // -----------------------
    function applyCategoryFilter(categoryId) {
        const btns = $("#categoryFilters")?.querySelectorAll("button");
        btns?.forEach((b) => {
            b.classList.toggle("active", b.getAttribute("data-category") === categoryId);
        });
        renderRestaurants();
    }

    function initRestaurants() {
        const categoryContainer = $("#categoryFilters");
        if (categoryContainer) {
            categoryFiltersConfig.forEach((c, idx) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = c.label;
                btn.dataset.category = c.id;
                if (idx === 0) btn.classList.add("active");
                btn.addEventListener("click", () => {
                    categoryContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                    renderRestaurants();
                });
                categoryContainer.appendChild(btn);
            });
        }

        $("#restaurantSearchInput")?.addEventListener("input", () => {
            renderRestaurants();
        });

        renderRestaurants();
    }

    function renderRestaurants() {
        const grid = $("#restaurantGrid");
        if (!grid) return;
        grid.innerHTML = "";

        const searchText = ($("#restaurantSearchInput")?.value || "").toLowerCase();
        const activeCategory =
            $("#categoryFilters")?.querySelector("button.active")?.getAttribute("data-category") || "all";

        const filtered = restaurants.filter((r) => {
            if (activeCategory !== "all" && r.category !== activeCategory) return false;
            if (!searchText) return true;
            const haystack = [r.name, r.categoryLabel, ...(r.tags || [])].join(" ").toLowerCase();
            return haystack.includes(searchText);
        });

        filtered.forEach((r) => {
            const card = document.createElement("article");
            card.className = "restaurant-card";
            card.innerHTML = `
                <img src="${r.image}" alt="${r.name}">
                <div class="restaurant-body">
                    <div class="restaurant-name">${r.name}</div>
                    <div class="restaurant-meta">
                        <span>${r.categoryLabel}</span>
                        <span>•</span>
                        <span>${r.eta}</span>
                        <span>•</span>
                        <span>⭐ ${r.rating.toFixed(1)}</span>
                    </div>
                    <div class="restaurant-tags">
                        ${(r.tags || [])
                            .slice(0, 3)
                            .map((t) => `<span class="tag-pill">${t}</span>`)
                            .join("")}
                    </div>
                    <button type="button" class="chip-btn">View menu</button>
                </div>
            `;
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                selectRestaurant(r.id);
            });
            grid.appendChild(card);
        });

        if (!filtered.length) {
            grid.innerHTML = `<p>No restaurants match your search. Try a different keyword.</p>`;
        }
    }

    function selectRestaurant(restId) {
        state.selectedRestaurantId = restId;
        renderMenu();
        smoothScrollTo("#menu");
    }

    // -----------------------
    // Menu & cart
    // -----------------------
    function renderMenu() {
        const menuList = $("#menuList");
        const titleEl = $("#menuRestaurantName");
        const metaEl = $("#menuRestaurantMeta");
        const restaurant = restaurants.find((r) => r.id === state.selectedRestaurantId);
        if (!menuList || !titleEl || !metaEl) return;

        if (!restaurant) {
            titleEl.textContent = "Select a restaurant to view its menu";
            metaEl.textContent = "";
            menuList.innerHTML = "";
            return;
        }

        titleEl.textContent = restaurant.name;
        metaEl.textContent = `${restaurant.categoryLabel} · ${restaurant.eta} · ⭐ ${restaurant.rating.toFixed(
            1
        )} · Delivery from ${formatMoney(restaurant.deliveryFee)}`;

        const categories = Array.from(
            new Set(restaurant.menu.map((m) => m.category || "Menu"))
        );

        menuList.innerHTML = "";
        categories.forEach((cat) => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = `<h3 class="menu-category">${cat}</h3>`;
            const itemsContainer = document.createElement("div");
            itemsContainer.className = "menu-items";

            restaurant.menu
                .filter((m) => (m.category || "Menu") === cat)
                .forEach((item) => {
                    const row = document.createElement("div");
                    row.className = "menu-item-row";
                    row.innerHTML = `
                        <div class="menu-item-main">
                            <h4>${item.name}</h4>
                            <p>${item.description || ""}</p>
                        </div>
                        <div class="menu-item-actions">
                            <div class="menu-item-price">${formatMoney(item.price)}</div>
                            <button type="button" class="primary-btn menu-item-add">Add</button>
                        </div>
                    `;
                    row.querySelector(".menu-item-add").addEventListener("click", (e) => {
                        e.stopPropagation();
                        addToCart(restaurant.id, item.id);
                    });
                    itemsContainer.appendChild(row);
                });

            wrapper.appendChild(itemsContainer);
            menuList.appendChild(wrapper);
        });

        $("#clearSelectionBtn")?.addEventListener("click", () => {
            state.selectedRestaurantId = null;
            renderMenu();
        });
    }

    function addToCart(restaurantId, itemId) {
        const restaurant = restaurants.find((r) => r.id === restaurantId);
        if (!restaurant) return;
        if (state.cart.length && state.cart[0].restaurantId !== restaurantId) {
            state.cart = [];
        }

        const menuItem = restaurant.menu.find((m) => m.id === itemId);
        if (!menuItem) return;
        const existing = state.cart.find((c) => c.itemId === itemId);
        if (existing) existing.qty += 1;
        else state.cart.push({ restaurantId, itemId, qty: 1 });

        renderCart();
    }

    function changeCartQty(itemId, delta) {
        const item = state.cart.find((c) => c.itemId === itemId);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            state.cart = state.cart.filter((c) => c.itemId !== itemId);
        }
        renderCart();
    }

    function renderCart() {
        const itemsEl = $("#cartItems");
        const subtitleEl = $("#cartSubtitle");
        const subtotalEl = $("#subtotalAmount");
        const deliveryEl = $("#deliveryAmount");
        const totalEl = $("#totalAmount");

        if (!itemsEl || !subtotalEl || !deliveryEl || !totalEl || !subtitleEl) return;

        itemsEl.innerHTML = "";
        if (!state.cart.length) {
            subtitleEl.textContent = "Items you add will appear here.";
            subtotalEl.textContent = "$0.00";
            deliveryEl.textContent = "$3.99";
            totalEl.textContent = "$3.99";
            return;
        }

        const restaurant = restaurants.find((r) => r.id === state.cart[0].restaurantId);
        const deliveryFee = restaurant?.deliveryFee ?? 3.99;
        let subtotal = 0;

        state.cart.forEach((entry) => {
            const r = restaurants.find((rr) => rr.id === entry.restaurantId);
            const menuItem = r?.menu.find((m) => m.id === entry.itemId);
            if (!menuItem) return;
            const line = menuItem.price * entry.qty;
            subtotal += line;

            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `
                <div>
                    <div class="cart-item-title">${menuItem.name}</div>
                    <div class="cart-item-meta">${entry.qty} × ${formatMoney(menuItem.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <button type="button" class="cart-qty-btn">-</button>
                    <span>${entry.qty}</span>
                    <button type="button" class="cart-qty-btn">+</button>
                </div>
            `;
            const [minusBtn, plusBtn] = row.querySelectorAll(".cart-qty-btn");
            minusBtn.addEventListener("click", () => changeCartQty(entry.itemId, -1));
            plusBtn.addEventListener("click", () => changeCartQty(entry.itemId, 1));
            itemsEl.appendChild(row);
        });

        subtitleEl.textContent = restaurant
            ? `Order from ${restaurant.name}`
            : "Your current order";

        subtotalEl.textContent = formatMoney(subtotal);
        deliveryEl.textContent = formatMoney(deliveryFee);
        totalEl.textContent = formatMoney(subtotal + deliveryFee);
    }

    function initCheckout() {
        $("#checkoutBtn")?.addEventListener("click", () => {
            if (!state.cart.length) return;
            const restaurant = restaurants.find((r) => r.id === state.cart[0].restaurantId);
            if (!restaurant) return;

            const payment = document.querySelector("input[name='payment']:checked")?.value || "card";
            const orderId = generateOrderId();
            const total = $("#totalAmount")?.textContent || "";
            const order = {
                id: orderId,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                items: state.cart.map((entry) => {
                    const menuItem = restaurant.menu.find((m) => m.id === entry.itemId);
                    return {
                        name: menuItem?.name || "",
                        qty: entry.qty,
                    };
                }),
                total,
                status: "placed",
                createdAt: new Date().toISOString(),
                payment,
                userEmail: state.user?.email || "guest@example.com",
            };

            state.currentOrder = order;
            state.orders.unshift(order);
            persistState();
            state.cart = [];
            renderCart();
            renderTracking(order);
            renderAdmin();
            renderPartner();
            smoothScrollTo("#track");
        });
    }

    // -----------------------
    // Tracking
    // -----------------------
    let trackingInterval = null;

    function renderTracking(order) {
        const titleEl = $("#trackStatusTitle");
        const subtitleEl = $("#trackStatusSubtitle");
        if (!order || !titleEl || !subtitleEl) {
            titleEl.textContent = "No order selected";
            subtitleEl.textContent = "Place an order to see live status updates here.";
            return;
        }

        titleEl.textContent = `Order ${order.id}`;
        subtitleEl.textContent = `From ${order.restaurantName} • ${order.total} • Payment: ${order.payment}`;

        const steps = $(".status-step");
        steps.forEach((step) => {
            step.classList.remove("active", "completed");
            const status = step.getAttribute("data-status");
            if (!status) return;
            const index = TRACK_STATUSES.indexOf(status);
            const currentIndex = TRACK_STATUSES.indexOf(order.status);
            if (index < currentIndex) step.classList.add("completed");
            if (index === currentIndex) step.classList.add("active");
        });

        if (trackingInterval) clearInterval(trackingInterval);
        trackingInterval = setInterval(() => {
            const idx = TRACK_STATUSES.indexOf(order.status);
            if (idx === -1 || idx >= TRACK_STATUSES.length - 1) {
                clearInterval(trackingInterval);
                return;
            }
            order.status = TRACK_STATUSES[idx + 1];
            const stored = state.orders.find((o) => o.id === order.id);
            if (stored) stored.status = order.status;
            persistState();
            renderTracking(order);
        }, 5000);
    }

    function initTrackSection() {
        const trackForm = $("#trackForm");
        const recentOrdersEl = $("#recentOrders");

        if (trackForm) {
            trackForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const id = $("#trackOrderId")?.value.trim();
                if (!id) return;
                const order = state.orders.find((o) => o.id === id);
                if (order) {
                    state.currentOrder = order;
                    renderTracking(order);
                }
            });
        }

        function renderRecent() {
            if (!recentOrdersEl) return;
            if (!state.orders.length) {
                recentOrdersEl.textContent = "No recent orders in this browser yet.";
                return;
            }
            recentOrdersEl.innerHTML = `<p>Recent orders:</p>`;
            state.orders.slice(0, 4).forEach((order) => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "recent-order-chip";
                chip.textContent = order.id;
                chip.addEventListener("click", () => {
                    $("#trackOrderId").value = order.id;
                    state.currentOrder = order;
                    renderTracking(order);
                });
                recentOrdersEl.appendChild(chip);
            });
        }

        renderRecent();
        if (state.currentOrder) renderTracking(state.currentOrder);
    }

    // -----------------------
    // Addresses + map
    // -----------------------
    function initAddresses() {
        const form = $("#addressForm");
        const listEl = $("#savedAddresses");
        const mapIframe = $("#mapIframe");

        function buildMapUrl(address) {
            const query = encodeURIComponent(address);
            return `https://www.openstreetmap.org/export/embed.html?search=${query}&layer=mapnik`;
        }

        function renderAddresses() {
            if (!listEl) return;
            if (!state.addresses.length) {
                listEl.textContent = "No saved addresses yet.";
                return;
            }
            listEl.innerHTML = "";
            state.addresses.forEach((addr, index) => {
                const div = document.createElement("div");
                div.className = "saved-address";
                div.innerHTML = `
                    <span><strong>${addr.label}</strong> – ${addr.full}</span>
                    <button type="button" class="ghost-btn" data-index="${index}">Select</button>
                `;
                div.querySelector("button").addEventListener("click", () => {
                    if (mapIframe) {
                        mapIframe.src = buildMapUrl(addr.full);
                    }
                });
                listEl.appendChild(div);
            });
        }

        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            const label = $("#addressLabel").value.trim() || "Address";
            const line = $("#addressLine").value.trim();
            const city = $("#addressCity").value.trim();
            const zip = $("#addressZip").value.trim();
            if (!line) return;
            const full = [line, city, zip].filter(Boolean).join(", ");
            state.addresses.push({ label, full });
            persistState();
            form.reset();
            renderAddresses();
            if (mapIframe) mapIframe.src = buildMapUrl(full);
        });

        renderAddresses();
    }

    // -----------------------
    // Admin dashboard
    // -----------------------
    function initAdmin() {
        $(".dashboard-tabs .tab[data-admin-tab]").forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-admin-tab");
                if (!target) return;
                $(".dashboard-tabs .tab[data-admin-tab]").forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                $(".dashboard-panel[data-admin-panel]").forEach((panel) => {
                    panel.classList.toggle("hidden", panel.getAttribute("data-admin-panel") !== target);
                });
            });
        });

        $("#adminAddRestaurantBtn")?.addEventListener("click", () => {
            alert("In a real system this would open a form to add restaurants.");
        });

        renderAdmin();
    }

    function renderAdmin() {
        const restaurantsTable = $("#adminRestaurantsTable");
        const menusTable = $("#adminMenusTable");
        const ordersTable = $("#adminOrdersTable");
        const usersTable = $("#adminUsersTable");

        if (restaurantsTable) {
            restaurantsTable.innerHTML = "";
            restaurants.forEach((r) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${r.name}</td>
                    <td>${r.categoryLabel}</td>
                    <td>${r.eta}</td>
                    <td>${r.rating.toFixed(1)}</td>
                    <td>${r.isOpen ? "Open" : "Closed"}</td>
                `;
                restaurantsTable.appendChild(tr);
            });
        }

        if (menusTable) {
            menusTable.innerHTML = "";
            restaurants.forEach((r) => {
                r.menu.forEach((m) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${r.name}</td>
                        <td>${m.name}</td>
                        <td>${m.category || ""}</td>
                        <td>${formatMoney(m.price)}</td>
                    `;
                    menusTable.appendChild(tr);
                });
            });
        }

        if (ordersTable) {
            ordersTable.innerHTML = "";
            state.orders.slice(0, 10).forEach((o) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${o.id}</td>
                    <td>${o.userEmail}</td>
                    <td>${o.restaurantName}</td>
                    <td>${o.total}</td>
                    <td>${o.status}</td>
                `;
                ordersTable.appendChild(tr);
            });
        }

        if (usersTable) {
            usersTable.innerHTML = "";
            state.users.forEach((u) => {
                const ordersCount = state.orders.filter((o) => o.userEmail === u.email).length;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${ordersCount}</td>
                    <td>${u.role || "customer"}</td>
                `;
                usersTable.appendChild(tr);
            });
        }
    }

    // -----------------------
    // Partner dashboard
    // -----------------------
    function initPartner() {
        $(".dashboard-tabs .tab[data-partner-tab]").forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-partner-tab");
                if (!target) return;
                $(".dashboard-tabs .tab[data-partner-tab]").forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                $(".dashboard-panel[data-partner-panel]").forEach((panel) => {
                    panel.classList.toggle("hidden", panel.getAttribute("data-partner-panel") !== target);
                });
            });
        });

        $("#partnerAddItemBtn")?.addEventListener("click", () => {
            alert("In a real system this would open a form to add or edit menu items.");
        });

        renderPartner();
    }

    function renderPartner() {
        const menuTable = $("#partnerMenuTable");
        const ordersTable = $("#partnerOrdersTable");
        const ordersCountEl = $("#partnerOrdersCount");
        const ratingEl = $("#partnerRating");
        const statusEl = $("#partnerStatus");

        const partnerRestaurant = restaurants[0]; // demo: first restaurant

        if (ordersCountEl) {
            const count = state.orders.filter((o) => o.restaurantId === partnerRestaurant.id).length;
            ordersCountEl.textContent = String(count);
        }
        if (ratingEl) ratingEl.textContent = partnerRestaurant.rating.toFixed(1);
        if (statusEl) statusEl.textContent = partnerRestaurant.isOpen ? "Open" : "Closed";

        if (menuTable) {
            menuTable.innerHTML = "";
            partnerRestaurant.menu.forEach((m) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${m.name}</td>
                    <td>${m.category || ""}</td>
                    <td>${formatMoney(m.price)}</td>
                    <td>${"Yes"}</td>
                `;
                menuTable.appendChild(tr);
            });
        }

        if (ordersTable) {
            ordersTable.innerHTML = "";
            state.orders
                .filter((o) => o.restaurantId === partnerRestaurant.id)
                .slice(0, 10)
                .forEach((o) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${o.id}</td>
                        <td>${o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                        <td>${o.total}</td>
                        <td>${o.status}</td>
                    `;
                    ordersTable.appendChild(tr);
                });
        }
    }

    // -----------------------
    // Contact form
    // -----------------------
    function initContact() {
        $("#contactForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            e.target.reset();
            alert("Thanks for your message. In a real app this would be sent to the backend.");
        });
    }

    // -----------------------
    // Init
    // -----------------------
    document.addEventListener("DOMContentLoaded", () => {
        loadState();
        initHeader();
        initAuth();
        initHero();
        initRestaurants();
        renderMenu();
        renderCart();
        initCheckout();
        initTrackSection();
        initAddresses();
        initAdmin();
        initPartner();
        initContact();

        if (state.currentOrder) renderTracking(state.currentOrder);
    });
})();