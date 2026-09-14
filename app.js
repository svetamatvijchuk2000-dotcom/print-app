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