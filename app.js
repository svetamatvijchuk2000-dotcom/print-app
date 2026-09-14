// ===============================
// PRINT APP — app.js
// ===============================

// ---------- ДИПЛОМЫ ----------

const DEFAULT_DIPLOMA_PRICES = {
    uv_a5: {
        name: "Диплом УФ — А5",
        tiers: {
            1: { min: 1, max: 2, sale: 300, cost: 240 },
            2: { min: 3, max: 10, sale: 280, cost: 200 },
            3: { min: 11, max: 20, sale: 260, cost: 190 },
            4: { min: 21, max: 50, sale: 240, cost: 180 },
            5: { min: 51, max: Infinity, sale: 220, cost: 170 }
        }
    },

    uv_a4: {
        name: "Диплом УФ — А4",
        tiers: {
            1: { min: 1, max: 2, sale: 470, cost: 420 },
            2: { min: 3, max: 10, sale: 450, cost: 400 },
            3: { min: 11, max: 20, sale: 430, cost: 370 },
            4: { min: 21, max: 50, sale: 410, cost: 350 },
            5: { min: 51, max: Infinity, sale: 390, cost: 320 }
        }
    },

    uv_a3: {
        name: "Диплом УФ — А3",
        tiers: {
            1: { min: 1, max: 2, sale: 0, cost: 0 },
            2: { min: 3, max: 10, sale: 0, cost: 0 },
            3: { min: 11, max: 20, sale: 0, cost: 0 },
            4: { min: 21, max: 50, sale: 0, cost: 0 },
            5: { min: 51, max: Infinity, sale: 0, cost: 0 }
        }
    },

    sublimation_a5: {
        name: "Диплом сублимация — А5",
        tiers: {
            1: { min: 1, max: 2, sale: 300, cost: 240 },
            2: { min: 3, max: 10, sale: 280, cost: 190 },
            3: { min: 11, max: 20, sale: 260, cost: 180 },
            4: { min: 21, max: 50, sale: 240, cost: 170 },
            5: { min: 51, max: Infinity, sale: 220, cost: 165 }
        }
    },

    sublimation_a4: {
        name: "Диплом сублимация — А4",
        tiers: {
            1: { min: 1, max: 2, sale: 470, cost: 400 },
            2: { min: 3, max: 10, sale: 450, cost: 390 },
            3: { min: 11, max: 20, sale: 430, cost: 360 },
            4: { min: 21, max: 50, sale: 410, cost: 340 },
            5: { min: 51, max: Infinity, sale: 390, cost: 310 }
        }
    },

    sublimation_a3: {
        name: "Диплом сублимация — А3",
        tiers: {
            1: { min: 1, max: 2, sale: 0, cost: 0 },
            2: { min: 3, max: 10, sale: 0, cost: 0 },
            3: { min: 11, max: 20, sale: 0, cost: 0 },
            4: { min: 21, max: 50, sale: 0, cost: 0 },
            5: { min: 51, max: Infinity, sale: 0, cost: 0 }
        }
    }
};


// ---------- ГОТОВЫЕ ЧАШКИ ----------

const DEFAULT_READY_CUPS = {
    cup_carabiner_300_ss: {
        name: "Чашка с карабином 300 мл — С/С",
        sale: 159,
        cost: 159
    },

    cup_carabiner_300_sk: {
        name: "Чашка с карабином 300 мл — С/Кр",
        sale: 159,
        cost: 159
    },

    cup_carabiner_300_black: {
        name: "Чашка с карабином 300 мл — С/Черн",
        sale: 159,
        cost: 159
    },

    cup_color_330: {
        name: "Чашка цветная внутри и ручка 330 мл",
        sale: 59,
        cost: 59,
        colorRequired: true
    },

    cup_white_330: {
        name: "Белая чашка 330 мл",
        sale: 47,
        cost: 47
    }
};


// ---------- СТАТУСЫ ----------

const ORDER_STATUSES = [
    "Новый",
    "В работе",
    "Готов",
    "Выдан",
    "Отменён"
];

const PAYMENT_STATUSES = [
    "Не оплачено",
    "Частично оплачено",
    "Оплачено"
];


// ---------- КАТАЛОГ ----------

function loadCatalog() {
    let catalog;

    try {
        catalog = JSON.parse(
            localStorage.getItem("printAppCatalog")
        );
    } catch (e) {
        catalog = null;
    }

    if (!catalog) {
        catalog = {
            diplomaPrices: structuredClone(DEFAULT_DIPLOMA_PRICES),
            readyCups: structuredClone(DEFAULT_READY_CUPS)
        };
    }

    if (!catalog.diplomaPrices) {
        catalog.diplomaPrices =
            structuredClone(DEFAULT_DIPLOMA_PRICES);
    }

    if (!catalog.readyCups) {
        catalog.readyCups =
            structuredClone(DEFAULT_READY_CUPS);
    }

    Object.keys(catalog.readyCups).forEach(key => {
        const cup = catalog.readyCups[key];

        if (cup.sale == null) {
            cup.sale = Number(cup.price ?? 0);
        }

        if (cup.cost == null) {
            cup.cost = Number(cup.price ?? 0);
        }
    });

    localStorage.setItem(
        "printAppCatalog",
        JSON.stringify(catalog)
    );

    return catalog;
}


function saveCatalog(catalog) {
    localStorage.setItem(
        "printAppCatalog",
        JSON.stringify(catalog)
    );
}


// ---------- ПОЗИЦИИ НОВОГО ЗАКАЗА ----------

let positionCounter = 0;

function addPosition() {
    positionCounter++;

    const container =
        document.getElementById("positions");

    if (!container) return;

    const position =
        document.createElement("div");

    position.className = "position-card";
    position.dataset.position = positionCounter;

    position.innerHTML = `
        <div class="position-header">
            <strong>Позиция ${positionCounter}</strong>

            <button
                type="button"
                class="delete-position"
                onclick="removePosition(this)"
            >
                ×
            </button>
        </div>

        <div class="field">
            <label>Категория</label>

            <select
                class="position-category"
                onchange="updateProductOptions(this)"
            >
                <option value="">Выберите категорию</option>
                <option value="diploma">Дипломы</option>
                <option value="cup_ready">Готовая чашка</option>
                <option value="cup_print">Печать чашка</option>
                <option value="cup_custom">Чашка</option>
                <option value="packaging">Упаковка для чашки</option>
                <option value="designer">Услуги дизайнера</option>
                <option value="urgent">Срочность</option>
            </select>
        </div>

        <div class="field product-field">
            <label>Изделие</label>

            <select
                class="position-product"
                onchange="updateDiploma(this)"
            >
                <option value="">
                    Сначала выберите категорию
                </option>
            </select>
        </div>

        <div class="field extra-field"></div>

        <div class="field">
            <label>Количество</label>

            <input
                type="number"
                class="position-quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            >
        </div>

        <div class="manual-prices">

            <div class="field">
                <label>Цена продажи / шт.</label>

                <input
                    type="number"
                    class="position-sale"
                    min="0"
                    step="0.01"
                    value="0"
                    oninput="calculateAll()"
                >
            </div>

            <div class="field">
                <label>Себестоимость / шт.</label>

                <input
                    type="number"
                    class="position-cost"
                    min="0"
                    step="0.01"
                    value="0"
                    oninput="calculateAll()"
                >
            </div>

        </div>

        <div class="position-total">

            <div>
                Продажа:
                <strong class="position-sale-total">
                    0 грн
                </strong>
            </div>

            <div>
                Себестоимость:
                <strong class="position-cost-total">
                    0 грн
                </strong>
            </div>

            <div>
                Прибыль:
                <strong class="position-profit-total">
                    0 грн
                </strong>
            </div>

        </div>
    `;

    container.appendChild(position);

    updateProductOptions(
        position.querySelector(".position-category")
    );

    calculateAll();
}


function removePosition(button) {
    const position =
        button.closest(".position-card");

    if (position) {
        position.remove();
    }

    renumberPositions();
    calculateAll();
}


function renumberPositions() {
    document
        .querySelectorAll("#positions .position-card")
        .forEach((position, index) => {

            const title =
                position.querySelector(
                    ".position-header strong"
                );

            if (title) {
                title.textContent =
                    `Позиция ${index + 1}`;
            }
        });
}


// ---------- ВЫБОР ТОВАРА ----------

function updateProductOptions(categorySelect) {
    const position =
        categorySelect.closest(".position-card");

    if (!position) return;

    const category =
        categorySelect.value;

    const product =
        position.querySelector(".position-product");

    const extra =
        position.querySelector(".extra-field");

    if (!product) return;

    product.innerHTML = "";
    extra.innerHTML = "";

    if (!category) {
        product.innerHTML =
            `<option value="">Выберите изделие</option>`;

        calculateAll();
        return;
    }

    if (category === "diploma") {
        const catalog = loadCatalog();

        product.innerHTML =
            `<option value="">Выберите диплом</option>`;

        Object.entries(catalog.diplomaPrices)
            .forEach(([key, item]) => {

                product.innerHTML += `
                    <option value="${escapeHtml(key)}">
                        ${escapeHtml(item.name)}
                    </option>
                `;
            });
    }

    if (category === "cup_ready") {
        const catalog = loadCatalog();

        product.innerHTML =
            `<option value="">Выберите чашку</option>`;

        Object.entries(catalog.readyCups)
            .forEach(([key, item]) => {

                product.innerHTML += `
                    <option value="${escapeHtml(key)}">
                        ${escapeHtml(item.name)}
                    </option>
                `;
            });
    }

    if (category === "cup_print") {
        product.innerHTML = `
            <option value="cup_print">
                Печать на чашке
            </option>
        `;
    }

    if (category === "cup_custom") {
        product.innerHTML = `
            <option value="cup_custom">
                Чашка
            </option>
        `;

        extra.innerHTML = `
            <div class="field">
                <label>Описание</label>

                <input
                    type="text"
                    class="position-description"
                    placeholder="Например: чашка сублимационная"
                >
            </div>
        `;
    }

    if (category === "packaging") {
        product.innerHTML = `
            <option value="packaging">
                Упаковка для чашки
            </option>
        `;

        extra.innerHTML = `
            <div class="field">
                <label>Описание / тип</label>

                <input
                    type="text"
                    class="position-description"
                    placeholder="Например: коробка"
                >
            </div>
        `;
    }

    if (category === "designer") {
        product.innerHTML = `
            <option value="designer">
                Услуги дизайнера
            </option>
        `;
    }

    if (category === "urgent") {
        product.innerHTML = `
            <option value="urgent">
                Срочность
            </option>
        `;
    }

    updateDiploma(product);
}


function updateDiploma(productSelect) {
    const position =
        productSelect.closest(".position-card");

    if (!position) return;

    const category =
        position.querySelector(
            ".position-category"
        )?.value;

    const productKey =
        productSelect.value;

    const saleInput =
        position.querySelector(".position-sale");

    const costInput =
        position.querySelector(".position-cost");

    const quantityInput =
        position.querySelector(".position-quantity");

    if (!saleInput || !costInput) return;

    const quantity =
        Number(quantityInput?.value || 1);

    if (category === "diploma") {
        const price =
            getDiplomaPrice(
                productKey,
                quantity
            );

        saleInput.value = price.sale;
        costInput.value = price.cost;
    }

    if (category === "cup_ready") {
        const catalog = loadCatalog();
        const cup =
            catalog.readyCups[productKey];

        if (cup) {
            saleInput.value = cup.sale;
            costInput.value = cup.cost;
        }
    }

    if (
        category === "cup_print" ||
        category === "cup_custom" ||
        category === "packaging" ||
        category === "designer" ||
        category === "urgent"
    ) {
        saleInput.value = 0;
        costInput.value = 0;
    }

    calculateAll();
}


// ---------- ЦЕНЫ ДИПЛОМОВ ----------

function getDiplomaPrice(key, quantity) {
    const catalog = loadCatalog();

    const diploma =
        catalog.diplomaPrices[key];

    if (!diploma) {
        return {
            sale: 0,
            cost: 0
        };
    }

    const tiers =
        Object.values(diploma.tiers);

    const tier =
        tiers.find(item =>
            quantity >= item.min &&
            quantity <= item.max
        ) ||
        tiers[tiers.length - 1];

    return {
        sale: Number(tier.sale || 0),
        cost: Number(tier.cost || 0)
    };
}


// ---------- РАСЧЁТ ----------

function calculatePosition(position) {
    const quantity =
        Math.max(
            1,
            Number(
                position.querySelector(
                    ".position-quantity"
                )?.value || 1
            )
        );

    const sale =
        Number(
            position.querySelector(
                ".position-sale"
            )?.value || 0
        );

    const cost =
        Number(
            position.querySelector(
                ".position-cost"
            )?.value || 0
        );

    const saleTotal =
        sale * quantity;

    const costTotal =
        cost * quantity;

    const profitTotal =
        saleTotal - costTotal;

    const saleEl =
        position.querySelector(
            ".position-sale-total"
        );

    const costEl =
        position.querySelector(
            ".position-cost-total"
        );

    const profitEl =
        position.querySelector(
            ".position-profit-total"
        );

    if (saleEl) {
        saleEl.textContent =
            `${formatMoney(saleTotal)} грн`;
    }

    if (costEl) {
        costEl.textContent =
            `${formatMoney(costTotal)} грн`;
    }

    if (profitEl) {
        profitEl.textContent =
            `${formatMoney(profitTotal)} грн`;
    }

    position.dataset.sale =
        saleTotal;

    position.dataset.cost =
        costTotal;

    position.dataset.profit =
        profitTotal;

    return {
        quantity,
        sale,
        cost,
        saleTotal,
        costTotal,
        profitTotal
    };
}


function calculateAll() {
    let totalSale = 0;
    let totalCost = 0;
    let totalProfit = 0;

    document
        .querySelectorAll(
            "#positions .position-card"
        )
        .forEach(position => {

            const result =
                calculatePosition(position);

            totalSale += result.saleTotal;
            totalCost += result.costTotal;
            totalProfit += result.profitTotal;
        });

    const saleEl =
        document.getElementById("totalSale");

    const costEl =
        document.getElementById("totalCost");

    const profitEl =
        document.getElementById("totalProfit");

    if (saleEl) {
        saleEl.textContent =
            `${formatMoney(totalSale)} грн`;
    }

    if (costEl) {
        costEl.textContent =
            `${formatMoney(totalCost)} грн`;
    }

    if (profitEl) {
        profitEl.textContent =
            `${formatMoney(totalProfit)} грн`;
    }

    return {
        sale: totalSale,
        cost: totalCost,
        profit: totalProfit
    };
}


// ---------- ОЧИСТКА НОВОГО ЗАКАЗА ----------

function clearOrder() {
    const client =
        document.getElementById("clientName");

    if (client) {
        client.value = "";
    }

    const positions =
        document.getElementById("positions");

    if (positions) {
        positions.innerHTML = "";
    }

    positionCounter = 0;

    addPosition();
    calculateAll();
}


// ---------- НОМЕР ЗАКАЗА ----------

function getNextOrderNumber() {
    const orders =
        getOrders();

    let maxNumber = 0;

    orders.forEach(order => {

        const number =
            parseInt(
                String(
                    order.number || ""
                ).replace(/\D/g, ""),
                10
            );

        if (!isNaN(number)) {
            maxNumber =
                Math.max(
                    maxNumber,
                    number
                );
        }
    });

    return String(maxNumber + 1)
        .padStart(4, "0");
}


// ---------- СОХРАНЕНИЕ НОВОГО ЗАКАЗА ----------

function collectNewOrderPositions() {
    const positions = [];

    document
        .querySelectorAll(
            "#positions .position-card"
        )
        .forEach(position => {

            const category =
                position.querySelector(
                    ".position-category"
                )?.value || "";

            const product =
                position.querySelector(
                    ".position-product"
                )?.value || "";

            if (!category || !product) {
                return;
            }

            const quantity =
                Number(
                    position.querySelector(
                        ".position-quantity"
                    )?.value || 1
                );

            const sale =
                Number(
                    position.querySelector(
                        ".position-sale"
                    )?.value || 0
                );

            const cost =
                Number(
                    position.querySelector(
                        ".position-cost"
                    )?.value || 0
                );

            const description =
                position.querySelector(
                    ".position-description"
                )?.value || "";

            positions.push({
                category,
                product,
                description,
                quantity,
                sale,
                cost,
                saleTotal:
                    sale * quantity,
                costTotal:
                    cost * quantity,
                profitTotal:
                    (sale - cost) * quantity
            });
        });

    return positions;
}


function saveOrder() {
    const client =
        document.getElementById(
            "clientName"
        )?.value.trim() ||
        "Без имени";

    const positions =
        collectNewOrderPositions();

    if (!positions.length) {
        alert(
            "Добавьте хотя бы одну позицию."
        );
        return;
    }

    const totals =
        calculateAll();

    const order = {
        id: Date.now(),

        number:
            getNextOrderNumber(),

        client,

        createdAt:
            Date.now(),

        status:
            "Новый",

        paymentStatus:
            "Не оплачено",

        comment:
            "",

        photos:
            [],

        positions,

        saleTotal:
            totals.sale,

        costTotal:
            totals.cost,

        profitTotal:
            totals.profit,

        sale:
            `${formatMoney(totals.sale)} грн`,

        cost:
            `${formatMoney(totals.cost)} грн`,

        profit:
            `${formatMoney(totals.profit)} грн`
    };

    const orders =
        getOrders();

    orders.push(order);

    saveOrders(orders);

    alert(
        `Заказ №${order.number} сохранён.`
    );

    clearOrder();

    showOrders();
}


// ---------- ЗАКАЗЫ В LOCALSTORAGE ----------

function getOrders() {
    try {
        const saved =
            localStorage.getItem(
                "printAppOrders"
            );

        if (!saved) {
            return [];
        }

        const orders =
            JSON.parse(saved);

        if (!Array.isArray(orders)) {
            return [];
        }

        return orders;

    } catch (error) {
        console.error(
            "Ошибка загрузки заказов:",
            error
        );

        return [];
    }
}


function saveOrders(orders) {
    localStorage.setItem(
        "printAppOrders",
        JSON.stringify(orders)
    );
}


// ---------- НАЗВАНИЯ ----------

function categoryNames(category) {
    const names = {
        diploma: "Диплом",
        cup_ready: "Готовая чашка",
        cup_print: "Печать чашка",
        cup_custom: "Чашка",
        packaging: "Упаковка",
        designer: "Дизайнер",
        urgent: "Срочность"
    };

    return (
        names[category] ||
        category
    );
}


function catalogNames(category, key) {
    const catalog =
        loadCatalog();

    if (category === "diploma") {
        return (
            catalog.diplomaPrices[key]
                ?.name ||
            key
        );
    }

    if (category === "cup_ready") {
        return (
            catalog.readyCups[key]
                ?.name ||
            key
        );
    }

    const names = {
        cup_print: "Печать чашка",
        cup_custom: "Чашка",
        packaging: "Упаковка для чашки",
        designer: "Услуги дизайнера",
        urgent: "Срочность"
    };

    return (
        names[category] ||
        key
    );
}


// =====================================================
// ЗАКАЗЫ
// =====================================================

let ordersSearch = "";
let ordersStatusFilter = "all";
let ordersSort = "newest";


function showOrders() {
    hideAllScreens();

    const screen =
        document.getElementById(
            "screenOrders"
        );

    if (!screen) return;

    screen.classList.add("active");

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );

    if (title) {
        title.textContent =
            "Заказы";
    }

    if (subtitle) {
        subtitle.textContent =
            "Список сохранённых заказов";
    }

    renderOrders();

    setActiveNav("Заказы");
}


function openOrders() {
    showOrders();
}


// ---------- ОТДЕЛЬНОЕ ПОЛЕ ПОИСКА ----------
// Важно: само поле НЕ пересоздаётся
// при каждом вводе символа.

function renderOrders() {
    const container =
        document.getElementById(
            "ordersList"
        );

    const count =
        document.getElementById(
            "ordersCount"
        );

    if (!container) return;

    addOrdersStyles();

    let controls =
        container.querySelector(
            ".orders-controls"
        );

    let list =
        container.querySelector(
            ".orders-list-results"
        );

    if (!controls) {
        controls =
            document.createElement("div");

        controls.className =
            "orders-controls";

        controls.innerHTML = `
            <input
                type="search"
                id="ordersSearchInput"
                placeholder="Поиск по номеру или клиенту"
                autocomplete="off"
                enterkeyhint="search"
            >

            <select
                id="ordersStatusFilter"
            >
                <option value="all">
                    Все статусы
                </option>

                <option value="Новый">
                    Новый
                </option>

                <option value="В работе">
                    В работе
                </option>

                <option value="Готов">
                    Готов
                </option>

                <option value="Выдан">
                    Выдан
                </option>

                <option value="Отменён">
                    Отменён
                </option>
            </select>

            <select
                id="ordersSort"
            >
                <option value="newest">
                    Сначала новые
                </option>

                <option value="oldest">
                    Сначала старые
                </option>

                <option value="profit">
                    По прибыли
                </option>

                <option value="sale">
                    По сумме
                </option>
            </select>
        `;

        container.innerHTML = "";

        container.appendChild(
            controls
        );

        list =
            document.createElement("div");

        list.className =
            "orders-list-results";

        container.appendChild(list);

        const searchInput =
            controls.querySelector(
                "#ordersSearchInput"
            );

        const statusSelect =
            controls.querySelector(
                "#ordersStatusFilter"
            );

        const sortSelect =
            controls.querySelector(
                "#ordersSort"
            );

        // Ключевой момент:
        // input НЕ пересоздаётся.
        searchInput.addEventListener(
            "input",
            function () {
                ordersSearch =
                    this.value;

                renderOrderCards();
            }
        );

        statusSelect.addEventListener(
            "change",
            function () {
                ordersStatusFilter =
                    this.value;

                renderOrderCards();
            }
        );

        sortSelect.addEventListener(
            "change",
            function () {
                ordersSort =
                    this.value;

                renderOrderCards();
            }
        );
    }

    const searchInput =
        controls.querySelector(
            "#ordersSearchInput"
        );

    const statusSelect =
        controls.querySelector(
            "#ordersStatusFilter"
        );

    const sortSelect =
        controls.querySelector(
            "#ordersSort"
        );

    if (
        document.activeElement !==
        searchInput
    ) {
        searchInput.value =
            ordersSearch;
    }

    statusSelect.value =
        ordersStatusFilter;

    sortSelect.value =
        ordersSort;

    renderOrderCards();
}


function renderOrderCards() {
    const container =
        document.getElementById(
            "ordersList"
        );

    if (!container) return;

    const list =
        container.querySelector(
            ".orders-list-results"
        );

    const count =
        document.getElementById(
            "ordersCount"
        );

    if (!list) return;

    let orders =
        getOrders();

    // Поиск
    const search =
        String(
            ordersSearch || ""
        )
        .trim()
        .toLowerCase();

    if (search) {
        orders =
            orders.filter(order => {

                const number =
                    String(
                        order.number || ""
                    ).toLowerCase();

                const client =
                    String(
                        order.client || ""
                    ).toLowerCase();

                return (
                    number.includes(search) ||
                    client.includes(search)
                );
            });
    }

    // Статус
    if (
        ordersStatusFilter !==
        "all"
    ) {
        orders =
            orders.filter(order =>
                getOrderStatus(order) ===
                ordersStatusFilter
            );
    }

    // Сортировка
    orders.sort((a, b) => {

        if (
            ordersSort ===
            "newest"
        ) {
            return (
                getOrderDate(b) -
                getOrderDate(a)
            );
        }

        if (
            ordersSort ===
            "oldest"
        ) {
            return (
                getOrderDate(a) -
                getOrderDate(b)
            );
        }

        if (
            ordersSort ===
            "profit"
        ) {
            return (
                getOrderProfit(b) -
                getOrderProfit(a)
            );
        }

        if (
            ordersSort ===
            "sale"
        ) {
            return (
                getOrderSale(b) -
                getOrderSale(a)
            );
        }

        return 0;
    });

    if (count) {
        count.textContent =
            `Всего заказов: ${orders.length}`;
    }

    if (!orders.length) {
        list.innerHTML = `
            <div class="empty-orders">
                <div style="font-size:42px;">
                    📋
                </div>

                <h3>
                    ${
                        search ||
                        ordersStatusFilter !== "all"
                            ? "Ничего не найдено"
                            : "Заказов пока нет"
                    }
                </h3>

                <p>
                    ${
                        search
                            ? "Попробуйте изменить запрос."
                            : "Сохранённые заказы появятся здесь."
                    }
                </p>
            </div>
        `;

        return;
    }

    let html = "";

    orders.forEach(order => {

        const number =
            order.number || "—";

        const client =
            order.client ||
            "Без имени";

        const status =
            getOrderStatus(order);

        const payment =
            getPaymentStatus(order);

        const sale =
            getOrderSale(order);

        const profit =
            getOrderProfit(order);

        const date =
            formatDate(
                getOrderDate(order)
            );

        html += `
            <div class="order-card">

                <div
                    class="order-card-main"
                    onclick="openOrderDetails(${Number(order.id)})"
                >

                    <div class="order-card-top">

                        <strong>
                            Заказ №${escapeHtml(number)}
                        </strong>

                        <span class="order-status">
                            ${escapeHtml(status)}
                        </span>

                    </div>

                    <div class="order-client">
                        ${escapeHtml(client)}
                    </div>

                    <div class="order-date">
                        ${date}
                    </div>

                    <div class="order-payment">
                        Оплата:
                        <b>
                            ${escapeHtml(payment)}
                        </b>
                    </div>

                    <div class="order-money">

                        <span>
                            Продажа:
                            <b>
                                ${formatMoney(sale)} грн
                            </b>
                        </span>

                        <span>
                            Прибыль:
                            <b>
                                ${formatMoney(profit)} грн
                            </b>
                        </span>

                    </div>

                </div>

                <div class="order-card-actions">

                    <select
                        onclick="event.stopPropagation()"
                        onchange="
                            event.stopPropagation();
                            changeOrderStatus(
                                ${Number(order.id)},
                                this.value
                            )
                        "
                    >
                        ${getStatusOptions(status)}
                    </select>

                    <button
                        type="button"
                        onclick="
                            event.stopPropagation();
                            deleteOrder(${Number(order.id)})
                        "
                    >
                        Удалить
                    </button>

                </div>

            </div>
        `;
    });

    list.innerHTML = html;
}


function getStatusOptions(current) {
    return ORDER_STATUSES
        .map(status => `
            <option
                value="${escapeHtml(status)}"
                ${
                    status === current
                        ? "selected"
                        : ""
                }
            >
                ${escapeHtml(status)}
            </option>
        `)
        .join("");
}


function getPaymentOptions(current) {
    return PAYMENT_STATUSES
        .map(status => `
            <option
                value="${escapeHtml(status)}"
                ${
                    status === current
                        ? "selected"
                        : ""
                }
            >
                ${escapeHtml(status)}
            </option>
        `)
        .join("");
}


function getOrderStatus(order) {
    return (
        order.status ||
        "Новый"
    );
}


function getPaymentStatus(order) {
    return (
        order.paymentStatus ||
        "Не оплачено"
    );
}


function getOrderDate(order) {
    return Number(
        order.createdAt ||
        order.id ||
        Date.now()
    );
}


function getOrderSale(order) {
    if (
        typeof order.saleTotal ===
        "number"
    ) {
        return order.saleTotal;
    }

    return parseMoney(
        order.sale
    );
}


function getOrderCost(order) {
    if (
        typeof order.costTotal ===
        "number"
    ) {
        return order.costTotal;
    }

    return parseMoney(
        order.cost
    );
}


function getOrderProfit(order) {
    if (
        typeof order.profitTotal ===
        "number"
    ) {
        return order.profitTotal;
    }

    return parseMoney(
        order.profit
    );
}


function changeOrderStatus(
    id,
    status
) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    order.status =
        status;

    saveOrders(orders);

    renderOrderCards();
}


// ---------- ОТКРЫТИЕ ЗАКАЗА ----------

function openOrderDetails(id) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) {
        alert(
            "Заказ не найден."
        );
        return;
    }

    // Миграция старых заказов
    if (!order.paymentStatus) {
        order.paymentStatus =
            "Не оплачено";
    }

    if (!Array.isArray(order.photos)) {
        order.photos = [];
    }

    if (order.comment == null) {
        order.comment = "";
    }

    saveOrders(orders);

    ensureOrderModal();

    renderOrderDetails(
        order
    );

    const modal =
        document.getElementById(
            "orderModal"
        );

    modal.classList.add(
        "active"
    );
}


function ensureOrderModal() {
    let modal =
        document.getElementById(
            "orderModal"
        );

    if (!modal) {
        createOrderModal();
        return;
    }

    if (
        !modal.querySelector(
            ".order-modal-content"
        )
    ) {
        modal.innerHTML = `
            <div
                class="modal-overlay"
                onclick="closeOrderDetails()"
            ></div>

            <div class="order-modal-content"></div>
        `;
    }

    addModalStyles();
}


function createOrderModal() {
    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "orderModal";

    modal.className =
        "modal";

    modal.innerHTML = `
        <div
            class="modal-overlay"
            onclick="closeOrderDetails()"
        ></div>

        <div class="order-modal-content"></div>
    `;

    document.body.appendChild(
        modal
    );

    addModalStyles();
}


// ---------- ПРОСМОТР ЗАКАЗА ----------

function renderOrderDetails(order) {
    const modal =
        document.getElementById(
            "orderModal"
        );

    if (!modal) return;

    const content =
        modal.querySelector(
            ".order-modal-content"
        );

    if (!content) return;

    const positions =
        order.positions || [];

    let positionsHtml = "";

    positions.forEach(
        (position, index) => {

            const productName =
                catalogNames(
                    position.category,
                    position.product
                );

            const description =
                position.description
                    ? `
                        <div class="detail-description">
                            ${escapeHtml(
                                position.description
                            )}
                        </div>
                    `
                    : "";

            positionsHtml += `
                <div
                    class="order-detail-position"
                >

                    <strong>
                        ${index + 1}.
                        ${escapeHtml(productName)}
                    </strong>

                    ${description}

                    <div>
                        ${position.quantity} шт.
                        ×
                        ${formatMoney(position.sale)}
                        грн
                    </div>

                    <div>
                        Себестоимость:
                        ${formatMoney(position.cost)}
                        грн / шт.
                    </div>

                    <div>
                        Сумма:
                        ${formatMoney(
                            position.saleTotal
                        )}
                        грн
                    </div>

                    <div>
                        Прибыль:
                        ${formatMoney(
                            position.profitTotal
                        )}
                        грн
                    </div>

                </div>
            `;
        }
    );

    const photos =
        Array.isArray(order.photos)
            ? order.photos
            : [];

    let photosHtml = "";

    if (photos.length) {
        photosHtml = `
            <div class="order-photos-grid">

                ${photos.map(
                    (photo, index) => `
                        <div
                            class="order-photo-item"
                        >

                            <img
                                src="${photo}"
                                alt="Фото заказа"
                            >

                            <button
                                type="button"
                                onclick="
                                    removeOrderPhoto(
                                        ${Number(order.id)},
                                        ${index}
                                    )
                                "
                            >
                                ×
                            </button>

                        </div>
                    `
                ).join("")}

            </div>
        `;
    } else {
        photosHtml = `
            <div class="no-photos">
                Фото пока нет.
            </div>
        `;
    }

    content.innerHTML = `

        <div class="order-detail-header">

            <div>
                <h2>
                    Заказ №${escapeHtml(
                        order.number || "—"
                    )}
                </h2>

                <div class="detail-client">
                    ${escapeHtml(
                        order.client ||
                        "Без имени"
                    )}
                </div>

                <small>
                    ${formatDate(
                        getOrderDate(order)
                    )}
                </small>
            </div>

            <button
                type="button"
                class="modal-close-button"
                onclick="closeOrderDetails()"
            >
                ×
            </button>

        </div>


        <div class="order-detail-block">

            <label>
                Статус заказа
            </label>

            <select
                onchange="
                    changeOrderStatusFromModal(
                        ${Number(order.id)},
                        this.value
                    )
                "
            >
                ${getStatusOptions(
                    getOrderStatus(order)
                )}
            </select>

        </div>


        <div class="order-detail-block">

            <label>
                Статус оплаты
            </label>

            <select
                onchange="
                    changePaymentStatus(
                        ${Number(order.id)},
                        this.value
                    )
                "
            >
                ${getPaymentOptions(
                    getPaymentStatus(order)
                )}
            </select>

        </div>


        <div class="order-detail-block">

            <div class="detail-section-title">
                Позиции
            </div>

            <div>
                ${positionsHtml}
            </div>

        </div>


        <div class="order-detail-total">

            <div>
                Продажа:
                <strong>
                    ${formatMoney(
                        getOrderSale(order)
                    )}
                    грн
                </strong>
            </div>

            <div>
                Себестоимость:
                <strong>
                    ${formatMoney(
                        getOrderCost(order)
                    )}
                    грн
                </strong>
            </div>

            <div>
                Прибыль:
                <strong>
                    ${formatMoney(
                        getOrderProfit(order)
                    )}
                    грн
                </strong>
            </div>

        </div>


        <div class="order-detail-block">

            <div class="detail-section-title">
                Комментарий
            </div>

            <textarea
                id="orderCommentInput"
                class="order-comment-input"
                placeholder="Напишите комментарий к заказу..."
            >${escapeHtml(
                order.comment || ""
            )}</textarea>

            <button
                type="button"
                class="secondary-button order-save-comment"
                onclick="
                    saveOrderComment(
                        ${Number(order.id)}
                    )
                "
            >
                Сохранить комментарий
            </button>

        </div>


        <div class="order-detail-block">

            <div class="detail-section-title">
                Фото заказа
            </div>

            <label class="photo-add-button">
                ＋ Добавить фото

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onchange="
                        addOrderPhotos(
                            ${Number(order.id)},
                            this.files
                        )
                    "
                    hidden
                >
            </label>

            ${photosHtml}

        </div>


        <div class="order-detail-buttons">

            <button
                type="button"
                class="primary-button"
                onclick="
                    openOrderEditor(
                        ${Number(order.id)}
                    )
                "
            >
                ✏️ Изменить заказ
            </button>

            <button
                type="button"
                class="danger-button"
                onclick="
                    deleteOrder(
                        ${Number(order.id)}
                    );
                    closeOrderDetails();
                "
            >
                Удалить заказ
            </button>

        </div>
    `;
}


// ---------- СТАТУС ОПЛАТЫ ----------

function changePaymentStatus(
    id,
    paymentStatus
) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    order.paymentStatus =
        paymentStatus;

    saveOrders(orders);

    renderOrderDetails(
        order
    );

    renderOrderCards();
}


// ---------- СТАТУС ИЗ МОДАЛЬНОГО ОКНА ----------

function changeOrderStatusFromModal(
    id,
    status
) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    order.status =
        status;

    saveOrders(orders);

    renderOrderDetails(
        order
    );

    renderOrderCards();
}


// ---------- КОММЕНТАРИЙ ----------

function saveOrderComment(id) {
    const input =
        document.getElementById(
            "orderCommentInput"
        );

    if (!input) return;

    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    order.comment =
        input.value;

    saveOrders(orders);

    const button =
        document.querySelector(
            ".order-save-comment"
        );

    if (button) {
        const oldText =
            button.textContent;

        button.textContent =
            "✓ Сохранено";

        setTimeout(() => {
            if (button) {
                button.textContent =
                    oldText;
            }
        }, 1200);
    }
}


// =====================================================
// ФОТО
// =====================================================

async function addOrderPhotos(
    id,
    files
) {
    if (!files || !files.length) {
        return;
    }

    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    if (!Array.isArray(order.photos)) {
        order.photos = [];
    }

    const fileArray =
        Array.from(files);

    try {

        for (const file of fileArray) {

            const dataUrl =
                await resizeImageToDataUrl(
                    file,
                    1400,
                    0.82
                );

            order.photos.push(
                dataUrl
            );
        }

        saveOrders(orders);

        renderOrderDetails(
            order
        );

    } catch (error) {

        console.error(
            "Ошибка добавления фото:",
            error
        );

        alert(
            "Не удалось добавить фото."
        );
    }
}


function resizeImageToDataUrl(
    file,
    maxSize = 1400,
    quality = 0.82
) {
    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = event => {

                const image =
                    new Image();

                image.onload = () => {

                    let width =
                        image.width;

                    let height =
                        image.height;

                    if (
                        width > maxSize ||
                        height > maxSize
                    ) {
                        const ratio =
                            Math.min(
                                maxSize / width,
                                maxSize / height
                            );

                        width =
                            Math.round(
                                width * ratio
                            );

                        height =
                            Math.round(
                                height * ratio
                            );
                    }

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    canvas.width =
                        width;

                    canvas.height =
                        height;

                    const ctx =
                        canvas.getContext(
                            "2d"
                        );

                    ctx.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );

                    resolve(
                        canvas.toDataURL(
                            "image/jpeg",
                            quality
                        )
                    );
                };

                image.onerror =
                    reject;

                image.src =
                    event.target.result;
            };

            reader.onerror =
                reject;

            reader.readAsDataURL(
                file
            );
        }
    );
}


function removeOrderPhoto(
    id,
    index
) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    if (!Array.isArray(order.photos)) {
        return;
    }

    if (
        !confirm(
            "Удалить это фото?"
        )
    ) {
        return;
    }

    order.photos.splice(
        index,
        1
    );

    saveOrders(orders);

    renderOrderDetails(
        order
    );
}


function openOrderPhoto(photoUrl) {
    const viewer = document.createElement("div");
    viewer.id = "photoViewer";
    viewer.innerHTML = `
        <div class="photo-viewer-overlay" onclick="closeOrderPhoto()">
            <button class="photo-viewer-close" onclick="event.stopPropagation(); closeOrderPhoto()">×</button>
            <img src="${photo.dataUrl}" class="order-photo" onclick="openOrderPhoto('${photo.dataUrl}')">
        </div>
    `;

    document.body.appendChild(viewer);

    requestAnimationFrame(() => {
        viewer.classList.add("active");
    });
}

function closeOrderPhoto() {
    const viewer = document.getElementById("photoViewer");

    if (!viewer) return;

    viewer.classList.remove("active");

    setTimeout(() => {
        viewer.remove();
    }, 200);
}


// =====================================================
// РЕДАКТИРОВАНИЕ ЗАКАЗА
// =====================================================

function openOrderEditor(id) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    ensureOrderModal();

    renderOrderEditor(
        order
    );
}


function renderOrderEditor(order) {
    const modal =
        document.getElementById(
            "orderModal"
        );

    const content =
        modal?.querySelector(
            ".order-modal-content"
        );

    if (!content) return;

    let positionsHtml = "";

    (order.positions || [])
        .forEach(
            (position, index) => {

                positionsHtml +=
                    createEditPositionHtml(
                        position,
                        index
                    );
            }
        );

    content.innerHTML = `

        <div class="order-detail-header">

            <div>
                <h2>
                    Изменение заказа №${escapeHtml(
                        order.number || "—"
                    )}
                </h2>
            </div>

            <button
                type="button"
                class="modal-close-button"
                onclick="
                    openOrderDetails(
                        ${Number(order.id)}
                    )
                "
            >
                ×
            </button>

        </div>


        <div class="order-detail-block">

            <label>
                Клиент
            </label>

            <input
                id="editOrderClient"
                type="text"
                value="${escapeHtml(
                    order.client || ""
                )}"
                placeholder="Имя клиента"
            >

        </div>


        <div
            id="editOrderPositions"
            class="edit-order-positions"
        >
            ${positionsHtml}
        </div>


        <button
            type="button"
            class="secondary-button"
            onclick="addEditOrderPosition()"
        >
            ＋ Добавить позицию
        </button>


        <div class="edit-order-actions">

            <button
                type="button"
                class="primary-button"
                onclick="
                    saveEditedOrder(
                        ${Number(order.id)}
                    )
                "
            >
                Сохранить изменения
            </button>

            <button
                type="button"
                class="secondary-button"
                onclick="
                    openOrderDetails(
                        ${Number(order.id)}
                    )
                "
            >
                Отмена
            </button>

        </div>
    `;

    modal.classList.add(
        "active"
    );
}


function createEditPositionHtml(
    position = {},
    index = 0
) {
    const category =
        position.category || "";

    const product =
        position.product || "";

    const quantity =
        Number(
            position.quantity || 1
        );

    const sale =
        Number(
            position.sale || 0
        );

    const cost =
        Number(
            position.cost || 0
        );

    const description =
        position.description || "";

    return `
        <div
            class="edit-position-card"
            data-edit-position
        >

            <div class="edit-position-header">

                <strong>
                    Позиция ${index + 1}
                </strong>

                <button
                    type="button"
                    onclick="removeEditPosition(this)"
                >
                    ×
                </button>

            </div>


            <div class="field">

                <label>
                    Категория
                </label>

                <select
                    class="edit-category"
                    onchange="
                        updateEditProductOptions(this)
                    "
                >
                    <option value="">
                        Выберите категорию
                    </option>

                    <option
                        value="diploma"
                        ${
                            category === "diploma"
                                ? "selected"
                                : ""
                        }
                    >
                        Дипломы
                    </option>

                    <option
                        value="cup_ready"
                        ${
                            category === "cup_ready"
                                ? "selected"
                                : ""
                        }
                    >
                        Готовая чашка
                    </option>

                    <option
                        value="cup_print"
                        ${
                            category === "cup_print"
                                ? "selected"
                                : ""
                        }
                    >
                        Печать чашка
                    </option>

                    <option
                        value="cup_custom"
                        ${
                            category === "cup_custom"
                                ? "selected"
                                : ""
                        }
                    >
                        Чашка
                    </option>

                    <option
                        value="packaging"
                        ${
                            category === "packaging"
                                ? "selected"
                                : ""
                        }
                    >
                        Упаковка для чашки
                    </option>

                    <option
                        value="designer"
                        ${
                            category === "designer"
                                ? "selected"
                                : ""
                        }
                    >
                        Услуги дизайнера
                    </option>

                    <option
                        value="urgent"
                        ${
                            category === "urgent"
                                ? "selected"
                                : ""
                        }
                    >
                        Срочность
                    </option>

                </select>

            </div>


            <div class="field">

                <label>
                    Изделие
                </label>

                <select
                    class="edit-product"
                    data-selected-product="${escapeHtml(
                        product
                    )}"
                    onchange="
                        updateEditProductPrice(this)
                    "
                >
                    ${getEditProductOptionsHtml(
                        category,
                        product
                    )}
                </select>

            </div>


            <div
                class="edit-extra-field"
            >
                ${
                    (
                        category === "cup_custom" ||
                        category === "packaging"
                    )
                        ? `
                            <div class="field">
                                <label>
                                    Описание
                                </label>

                                <input
                                    type="text"
                                    class="edit-description"
                                    value="${escapeHtml(
                                        description
                                    )}"
                                    placeholder="Описание"
                                >
                            </div>
                        `
                        : ""
                }
            </div>


            <div class="field">

                <label>
                    Количество
                </label>

                <input
                    type="number"
                    class="edit-quantity"
                    min="1"
                    value="${quantity}"
                    oninput="
                        updateEditDiplomaPrice(this)
                    "
                >

            </div>


            <div class="manual-prices">

                <div class="field">

                    <label>
                        Цена продажи / шт.
                    </label>

                    <input
                        type="number"
                        class="edit-sale"
                        min="0"
                        step="0.01"
                        value="${sale}"
                    >

                </div>


                <div class="field">

                    <label>
                        Себестоимость / шт.
                    </label>

                    <input
                        type="number"
                        class="edit-cost"
                        min="0"
                        step="0.01"
                        value="${cost}"
                    >

                </div>

            </div>

        </div>
    `;
}


function getEditProductOptionsHtml(
    category,
    selected
) {
    let html =
        `<option value="">Выберите изделие</option>`;

    if (category === "diploma") {

        const catalog =
            loadCatalog();

        Object.entries(
            catalog.diplomaPrices
        ).forEach(
            ([key, item]) => {

                html += `
                    <option
                        value="${escapeHtml(key)}"
                        ${
                            key === selected
                                ? "selected"
                                : ""
                        }
                    >
                        ${escapeHtml(
                            item.name
                        )}
                    </option>
                `;
            }
        );
    }

    if (category === "cup_ready") {

        const catalog =
            loadCatalog();

        Object.entries(
            catalog.readyCups
        ).forEach(
            ([key, item]) => {

                html += `
                    <option
                        value="${escapeHtml(key)}"
                        ${
                            key === selected
                                ? "selected"
                                : ""
                        }
                    >
                        ${escapeHtml(
                            item.name
                        )}
                    </option>
                `;
            }
        );
    }

    if (category === "cup_print") {
        html = `
            <option
                value="cup_print"
                selected
            >
                Печать на чашке
            </option>
        `;
    }

    if (category === "cup_custom") {
        html = `
            <option
                value="cup_custom"
                selected
            >
                Чашка
            </option>
        `;
    }

    if (category === "packaging") {
        html = `
            <option
                value="packaging"
                selected
            >
                Упаковка для чашки
            </option>
        `;
    }

    if (category === "designer") {
        html = `
            <option
                value="designer"
                selected
            >
                Услуги дизайнера
            </option>
        `;
    }

    if (category === "urgent") {
        html = `
            <option
                value="urgent"
                selected
            >
                Срочность
            </option>
        `;
    }

    return html;
}


function updateEditProductOptions(
    categorySelect
) {
    const card =
        categorySelect.closest(
            "[data-edit-position]"
        );

    if (!card) return;

    const category =
        categorySelect.value;

    const product =
        card.querySelector(
            ".edit-product"
        );

    const extra =
        card.querySelector(
            ".edit-extra-field"
        );

    if (!product) return;

    product.innerHTML =
        getEditProductOptionsHtml(
            category,
            ""
        );

    if (extra) {
        if (
            category === "cup_custom" ||
            category === "packaging"
        ) {
            extra.innerHTML = `
                <div class="field">
                    <label>
                        Описание
                    </label>

                    <input
                        type="text"
                        class="edit-description"
                        placeholder="Описание"
                    >
                </div>
            `;
        } else {
            extra.innerHTML = "";
        }
    }

    updateEditProductPrice(
        product
    );
}


function updateEditProductPrice(
    productSelect
) {
    const card =
        productSelect.closest(
            "[data-edit-position]"
        );

    if (!card) return;

    const category =
        card.querySelector(
            ".edit-category"
        )?.value;

    const product =
        productSelect.value;

    const quantity =
        Number(
            card.querySelector(
                ".edit-quantity"
            )?.value || 1
        );

    const sale =
        card.querySelector(
            ".edit-sale"
        );

    const cost =
        card.querySelector(
            ".edit-cost"
        );

    if (!sale || !cost) return;

    if (category === "diploma") {

        const price =
            getDiplomaPrice(
                product,
                quantity
            );

        sale.value =
            price.sale;

        cost.value =
            price.cost;

        return;
    }

    if (category === "cup_ready") {

        const catalog =
            loadCatalog();

        const cup =
            catalog.readyCups[product];

        if (cup) {
            sale.value =
                cup.sale;

            cost.value =
                cup.cost;
        }

        return;
    }

    if (
        category === "cup_print" ||
        category === "cup_custom" ||
        category === "packaging" ||
        category === "designer" ||
        category === "urgent"
    ) {
        sale.value = 0;
        cost.value = 0;
    }
}


function updateEditDiplomaPrice(
    quantityInput
) {
    const card =
        quantityInput.closest(
            "[data-edit-position]"
        );

    if (!card) return;

    const category =
        card.querySelector(
            ".edit-category"
        )?.value;

    const product =
        card.querySelector(
            ".edit-product"
        )?.value;

    if (category !== "diploma") {
        return;
    }

    const quantity =
        Number(
            quantityInput.value || 1
        );

    const price =
        getDiplomaPrice(
            product,
            quantity
        );

    const sale =
        card.querySelector(
            ".edit-sale"
        );

    const cost =
        card.querySelector(
            ".edit-cost"
        );

    if (sale) {
        sale.value =
            price.sale;
    }

    if (cost) {
        cost.value =
            price.cost;
    }
}


function addEditOrderPosition() {
    const container =
        document.getElementById(
            "editOrderPositions"
        );

    if (!container) return;

    const index =
        container.querySelectorAll(
            "[data-edit-position]"
        ).length;

    container.insertAdjacentHTML(
        "beforeend",
        createEditPositionHtml(
            {},
            index
        )
    );
}


function removeEditPosition(
    button
) {
    const card =
        button.closest(
            "[data-edit-position]"
        );

    if (card) {
        card.remove();
    }

    renumberEditPositions();
}


function renumberEditPositions() {
    document
        .querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        )
        .forEach(
            (card, index) => {

                const title =
                    card.querySelector(
                        ".edit-position-header strong"
                    );

                if (title) {
                    title.textContent =
                        `Позиция ${index + 1}`;
                }
            }
        );
}


function collectEditedPositions() {
    const positions = [];

    document
        .querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        )
        .forEach(card => {

            const category =
                card.querySelector(
                    ".edit-category"
                )?.value || "";

            const product =
                card.querySelector(
                    ".edit-product"
                )?.value || "";

            if (!category || !product) {
                return;
            }

            const quantity =
                Math.max(
                    1,
                    Number(
                        card.querySelector(
                            ".edit-quantity"
                        )?.value || 1
                    )
                );

            const sale =
                Number(
                    card.querySelector(
                        ".edit-sale"
                    )?.value || 0
                );

            const cost =
                Number(
                    card.querySelector(
                        ".edit-cost"
                    )?.value || 0
                );

            const description =
                card.querySelector(
                    ".edit-description"
                )?.value || "";

            positions.push({
                category,
                product,
                description,
                quantity,
                sale,
                cost,
                saleTotal:
                    sale * quantity,
                costTotal:
                    cost * quantity,
                profitTotal:
                    (sale - cost) *
                    quantity
            });
        });

    return positions;
}


function saveEditedOrder(id) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    const positions =
        collectEditedPositions();

    if (!positions.length) {
        alert(
            "В заказе должна быть хотя бы одна позиция."
        );
        return;
    }

    const client =
        document.getElementById(
            "editOrderClient"
        )?.value.trim() ||
        "Без имени";

    const totals =
        positions.reduce(
            (result, position) => {

                result.sale +=
                    position.saleTotal;

                result.cost +=
                    position.costTotal;

                result.profit +=
                    position.profitTotal;

                return result;

            },
            {
                sale: 0,
                cost: 0,
                profit: 0
            }
        );

    order.client =
        client;

    order.positions =
        positions;

    order.saleTotal =
        totals.sale;

    order.costTotal =
        totals.cost;

    order.profitTotal =
        totals.profit;

    order.sale =
        `${formatMoney(
            totals.sale
        )} грн`;

    order.cost =
        `${formatMoney(
            totals.cost
        )} грн`;

    order.profit =
        `${formatMoney(
            totals.profit
        )} грн`;

    saveOrders(orders);

    alert(
        `Заказ №${order.number} изменён.`
    );

    renderOrderDetails(
        order
    );

    renderOrderCards();
}


// ---------- ЗАКРЫТИЕ ----------

function closeOrderDetails() {
    const modal =
        document.getElementById(
            "orderModal"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


function closeOrders() {
    closeOrderDetails();
}


// =====================================================
// УДАЛЕНИЕ
// =====================================================

function deleteOrder(id) {
    const orders =
        getOrders();

    const order =
        orders.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!order) return;

    const number =
        order.number || "—";

    if (
        !confirm(
            `Удалить заказ №${number}?`
        )
    ) {
        return;
    }

    const updated =
        orders.filter(item =>
            Number(item.id) !==
            Number(id)
        );

    saveOrders(
        updated
    );

    renderOrderCards();
}


// =====================================================
// КАТАЛОГ
// =====================================================

function showCatalog() {
    hideAllScreens();

    const screen =
        document.getElementById(
            "screenCatalog"
        );

    if (!screen) return;

    screen.classList.add(
        "active"
    );

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );

    if (title) {
        title.textContent =
            "Каталог";
    }

    if (subtitle) {
        subtitle.textContent =
            "Цены и себестоимость";
    }

    renderCatalog();

    setActiveNav(
        "Каталог"
    );
}


function openCatalog() {
    showCatalog();
}


function renderCatalog() {
    const container =
        document.getElementById(
            "catalogContent"
        );

    if (!container) return;

    const catalog =
        loadCatalog();

    let html = "";

    html += `
        <div class="catalog-section">

            <h3>
                Дипломы
            </h3>

            <div class="catalog-table">
    `;

    Object.entries(
        catalog.diplomaPrices
    ).forEach(
        ([key, diploma]) => {

            html += `
                <div class="catalog-product">

                    <h4>
                        ${escapeHtml(
                            diploma.name
                        )}
                    </h4>

                    <div class="catalog-grid">

                        <div class="catalog-grid-head">
                            <span>
                                Количество
                            </span>

                            <span>
                                Продажа
                            </span>

                            <span>
                                Себестоимость
                            </span>
                        </div>
            `;

            Object.entries(
                diploma.tiers
            ).forEach(
                ([tierKey, tier]) => {

                    const range =
                        tier.max === Infinity
                            ? `${tier.min}+`
                            : `${tier.min}–${tier.max}`;

                    html += `
                        <div
                            class="catalog-grid-row"
                        >

                            <span>
                                ${range} шт.
                            </span>

                            <input
                                type="number"
                                min="0"
                                data-diploma="${escapeHtml(key)}"
                                data-tier="${tierKey}"
                                data-type="sale"
                                value="${Number(
                                    tier.sale || 0
                                )}"
                            >

                            <input
                                type="number"
                                min="0"
                                data-diploma="${escapeHtml(key)}"
                                data-tier="${tierKey}"
                                data-type="cost"
                                value="${Number(
                                    tier.cost || 0
                                )}"
                            >

                        </div>
                    `;
                }
            );

            html += `
                    </div>
                </div>
            `;
        }
    );

    html += `
            </div>
        </div>
    `;


    html += `
        <div class="catalog-section">

            <h3>
                Готовые чашки
            </h3>
    `;

    Object.entries(
        catalog.readyCups
    ).forEach(
        ([key, cup]) => {

            html += `
                <div
                    class="catalog-product"
                >

                    <h4>
                        ${escapeHtml(
                            cup.name
                        )}
                    </h4>

                    <div
                        class="catalog-two-inputs"
                    >

                        <label>
                            Цена продажи

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                data-cup="${escapeHtml(key)}"
                                data-type="sale"
                                value="${Number(
                                    cup.sale || 0
                                )}"
                            >
                        </label>

                        <label>
                            Себестоимость

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                data-cup="${escapeHtml(key)}"
                                data-type="cost"
                                value="${Number(
                                    cup.cost || 0
                                )}"
                            >
                        </label>

                    </div>

                </div>
            `;
        }
    );

    html += `
        </div>

        <button
            type="button"
            class="primary-button"
            onclick="saveCatalogFromScreen()"
        >
            Сохранить изменения
        </button>

        <button
            type="button"
            class="secondary-button"
            onclick="resetCatalog()"
        >
            Сбросить каталог
        </button>
    `;

    container.innerHTML =
        html;

    addCatalogStyles();
}


function saveCatalogFromScreen() {
    const catalog =
        loadCatalog();

    document
        .querySelectorAll(
            "[data-diploma]"
        )
        .forEach(input => {

            const key =
                input.dataset.diploma;

            const tier =
                input.dataset.tier;

            const type =
                input.dataset.type;

            if (
                !catalog.diplomaPrices[key]
            ) {
                return;
            }

            if (
                !catalog.diplomaPrices[key]
                    .tiers[tier]
            ) {
                return;
            }

            catalog
                .diplomaPrices[key]
                .tiers[tier][type] =
                Number(
                    input.value || 0
                );
        });

    document
        .querySelectorAll(
            "[data-cup]"
        )
        .forEach(input => {

            const key =
                input.dataset.cup;

            const type =
                input.dataset.type;

            if (
                !catalog.readyCups[key]
            ) {
                return;
            }

            catalog
                .readyCups[key][type] =
                Number(
                    input.value || 0
                );
        });

    saveCatalog(
        catalog
    );

    alert(
        "Каталог сохранён."
    );

    renderCatalog();
}


function resetCatalog() {
    if (
        !confirm(
            "Сбросить цены каталога к первоначальным?"
        )
    ) {
        return;
    }

    saveCatalog({
        diplomaPrices:
            structuredClone(
                DEFAULT_DIPLOMA_PRICES
            ),

        readyCups:
            structuredClone(
                DEFAULT_READY_CUPS
            )
    });

    renderCatalog();
}


// =====================================================
// СТАТИСТИКА
// =====================================================

function showStatistics() {
    hideAllScreens();

    let screen =
        document.getElementById(
            "screenStatistics"
        );

    if (!screen) {

        screen =
            document.createElement(
                "section"
            );

        screen.id =
            "screenStatistics";

        screen.className =
            "screen";

        const main =
            document.querySelector(
                "main"
            );

        if (main) {
            main.appendChild(
                screen
            );
        } else {
            document.body.appendChild(
                screen
            );
        }
    }

    screen.classList.add(
        "active"
    );

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );

    if (title) {
        title.textContent =
            "Статистика";
    }

    if (subtitle) {
        subtitle.textContent =
            "Продажи и прибыль";
    }

    renderStatistics();

    setActiveNav(
        "Статистика"
    );
}


function renderStatistics() {
    const screen =
        document.getElementById(
            "screenStatistics"
        );

    if (!screen) return;

    const orders =
        getOrders();

    const period =
        localStorage.getItem(
            "statisticsPeriod"
        ) || "all";

    const filtered =
        filterOrdersByPeriod(
            orders,
            period
        );

    const totalSale =
        filtered.reduce(
            (sum, order) =>
                sum +
                getOrderSale(order),
            0
        );

    const totalCost =
        filtered.reduce(
            (sum, order) =>
                sum +
                getOrderCost(order),
            0
        );

    const totalProfit =
        filtered.reduce(
            (sum, order) =>
                sum +
                getOrderProfit(order),
            0
        );

    const average =
        filtered.length
            ? totalSale /
              filtered.length
            : 0;

    const margin =
        totalSale
            ? (
                totalProfit /
                totalSale
            ) * 100
            : 0;

    const statuses = {};

    filtered.forEach(order => {

        const status =
            getOrderStatus(
                order
            );

        statuses[status] =
            (
                statuses[status] ||
                0
            ) + 1;
    });

    screen.innerHTML = `
        <div class="statistics-container">

            <div
                class="statistics-period"
            >

                <label>
                    Период
                </label>

                <select
                    onchange="
                        localStorage.setItem(
                            'statisticsPeriod',
                            this.value
                        );
                        renderStatistics();
                    "
                >

                    <option
                        value="all"
                        ${
                            period === "all"
                                ? "selected"
                                : ""
                        }
                    >
                        Всё время
                    </option>

                    <option
                        value="today"
                        ${
                            period === "today"
                                ? "selected"
                                : ""
                        }
                    >
                        Сегодня
                    </option>

                    <option
                        value="7days"
                        ${
                            period === "7days"
                                ? "selected"
                                : ""
                        }
                    >
                        Последние 7 дней
                    </option>

                    <option
                        value="month"
                        ${
                            period === "month"
                                ? "selected"
                                : ""
                        }
                    >
                        Текущий месяц
                    </option>

                </select>

            </div>

            <div
                class="statistics-grid"
            >

                <div class="stat-card">
                    <span>
                        Заказов
                    </span>

                    <strong>
                        ${filtered.length}
                    </strong>
                </div>

                <div class="stat-card">
                    <span>
                        Продажи
                    </span>

                    <strong>
                        ${formatMoney(
                            totalSale
                        )} грн
                    </strong>
                </div>

                <div class="stat-card">
                    <span>
                        Себестоимость
                    </span>

                    <strong>
                        ${formatMoney(
                            totalCost
                        )} грн
                    </strong>
                </div>

                <div class="stat-card">
                    <span>
                        Прибыль
                    </span>

                    <strong>
                        ${formatMoney(
                            totalProfit
                        )} грн
                    </strong>
                </div>

                <div class="stat-card">
                    <span>
                        Средний заказ
                    </span>

                    <strong>
                        ${formatMoney(
                            average
                        )} грн
                    </strong>
                </div>

                <div class="stat-card">
                    <span>
                        Маржа
                    </span>

                    <strong>
                        ${margin.toFixed(
                            1
                        )}%
                    </strong>
                </div>

            </div>

            <div
                class="statistics-statuses"
            >

                <h3>
                    Статусы
                </h3>

                ${
                    Object.entries(
                        statuses
                    )
                    .map(
                        ([status, count]) => `
                            <div
                                class="statistics-status-row"
                            >
                                <span>
                                    ${escapeHtml(
                                        status
                                    )}
                                </span>

                                <strong>
                                    ${count}
                                </strong>
                            </div>
                        `
                    )
                    .join("")
                }

            </div>

        </div>
    `;

    addStatisticsStyles();
}


function filterOrdersByPeriod(
    orders,
    period
) {
    if (
        period === "all"
    ) {
        return orders;
    }

    const now =
        new Date();

    return orders.filter(
        order => {

            const date =
                new Date(
                    getOrderDate(order)
                );

            if (
                period === "today"
            ) {
                return (
                    date.getFullYear() ===
                        now.getFullYear() &&

                    date.getMonth() ===
                        now.getMonth() &&

                    date.getDate() ===
                        now.getDate()
                );
            }

            if (
                period === "7days"
            ) {
                const sevenDaysAgo =
                    Date.now() -
                    7 *
                    24 *
                    60 *
                    60 *
                    1000;

                return (
                    getOrderDate(order) >=
                    sevenDaysAgo
                );
            }

            if (
                period === "month"
            ) {
                return (
                    date.getFullYear() ===
                        now.getFullYear() &&

                    date.getMonth() ===
                        now.getMonth()
                );
            }

            return true;
        }
    );
}


// =====================================================
// ГЛАВНЫЙ ЭКРАН
// =====================================================

function showOrder() {
    hideAllScreens();

    const screen =
        document.getElementById(
            "screenOrder"
        );

    if (!screen) return;

    screen.classList.add(
        "active"
    );

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );

    if (title) {
        title.textContent =
            "Новый заказ";
    }

    if (subtitle) {
        subtitle.textContent =
            "Расчёт заказа";
    }

    setActiveNav(
        "Новый заказ"
    );
}


function showOrderScreen() {
    showOrder();
}


// =====================================================
// НАСТРОЙКИ
// =====================================================

function showSettings() {
    hideAllScreens();

    const screen =
        document.getElementById(
            "screenSettings"
        );

    if (!screen) return;

    screen.classList.add(
        "active"
    );

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );

    if (title) {
        title.textContent =
            "Настройки";
    }

    if (subtitle) {
        subtitle.textContent =
            "Настройки приложения";
    }

    setActiveNav(
        "Настройки"
    );
}


function deleteAllOrders() {
    if (
        !confirm(
            "Удалить ВСЕ сохранённые заказы?"
        )
    ) {
        return;
    }

    localStorage.removeItem(
        "printAppOrders"
    );

    alert(
        "Все заказы удалены."
    );

    ordersSearch = "";

    showOrders();
}


// =====================================================
// НАВИГАЦИЯ
// =====================================================

function hideAllScreens() {
    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            screen => {
                screen.classList.remove(
                    "active"
                );
            }
        );
}


function setActiveNav(name) {
    document
        .querySelectorAll(
            ".bottom-nav .nav-item, .extra-nav-item"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.nav ===
                        name
                );
            }
        );
}


function getBottomNavigation(
    active = ""
) {
    return `
        <div
            class="extra-bottom-nav"
        >

            <button
                class="extra-nav-item ${
                    active === "Новый заказ"
                        ? "active"
                        : ""
                }"
                data-nav="Новый заказ"
                onclick="showOrder()"
            >
                ＋
                <span>
                    Заказ
                </span>
            </button>

            <button
                class="extra-nav-item ${
                    active === "Каталог"
                        ? "active"
                        : ""
                }"
                data-nav="Каталог"
                onclick="showCatalog()"
            >
                📦
                <span>
                    Каталог
                </span>
            </button>

            <button
                class="extra-nav-item ${
                    active === "Заказы"
                        ? "active"
                        : ""
                }"
                data-nav="Заказы"
                onclick="showOrders()"
            >
                📋
                <span>
                    Заказы
                </span>
            </button>

            <button
                class="extra-nav-item ${
                    active === "Статистика"
                        ? "active"
                        : ""
                }"
                data-nav="Статистика"
                onclick="showStatistics()"
            >
                📊
                <span>
                    Статистика
                </span>
            </button>

            <button
                class="extra-nav-item ${
                    active === "Настройки"
                        ? "active"
                        : ""
                }"
                data-nav="Настройки"
                onclick="showSettings()"
            >
                ⚙️
                <span>
                    Настройки
                </span>
            </button>

        </div>
    `;
}


// =====================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =====================================================

function formatMoney(value) {
    return Number(
        value || 0
    ).toLocaleString(
        "uk-UA",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );
}


function parseMoney(value) {
    if (
        typeof value ===
        "number"
    ) {
        return value;
    }

    if (!value) {
        return 0;
    }

    const cleaned =
        String(value)
            .replace(/\s/g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");

    return (
        Number(cleaned) ||
        0
    );
}


function formatDate(timestamp) {
    if (!timestamp) {
        return "—";
    }

    const date =
        new Date(timestamp);

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleString(
        "uk-UA",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function escapeHtml(value) {
    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// СТИЛИ КАТАЛОГА
// =====================================================

function addCatalogStyles() {
    if (
        document.getElementById(
            "dynamicCatalogStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "dynamicCatalogStyles";

    style.textContent = `
        .catalog-section {
            margin-bottom: 24px;
        }

        .catalog-product {
            background: #fff;
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,.06);
        }

        .catalog-product h4 {
            margin: 0 0 12px;
        }

        .catalog-grid-head,
        .catalog-grid-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            align-items: center;
        }

        .catalog-grid-head {
            font-size: 12px;
            color: #777;
            margin-bottom: 6px;
        }

        .catalog-grid-row {
            margin-bottom: 8px;
        }

        .catalog-grid-row input,
        .catalog-two-inputs input {
            width: 100%;
            box-sizing: border-box;
        }

        .catalog-two-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .catalog-two-inputs label {
            font-size: 13px;
        }

        .catalog-two-inputs input {
            margin-top: 5px;
        }
    `;

    document.head.appendChild(
        style
    );
}


// =====================================================
// СТИЛИ ЗАКАЗОВ И МОДАЛКИ
// =====================================================

function addModalStyles() {
    if (
        document.getElementById(
            "dynamicModalStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "dynamicModalStyles";

    style.textContent = `

        #orderModal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: none;
        }

        #orderModal.active {
            display: block;
        }

        #orderModal .modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,.45);
        }

        .order-modal-content {
            position: absolute;
            left: 10px;
            right: 10px;
            bottom: 10px;
            max-height: 92vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: #fff;
            border-radius: 22px;
            padding: 18px;
            box-sizing: border-box;
        }

        .order-detail-header {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .order-detail-header h2 {
            margin: 0 0 5px;
        }

        .modal-close-button {
            border: 0;
            background: none;
            font-size: 32px;
            line-height: 1;
            padding: 0 5px;
        }

        .detail-client {
            font-size: 17px;
            font-weight: 600;
        }

        .order-detail-block {
            margin: 16px 0;
        }

        .order-detail-block > label {
            display: block;
            font-weight: 600;
            margin-bottom: 7px;
        }

        .order-detail-block select,
        .order-detail-block input,
        .order-comment-input {
            width: 100%;
            box-sizing: border-box;
        }

        .order-comment-input {
            min-height: 100px;
            resize: vertical;
            padding: 11px;
            border-radius: 12px;
            border: 1px solid #ddd;
            font: inherit;
        }

        .detail-section-title {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .detail-description {
            color: #666;
            margin: 4px 0;
        }

        .order-detail-position {
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            line-height: 1.5;
        }

        .order-detail-total {
            margin-top: 16px;
            display: grid;
            gap: 8px;
            background: #f7f7f7;
            border-radius: 14px;
            padding: 14px;
        }

        .order-save-comment {
            width: 100%;
            margin-top: 8px;
        }

        .photo-add-button {
            display: block;
            text-align: center;
            padding: 13px;
            border-radius: 12px;
            background: #f1f1f1;
            cursor: pointer;
            margin-bottom: 12px;
        }

        .order-photos-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }

        .order-photo-item {
            position: relative;
            aspect-ratio: 1;
            overflow: hidden;
            border-radius: 12px;
            background: #eee;
        }

        .order-photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .order-photo-item button {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 28px;
            height: 28px;
            border: 0;
            border-radius: 50%;
            background: rgba(0,0,0,.65);
            color: white;
            font-size: 20px;
            line-height: 20px;
        }

        .no-photos {
            color: #777;
            padding: 10px 0;
        }

        .order-detail-buttons,
        .edit-order-actions {
            display: grid;
            gap: 9px;
            margin-top: 20px;
        }

        .primary-button,
        .secondary-button,
        .danger-button {
            width: 100%;
            border: 0;
            border-radius: 12px;
            padding: 13px;
            font: inherit;
            cursor: pointer;
        }

        .danger-button {
            background: #e53935;
            color: white;
        }

        .edit-position-card {
            background: #f7f7f7;
            border-radius: 15px;
            padding: 13px;
            margin-bottom: 12px;
        }

        .edit-position-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .edit-position-header button {
            border: 0;
            background: transparent;
            font-size: 25px;
        }

        .edit-position-card input,
        .edit-position-card select {
            width: 100%;
            box-sizing: border-box;
        }

        .order-payment {
            font-size: 13px;
            margin-top: 7px;
        }

        .order-payment b {
            font-weight: 600;
        }

    `;

    document.head.appendChild(
        style
    );
}


function addOrdersStyles() {
    if (
        document.getElementById(
            "dynamicOrdersStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "dynamicOrdersStyles";

    style.textContent = `

        .orders-controls {
            display: grid;
            gap: 8px;
            margin-bottom: 15px;
        }

        .orders-controls input,
        .orders-controls select {
            width: 100%;
            box-sizing: border-box;
        }

        .orders-controls input {
            -webkit-appearance: none;
            appearance: none;
        }

        .order-card {
            background: #fff;
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,.06);
        }

        .order-card-main {
            cursor: pointer;
        }

        .order-card-top {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            align-items: center;
        }

        .order-status {
            font-size: 12px;
            background: #eee;
            padding: 5px 8px;
            border-radius: 10px;
            white-space: nowrap;
        }

        .order-client {
            font-size: 17px;
            font-weight: 600;
            margin-top: 8px;
        }

        .order-date {
            font-size: 12px;
            color: #777;
            margin-top: 4px;
        }

        .order-money {
            display: grid;
            gap: 4px;
            margin-top: 12px;
            font-size: 13px;
        }

        .order-card-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .order-card-actions select {
            flex: 1;
            min-width: 0;
        }

        .order-card-actions button {
            border: 0;
            border-radius: 9px;
            padding: 8px 10px;
        }

        .empty-orders {
            text-align: center;
            padding: 40px 20px;
            color: #777;
        }

    `;

    document.head.appendChild(
        style
    );
}


function addStatisticsStyles() {
    if (
        document.getElementById(
            "dynamicStatisticsStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "dynamicStatisticsStyles";

    style.textContent = `

        .statistics-container {
            padding-bottom: 30px;
        }

        .statistics-period {
            margin-bottom: 16px;
        }

        .statistics-period select {
            width: 100%;
            margin-top: 6px;
        }

        .statistics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,.06);
        }

        .stat-card span {
            display: block;
            font-size: 13px;
            color: #777;
            margin-bottom: 6px;
        }

        .stat-card strong {
            font-size: 20px;
        }

        .statistics-statuses {
            background: #fff;
            border-radius: 16px;
            padding: 15px;
            margin-top: 15px;
        }

        .statistics-status-row {
            display: flex;
            justify-content: space-between;
            padding: 9px 0;
            border-bottom: 1px solid #eee;
        }

    `;

    document.head.appendChild(
        style
    );
}


// =====================================================
// ИНИЦИАЛИЗАЦИЯ
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCatalog();

        addOrdersStyles();
        addModalStyles();

        const positions =
            document.getElementById(
                "positions"
            );

        if (
            positions &&
            positions.children.length === 0
        ) {
            addPosition();
        }

        if (
            !document.getElementById(
                "screenStatistics"
            )
        ) {

            const statistics =
                document.createElement(
                    "section"
                );

            statistics.id =
                "screenStatistics";

            statistics.className =
                "screen";

            const main =
                document.querySelector(
                    "main"
                );

            if (main) {
                main.appendChild(
                    statistics
                );
            }
        }

        document
            .querySelectorAll(
                ".screen"
            )
            .forEach(
                screen => {

                    if (
                        screen.id ===
                            "screenOrder" ||
                        screen.querySelector(
                            ".extra-bottom-nav"
                        )
                    ) {
                        return;
                    }

                    let active = "";

                    if (
                        screen.id ===
                        "screenCatalog"
                    ) {
                        active =
                            "Каталог";
                    }

                    if (
                        screen.id ===
                        "screenOrders"
                    ) {
                        active =
                            "Заказы";
                    }

                    if (
                        screen.id ===
                        "screenSettings"
                    ) {
                        active =
                            "Настройки";
                    }

                    if (
                        screen.id ===
                        "screenStatistics"
                    ) {
                        active =
                            "Статистика";
                    }

                    screen.insertAdjacentHTML(
                        "beforeend",
                        getBottomNavigation(
                            active
                        )
                    );
                }
            );

        setActiveNav(
            "Новый заказ"
        );

        if (
            "serviceWorker" in
            navigator
        ) {
            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .catch(
                    error => {
                        console.error(
                            "Service Worker error:",
                            error
                        );
                    }
                );
        }
    }
);


// =====================================================
// ОБНОВЛЕНИЕ
// ФОТО + ДОСТАВКА + ТТН + НОВЫЕ ТОВАРЫ
// ВСТАВИТЬ В САМЫЙ КОНЕЦ app.js
// =====================================================


// =====================================================
// КАТАЛОГ — МОИ ТОВАРЫ
// =====================================================

const _baseLoadCatalog = loadCatalog;

loadCatalog = function () {

    const catalog =
        _baseLoadCatalog();

    if (
        !catalog.customProducts ||
        typeof catalog.customProducts !== "object"
    ) {
        catalog.customProducts = {};

        saveCatalog(
            catalog
        );
    }

    return catalog;
};


function makeCustomProductKey() {

    return (
        "custom_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 7)
    );
}


function addCustomProductFromCatalog() {

    const name =
        document.getElementById(
            "newProductName"
        )?.value.trim() || "";

    const category =
        document.getElementById(
            "newProductCategory"
        )?.value.trim() || "";

    const sale =
        Number(
            document.getElementById(
                "newProductSale"
            )?.value || 0
        );

    const cost =
        Number(
            document.getElementById(
                "newProductCost"
            )?.value || 0
        );

    const description =
        document.getElementById(
            "newProductDescription"
        )?.value.trim() || "";


    if (!name) {

        alert(
            "Введите название товара."
        );

        return;
    }


    const catalog =
        loadCatalog();

    const key =
        makeCustomProductKey();


    catalog.customProducts[key] = {

        name,

        category,

        sale,

        cost,

        description
    };


    saveCatalog(
        catalog
    );


    renderCatalog();


    alert(
        "Товар добавлен в каталог."
    );
}


function deleteCustomProduct(key) {

    if (
        !confirm(
            "Удалить этот товар из каталога?"
        )
    ) {
        return;
    }


    const catalog =
        loadCatalog();


    if (
        catalog.customProducts?.[key]
    ) {

        delete catalog
            .customProducts[key];


        saveCatalog(
            catalog
        );


        renderCatalog();
    }
}


// =====================================================
// ДОБАВЛЯЕМ РАЗДЕЛ "МОИ ТОВАРЫ" В КАТАЛОГ
// =====================================================

function appendCustomCatalogSection() {

    const container =
        document.getElementById(
            "catalogContent"
        );

    if (!container) return;


    const catalog =
        loadCatalog();


    const products =
        Object.entries(
            catalog.customProducts || {}
        );


    const section =
        document.createElement(
            "div"
        );


    section.className =
        "catalog-section custom-products-section";


    section.innerHTML = `

        <h3>
            Мои товары
        </h3>


        <div
            class="catalog-product custom-product-form"
        >

            <h4>
                ＋ Добавить новый товар
            </h4>


            <div class="field">

                <label>
                    Название товара
                </label>

                <input
                    id="newProductName"
                    type="text"
                    placeholder="Например: Термокружка 450 мл"
                >

            </div>


            <div class="field">

                <label>
                    Категория
                </label>

                <input
                    id="newProductCategory"
                    type="text"
                    placeholder="Например: Чашки, металл, текстиль"
                >

            </div>


            <div
                class="catalog-two-inputs"
            >

                <label>

                    Цена продажи

                    <input
                        id="newProductSale"
                        type="number"
                        min="0"
                        step="0.01"
                        value="0"
                    >

                </label>


                <label>

                    Себестоимость

                    <input
                        id="newProductCost"
                        type="number"
                        min="0"
                        step="0.01"
                        value="0"
                    >

                </label>

            </div>


            <div
                class="field"
                style="margin-top:10px;"
            >

                <label>
                    Описание — необязательно
                </label>

                <input
                    id="newProductDescription"
                    type="text"
                    placeholder="Дополнительная информация"
                >

            </div>


            <button
                type="button"
                class="primary-button"
                onclick="addCustomProductFromCatalog()"
            >
                Добавить товар
            </button>

        </div>


        <div
            class="custom-products-list"
        >

            ${
                products.length

                ? products
                    .map(
                        ([key, product]) => `

                        <div
                            class="catalog-product custom-product-card"
                        >

                            <div
                                class="custom-product-title-row"
                            >

                                <div>

                                    <h4>
                                        ${escapeHtml(
                                            product.name ||
                                            "Без названия"
                                        )}
                                    </h4>

                                    ${
                                        product.category
                                            ? `
                                                <div
                                                    class="custom-product-category"
                                                >
                                                    ${escapeHtml(
                                                        product.category
                                                    )}
                                                </div>
                                            `
                                            : ""
                                    }

                                </div>


                                <button
                                    type="button"
                                    class="custom-product-delete"
                                    onclick="
                                        deleteCustomProduct(
                                            '${escapeHtml(key)}'
                                        )
                                    "
                                >
                                    ×
                                </button>

                            </div>


                            ${
                                product.description
                                    ? `
                                        <div
                                            class="custom-product-description"
                                        >
                                            ${escapeHtml(
                                                product.description
                                            )}
                                        </div>
                                    `
                                    : ""
                            }


                            <div
                                class="custom-product-prices"
                            >

                                <span>
                                    Продажа:
                                    <b>
                                        ${formatMoney(
                                            product.sale
                                        )} грн
                                    </b>
                                </span>

                                <span>
                                    Себестоимость:
                                    <b>
                                        ${formatMoney(
                                            product.cost
                                        )} грн
                                    </b>
                                </span>

                            </div>

                        </div>
                    `
                    )
                    .join("")

                : `
                    <div
                        class="no-custom-products"
                    >
                        Добавленных товаров пока нет.
                    </div>
                `
            }

        </div>
    `;


    const firstButton =
        container.querySelector(
            "button.primary-button"
        );


    if (firstButton) {

        container.insertBefore(
            section,
            firstButton
        );

    } else {

        container.appendChild(
            section
        );
    }


    addCustomProductStyles();
}


// =====================================================
// ПЕРЕОПРЕДЕЛЯЕМ ОТРИСОВКУ КАТАЛОГА
// =====================================================

const _baseRenderCatalog =
    renderCatalog;


renderCatalog = function () {

    _baseRenderCatalog();

    appendCustomCatalogSection();
};


// =====================================================
// СБРОС КАТАЛОГА
// СОХРАНЯЕМ ДОБАВЛЕННЫЕ ТОВАРЫ
// =====================================================

resetCatalog = function () {

    if (
        !confirm(
            "Сбросить стандартные цены каталога? Добавленные вами товары останутся."
        )
    ) {
        return;
    }


    const current =
        loadCatalog();


    saveCatalog({

        diplomaPrices:
            structuredClone(
                DEFAULT_DIPLOMA_PRICES
            ),

        readyCups:
            structuredClone(
                DEFAULT_READY_CUPS
            ),

        customProducts:
            structuredClone(
                current.customProducts ||
                {}
            )
    });


    renderCatalog();
};


// =====================================================
// СТИЛИ МОИХ ТОВАРОВ
// =====================================================

function addCustomProductStyles() {

    if (
        document.getElementById(
            "customProductStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "customProductStyles";


    style.textContent = `

        .custom-product-form .field {
            margin-bottom: 10px;
        }

        .custom-product-form input {
            width: 100%;
            box-sizing: border-box;
        }

        .custom-product-form .primary-button {
            margin-top: 12px;
        }

        .custom-product-title-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
        }

        .custom-product-title-row h4 {
            margin-bottom: 3px;
        }

        .custom-product-category {
            color: #777;
            font-size: 13px;
        }

        .custom-product-description {
            margin-top: 8px;
            color: #555;
            font-size: 13px;
        }

        .custom-product-prices {
            display: grid;
            gap: 4px;
            margin-top: 10px;
            font-size: 13px;
        }

        .custom-product-delete {
            border: 0;
            background: #f3f3f3;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 22px;
            line-height: 28px;
        }

        .no-custom-products {
            color: #777;
            padding: 8px 2px 18px;
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// НОВЫЙ ЗАКАЗ — КАТЕГОРИЯ "МОИ ТОВАРЫ"
// =====================================================

const _baseAddPosition =
    addPosition;


addPosition = function () {

    _baseAddPosition();


    const positions =
        document.querySelectorAll(
            "#positions .position-card"
        );


    const position =
        positions[
            positions.length - 1
        ];


    if (!position) return;


    const select =
        position.querySelector(
            ".position-category"
        );


    if (
        !select ||
        select.querySelector(
            'option[value="custom_product"]'
        )
    ) {
        return;
    }


    const option =
        document.createElement(
            "option"
        );


    option.value =
        "custom_product";

    option.textContent =
        "Мои товары";


    select.appendChild(
        option
    );
};


// =====================================================
// ВЫБОР МОЕГО ТОВАРА
// =====================================================

const _baseUpdateProductOptions =
    updateProductOptions;


updateProductOptions =
function (categorySelect) {

    if (
        categorySelect?.value !==
        "custom_product"
    ) {

        _baseUpdateProductOptions(
            categorySelect
        );

        return;
    }


    const position =
        categorySelect.closest(
            ".position-card"
        );


    if (!position) return;


    const product =
        position.querySelector(
            ".position-product"
        );


    const extra =
        position.querySelector(
            ".extra-field"
        );


    const catalog =
        loadCatalog();


    if (!product) return;


    product.innerHTML = `
        <option value="">
            Выберите товар
        </option>
    `;


    Object.entries(
        catalog.customProducts || {}
    )
    .forEach(
        ([key, item]) => {

            product.innerHTML += `
                <option
                    value="${escapeHtml(key)}"
                >
                    ${escapeHtml(
                        item.name ||
                        "Без названия"
                    )}
                </option>
            `;
        }
    );


    if (extra) {
        extra.innerHTML = "";
    }


    calculateAll();
};


// =====================================================
// АВТОМАТИЧЕСКИ ПОДСТАВЛЯЕМ ЦЕНУ МОЕГО ТОВАРА
// =====================================================

const _baseUpdateDiploma =
    updateDiploma;


updateDiploma =
function (productSelect) {

    const position =
        productSelect?.closest(
            ".position-card"
        );


    const category =
        position?.querySelector(
            ".position-category"
        )?.value;


    if (
        category !==
        "custom_product"
    ) {

        _baseUpdateDiploma(
            productSelect
        );

        return;
    }


    const catalog =
        loadCatalog();


    const item =
        catalog.customProducts?.[
            productSelect.value
        ];


    const saleInput =
        position.querySelector(
            ".position-sale"
        );


    const costInput =
        position.querySelector(
            ".position-cost"
        );


    const extra =
        position.querySelector(
            ".extra-field"
        );


    if (item) {

        if (saleInput) {
            saleInput.value =
                Number(
                    item.sale || 0
                );
        }


        if (costInput) {
            costInput.value =
                Number(
                    item.cost || 0
                );
        }


        if (extra) {

            extra.innerHTML = `

                <div class="field">

                    <label>
                        Описание
                    </label>

                    <input
                        type="text"
                        class="position-description"
                        value="${escapeHtml(
                            item.description || ""
                        )}"
                        placeholder="Описание"
                    >

                </div>
            `;
        }
    }


    calculateAll();
};


// =====================================================
// НАЗВАНИЯ МОИХ ТОВАРОВ
// =====================================================

const _baseCategoryNames =
    categoryNames;


categoryNames =
function (category) {

    if (
        category ===
        "custom_product"
    ) {
        return "Мои товары";
    }


    return _baseCategoryNames(
        category
    );
};


const _baseCatalogNames =
    catalogNames;


catalogNames =
function (
    category,
    key
) {

    if (
        category ===
        "custom_product"
    ) {

        return (
            loadCatalog()
                .customProducts?.[key]
                ?.name ||
            key
        );
    }


    return _baseCatalogNames(
        category,
        key
    );
};


// =====================================================
// РЕДАКТИРОВАНИЕ ЗАКАЗА — МОИ ТОВАРЫ
// =====================================================

const _baseGetEditProductOptionsHtml =
    getEditProductOptionsHtml;


getEditProductOptionsHtml =
function (
    category,
    selected
) {

    if (
        category !==
        "custom_product"
    ) {

        return (
            _baseGetEditProductOptionsHtml(
                category,
                selected
            )
        );
    }


    const catalog =
        loadCatalog();


    let html = `
        <option value="">
            Выберите товар
        </option>
    `;


    Object.entries(
        catalog.customProducts || {}
    )
    .forEach(
        ([key, item]) => {

            html += `

                <option
                    value="${escapeHtml(key)}"
                    ${
                        key === selected
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHtml(
                        item.name ||
                        "Без названия"
                    )}
                </option>
            `;
        }
    );


    return html;
};


function ensureCustomCategoryInEditCard(
    card,
    selectedCategory = ""
) {

    const select =
        card?.querySelector(
            ".edit-category"
        );


    if (!select) return;


    let option =
        select.querySelector(
            'option[value="custom_product"]'
        );


    if (!option) {

        option =
            document.createElement(
                "option"
            );


        option.value =
            "custom_product";

        option.textContent =
            "Мои товары";


        select.appendChild(
            option
        );
    }


    if (
        selectedCategory ===
        "custom_product"
    ) {

        select.value =
            "custom_product";
    }
}


// =====================================================
// РЕДАКТИРОВАНИЕ — ВЫБОР ТОВАРА
// =====================================================

const _baseUpdateEditProductOptions =
    updateEditProductOptions;


updateEditProductOptions =
function (categorySelect) {

    if (
        categorySelect?.value !==
        "custom_product"
    ) {

        _baseUpdateEditProductOptions(
            categorySelect
        );

        return;
    }


    const card =
        categorySelect.closest(
            "[data-edit-position]"
        );


    if (!card) return;


    const product =
        card.querySelector(
            ".edit-product"
        );


    const extra =
        card.querySelector(
            ".edit-extra-field"
        );


    if (product) {

        product.innerHTML =
            getEditProductOptionsHtml(
                "custom_product",
                ""
            );
    }


    if (extra) {
        extra.innerHTML = "";
    }
};


// =====================================================
// РЕДАКТИРОВАНИЕ — ЦЕНА МОЕГО ТОВАРА
// =====================================================

const _baseUpdateEditProductPrice =
    updateEditProductPrice;


updateEditProductPrice =
function (productSelect) {

    const card =
        productSelect?.closest(
            "[data-edit-position]"
        );


    const category =
        card?.querySelector(
            ".edit-category"
        )?.value;


    if (
        category !==
        "custom_product"
    ) {

        _baseUpdateEditProductPrice(
            productSelect
        );

        return;
    }


    const item =
        loadCatalog()
            .customProducts?.[
                productSelect.value
            ];


    const sale =
        card.querySelector(
            ".edit-sale"
        );


    const cost =
        card.querySelector(
            ".edit-cost"
        );


    const extra =
        card.querySelector(
            ".edit-extra-field"
        );


    if (item) {

        if (sale) {
            sale.value =
                Number(
                    item.sale || 0
                );
        }


        if (cost) {
            cost.value =
                Number(
                    item.cost || 0
                );
        }


        if (extra) {

            extra.innerHTML = `

                <div class="field">

                    <label>
                        Описание
                    </label>

                    <input
                        type="text"
                        class="edit-description"
                        value="${escapeHtml(
                            item.description || ""
                        )}"
                        placeholder="Описание"
                    >

                </div>
            `;
        }
    }
};


const _baseAddEditOrderPosition =
    addEditOrderPosition;


addEditOrderPosition =
function () {

    _baseAddEditOrderPosition();


    const cards =
        document.querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        );


    const card =
        cards[
            cards.length - 1
        ];


    ensureCustomCategoryInEditCard(
        card
    );
};


// =====================================================
// ФОТО — ИСПРАВЛЕННЫЙ ПРОСМОТР
// =====================================================

openOrderPhoto =
function (photoUrl) {

    closeOrderPhoto();


    if (!photoUrl) {
        return;
    }


    const viewer =
        document.createElement(
            "div"
        );


    viewer.id =
        "photoViewer";


    viewer.innerHTML = `

        <div
            class="photo-viewer-overlay"
            onclick="closeOrderPhoto()"
        >

            <button
                type="button"
                class="photo-viewer-close"
                onclick="
                    event.stopPropagation();
                    closeOrderPhoto();
                "
            >
                ×
            </button>


            <img
                src="${photoUrl}"
                class="photo-viewer-image"
                alt="Фото заказа"
                onclick="
                    event.stopPropagation()
                "
            >

        </div>
    `;


    document.body.appendChild(
        viewer
    );


    requestAnimationFrame(
        () => {

            viewer.classList.add(
                "active"
            );
        }
    );
};


// =====================================================
// СТИЛИ ПРОСМОТРА ФОТО
// =====================================================

function addPhotoViewerStyles() {

    if (
        document.getElementById(
            "photoViewerStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "photoViewerStyles";


    style.textContent = `

        #photoViewer {
            position: fixed;
            inset: 0;
            z-index: 20000;
            opacity: 0;
            transition: opacity .2s ease;
        }

        #photoViewer.active {
            opacity: 1;
        }

        .photo-viewer-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,.92);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .photo-viewer-image {
            max-width: 100%;
            max-height: 88vh;
            object-fit: contain;
            border-radius: 8px;
        }

        .photo-viewer-close {
            position: absolute;
            top: max(
                14px,
                env(safe-area-inset-top)
            );
            right: 14px;
            width: 42px;
            height: 42px;
            border: 0;
            border-radius: 50%;
            background:
                rgba(255,255,255,.18);
            color: #fff;
            font-size: 30px;
            line-height: 38px;
            z-index: 2;
        }

        .order-photo-item img {
            cursor: zoom-in;
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// ДОСТАВКА И ТТН
// =====================================================

function saveOrderShipping(id) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!order) return;


    order.deliveryCity =
        document.getElementById(
            "orderDeliveryCity"
        )?.value.trim() || "";


    order.deliveryBranch =
        document.getElementById(
            "orderDeliveryBranch"
        )?.value.trim() || "";


    order.ttn =
        document.getElementById(
            "orderTtn"
        )?.value.trim() || "";


    saveOrders(
        orders
    );


    renderOrderDetails(
        order
    );


    renderOrderCards();
}


// =====================================================
// ДОСТАВКА В КАРТОЧКЕ ЗАКАЗА
// =====================================================

function addShippingToOrderDetails(
    order
) {

    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    if (!content) return;


    const blocks =
        content.querySelectorAll(
            ".order-detail-block"
        );


    // Второй блок — статус оплаты
    const paymentBlock =
        blocks[1];


    if (!paymentBlock) return;


    const shipping =
        document.createElement(
            "div"
        );


    shipping.className =
        "order-detail-block order-shipping-block";


    shipping.innerHTML = `

        <div
            class="detail-section-title"
        >
            Доставка
        </div>


        <div
            class="shipping-grid"
        >

            <div class="field">

                <label>
                    Город
                </label>

                <input
                    id="orderDeliveryCity"
                    type="text"
                    value="${escapeHtml(
                        order.deliveryCity ||
                        ""
                    )}"
                    placeholder="Например: Одесса"
                >

            </div>


            <div class="field">

                <label>
                    № отделения
                </label>

                <input
                    id="orderDeliveryBranch"
                    type="text"
                    value="${escapeHtml(
                        order.deliveryBranch ||
                        ""
                    )}"
                    placeholder="Например: 12"
                >

            </div>

        </div>


        <div
            class="field shipping-ttn-field"
        >

            <label>
                ТТН
            </label>

            <input
                id="orderTtn"
                type="text"
                inputmode="numeric"
                value="${escapeHtml(
                    order.ttn || ""
                )}"
                placeholder="Номер ТТН"
            >

        </div>


        <button
            type="button"
            class="secondary-button"
            onclick="
                saveOrderShipping(
                    ${Number(order.id)}
                )
            "
        >
            Сохранить доставку
        </button>
    `;


    paymentBlock.insertAdjacentElement(
        "afterend",
        shipping
    );
}


// =====================================================
// ДЕЛАЕМ ФОТО КЛИКАБЕЛЬНЫМИ
// =====================================================

function addPhotoClicksToOrderDetails(
    order
) {

    const images =
        document.querySelectorAll(
            "#orderModal .order-photo-item img"
        );


    const photos =
        Array.isArray(
            order.photos
        )
            ? order.photos
            : [];


    images.forEach(
        (img, index) => {

            img.onclick =
                function (event) {

                    event.stopPropagation();

                    openOrderPhoto(
                        photos[index]
                    );
                };
        }
    );


    document
        .querySelectorAll(
            "#orderModal .order-photo-item button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event =>
                        event.stopPropagation()
                );
            }
        );
}


// =====================================================
// ПЕРЕОПРЕДЕЛЯЕМ ПРОСМОТР ЗАКАЗА
// =====================================================

const _baseRenderOrderDetails =
    renderOrderDetails;


renderOrderDetails =
function (order) {

    if (
        order.deliveryCity == null
    ) {
        order.deliveryCity = "";
    }


    if (
        order.deliveryBranch == null
    ) {
        order.deliveryBranch = "";
    }


    if (
        order.ttn == null
    ) {
        order.ttn = "";
    }


    _baseRenderOrderDetails(
        order
    );


    addShippingToOrderDetails(
        order
    );


    addPhotoClicksToOrderDetails(
        order
    );


    addPhotoViewerStyles();

    addShippingStyles();
};


// =====================================================
// РЕДАКТИРОВАНИЕ ЗАКАЗА
// ДОБАВЛЯЕМ ДОСТАВКУ
// =====================================================

const _baseRenderOrderEditor =
    renderOrderEditor;


renderOrderEditor =
function (order) {

    _baseRenderOrderEditor(
        order
    );


    // Добавляем категорию
    // "Мои товары"
    document
        .querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        )
        .forEach(
            (card, index) => {

                ensureCustomCategoryInEditCard(
                    card,
                    order.positions?.[index]
                        ?.category ||
                    ""
                );
            }
        );


    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    const clientBlock =
        content?.querySelector(
            ".order-detail-block"
        );


    if (!clientBlock) return;


    const block =
        document.createElement(
            "div"
        );


    block.className =
        "order-detail-block";


    block.innerHTML = `

        <div
            class="detail-section-title"
        >
            Доставка
        </div>


        <div
            class="shipping-grid"
        >

            <div class="field">

                <label>
                    Город
                </label>

                <input
                    id="editOrderDeliveryCity"
                    type="text"
                    value="${escapeHtml(
                        order.deliveryCity ||
                        ""
                    )}"
                    placeholder="Например: Одесса"
                >

            </div>


            <div class="field">

                <label>
                    № отделения
                </label>

                <input
                    id="editOrderDeliveryBranch"
                    type="text"
                    value="${escapeHtml(
                        order.deliveryBranch ||
                        ""
                    )}"
                    placeholder="Например: 12"
                >

            </div>

        </div>


        <div
            class="field shipping-ttn-field"
        >

            <label>
                ТТН
            </label>

            <input
                id="editOrderTtn"
                type="text"
                inputmode="numeric"
                value="${escapeHtml(
                    order.ttn || ""
                )}"
                placeholder="Номер ТТН"
            >

        </div>
    `;


    clientBlock.insertAdjacentElement(
        "afterend",
        block
    );


    addShippingStyles();
};


// =====================================================
// СОХРАНЕНИЕ ДОСТАВКИ ПРИ РЕДАКТИРОВАНИИ
// =====================================================

const _baseSaveEditedOrder =
    saveEditedOrder;


saveEditedOrder =
function (id) {

    const deliveryCity =
        document.getElementById(
            "editOrderDeliveryCity"
        )?.value.trim() || "";


    const deliveryBranch =
        document.getElementById(
            "editOrderDeliveryBranch"
        )?.value.trim() || "";


    const ttn =
        document.getElementById(
            "editOrderTtn"
        )?.value.trim() || "";


    _baseSaveEditedOrder(
        id
    );


    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!order) return;


    order.deliveryCity =
        deliveryCity;


    order.deliveryBranch =
        deliveryBranch;


    order.ttn =
        ttn;


    saveOrders(
        orders
    );


    renderOrderDetails(
        order
    );


    renderOrderCards();
};


// =====================================================
// СТИЛИ ДОСТАВКИ
// =====================================================

function addShippingStyles() {

    if (
        document.getElementById(
            "shippingStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "shippingStyles";


    style.textContent = `

        .shipping-grid {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            gap: 10px;
        }

        .shipping-grid input,
        .shipping-ttn-field input {
            width: 100%;
            box-sizing: border-box;
        }

        .shipping-ttn-field {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .order-shipping-block
        .secondary-button {
            margin-top: 4px;
        }

        .order-shipping-summary {
            display: grid;
            gap: 3px;
            margin-top: 7px;
            font-size: 13px;
            color: #555;
        }

        @media (max-width: 420px) {

            .shipping-grid {
                grid-template-columns:
                    1fr;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// ПОЛУЧАЕМ ЗАКАЗЫ В ТОМ ЖЕ ПОРЯДКЕ,
// КАК ОНИ ПОКАЗАНЫ НА ЭКРАНЕ
// =====================================================

function getOrdersVisibleForCurrentList() {

    let orders =
        getOrders();


    const search =
        String(
            ordersSearch || ""
        )
        .trim()
        .toLowerCase();


    if (search) {

        orders =
            orders.filter(
                order => {

                    const number =
                        String(
                            order.number ||
                            ""
                        )
                        .toLowerCase();


                    const client =
                        String(
                            order.client ||
                            ""
                        )
                        .toLowerCase();


                    return (
                        number.includes(
                            search
                        ) ||
                        client.includes(
                            search
                        )
                    );
                }
            );
    }


    if (
        ordersStatusFilter !==
        "all"
    ) {

        orders =
            orders.filter(
                order =>
                    getOrderStatus(
                        order
                    ) ===
                    ordersStatusFilter
            );
    }


    orders.sort(
        (a, b) => {

            if (
                ordersSort ===
                "newest"
            ) {

                return (
                    getOrderDate(b) -
                    getOrderDate(a)
                );
            }


            if (
                ordersSort ===
                "oldest"
            ) {

                return (
                    getOrderDate(a) -
                    getOrderDate(b)
                );
            }


            if (
                ordersSort ===
                "profit"
            ) {

                return (
                    getOrderProfit(b) -
                    getOrderProfit(a)
                );
            }


            if (
                ordersSort ===
                "sale"
            ) {

                return (
                    getOrderSale(b) -
                    getOrderSale(a)
                );
            }


            return 0;
        }
    );


    return orders;
}


// =====================================================
// ДОСТАВКА И ТТН В СПИСКЕ ЗАКАЗОВ
// =====================================================

const _baseRenderOrderCardsForShipping =
    renderOrderCards;


renderOrderCards =
function () {

    _baseRenderOrderCardsForShipping();


    const orders =
        getOrdersVisibleForCurrentList();


    const cards =
        document.querySelectorAll(
            "#ordersList .orders-list-results .order-card"
        );


    cards.forEach(
        (card, index) => {

            const order =
                orders[index];


            if (!order) return;


            const payment =
                card.querySelector(
                    ".order-payment"
                );


            if (!payment) return;


            const city =
                order.deliveryCity ||
                "—";


            const branch =
                order.deliveryBranch ||
                "—";


            const ttn =
                order.ttn ||
                "—";


            const summary =
                document.createElement(
                    "div"
                );


            summary.className =
                "order-shipping-summary";


            summary.innerHTML = `

                <div>
                    Доставка:
                    <b>
                        ${escapeHtml(city)}
                    </b>,
                    отделение
                    <b>
                        ${escapeHtml(branch)}
                    </b>
                </div>

                <div>
                    ТТН:
                    <b>
                        ${escapeHtml(ttn)}
                    </b>
                </div>
            `;


            payment.insertAdjacentElement(
                "afterend",
                summary
            );
        }
    );
};


// =====================================================
// ДОБАВЛЯЕМ ПУСТЫЕ ПОЛЯ В СТАРЫЕ ЗАКАЗЫ
// =====================================================

function migrateOrdersForShipping() {

    const orders =
        getOrders();


    let changed =
        false;


    orders.forEach(
        order => {

            if (
                order.deliveryCity == null
            ) {

                order.deliveryCity = "";

                changed = true;
            }


            if (
                order.deliveryBranch == null
            ) {

                order.deliveryBranch = "";

                changed = true;
            }


            if (
                order.ttn == null
            ) {

                order.ttn = "";

                changed = true;
            }
        }
    );


    if (changed) {

        saveOrders(
            orders
        );
    }
}


// =====================================================
// ИНИЦИАЛИЗАЦИЯ ОБНОВЛЕНИЯ
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCatalog();

        migrateOrdersForShipping();

        addPhotoViewerStyles();

        addShippingStyles();

        addCustomProductStyles();
    }
);

// =====================================================
// ЕДИНОЕ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// 1. Цвет статуса заказа
// 2. Цвет статуса оплаты
// 3. Компактный дизайн страницы "Новый заказ"
// =====================================================


// =====================================================
// 1. ЦВЕТ СТАТУСА ЗАКАЗА
// =====================================================

function getOrderStatusColorClass(status) {

    const value = String(status || "")
        .trim()
        .toLowerCase();


    if (value === "новый") {
        return "status-new";
    }

    if (value === "в работе") {
        return "status-work";
    }

    if (value === "готов") {
        return "status-ready";
    }

    if (value === "выдан") {
        return "status-done";
    }

    if (
        value === "отменён" ||
        value === "отменен"
    ) {
        return "status-cancelled";
    }

    return "";
}


// =====================================================
// 2. ОПРЕДЕЛЯЕМ SELECT СТАТУСА ЗАКАЗА
// =====================================================

function isOrderStatusSelect(select) {

    if (!select?.options) {
        return false;
    }

    const options = Array
        .from(select.options)
        .map(option =>
            option.textContent
                .trim()
                .toLowerCase()
        );


    return (
        options.includes("новый") &&
        (
            options.includes("в работе") ||
            options.includes("готов")
        )
    );
}


// =====================================================
// 3. ОПРЕДЕЛЯЕМ SELECT ОПЛАТЫ
// =====================================================

function isPaymentStatusSelect(select) {

    if (!select?.options) {
        return false;
    }

    const options = Array
        .from(select.options)
        .map(option =>
            option.textContent
                .trim()
                .toLowerCase()
        );


    return (
        options.some(
            value =>
                value.includes("не оплач")
        )
        ||
        options.some(
            value =>
                value.includes("предоплат")
        )
        ||
        options.includes("оплачено")
    );
}


// =====================================================
// 4. ЦВЕТА СТАТУСОВ ЗАКАЗОВ
// =====================================================

function applyOrderStatusColors() {

    document
        .querySelectorAll(
            "#ordersList select, #orderModal select"
        )
        .forEach(select => {

            if (
                !isOrderStatusSelect(select)
            ) {
                return;
            }


            select.classList.remove(
                "status-new",
                "status-work",
                "status-ready",
                "status-done",
                "status-cancelled"
            );


            select.classList.add(
                "order-status-colored"
            );


            const currentStatus =
                select.options[
                    select.selectedIndex
                ]?.textContent ||
                select.value ||
                "";


            const colorClass =
                getOrderStatusColorClass(
                    currentStatus
                );


            if (colorClass) {

                select.classList.add(
                    colorClass
                );
            }


            if (
                !select.dataset
                    .orderStatusColorListener
            ) {

                select.dataset
                    .orderStatusColorListener =
                    "1";


                select.addEventListener(
                    "change",
                    () => {

                        setTimeout(
                            applyInterfaceColors,
                            0
                        );
                    }
                );
            }
        });
}


// =====================================================
// 5. ЦВЕТА СТАТУСА ОПЛАТЫ
// =====================================================

function applyPaymentStatusColors() {

    document
        .querySelectorAll(
            "#ordersList select, #orderModal select"
        )
        .forEach(select => {

            if (
                !isPaymentStatusSelect(select)
            ) {
                return;
            }


            select.classList.remove(
                "payment-paid",
                "payment-partial",
                "payment-unpaid"
            );


            select.classList.add(
                "payment-status-colored"
            );


            const value =
                (
                    select.options[
                        select.selectedIndex
                    ]?.textContent ||
                    select.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            // Сначала проверяем
            // "не оплачено",
            // чтобы слово "оплачено"
            // не сработало раньше

            if (
                value.includes(
                    "не оплач"
                )
            ) {

                select.classList.add(
                    "payment-unpaid"
                );
            }

            else if (
                value.includes(
                    "частич"
                )
                ||
                value.includes(
                    "предоплат"
                )
            ) {

                select.classList.add(
                    "payment-partial"
                );
            }

            else if (
                value === "оплачено"
                ||
                value === "оплачен"
                ||
                value.includes(
                    "полностью оплач"
                )
            ) {

                select.classList.add(
                    "payment-paid"
                );
            }


            if (
                !select.dataset
                    .paymentColorListener
            ) {

                select.dataset
                    .paymentColorListener =
                    "1";


                select.addEventListener(
                    "change",
                    () => {

                        setTimeout(
                            applyInterfaceColors,
                            0
                        );
                    }
                );
            }
        });
}


// =====================================================
// ОБЩЕЕ ОБНОВЛЕНИЕ ЦВЕТОВ
// =====================================================

function applyInterfaceColors() {

    applyOrderStatusColors();

    applyPaymentStatusColors();
}


// =====================================================
// 6. СТИЛИ СТАТУСОВ
// =====================================================

function addOrderInterfaceStyles() {

    if (
        document.getElementById(
            "orderInterfaceStylesV2"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "orderInterfaceStylesV2";


    style.textContent = `

        /* =====================================
           ЦВЕТНЫЕ СТАТУСЫ
        ===================================== */

        .order-status-colored,
        .payment-status-colored {

            border: 0 !important;

            border-radius:
                10px !important;

            font-weight:
                700 !important;

            padding:
                8px 30px 8px 10px !important;

            transition:
                background-color .2s ease,
                color .2s ease;

            -webkit-appearance:
                auto;
        }


        /* НОВЫЙ */

        .order-status-colored.status-new {

            background:
                #E8F3FF !important;

            color:
                #1677C8 !important;
        }


        /* В РАБОТЕ */

        .order-status-colored.status-work {

            background:
                #FFF1D6 !important;

            color:
                #B66A00 !important;
        }


        /* ГОТОВ */

        .order-status-colored.status-ready {

            background:
                #E4F7E9 !important;

            color:
                #25823C !important;
        }


        /* ВЫДАН */

        .order-status-colored.status-done {

            background:
                #ECEEF1 !important;

            color:
                #62676F !important;
        }


        /* ОТМЕНЁН */

        .order-status-colored.status-cancelled {

            background:
                #FFE7E7 !important;

            color:
                #C93434 !important;
        }



        /* =====================================
           ОПЛАТА
        ===================================== */

        /* ОПЛАЧЕНО */

        .payment-status-colored.payment-paid {

            background:
                #E4F7E9 !important;

            color:
                #25823C !important;
        }


        /* ЧАСТИЧНАЯ ПРЕДОПЛАТА */

        .payment-status-colored.payment-partial {

            background:
                #E4F7E9 !important;

            color:
                #25823C !important;
        }


        /* НЕ ОПЛАЧЕНО */

        .payment-status-colored.payment-unpaid {

            background:
                #FFE7E7 !important;

            color:
                #C93434 !important;
        }



        /* ==================================================
           НОВЫЙ ЗАКАЗ
           ОБЩАЯ КОМПАКТНОСТЬ
        ================================================== */

        #screenOrder {

            padding-bottom:
                calc(
                    90px +
                    env(safe-area-inset-bottom)
                );
        }


        #screenOrder .card {

            padding:
                12px !important;

            margin-bottom:
                10px !important;

            border-radius:
                14px !important;
        }



        /* ==================================================
           КЛИЕНТ
        ================================================== */

        #screenOrder #clientName {

            width: 100%;

            min-height:
                42px !important;

            height:
                42px !important;

            box-sizing:
                border-box;

            padding:
                0 11px !important;

            border-radius:
                10px !important;

            font-size:
                16px !important;
        }


        #screenOrder label {

            font-size:
                12px;

            font-weight:
                600;
        }



        /* ==================================================
           ЗАГОЛОВОК ПОЗИЦИЙ
        ================================================== */

        #screenOrder .section-heading {

            margin:
                8px 0 !important;

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            gap:
                8px;
        }


        #screenOrder .section-heading h2 {

            margin:
                0 !important;

            font-size:
                18px !important;

            line-height:
                1.2;
        }



        /* ==================================================
           КНОПКА ДОБАВИТЬ ПОЗИЦИЮ
        ================================================== */

        #screenOrder .section-heading button,
        #screenOrder .small-button {

            min-height:
                38px !important;

            padding:
                7px 12px !important;

            border-radius:
                10px !important;

            font-size:
                13px !important;

            font-weight:
                700 !important;
        }



        /* ==================================================
           КАРТОЧКА ПОЗИЦИИ
        ================================================== */

        #screenOrder .position-card {

            position:
                relative;

            padding:
                10px !important;

            margin-bottom:
                10px !important;

            border-radius:
                15px !important;

            box-shadow:
                0 2px 8px
                rgba(0,0,0,.04);

            overflow:
                hidden;
        }



        /* ==================================================
           ШАПКА ПОЗИЦИИ
        ================================================== */

        #screenOrder .position-header {

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            gap:
                8px;

            margin-bottom:
                8px !important;

            padding-bottom:
                7px;

            border-bottom:
                1px solid
                rgba(0,0,0,.06);
        }


        #screenOrder .position-header strong {

            font-size:
                14px;

            font-weight:
                800;
        }



        /* ==================================================
           УДАЛЕНИЕ ПОЗИЦИИ
        ================================================== */

        #screenOrder .delete-position {

            display:
                flex !important;

            align-items:
                center;

            justify-content:
                center;

            width:
                32px !important;

            min-width:
                32px !important;

            height:
                32px !important;

            min-height:
                32px !important;

            padding:
                0 !important;

            border-radius:
                50% !important;

            font-size:
                20px !important;

            line-height:
                1 !important;
        }



        /* ==================================================
           ПОЛЯ В ПОЗИЦИИ
        ================================================== */

        #screenOrder
        .position-card
        .field {

            margin-bottom:
                7px !important;
        }


        #screenOrder
        .position-card
        .field label {

            display:
                block;

            margin-bottom:
                3px !important;

            font-size:
                11px !important;

            line-height:
                1.2;

            color:
                #6B7280;
        }


        #screenOrder
        .position-card input,

        #screenOrder
        .position-card select {

            width:
                100% !important;

            min-width:
                0;

            height:
                40px !important;

            min-height:
                40px !important;

            box-sizing:
                border-box;

            padding:
                0 9px !important;

            border-radius:
                9px !important;

            font-size:
                16px !important;
        }



        /* ==================================================
           КАТЕГОРИЯ + ИЗДЕЛИЕ
           СТАВИМ РЯДОМ
        ================================================== */

        #screenOrder
        .position-card {

            display:
                grid;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0, 1fr)
                );

            column-gap:
                8px;

            row-gap:
                0;
        }


        #screenOrder
        .position-header {

            grid-column:
                1 / -1;
        }


        #screenOrder
        .position-card
        > .extra-field {

            grid-column:
                1 / -1;
        }


        #screenOrder
        .position-card
        > .extra-field:empty {

            display:
                none;
        }



        /* ==================================================
           ЦЕНА И СЕБЕСТОИМОСТЬ
        ================================================== */

        #screenOrder .manual-prices {

            grid-column:
                1 / -1;

            display:
                grid !important;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0, 1fr)
                );

            gap:
                8px !important;

            margin:
                0 !important;
        }



        /* ==================================================
           ИТОГ ПО ПОЗИЦИИ
        ================================================== */

        #screenOrder .position-total {

            grid-column:
                1 / -1;

            display:
                grid !important;

            grid-template-columns:
                repeat(
                    3,
                    minmax(0, 1fr)
                );

            gap:
                4px;

            margin-top:
                2px !important;

            padding:
                8px !important;

            border-radius:
                10px !important;

            background:
                rgba(0,0,0,.025);
        }


        #screenOrder
        .position-total > div {

            min-width:
                0;

            display:
                flex;

            flex-direction:
                column;

            gap:
                2px;

            font-size:
                10px !important;

            line-height:
                1.2;

            color:
                #6B7280;
        }


        #screenOrder
        .position-total strong {

            display:
                block;

            font-size:
                12px !important;

            color:
                #111827;

            white-space:
                nowrap;

            overflow:
                hidden;

            text-overflow:
                ellipsis;
        }



        /* ==================================================
           ОБЩИЕ ИТОГИ ЗАКАЗА
        ================================================== */

        #screenOrder .totals-card {

            padding:
                10px 12px !important;

            margin-top:
                10px !important;

            margin-bottom:
                9px !important;

            border-radius:
                14px !important;
        }


        #screenOrder .total-row {

            min-height:
                27px;

            padding:
                3px 0 !important;

            font-size:
                13px !important;
        }


        #screenOrder .total-row strong {

            font-size:
                14px !important;
        }


        #screenOrder .profit-row {

            margin-top:
                3px;

            padding-top:
                7px !important;

            font-size:
                15px !important;
        }


        #screenOrder .profit-row strong {

            font-size:
                17px !important;
        }



        /* ==================================================
           СОХРАНИТЬ / ОЧИСТИТЬ
        ================================================== */

        #screenOrder .main-actions {

            display:
                grid !important;

            grid-template-columns:
                minmax(0, 2fr)
                minmax(0, 1fr);

            gap:
                8px !important;

            margin-top:
                8px !important;
        }


        #screenOrder
        .main-actions button {

            width:
                100%;

            min-height:
                46px !important;

            margin:
                0 !important;

            padding:
                9px 8px !important;

            border-radius:
                11px !important;

            font-size:
                14px !important;

            font-weight:
                700 !important;
        }



        /* ==================================================
           IPHONE / УЗКИЙ ЭКРАН
        ================================================== */

        @media
        (max-width: 430px) {

            #screenOrder .card {

                padding:
                    10px !important;
            }


            #screenOrder
            .position-card {

                padding:
                    9px !important;

                column-gap:
                    7px;
            }


            #screenOrder
            .position-card input,

            #screenOrder
            .position-card select {

                height:
                    39px !important;

                min-height:
                    39px !important;
            }


            #screenOrder
            .position-total {

                padding:
                    7px !important;
            }
        }



        /* ==================================================
           ОЧЕНЬ УЗКИЙ ЭКРАН
        ================================================== */

        @media
        (max-width: 350px) {

            #screenOrder
            .position-card {

                grid-template-columns:
                    1fr;
            }


            #screenOrder
            .position-header,

            #screenOrder
            .position-card
            > .extra-field,

            #screenOrder
            .manual-prices,

            #screenOrder
            .position-total {

                grid-column:
                    1;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// 7. ОБНОВЛЯЕМ ЦВЕТА ПОСЛЕ ОТРИСОВКИ СПИСКА
// =====================================================

const _renderOrderCardsUnifiedUI =
    renderOrderCards;


renderOrderCards = function () {

    _renderOrderCardsUnifiedUI();

    setTimeout(
        applyInterfaceColors,
        0
    );
};


// =====================================================
// 8. ОБНОВЛЯЕМ ЦВЕТА В ОТКРЫТОМ ЗАКАЗЕ
// =====================================================

const _renderOrderDetailsUnifiedUI =
    renderOrderDetails;


renderOrderDetails = function (order) {

    _renderOrderDetailsUnifiedUI(
        order
    );

    setTimeout(
        applyInterfaceColors,
        0
    );
};


// =====================================================
// 9. ЗАПУСК
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addOrderInterfaceStyles();

        setTimeout(
            applyInterfaceColors,
            100
        );
    }
);

// =====================================================
// ОБНОВЛЕНИЕ:
// 1. ЦВЕТ ОПЛАТЫ В КАРТОЧКЕ ЗАКАЗА
// 2. ИЗМЕНЕНИЕ ДАТЫ СОЗДАНИЯ ЗАКАЗА
// =====================================================


// =====================================================
// ЦВЕТ ТЕКСТОВОГО СТАТУСА ОПЛАТЫ В СПИСКЕ ЗАКАЗОВ
// =====================================================

function applyPaymentTextColors() {

    document
        .querySelectorAll("#ordersList .order-card")
        .forEach(card => {

            const elements =
                Array.from(
                    card.querySelectorAll(
                        "div, span, p, b, strong"
                    )
                );


            elements.forEach(element => {

                const text =
                    element.textContent
                        ?.trim()
                        .toLowerCase() || "";


                // Ищем строку оплаты
                if (
                    !text.includes("оплата:")
                ) {
                    return;
                }


                // Убираем старые классы
                element.classList.remove(
                    "payment-text-paid",
                    "payment-text-partial",
                    "payment-text-unpaid"
                );


                if (
                    text.includes(
                        "не оплачено"
                    )
                ) {

                    element.classList.add(
                        "payment-text-unpaid"
                    );
                }

                else if (
                    text.includes(
                        "частич"
                    )
                    ||
                    text.includes(
                        "предоплат"
                    )
                ) {

                    element.classList.add(
                        "payment-text-partial"
                    );
                }

                else if (
                    text.includes(
                        "оплачено"
                    )
                ) {

                    element.classList.add(
                        "payment-text-paid"
                    );
                }
            });
        });
}


// =====================================================
// ДОБАВЛЯЕМ СТИЛИ ОПЛАТЫ
// =====================================================

function addPaymentTextStyles() {

    if (
        document.getElementById(
            "paymentTextStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "paymentTextStyles";


    style.textContent = `

        /* Сам текст строки остаётся обычным */

        .payment-text-paid,
        .payment-text-partial,
        .payment-text-unpaid {
            color: inherit;
        }


        /* Красим жирный статус внутри строки */

        .payment-text-paid b,
        .payment-text-paid strong {
            color: #25823C !important;

            background:
                #E4F7E9;

            padding:
                3px 8px;

            border-radius:
                8px;

            font-weight:
                700;
        }


        .payment-text-partial b,
        .payment-text-partial strong {
            color: #25823C !important;

            background:
                #E4F7E9;

            padding:
                3px 8px;

            border-radius:
                8px;

            font-weight:
                700;
        }


        .payment-text-unpaid b,
        .payment-text-unpaid strong {
            color: #C93434 !important;

            background:
                #FFE7E7;

            padding:
                3px 8px;

            border-radius:
                8px;

            font-weight:
                700;
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// ПОЛУЧАЕМ ДАТУ ДЛЯ input[type=date]
// =====================================================

function orderDateToInputValue(timestamp) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// =====================================================
// ПОЛУЧАЕМ ВРЕМЯ ДЛЯ input[type=time]
// =====================================================

function orderTimeToInputValue(timestamp) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    return `${hours}:${minutes}`;
}


// =====================================================
// СОХРАНЕНИЕ НОВОЙ ДАТЫ СОЗДАНИЯ
// =====================================================

function saveOrderCreatedDate(id) {

    const dateValue =
        document.getElementById(
            "editOrderCreatedDate"
        )?.value;


    const timeValue =
        document.getElementById(
            "editOrderCreatedTime"
        )?.value || "00:00";


    if (!dateValue) {

        alert(
            "Выберите дату заказа."
        );

        return;
    }


    const newDate =
        new Date(
            `${dateValue}T${timeValue}:00`
        );


    if (
        Number.isNaN(
            newDate.getTime()
        )
    ) {

        alert(
            "Не удалось сохранить дату."
        );

        return;
    }


    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!order) {
        return;
    }


    order.createdAt =
        newDate.getTime();


    saveOrders(
        orders
    );


    renderOrderDetails(
        order
    );


    renderOrderCards();
}


// =====================================================
// ДОБАВЛЯЕМ РЕДАКТИРОВАНИЕ ДАТЫ
// В ОТКРЫТЫЙ ЗАКАЗ
// =====================================================

function addCreatedDateEditor(order) {

    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    if (!content) {
        return;
    }


    if (
        content.querySelector(
            "#orderCreatedDateEditor"
        )
    ) {
        return;
    }


    const blocks =
        content.querySelectorAll(
            ".order-detail-block"
        );


    if (!blocks.length) {
        return;
    }


    const firstBlock =
        blocks[0];


    const editor =
        document.createElement(
            "div"
        );


    editor.id =
        "orderCreatedDateEditor";


    editor.className =
        "order-detail-block order-created-date-editor";


    editor.innerHTML = `

        <div class="detail-section-title">
            Дата создания заказа
        </div>


        <div class="order-date-grid">

            <div class="field">

                <label>
                    Дата
                </label>

                <input
                    id="editOrderCreatedDate"
                    type="date"
                    value="${orderDateToInputValue(
                        order.createdAt
                    )}"
                >

            </div>


            <div class="field">

                <label>
                    Время
                </label>

                <input
                    id="editOrderCreatedTime"
                    type="time"
                    value="${orderTimeToInputValue(
                        order.createdAt
                    )}"
                >

            </div>

        </div>


        <button
            type="button"
            class="secondary-button"
            onclick="
                saveOrderCreatedDate(
                    ${Number(order.id)}
                )
            "
        >
            Сохранить дату
        </button>
    `;


    firstBlock.insertAdjacentElement(
        "afterend",
        editor
    );
}


// =====================================================
// СТИЛИ РЕДАКТОРА ДАТЫ
// =====================================================

function addOrderDateEditorStyles() {

    if (
        document.getElementById(
            "orderDateEditorStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "orderDateEditorStyles";


    style.textContent = `

        .order-date-grid {
            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap:
                10px;

            margin-bottom:
                10px;
        }


        .order-created-date-editor
        input {

            width:
                100%;

            box-sizing:
                border-box;

            min-height:
                42px;

            padding:
                8px 10px;

            border-radius:
                10px;

            font-size:
                16px;
        }


        @media
        (max-width: 380px) {

            .order-date-grid {
                grid-template-columns:
                    1fr;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// ОБНОВЛЯЕМ renderOrderCards
// =====================================================

const _renderOrderCardsPaymentAndDate =
    renderOrderCards;


renderOrderCards = function () {

    _renderOrderCardsPaymentAndDate();


    setTimeout(
        applyPaymentTextColors,
        0
    );
};


// =====================================================
// ОБНОВЛЯЕМ renderOrderDetails
// =====================================================

const _renderOrderDetailsPaymentAndDate =
    renderOrderDetails;


renderOrderDetails = function (order) {

    _renderOrderDetailsPaymentAndDate(
        order
    );


    addCreatedDateEditor(
        order
    );


    setTimeout(
        applyPaymentTextColors,
        0
    );
};


// =====================================================
// ЗАПУСК
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addPaymentTextStyles();

        addOrderDateEditorStyles();


        setTimeout(
            applyPaymentTextColors,
            100
        );
    }
);

// =====================================================
// ИСПРАВЛЕНИЕ ЦВЕТОВ ОПЛАТЫ
// КРАСИМ ТОЛЬКО САМ СТАТУС ОПЛАТЫ
// =====================================================

function applyPaymentTextColors() {

    document
        .querySelectorAll("#ordersList .order-card")
        .forEach(card => {

            // Сначала полностью очищаем ошибочные классы
            // со всей карточки и её элементов

            card
                .querySelectorAll(
                    ".payment-text-paid, .payment-text-partial, .payment-text-unpaid"
                )
                .forEach(element => {

                    element.classList.remove(
                        "payment-text-paid",
                        "payment-text-partial",
                        "payment-text-unpaid"
                    );
                });


            // Ищем только жирные элементы,
            // в которых непосредственно находится статус оплаты

            const statusElements =
                card.querySelectorAll(
                    "b, strong"
                );


            statusElements.forEach(element => {

                const text =
                    String(
                        element.textContent || ""
                    )
                    .trim()
                    .toLowerCase();


                // НЕ ОПЛАЧЕНО

                if (
                    text === "не оплачено"
                ) {

                    element.classList.add(
                        "payment-text-unpaid"
                    );

                    return;
                }


                // ЧАСТИЧНАЯ ПРЕДОПЛАТА
                // или ЧАСТИЧНО ОПЛАЧЕНО

                if (
                    text.includes("частич") ||
                    text.includes("предоплат")
                ) {

                    element.classList.add(
                        "payment-text-partial"
                    );

                    return;
                }


                // ОПЛАЧЕНО

                if (
                    text === "оплачено"
                ) {

                    element.classList.add(
                        "payment-text-paid"
                    );
                }
            });
        });
}


// =====================================================
// ИСПРАВЛЕННЫЕ СТИЛИ
// ТОЛЬКО ДЛЯ СТАТУСА ОПЛАТЫ
// =====================================================

function addPaymentTextStylesFixed() {

    const oldStyle =
        document.getElementById(
            "paymentTextStylesFixed"
        );


    if (oldStyle) {
        oldStyle.remove();
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "paymentTextStylesFixed";


    style.textContent = `

        /* Убираем возможную окраску
           у обычных элементов карточки */

        #ordersList .order-card {
            color: inherit;
        }


        /* ОПЛАЧЕНО */

        #ordersList
        .order-card
        .payment-text-paid {

            display:
                inline-block;

            color:
                #25823C !important;

            background:
                #E4F7E9 !important;

            padding:
                3px 8px !important;

            border-radius:
                8px !important;

            font-weight:
                700 !important;
        }


        /* ЧАСТИЧНО ОПЛАЧЕНО */

        #ordersList
        .order-card
        .payment-text-partial {

            display:
                inline-block;

            color:
                #25823C !important;

            background:
                #E4F7E9 !important;

            padding:
                3px 8px !important;

            border-radius:
                8px !important;

            font-weight:
                700 !important;
        }


        /* НЕ ОПЛАЧЕНО */

        #ordersList
        .order-card
        .payment-text-unpaid {

            display:
                inline-block;

            color:
                #C93434 !important;

            background:
                #FFE7E7 !important;

            padding:
                3px 8px !important;

            border-radius:
                8px !important;

            font-weight:
                700 !important;
        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// ОБНОВЛЕНИЕ ПОСЛЕ ОТРИСОВКИ ЗАКАЗОВ
// =====================================================

const _renderOrderCardsPaymentFix =
    renderOrderCards;


renderOrderCards = function () {

    _renderOrderCardsPaymentFix();


    setTimeout(
        applyPaymentTextColors,
        0
    );
};


// =====================================================
// ЗАПУСК
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addPaymentTextStylesFixed();


        setTimeout(
            applyPaymentTextColors,
            100
        );
    }
);

// =====================================================
// ИСПРАВЛЕНИЕ ЦЕН ДИПЛОМОВ ПО КОЛИЧЕСТВУ
// Работает в обе стороны:
// товар -> количество
// количество -> товар
// =====================================================


// Пересчитываем цену конкретной позиции диплома
function refreshDiplomaPriceByQuantity(position) {

    if (!position) {
        return;
    }


    const category =
        position.querySelector(
            ".position-category"
        )?.value;


    // Для других категорий ничего не меняем
    if (category !== "diploma") {
        return;
    }


    const productSelect =
        position.querySelector(
            ".position-product"
        );


    if (
        !productSelect ||
        !productSelect.value
    ) {

        calculateAll();

        return;
    }


    const quantityInput =
        position.querySelector(
            ".position-quantity"
        );


    const saleInput =
        position.querySelector(
            ".position-sale"
        );


    const costInput =
        position.querySelector(
            ".position-cost"
        );


    if (
        !quantityInput ||
        !saleInput ||
        !costInput
    ) {
        return;
    }


    // Не даём количеству быть меньше 1
    let quantity =
        Number(
            quantityInput.value
        );


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {
        quantity = 1;
    }


    const price =
        getDiplomaPrice(
            productSelect.value,
            quantity
        );


    // Обновляем цену за 1 шт.
    saleInput.value =
        Number(
            price.sale || 0
        );


    costInput.value =
        Number(
            price.cost || 0
        );


    // И сразу обновляем итог
    calculateAll();
}


// =====================================================
// СЛУШАЕМ ИЗМЕНЕНИЕ КОЛИЧЕСТВА
// =====================================================

document.addEventListener(
    "input",
    function (event) {

        const quantityInput =
            event.target.closest(
                "#positions .position-quantity"
            );


        if (!quantityInput) {
            return;
        }


        const position =
            quantityInput.closest(
                ".position-card"
            );


        if (!position) {
            return;
        }


        const category =
            position.querySelector(
                ".position-category"
            )?.value;


        if (category === "diploma") {

            refreshDiplomaPriceByQuantity(
                position
            );

        } else {

            calculateAll();
        }
    }
);


// =====================================================
// ДОПОЛНИТЕЛЬНО ЛОВИМ CHANGE
// Полезно для iPhone,
// когда количество вводится с цифровой клавиатуры
// =====================================================

document.addEventListener(
    "change",
    function (event) {

        const quantityInput =
            event.target.closest(
                "#positions .position-quantity"
            );


        if (!quantityInput) {
            return;
        }


        const position =
            quantityInput.closest(
                ".position-card"
            );


        if (!position) {
            return;
        }


        if (
            position.querySelector(
                ".position-category"
            )?.value === "diploma"
        ) {

            refreshDiplomaPriceByQuantity(
                position
            );
        }
    }
);

// ============================================================
// БОЛЬШОЕ ОБНОВЛЕНИЕ ЗАКАЗОВ
//
// 1. Клиент:
//    - ФИО
//    - телефон
//    - канал продажи
//    - канал связи
//
// 2. Редактирование:
//    - одна кнопка "Сохранить изменения"
//    - дата и время
//    - статус заказа
//    - статус оплаты
//    - клиент
//    - доставка / ТТН
//    - позиции
//
// 3. Позиции:
//    - Продажа всего
//    - Себестоимость всего
//    - программа сама считает цену за 1 шт.
//
// 4. Два режима цены:
//    - автоматическая цена каталога
//    - ручная общая сумма
// ============================================================



// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function safeNumber(value) {

    const number =
        Number(
            String(value ?? "")
                .replace(",", ".")
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


function moneyRound(value) {

    return Math.round(
        safeNumber(value) * 100
    ) / 100;
}


function getPositionQuantity(card) {

    const input =
        card?.querySelector(
            ".position-quantity"
        );

    const qty =
        safeNumber(
            input?.value
        );

    return qty > 0
        ? qty
        : 1;
}


function getEditPositionQuantity(card) {

    const input =
        card?.querySelector(
            ".edit-quantity"
        );

    const qty =
        safeNumber(
            input?.value
        );

    return qty > 0
        ? qty
        : 1;
}


// ============================================================
// КЛИЕНТ — НОВЫЙ ЗАКАЗ
// ============================================================

function addExtendedClientFieldsToNewOrder() {

    const clientInput =
        document.getElementById(
            "clientName"
        );

    if (!clientInput) {
        return;
    }


    if (
        document.getElementById(
            "extendedClientFields"
        )
    ) {
        return;
    }


    // Если рядом есть label "Клиент",
    // меняем его на ФИО

    const field =
        clientInput.closest(
            ".field"
        );


    const label =
        field?.querySelector(
            "label"
        );


    if (label) {
        label.textContent =
            "ФИО клиента";
    }


    clientInput.placeholder =
        "Имя и фамилия";


    const block =
        document.createElement(
            "div"
        );


    block.id =
        "extendedClientFields";


    block.className =
        "extended-client-fields";


    block.innerHTML = `

        <div class="field">

            <label>
                Номер телефона
            </label>

            <input
                id="clientPhone"
                type="tel"
                inputmode="tel"
                placeholder="+380..."
                autocomplete="tel"
            >

        </div>


        <div class="client-channel-grid">

            <div class="field">

                <label>
                    Канал продажи
                </label>

                <select
                    id="clientSalesChannel"
                >
                    <option value="">
                        Не выбран
                    </option>

                    <option value="Сайт">
                        Сайт
                    </option>

                    <option value="Instagram">
                        Instagram
                    </option>

                    <option value="Другое">
                        Другое
                    </option>
                </select>

            </div>


            <div class="field">

                <label>
                    Канал связи
                </label>

                <select
                    id="clientContactChannel"
                >
                    <option value="">
                        Не выбран
                    </option>

                    <option value="Telegram">
                        Telegram
                    </option>

                    <option value="Viber">
                        Viber
                    </option>

                    <option value="WhatsApp">
                        WhatsApp
                    </option>
                </select>

            </div>

        </div>
    `;


    field.insertAdjacentElement(
        "afterend",
        block
    );
}



// ============================================================
// СОХРАНЕНИЕ РАСШИРЕННЫХ ДАННЫХ КЛИЕНТА
// ПРИ СОЗДАНИИ НОВОГО ЗАКАЗА
// ============================================================

const _saveOrderExtendedClient =
    saveOrder;


saveOrder = function () {

    const clientPhone =
        document.getElementById(
            "clientPhone"
        )?.value.trim() || "";


    const salesChannel =
        document.getElementById(
            "clientSalesChannel"
        )?.value || "";


    const contactChannel =
        document.getElementById(
            "clientContactChannel"
        )?.value || "";


    // Запоминаем количество заказов до сохранения

    const beforeOrders =
        getOrders();


    const beforeIds =
        new Set(
            beforeOrders.map(
                order =>
                    String(order.id)
            )
        );


    // Сохраняем обычным существующим способом

    _saveOrderExtendedClient();


    // Находим только что созданный заказ

    const orders =
        getOrders();


    let createdOrder =
        orders.find(
            order =>
                !beforeIds.has(
                    String(order.id)
                )
        );


    // Если не нашли по ID —
    // берём самый новый

    if (!createdOrder) {

        createdOrder =
            [...orders]
                .sort(
                    (a, b) =>
                        Number(b.id || 0) -
                        Number(a.id || 0)
                )[0];
    }


    if (createdOrder) {

        createdOrder.clientPhone =
            clientPhone;

        createdOrder.salesChannel =
            salesChannel;

        createdOrder.contactChannel =
            contactChannel;


        saveOrders(
            orders
        );
    }


    // Очищаем дополнительные поля

    const phone =
        document.getElementById(
            "clientPhone"
        );

    const sale =
        document.getElementById(
            "clientSalesChannel"
        );

    const contact =
        document.getElementById(
            "clientContactChannel"
        );


    if (phone) {
        phone.value = "";
    }

    if (sale) {
        sale.value = "";
    }

    if (contact) {
        contact.value = "";
    }


    if (
        typeof renderOrderCards ===
        "function"
    ) {
        renderOrderCards();
    }
};



// ============================================================
// ОБЩАЯ СУММА ПОЗИЦИИ — НОВЫЙ ЗАКАЗ
// ============================================================

function enhanceNewOrderPositionCard(
    card
) {

    if (!card) {
        return;
    }


    if (
        card.dataset.totalFieldsReady ===
        "1"
    ) {
        return;
    }


    const saleInput =
        card.querySelector(
            ".position-sale"
        );


    const costInput =
        card.querySelector(
            ".position-cost"
        );


    if (
        !saleInput ||
        !costInput
    ) {
        return;
    }


    card.dataset.totalFieldsReady =
        "1";


    // Старые поля цены за единицу
    // оставляем для логики приложения,
    // но прячем визуально

    const saleField =
        saleInput.closest(
            ".field"
        );


    const costField =
        costInput.closest(
            ".field"
        );


    if (saleField) {

        saleField.classList.add(
            "internal-unit-price-field"
        );
    }


    if (costField) {

        costField.classList.add(
            "internal-unit-price-field"
        );
    }


    const totalBlock =
        document.createElement(
            "div"
        );


    totalBlock.className =
        "position-total-inputs";


    totalBlock.innerHTML = `

        <div class="field">

            <label>
                Продажа всего
            </label>

            <input
                type="number"
                inputmode="decimal"
                min="0"
                step="0.01"
                class="position-sale-total-input"
                placeholder="0"
            >

        </div>


        <div class="field">

            <label>
                Себестоимость всего
            </label>

            <input
                type="number"
                inputmode="decimal"
                min="0"
                step="0.01"
                class="position-cost-total-input"
                placeholder="0"
            >

        </div>


        <div class="position-unit-info">

            <span>
                Цена 1 шт.:
                <b class="position-unit-sale-info">
                    0 грн
                </b>
            </span>

            <span>
                Себест. 1 шт.:
                <b class="position-unit-cost-info">
                    0 грн
                </b>
            </span>

        </div>
    `;


    const manualPrices =
        card.querySelector(
            ".manual-prices"
        );


    if (manualPrices) {

        manualPrices.insertAdjacentElement(
            "afterend",
            totalBlock
        );

    } else {

        const positionTotal =
            card.querySelector(
                ".position-total"
            );


        if (positionTotal) {

            positionTotal.insertAdjacentElement(
                "beforebegin",
                totalBlock
            );

        } else {

            card.appendChild(
                totalBlock
            );
        }
    }


    syncPositionTotalsFromUnitPrices(
        card
    );
}



// ============================================================
// ЦЕНА ЗА ШТУКУ -> ОБЩАЯ СУММА
// ============================================================

function syncPositionTotalsFromUnitPrices(
    card,
    force = false
) {

    if (!card) {
        return;
    }


    const quantity =
        getPositionQuantity(
            card
        );


    const saleUnit =
        safeNumber(
            card.querySelector(
                ".position-sale"
            )?.value
        );


    const costUnit =
        safeNumber(
            card.querySelector(
                ".position-cost"
            )?.value
        );


    const saleTotalInput =
        card.querySelector(
            ".position-sale-total-input"
        );


    const costTotalInput =
        card.querySelector(
            ".position-cost-total-input"
        );


    // Если пользователь вручную изменил общую сумму,
    // автоматический каталог её больше не перетирает.
    // force=true используется при выборе нового товара.

    if (
        saleTotalInput &&
        (
            force ||
            saleTotalInput.dataset.manual !==
                "1"
        )
    ) {

        saleTotalInput.value =
            moneyRound(
                saleUnit *
                quantity
            );
    }


    if (
        costTotalInput &&
        (
            force ||
            costTotalInput.dataset.manual !==
                "1"
        )
    ) {

        costTotalInput.value =
            moneyRound(
                costUnit *
                quantity
            );
    }


    updatePositionUnitInfo(
        card
    );
}



// ============================================================
// ОБЩАЯ СУММА -> ЦЕНА ЗА 1 ШТ.
// ============================================================

function syncPositionUnitPricesFromTotals(
    card
) {

    if (!card) {
        return;
    }


    const quantity =
        getPositionQuantity(
            card
        );


    const totalSale =
        safeNumber(
            card.querySelector(
                ".position-sale-total-input"
            )?.value
        );


    const totalCost =
        safeNumber(
            card.querySelector(
                ".position-cost-total-input"
            )?.value
        );


    const saleUnitInput =
        card.querySelector(
            ".position-sale"
        );


    const costUnitInput =
        card.querySelector(
            ".position-cost"
        );


    if (saleUnitInput) {

        saleUnitInput.value =
            moneyRound(
                totalSale /
                quantity
            );
    }


    if (costUnitInput) {

        costUnitInput.value =
            moneyRound(
                totalCost /
                quantity
            );
    }


    updatePositionUnitInfo(
        card
    );


    calculateAll();
}



// ============================================================
// ПОКАЗЫВАЕМ ЦЕНУ ЗА 1 ШТ.
// ============================================================

function updatePositionUnitInfo(
    card
) {

    if (!card) {
        return;
    }


    const sale =
        safeNumber(
            card.querySelector(
                ".position-sale"
            )?.value
        );


    const cost =
        safeNumber(
            card.querySelector(
                ".position-cost"
            )?.value
        );


    const saleInfo =
        card.querySelector(
            ".position-unit-sale-info"
        );


    const costInfo =
        card.querySelector(
            ".position-unit-cost-info"
        );


    if (saleInfo) {

        saleInfo.textContent =
            `${moneyRound(sale)} грн`;
    }


    if (costInfo) {

        costInfo.textContent =
            `${moneyRound(cost)} грн`;
    }
}



// ============================================================
// ВСЕ ПОЗИЦИИ НОВОГО ЗАКАЗА
// ============================================================

function enhanceAllNewOrderPositions() {

    document
        .querySelectorAll(
            "#positions .position-card"
        )
        .forEach(
            enhanceNewOrderPositionCard
        );
}



// ============================================================
// ПОСЛЕ ДОБАВЛЕНИЯ НОВОЙ ПОЗИЦИИ
// ============================================================

const _addPositionTotalMode =
    addPosition;


addPosition = function () {

    _addPositionTotalMode();


    setTimeout(
        () => {

            enhanceAllNewOrderPositions();

        },
        0
    );
};



// ============================================================
// ЕСЛИ ВЫБРАЛИ ТОВАР / ДИПЛОМ
// ОБНОВЛЯЕМ ОБЩУЮ СУММУ
// ============================================================

const _updateDiplomaTotalMode =
    updateDiploma;


updateDiploma = function (
    productSelect
) {

    _updateDiplomaTotalMode(
        productSelect
    );


    const card =
        productSelect?.closest(
            ".position-card"
        );


    if (!card) {
        return;
    }


    // При выборе нового товара
    // сбрасываем ручной режим

    const saleTotal =
        card.querySelector(
            ".position-sale-total-input"
        );


    const costTotal =
        card.querySelector(
            ".position-cost-total-input"
        );


    if (saleTotal) {

        saleTotal.dataset.manual =
            "0";
    }


    if (costTotal) {

        costTotal.dataset.manual =
            "0";
    }


    setTimeout(
        () => {

            syncPositionTotalsFromUnitPrices(
                card,
                true
            );

        },
        0
    );
};



// ============================================================
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА
//
// Вариант 1:
// общая сумма вручную НЕ вводилась
// -> пересчитываем цену каталога и итог
//
// Вариант 2:
// общая сумма введена вручную
// -> сохраняем общую сумму и делим её на новое количество
// ============================================================

document.addEventListener(
    "input",
    event => {

        const quantityInput =
            event.target.closest(
                "#positions .position-quantity"
            );


        if (!quantityInput) {
            return;
        }


        const card =
            quantityInput.closest(
                ".position-card"
            );


        if (!card) {
            return;
        }


        const saleTotal =
            card.querySelector(
                ".position-sale-total-input"
            );


        const costTotal =
            card.querySelector(
                ".position-cost-total-input"
            );


        const manualSale =
            saleTotal?.dataset.manual ===
            "1";


        const manualCost =
            costTotal?.dataset.manual ===
            "1";


        const productSelect =
            card.querySelector(
                ".position-product"
            );


        const category =
            card.querySelector(
                ".position-category"
            )?.value;


        // Если общая сумма введена вручную,
        // делим её на новое количество

        if (
            manualSale ||
            manualCost
        ) {

            syncPositionUnitPricesFromTotals(
                card
            );

            return;
        }


        // Для дипломов пересчитываем
        // цену каталога по количеству

        if (
            category === "diploma" &&
            productSelect?.value
        ) {

            _updateDiplomaTotalMode(
                productSelect
            );
        }


        setTimeout(
            () => {

                syncPositionTotalsFromUnitPrices(
                    card,
                    true
                );

                calculateAll();

            },
            0
        );
    }
);



// ============================================================
// РУЧНОЙ ВВОД ОБЩЕЙ ПРОДАЖИ
// ============================================================

document.addEventListener(
    "input",
    event => {

        const input =
            event.target.closest(
                ".position-sale-total-input"
            );


        if (!input) {
            return;
        }


        input.dataset.manual =
            "1";


        const card =
            input.closest(
                ".position-card"
            );


        syncPositionUnitPricesFromTotals(
            card
        );
    }
);



// ============================================================
// РУЧНОЙ ВВОД ОБЩЕЙ СЕБЕСТОИМОСТИ
// ============================================================

document.addEventListener(
    "input",
    event => {

        const input =
            event.target.closest(
                ".position-cost-total-input"
            );


        if (!input) {
            return;
        }


        input.dataset.manual =
            "1";


        const card =
            input.closest(
                ".position-card"
            );


        syncPositionUnitPricesFromTotals(
            card
        );
    }
);



// ============================================================
// ИЗМЕНИЛИ КАТЕГОРИЮ
// СБРАСЫВАЕМ РУЧНОЙ РЕЖИМ
// ============================================================

document.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                "#positions .position-category"
            );


        if (!select) {
            return;
        }


        const card =
            select.closest(
                ".position-card"
            );


        if (!card) {
            return;
        }


        const saleTotal =
            card.querySelector(
                ".position-sale-total-input"
            );


        const costTotal =
            card.querySelector(
                ".position-cost-total-input"
            );


        if (saleTotal) {
            saleTotal.dataset.manual =
                "0";
        }


        if (costTotal) {
            costTotal.dataset.manual =
                "0";
        }


        setTimeout(
            () => {

                syncPositionTotalsFromUnitPrices(
                    card,
                    true
                );

            },
            0
        );
    }
);



// ============================================================
// РЕДАКТИРОВАНИЕ ЗАКАЗА
// ДОБАВЛЯЕМ ВСЕ ДАННЫЕ В ОДИН РЕДАКТОР
// ============================================================

const _renderOrderEditorUnified =
    renderOrderEditor;


renderOrderEditor = function (
    order
) {

    _renderOrderEditorUnified(
        order
    );


    setTimeout(
        () => {

            addUnifiedOrderEditFields(
                order
            );

            enhanceEditPositionCards();

            cleanupExtraSaveButtons();

        },
        0
    );
};



// ============================================================
// ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ РЕДАКТИРОВАНИЯ
// ============================================================

function addUnifiedOrderEditFields(
    order
) {

    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    if (!content) {
        return;
    }


    if (
        document.getElementById(
            "unifiedOrderEditFields"
        )
    ) {
        return;
    }


    const firstBlock =
        content.querySelector(
            ".order-detail-block"
        );


    if (!firstBlock) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.id =
        "unifiedOrderEditFields";


    wrapper.className =
        "order-detail-block";


    const currentDate =
        orderDateToInputValue(
            order.createdAt
        );


    const currentTime =
        orderTimeToInputValue(
            order.createdAt
        );


    wrapper.innerHTML = `

        <div class="detail-section-title">
            Клиент и заказ
        </div>


        <div class="field">

            <label>
                Номер телефона
            </label>

            <input
                id="editClientPhone"
                type="tel"
                value="${escapeHtml(
                    order.clientPhone ||
                    ""
                )}"
                placeholder="+380..."
            >

        </div>


        <div class="edit-two-columns">

            <div class="field">

                <label>
                    Канал продажи
                </label>

                <select
                    id="editSalesChannel"
                >

                    <option
                        value=""
                        ${
                            !order.salesChannel
                            ? "selected"
                            : ""
                        }
                    >
                        Не выбран
                    </option>

                    <option
                        value="Сайт"
                        ${
                            order.salesChannel ===
                            "Сайт"
                            ? "selected"
                            : ""
                        }
                    >
                        Сайт
                    </option>

                    <option
                        value="Instagram"
                        ${
                            order.salesChannel ===
                            "Instagram"
                            ? "selected"
                            : ""
                        }
                    >
                        Instagram
                    </option>

                    <option
                        value="Другое"
                        ${
                            order.salesChannel ===
                            "Другое"
                            ? "selected"
                            : ""
                        }
                    >
                        Другое
                    </option>

                </select>

            </div>


            <div class="field">

                <label>
                    Канал связи
                </label>

                <select
                    id="editContactChannel"
                >

                    <option
                        value=""
                        ${
                            !order.contactChannel
                            ? "selected"
                            : ""
                        }
                    >
                        Не выбран
                    </option>

                    <option
                        value="Telegram"
                        ${
                            order.contactChannel ===
                            "Telegram"
                            ? "selected"
                            : ""
                        }
                    >
                        Telegram
                    </option>

                    <option
                        value="Viber"
                        ${
                            order.contactChannel ===
                            "Viber"
                            ? "selected"
                            : ""
                        }
                    >
                        Viber
                    </option>

                    <option
                        value="WhatsApp"
                        ${
                            order.contactChannel ===
                            "WhatsApp"
                            ? "selected"
                            : ""
                        }
                    >
                        WhatsApp
                    </option>

                </select>

            </div>

        </div>


        <div class="edit-two-columns">

            <div class="field">

                <label>
                    Дата заказа
                </label>

                <input
                    id="editUnifiedOrderDate"
                    type="date"
                    value="${currentDate}"
                >

            </div>


            <div class="field">

                <label>
                    Время
                </label>

                <input
                    id="editUnifiedOrderTime"
                    type="time"
                    value="${currentTime}"
                >

            </div>

        </div>


        <div class="edit-two-columns">

            <div class="field">

                <label>
                    Статус заказа
                </label>

                <select
                    id="editUnifiedOrderStatus"
                >

                    ${makeUnifiedOrderStatusOptions(
                        order.status
                    )}

                </select>

            </div>


            <div class="field">

                <label>
                    Статус оплаты
                </label>

                <select
                    id="editUnifiedPaymentStatus"
                >

                    ${makeUnifiedPaymentStatusOptions(
                        order.paymentStatus
                    )}

                </select>

            </div>

        </div>
    `;


    firstBlock.insertAdjacentElement(
        "afterend",
        wrapper
    );
}



// ============================================================
// OPTIONS СТАТУСА ЗАКАЗА
// ============================================================

function makeUnifiedOrderStatusOptions(
    selected
) {

    const statuses = [
        "Новый",
        "В работе",
        "Готов",
        "Выдан",
        "Отменён"
    ];


    return statuses
        .map(
            value => `

                <option
                    value="${value}"
                    ${
                        value === selected
                        ? "selected"
                        : ""
                    }
                >
                    ${value}
                </option>

            `
        )
        .join("");
}



// ============================================================
// OPTIONS ОПЛАТЫ
// ============================================================

function makeUnifiedPaymentStatusOptions(
    selected
) {

    const statuses = [
        "Не оплачено",
        "Частичная предоплата",
        "Оплачено"
    ];


    return statuses
        .map(
            value => `

                <option
                    value="${value}"
                    ${
                        value === selected
                        ? "selected"
                        : ""
                    }
                >
                    ${value}
                </option>

            `
        )
        .join("");
}



// ============================================================
// УБИРАЕМ ЛИШНИЕ КНОПКИ "СОХРАНИТЬ"
// ВНУТРИ РЕДАКТОРА
// ОСТАВЛЯЕМ ГЛАВНУЮ КНОПКУ СОХРАНЕНИЯ
// ============================================================

function cleanupExtraSaveButtons() {

    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    if (!content) {
        return;
    }


    const buttons =
        Array.from(
            content.querySelectorAll(
                "button"
            )
        );


    buttons.forEach(
        button => {

            const text =
                String(
                    button.textContent ||
                    ""
                )
                .trim()
                .toLowerCase();


            // Не трогаем главную кнопку
            // saveEditedOrder

            const onclick =
                button.getAttribute(
                    "onclick"
                ) || "";


            if (
                onclick.includes(
                    "saveEditedOrder"
                )
            ) {
                return;
            }


            if (
                text ===
                    "сохранить доставку"
                ||
                text ===
                    "сохранить дату"
            ) {

                button.style.display =
                    "none";
            }
        }
    );


    // Переименовываем главную кнопку

    buttons.forEach(
        button => {

            const onclick =
                button.getAttribute(
                    "onclick"
                ) || "";


            if (
                onclick.includes(
                    "saveEditedOrder"
                )
            ) {

                button.textContent =
                    "Сохранить изменения";

                button.classList.add(
                    "unified-save-button"
                );
            }
        }
    );
}



// ============================================================
// ПОЗИЦИИ В РЕДАКТИРОВАНИИ
// ОБЩАЯ ПРОДАЖА / ОБЩАЯ СЕБЕСТОИМОСТЬ
// ============================================================

function enhanceEditPositionCards() {

    document
        .querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        )
        .forEach(
            card => {

                if (
                    card.dataset
                        .editTotalFieldsReady ===
                    "1"
                ) {
                    return;
                }


                const saleInput =
                    card.querySelector(
                        ".edit-sale"
                    );


                const costInput =
                    card.querySelector(
                        ".edit-cost"
                    );


                if (
                    !saleInput ||
                    !costInput
                ) {
                    return;
                }


                card.dataset
                    .editTotalFieldsReady =
                    "1";


                const saleField =
                    saleInput.closest(
                        ".field"
                    );


                const costField =
                    costInput.closest(
                        ".field"
                    );


                saleField?.classList.add(
                    "internal-unit-price-field"
                );


                costField?.classList.add(
                    "internal-unit-price-field"
                );


                const quantity =
                    getEditPositionQuantity(
                        card
                    );


                const totalSale =
                    moneyRound(
                        safeNumber(
                            saleInput.value
                        ) *
                        quantity
                    );


                const totalCost =
                    moneyRound(
                        safeNumber(
                            costInput.value
                        ) *
                        quantity
                    );


                const block =
                    document.createElement(
                        "div"
                    );


                block.className =
                    "edit-position-total-inputs";


                block.innerHTML = `

                    <div class="field">

                        <label>
                            Продажа всего
                        </label>

                        <input
                            type="number"
                            inputmode="decimal"
                            min="0"
                            step="0.01"
                            class="edit-sale-total-input"
                            value="${totalSale}"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Себестоимость всего
                        </label>

                        <input
                            type="number"
                            inputmode="decimal"
                            min="0"
                            step="0.01"
                            class="edit-cost-total-input"
                            value="${totalCost}"
                        >

                    </div>


                    <div class="position-unit-info">

                        <span>
                            Цена 1 шт.:
                            <b class="edit-unit-sale-info">
                                ${moneyRound(
                                    saleInput.value
                                )} грн
                            </b>
                        </span>

                        <span>
                            Себест. 1 шт.:
                            <b class="edit-unit-cost-info">
                                ${moneyRound(
                                    costInput.value
                                )} грн
                            </b>
                        </span>

                    </div>
                `;


                const positionTotal =
                    card.querySelector(
                        ".edit-position-total, .position-total"
                    );


                if (positionTotal) {

                    positionTotal
                        .insertAdjacentElement(
                            "beforebegin",
                            block
                        );

                } else {

                    card.appendChild(
                        block
                    );
                }
            }
        );
}



// ============================================================
// РЕДАКТИРОВАНИЕ:
// ОБЩАЯ СУММА -> ЦЕНА ЗА 1 ШТ.
// ============================================================

function syncEditUnitPricesFromTotals(
    card
) {

    if (!card) {
        return;
    }


    const quantity =
        getEditPositionQuantity(
            card
        );


    const totalSale =
        safeNumber(
            card.querySelector(
                ".edit-sale-total-input"
            )?.value
        );


    const totalCost =
        safeNumber(
            card.querySelector(
                ".edit-cost-total-input"
            )?.value
        );


    const saleInput =
        card.querySelector(
            ".edit-sale"
        );


    const costInput =
        card.querySelector(
            ".edit-cost"
        );


    const saleUnit =
        moneyRound(
            totalSale /
            quantity
        );


    const costUnit =
        moneyRound(
            totalCost /
            quantity
        );


    if (saleInput) {
        saleInput.value =
            saleUnit;
    }


    if (costInput) {
        costInput.value =
            costUnit;
    }


    const saleInfo =
        card.querySelector(
            ".edit-unit-sale-info"
        );


    const costInfo =
        card.querySelector(
            ".edit-unit-cost-info"
        );


    if (saleInfo) {

        saleInfo.textContent =
            `${saleUnit} грн`;
    }


    if (costInfo) {

        costInfo.textContent =
            `${costUnit} грн`;
    }
}



// ============================================================
// РУЧНОЕ ИЗМЕНЕНИЕ ОБЩЕЙ СУММЫ В РЕДАКТОРЕ
// ============================================================

document.addEventListener(
    "input",
    event => {

        if (
            !event.target.matches(
                ".edit-sale-total-input, .edit-cost-total-input"
            )
        ) {
            return;
        }


        const card =
            event.target.closest(
                "[data-edit-position]"
            );


        syncEditUnitPricesFromTotals(
            card
        );
    }
);



// ============================================================
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА В РЕДАКТОРЕ
// ОБЩАЯ СУММА ОСТАЁТСЯ ТА ЖЕ,
// ЦЕНА ЗА ШТ. ПЕРЕСЧИТЫВАЕТСЯ
// ============================================================

document.addEventListener(
    "input",
    event => {

        if (
            !event.target.matches(
                "#editOrderPositions .edit-quantity"
            )
        ) {
            return;
        }


        const card =
            event.target.closest(
                "[data-edit-position]"
            );


        syncEditUnitPricesFromTotals(
            card
        );
    }
);



// ============================================================
// СОХРАНЕНИЕ ВСЕХ ИЗМЕНЕНИЙ ОДНОЙ КНОПКОЙ
// ============================================================

const _saveEditedOrderUnified =
    saveEditedOrder;


saveEditedOrder = function (
    id
) {

    // До вызова старого сохранения
    // забираем все дополнительные данные,
    // потому что старый код может перерисовать окно.

    const phone =
        document.getElementById(
            "editClientPhone"
        )?.value.trim() || "";


    const salesChannel =
        document.getElementById(
            "editSalesChannel"
        )?.value || "";


    const contactChannel =
        document.getElementById(
            "editContactChannel"
        )?.value || "";


    const status =
        document.getElementById(
            "editUnifiedOrderStatus"
        )?.value || "";


    const paymentStatus =
        document.getElementById(
            "editUnifiedPaymentStatus"
        )?.value || "";


    const dateValue =
        document.getElementById(
            "editUnifiedOrderDate"
        )?.value || "";


    const timeValue =
        document.getElementById(
            "editUnifiedOrderTime"
        )?.value || "00:00";


    // Перед стандартным сохранением
    // синхронизируем общие суммы
    // с внутренними ценами за 1 шт.

    document
        .querySelectorAll(
            "#editOrderPositions [data-edit-position]"
        )
        .forEach(
            syncEditUnitPricesFromTotals
        );


    // Стандартное сохранение:
    // клиент, позиции, доставка и т.д.

    _saveEditedOrderUnified(
        id
    );


    // Получаем заказ после стандартного сохранения

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!order) {
        return;
    }


    order.clientPhone =
        phone;


    order.salesChannel =
        salesChannel;


    order.contactChannel =
        contactChannel;


    if (status) {
        order.status =
            status;
    }


    if (paymentStatus) {
        order.paymentStatus =
            paymentStatus;
    }


    if (dateValue) {

        const date =
            new Date(
                `${dateValue}T${timeValue}:00`
            );


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            order.createdAt =
                date.getTime();
        }
    }


    saveOrders(
        orders
    );


    renderOrderDetails(
        order
    );


    renderOrderCards();
};



// ============================================================
// ПОКАЗЫВАЕМ ДАННЫЕ КЛИЕНТА
// В ОТКРЫТОМ ЗАКАЗЕ
// ============================================================

function addClientInformationToOrderDetails(
    order
) {

    const content =
        document.querySelector(
            "#orderModal .order-modal-content"
        );


    if (!content) {
        return;
    }


    if (
        document.getElementById(
            "orderClientExtraInformation"
        )
    ) {
        return;
    }


    if (
        !order.clientPhone &&
        !order.salesChannel &&
        !order.contactChannel
    ) {
        return;
    }


    const firstBlock =
        content.querySelector(
            ".order-detail-block"
        );


    if (!firstBlock) {
        return;
    }


    const info =
        document.createElement(
            "div"
        );


    info.id =
        "orderClientExtraInformation";


    info.className =
        "order-client-extra-info";


    info.innerHTML = `

        ${
            order.clientPhone
            ? `
                <div>
                    📞
                    <b>Телефон:</b>
                    ${escapeHtml(
                        order.clientPhone
                    )}
                </div>
            `
            : ""
        }


        ${
            order.salesChannel
            ? `
                <div>
                    🛒
                    <b>Канал продажи:</b>
                    ${escapeHtml(
                        order.salesChannel
                    )}
                </div>
            `
            : ""
        }


        ${
            order.contactChannel
            ? `
                <div>
                    💬
                    <b>Связь:</b>
                    ${escapeHtml(
                        order.contactChannel
                    )}
                </div>
            `
            : ""
        }
    `;


    firstBlock.appendChild(
        info
    );
}



// ============================================================
// ДОБАВЛЯЕМ ИНФОРМАЦИЮ В ПРОСМОТР ЗАКАЗА
// ============================================================

const _renderOrderDetailsClientInfo =
    renderOrderDetails;


renderOrderDetails = function (
    order
) {

    _renderOrderDetailsClientInfo(
        order
    );


    addClientInformationToOrderDetails(
        order
    );


    // Убираем отдельные кнопки
    // "Сохранить доставку"
    // "Сохранить дату"

    document
        .querySelectorAll(
            "#orderModal button"
        )
        .forEach(
            button => {

                const text =
                    String(
                        button.textContent ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    text ===
                        "сохранить доставку"
                    ||
                    text ===
                        "сохранить дату"
                ) {

                    button.style.display =
                        "none";
                }
            }
        );
};



// ============================================================
// СТИЛИ
// ============================================================

function addExtendedOrderStyles() {

    if (
        document.getElementById(
            "extendedOrderStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "extendedOrderStyles";


    style.textContent = `

        /* --------------------------------------
           КЛИЕНТ
        -------------------------------------- */

        .extended-client-fields {
            margin-top: 8px;
        }


        .client-channel-grid,
        .edit-two-columns {

            display: grid;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0,1fr)
                );

            gap: 8px;
        }


        .extended-client-fields
        input,

        .extended-client-fields
        select,

        #unifiedOrderEditFields
        input,

        #unifiedOrderEditFields
        select {

            width: 100%;

            min-width: 0;

            box-sizing: border-box;

            min-height: 42px;

            padding: 8px 10px;

            border-radius: 10px;

            font-size: 16px;
        }



        /* --------------------------------------
           ОБЩИЕ СУММЫ
        -------------------------------------- */

        .position-total-inputs,
        .edit-position-total-inputs {

            grid-column:
                1 / -1;

            display: grid;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0, 1fr)
                );

            gap: 8px;

            margin-top: 3px;
        }


        .position-total-inputs input,
        .edit-position-total-inputs input {

            width: 100%;

            box-sizing: border-box;
        }



        /* Старые поля за единицу
           остаются в DOM,
           чтобы существующие расчёты работали */

        .internal-unit-price-field {

            position: absolute !important;

            width: 1px !important;

            height: 1px !important;

            overflow: hidden !important;

            opacity: 0 !important;

            pointer-events: none !important;

            margin: 0 !important;

            padding: 0 !important;
        }



        /* --------------------------------------
           ИНФОРМАЦИЯ О ЦЕНЕ ЗА 1 ШТ.
        -------------------------------------- */

        .position-unit-info {

            grid-column:
                1 / -1;

            display: flex;

            justify-content:
                space-between;

            gap: 10px;

            padding:
                2px 2px 5px;

            font-size:
                11px;

            color:
                #73777f;
        }


        .position-unit-info b {

            color:
                #20232a;
        }



        /* --------------------------------------
           ДАННЫЕ КЛИЕНТА В ЗАКАЗЕ
        -------------------------------------- */

        .order-client-extra-info {

            display: grid;

            gap: 5px;

            margin-top: 10px;

            padding-top: 10px;

            border-top:
                1px solid
                rgba(0,0,0,.07);

            font-size: 13px;

            color: #555;
        }



        /* --------------------------------------
           ГЛАВНАЯ КНОПКА СОХРАНЕНИЯ
        -------------------------------------- */

        .unified-save-button {

            width: 100% !important;

            min-height: 48px !important;

            margin-top: 12px !important;

            border-radius: 12px !important;

            font-size: 15px !important;

            font-weight: 700 !important;
        }



        @media
        (max-width: 380px) {

            .client-channel-grid,
            .edit-two-columns {

                grid-template-columns:
                    1fr;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}



// ============================================================
// MIGRATION СТАРЫХ ЗАКАЗОВ
// ============================================================

function migrateExtendedClientFields() {

    const orders =
        getOrders();


    let changed =
        false;


    orders.forEach(
        order => {

            if (
                order.clientPhone == null
            ) {

                order.clientPhone = "";

                changed = true;
            }


            if (
                order.salesChannel == null
            ) {

                order.salesChannel = "";

                changed = true;
            }


            if (
                order.contactChannel == null
            ) {

                order.contactChannel = "";

                changed = true;
            }
        }
    );


    if (changed) {

        saveOrders(
            orders
        );
    }
}



// ============================================================
// НАБЛЮДАТЕЛЬ
// НУЖЕН ДЛЯ ДИНАМИЧЕСКИ ДОБАВЛЕННЫХ ПОЗИЦИЙ
// ============================================================

const extendedOrderObserver =
    new MutationObserver(
        () => {

            enhanceAllNewOrderPositions();

            if (
                document.querySelector(
                    "#editOrderPositions"
                )
            ) {

                enhanceEditPositionCards();
            }
        }
    );


document.addEventListener(
    "DOMContentLoaded",
    () => {

        migrateExtendedClientFields();

        addExtendedOrderStyles();

        addExtendedClientFieldsToNewOrder();

        enhanceAllNewOrderPositions();


        extendedOrderObserver.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }
);

// ============================================================
// НОВЫЕ СТАТУСЫ ЗАКАЗА
// ============================================================

const ORDER_STATUSES_NEW = [
    "Новый",
    "Принят",
    "В печати",
    "Отправлен",
    "Завершён",
    "Отменён"
];


// ============================================================
// ЦВЕТА СТАТУСОВ
// ============================================================

function getOrderStatusClass(status) {

    switch (String(status || "").trim()) {

        case "Новый":
            return "order-status-new";

        case "Принят":
            return "order-status-accepted";

        case "В печати":
            return "order-status-printing";

        case "Отправлен":
            return "order-status-sent";

        case "Завершён":
            return "order-status-completed";

        case "Отменён":
            return "order-status-cancelled";

        default:
            return "";
    }
}


// ============================================================
// OPTIONS ДЛЯ SELECT
// ============================================================

function createNewOrderStatusOptions(selectedStatus) {

    return ORDER_STATUSES_NEW
        .map(status => `
            <option
                value="${status}"
                ${status === selectedStatus ? "selected" : ""}
            >
                ${status}
            </option>
        `)
        .join("");
}


// ============================================================
// ЗАМЕНЯЕМ СТАТУСЫ В РЕДАКТОРЕ ЗАКАЗА
// ============================================================

function makeUnifiedOrderStatusOptions(selected) {

    return createNewOrderStatusOptions(
        selected
    );
}


// ============================================================
// ОБНОВЛЯЕМ SELECT СТАТУСОВ В СПИСКЕ ЗАКАЗОВ
// ============================================================

function updateOrderStatusSelects() {

    document
        .querySelectorAll(
            "#ordersList .order-card select"
        )
        .forEach(select => {

            const values =
                Array.from(
                    select.options
                )
                .map(option =>
                    option.value
                );


            const looksLikeStatusSelect =
                values.includes("Новый")
                ||
                values.includes("В работе")
                ||
                values.includes("Готов")
                ||
                values.includes("Выдан")
                ||
                values.includes("Принят")
                ||
                values.includes("В печати");


            if (!looksLikeStatusSelect) {
                return;
            }


            const current =
                select.value;


            let selected =
                current;


            // Переводим старые статусы
            // на новые

            if (current === "В работе") {
                selected = "Принят";
            }

            if (current === "Готов") {
                selected = "В печати";
            }

            if (current === "Выдан") {
                selected = "Завершён";
            }


            select.innerHTML =
                createNewOrderStatusOptions(
                    selected
                );


            select.value =
                selected;


            applyStatusColorToSelect(
                select
            );
        });
}


// ============================================================
// ЦВЕТ SELECT В ЗАВИСИМОСТИ ОТ СТАТУСА
// ============================================================

function applyStatusColorToSelect(select) {

    if (!select) {
        return;
    }


    select.classList.remove(
        "order-status-new",
        "order-status-accepted",
        "order-status-printing",
        "order-status-sent",
        "order-status-completed",
        "order-status-cancelled"
    );


    const statusClass =
        getOrderStatusClass(
            select.value
        );


    if (statusClass) {
        select.classList.add(
            statusClass
        );
    }
}


// ============================================================
// ЦВЕТ МЕНЯЕТСЯ СРАЗУ ПОСЛЕ ВЫБОРА
// ============================================================

document.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                "#ordersList .order-card select"
            );


        if (!select) {
            return;
        }


        const values =
            Array.from(
                select.options
            )
            .map(option =>
                option.value
            );


        if (
            !values.some(value =>
                ORDER_STATUSES_NEW.includes(
                    value
                )
            )
        ) {
            return;
        }


        applyStatusColorToSelect(
            select
        );
    }
);


// ============================================================
// МИГРАЦИЯ СТАРЫХ ЗАКАЗОВ
// ============================================================

function migrateOldOrderStatuses() {

    const orders =
        getOrders();


    let changed =
        false;


    orders.forEach(order => {

        switch (order.status) {

            case "В работе":
                order.status = "Принят";
                changed = true;
                break;

            case "Готов":
                order.status = "В печати";
                changed = true;
                break;

            case "Выдан":
                order.status = "Завершён";
                changed = true;
                break;
        }
    });


    if (changed) {

        saveOrders(
            orders
        );
    }
}


// ============================================================
// ПОСЛЕ ОТРИСОВКИ СПИСКА ЗАКАЗОВ
// ============================================================

const _renderOrderCardsNewStatuses =
    renderOrderCards;


renderOrderCards = function () {

    _renderOrderCardsNewStatuses();


    setTimeout(
        updateOrderStatusSelects,
        0
    );
};


// ============================================================
// ПОСЛЕ ОТКРЫТИЯ ЗАКАЗА
// ============================================================

const _renderOrderDetailsNewStatuses =
    renderOrderDetails;


renderOrderDetails = function (order) {

    _renderOrderDetailsNewStatuses(
        order
    );


    setTimeout(
        () => {

            const select =
                document.getElementById(
                    "editUnifiedOrderStatus"
                );


            if (select) {

                select.innerHTML =
                    createNewOrderStatusOptions(
                        order.status
                    );


                select.value =
                    order.status;


                applyStatusColorToSelect(
                    select
                );
            }

        },
        0
    );
};


// ============================================================
// ЦВЕТ СТАТУСА В РЕДАКТОРЕ
// ============================================================

document.addEventListener(
    "change",
    event => {

        if (
            event.target.id !==
            "editUnifiedOrderStatus"
        ) {
            return;
        }


        applyStatusColorToSelect(
            event.target
        );
    }
);


// ============================================================
// СТИЛИ СТАТУСОВ
// ============================================================

function addNewOrderStatusStyles() {

    if (
        document.getElementById(
            "newOrderStatusStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "newOrderStatusStyles";


    style.textContent = `

        .order-status-new {
            background: #e8f3ff !important;
            color: #1769aa !important;
            border-color: #b9d9f5 !important;
        }


        .order-status-accepted {
            background: #fff1df !important;
            color: #b36200 !important;
            border-color: #f1c78f !important;
        }


        .order-status-printing {
            background: #f1eaff !important;
            color: #7044b8 !important;
            border-color: #d2bff3 !important;
        }


        .order-status-sent {
            background: #e4f8ed !important;
            color: #18804b !important;
            border-color: #a9ddc0 !important;
        }


        .order-status-completed {
            background: #eeeeee !important;
            color: #555555 !important;
            border-color: #cccccc !important;
        }


        .order-status-cancelled {
            background: #ffe9e9 !important;
            color: #bd2929 !important;
            border-color: #efb5b5 !important;
        }


        #ordersList select.order-status-new,
        #ordersList select.order-status-accepted,
        #ordersList select.order-status-printing,
        #ordersList select.order-status-sent,
        #ordersList select.order-status-completed,
        #ordersList select.order-status-cancelled,
        #editUnifiedOrderStatus {

            font-weight: 700;

            border-width: 1px;

            border-style: solid;
        }

    `;


    document.head.appendChild(
        style
    );
}


// ============================================================
// ЗАПУСК
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addNewOrderStatusStyles();

        migrateOldOrderStatuses();

        setTimeout(
            () => {

                renderOrderCards();

                updateOrderStatusSelects();

            },
            0
        );
    }
);

// ============================================================
// ЕДИНЫЕ СТАТУСЫ ЗАКАЗОВ ВО ВСЁМ ПРИЛОЖЕНИИ
// ============================================================

const UNIFIED_ORDER_STATUSES = [
    "Новый",
    "Принят",
    "В печати",
    "Отправлен",
    "Завершён",
    "Отменён"
];


// ============================================================
// ПЕРЕВОД СТАРЫХ СТАТУСОВ
// ============================================================

function normalizeOrderStatus(status) {

    const value =
        String(status || "").trim();

    switch (value) {

        case "В работе":
            return "Принят";

        case "Готов":
            return "В печати";

        case "Выдан":
            return "Завершён";

        default:
            return UNIFIED_ORDER_STATUSES.includes(value)
                ? value
                : "Новый";
    }
}


// ============================================================
// СОЗДАЁМ OPTIONS
// ============================================================

function unifiedOrderStatusOptions(selected) {

    const current =
        normalizeOrderStatus(selected);

    return UNIFIED_ORDER_STATUSES
        .map(status => `
            <option
                value="${status}"
                ${status === current ? "selected" : ""}
            >
                ${status}
            </option>
        `)
        .join("");
}


// ============================================================
// ЦВЕТА
// ============================================================

function unifiedOrderStatusClass(status) {

    switch (
        normalizeOrderStatus(status)
    ) {

        case "Новый":
            return "unified-status-new";

        case "Принят":
            return "unified-status-accepted";

        case "В печати":
            return "unified-status-printing";

        case "Отправлен":
            return "unified-status-sent";

        case "Завершён":
            return "unified-status-completed";

        case "Отменён":
            return "unified-status-cancelled";

        default:
            return "";
    }
}


function applyUnifiedStatusColor(select) {

    if (!select) return;

    select.classList.remove(
        "unified-status-new",
        "unified-status-accepted",
        "unified-status-printing",
        "unified-status-sent",
        "unified-status-completed",
        "unified-status-cancelled",

        // старые классы
        "order-status-new",
        "order-status-accepted",
        "order-status-printing",
        "order-status-sent",
        "order-status-completed",
        "order-status-cancelled"
    );

    const className =
        unifiedOrderStatusClass(
            select.value
        );

    if (className) {
        select.classList.add(
            className
        );
    }
}


// ============================================================
// МИГРАЦИЯ ВСЕХ СТАРЫХ ЗАКАЗОВ
// ============================================================

function migrateAllOrderStatuses() {

    const orders =
        getOrders();

    let changed =
        false;

    orders.forEach(order => {

        const normalized =
            normalizeOrderStatus(
                order.status
            );

        if (
            order.status !== normalized
        ) {

            order.status =
                normalized;

            changed =
                true;
        }
    });


    if (changed) {

        saveOrders(
            orders
        );
    }
}


// ============================================================
// МЕНЯЕМ СТАТУС ПРЯМО ИЗ СПИСКА ЗАКАЗОВ
// ============================================================

function changeOrderStatusFromList(
    orderId,
    newStatus
) {

    const orders =
        getOrders();

    const order =
        orders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );

    if (!order) {
        return;
    }


    order.status =
        normalizeOrderStatus(
            newStatus
        );


    saveOrders(
        orders
    );


    // обновляем список
    renderOrderCards();
}


// ============================================================
// НАХОДИМ ID ЗАКАЗА В КАРТОЧКЕ
// ============================================================

function getOrderIdFromCard(card) {

    if (!card) {
        return null;
    }


    // 1. data-order-id

    if (card.dataset.orderId) {

        return card.dataset.orderId;
    }


    // 2. ищем в кнопках / select onclick

    const elements =
        card.querySelectorAll(
            "[onclick]"
        );

    for (
        const element of elements
    ) {

        const onclick =
            element.getAttribute(
                "onclick"
            ) || "";


        const match =
            onclick.match(
                /\((['"]?)(\d+)\1/
            );


        if (match) {
            return match[2];
        }
    }


    // 3. пробуем найти номер заказа
    // и сопоставить с orders

    const text =
        card.textContent || "";


    const numberMatch =
        text.match(
            /Заказ\s*№\s*0*(\d+)/i
        );


    if (numberMatch) {

        const number =
            Number(
                numberMatch[1]
            );


        const order =
            getOrders().find(
                item =>
                    Number(
                        item.number
                    ) ===
                    number
            );


        if (order) {
            return order.id;
        }
    }


    return null;
}


// ============================================================
// ОБНОВЛЯЕМ СТАТУСЫ В ОБЩЕМ СПИСКЕ
// ============================================================

function makeOrderListStatusesUnified() {

    const cards =
        document.querySelectorAll(
            "#ordersList .order-card"
        );


    cards.forEach(card => {

        const orderId =
            getOrderIdFromCard(
                card
            );


        if (!orderId) {
            return;
        }


        const order =
            getOrders().find(
                item =>
                    String(item.id) ===
                    String(orderId)
            );


        if (!order) {
            return;
        }


        // ----------------------------------------------------
        // ИЩЕМ СУЩЕСТВУЮЩИЙ SELECT СТАТУСА
        // ----------------------------------------------------

        let statusSelect =
            null;


        const selects =
            card.querySelectorAll(
                "select"
            );


        selects.forEach(select => {

            const values =
                Array.from(
                    select.options
                )
                .map(
                    option =>
                        option.value
                );


            const statusWords = [
                "Новый",
                "В работе",
                "Готов",
                "Выдан",
                "Отменён",
                "Принят",
                "В печати",
                "Отправлен",
                "Завершён"
            ];


            if (
                values.some(
                    value =>
                        statusWords.includes(
                            value
                        )
                )
            ) {

                statusSelect =
                    select;
            }
        });


        // ----------------------------------------------------
        // ЕСЛИ SELECT УЖЕ ЕСТЬ
        // ----------------------------------------------------

        if (statusSelect) {

            const currentStatus =
                normalizeOrderStatus(
                    order.status
                );


            statusSelect.innerHTML =
                unifiedOrderStatusOptions(
                    currentStatus
                );


            statusSelect.value =
                currentStatus;


            // Удаляем старые inline onchange,
            // чтобы не было двойного сохранения

            statusSelect.removeAttribute(
                "onchange"
            );


            statusSelect.dataset.orderId =
                order.id;


            statusSelect.classList.add(
                "unified-order-status-select"
            );


            applyUnifiedStatusColor(
                statusSelect
            );

            return;
        }


        // ----------------------------------------------------
        // ЕСЛИ SELECT В КАРТОЧКЕ ВООБЩЕ НЕТ —
        // ДОБАВЛЯЕМ ЕГО
        // ----------------------------------------------------

        const block =
            document.createElement(
                "div"
            );


        block.className =
            "unified-status-list-block";


        block.innerHTML = `
            <span class="unified-status-label">
                Статус
            </span>

            <select
                class="unified-order-status-select"
                data-order-id="${order.id}"
            >
                ${unifiedOrderStatusOptions(
                    order.status
                )}
            </select>
        `;


        const firstActions =
            card.querySelector(
                ".order-actions"
            );


        if (firstActions) {

            firstActions.insertAdjacentElement(
                "beforebegin",
                block
            );

        } else {

            card.appendChild(
                block
            );
        }


        applyUnifiedStatusColor(
            block.querySelector(
                "select"
            )
        );
    });
}


// ============================================================
// ИЗМЕНЕНИЕ СТАТУСА ПРЯМО В СПИСКЕ
// ============================================================

document.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                ".unified-order-status-select"
            );


        if (!select) {
            return;
        }


        const orderId =
            select.dataset.orderId;


        if (!orderId) {
            return;
        }


        applyUnifiedStatusColor(
            select
        );


        changeOrderStatusFromList(
            orderId,
            select.value
        );
    }
);


// ============================================================
// СТАТУС В РЕДАКТИРОВАНИИ ЗАКАЗА
// ============================================================

function makeUnifiedOrderStatusOptions(
    selected
) {

    return unifiedOrderStatusOptions(
        selected
    );
}


// ============================================================
// ОБНОВЛЯЕМ СТАТУС В ОКНЕ РЕДАКТИРОВАНИЯ
// ============================================================

function updateEditorStatusSelect() {

    const select =
        document.getElementById(
            "editUnifiedOrderStatus"
        );


    if (!select) {
        return;
    }


    const current =
        normalizeOrderStatus(
            select.value
        );


    select.innerHTML =
        unifiedOrderStatusOptions(
            current
        );


    select.value =
        current;


    applyUnifiedStatusColor(
        select
    );
}


// ============================================================
// ОБНОВЛЯЕМ СТАТУСЫ ПОСЛЕ renderOrderCards()
// ============================================================

const _renderOrderCardsUnifiedFinal =
    renderOrderCards;


renderOrderCards = function () {

    _renderOrderCardsUnifiedFinal();


    setTimeout(
        () => {

            makeOrderListStatusesUnified();

        },
        0
    );
};


// ============================================================
// ОБНОВЛЯЕМ ПОСЛЕ renderOrderDetails()
// ============================================================

const _renderOrderDetailsUnifiedFinal =
    renderOrderDetails;


renderOrderDetails = function (
    order
) {

    _renderOrderDetailsUnifiedFinal(
        order
    );


    setTimeout(
        () => {

            updateEditorStatusSelect();

        },
        0
    );
};


// ============================================================
// ОБНОВЛЯЕМ ПОСЛЕ renderOrderEditor()
// ============================================================

const _renderOrderEditorUnifiedFinal =
    renderOrderEditor;


renderOrderEditor = function (
    order
) {

    _renderOrderEditorUnifiedFinal(
        order
    );


    setTimeout(
        () => {

            updateEditorStatusSelect();

        },
        0
    );
};


// ============================================================
// ЦВЕТ В РЕДАКТОРЕ ПРИ ИЗМЕНЕНИИ
// ============================================================

document.addEventListener(
    "change",
    event => {

        if (
            event.target.id !==
            "editUnifiedOrderStatus"
        ) {
            return;
        }


        applyUnifiedStatusColor(
            event.target
        );
    }
);


// ============================================================
// СТИЛИ
// ============================================================

function addUnifiedOrderStatusStyles() {

    const old =
        document.getElementById(
            "unifiedOrderStatusStyles"
        );


    if (old) {
        old.remove();
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "unifiedOrderStatusStyles";


    style.textContent = `

        /* ==============================
           ОБЩИЙ ВИД SELECT
        ============================== */

        .unified-order-status-select,
        #editUnifiedOrderStatus {

            width: 100%;

            min-height: 38px;

            padding: 7px 30px 7px 10px;

            border-radius: 10px;

            border: 1px solid;

            font-size: 14px;

            font-weight: 700;

            box-sizing: border-box;
        }


        /* ==============================
           НОВЫЙ
        ============================== */

        .unified-status-new {

            background:
                #e8f3ff !important;

            color:
                #1769aa !important;

            border-color:
                #b9d9f5 !important;
        }


        /* ==============================
           ПРИНЯТ
        ============================== */

        .unified-status-accepted {

            background:
                #fff1df !important;

            color:
                #ad6200 !important;

            border-color:
                #f2c889 !important;
        }


        /* ==============================
           В ПЕЧАТИ
        ============================== */

        .unified-status-printing {

            background:
                #f1eaff !important;

            color:
                #7044b8 !important;

            border-color:
                #cfbdf1 !important;
        }


        /* ==============================
           ОТПРАВЛЕН
        ============================== */

        .unified-status-sent {

            background:
                #e3f8ed !important;

            color:
                #187f4b !important;

            border-color:
                #a9ddc0 !important;
        }


        /* ==============================
           ЗАВЕРШЁН
        ============================== */

        .unified-status-completed {

            background:
                #eeeeee !important;

            color:
                #555 !important;

            border-color:
                #cccccc !important;
        }


        /* ==============================
           ОТМЕНЁН
        ============================== */

        .unified-status-cancelled {

            background:
                #ffe9e9 !important;

            color:
                #bd2929 !important;

            border-color:
                #efb5b5 !important;
        }


        /* ==============================
           БЛОК В СПИСКЕ ЗАКАЗОВ
        ============================== */

        .unified-status-list-block {

            display: grid;

            grid-template-columns:
                70px 1fr;

            align-items: center;

            gap: 8px;

            margin-top: 8px;

            margin-bottom: 8px;
        }


        .unified-status-label {

            font-size: 12px;

            color: #777;
        }

    `;


    document.head.appendChild(
        style
    );
}


// ============================================================
// ЗАПУСК
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addUnifiedOrderStatusStyles();

        migrateAllOrderStatuses();


        setTimeout(
            () => {

                renderOrderCards();

                makeOrderListStatusesUnified();

            },
            0
        );
    }
);