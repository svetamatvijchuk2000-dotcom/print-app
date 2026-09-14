// ===============================
// КАТАЛОГ
// ===============================

const DEFAULT_CATALOG = {
    diplomas: {
        "Диплом УФ — А5": {
            "1":  { sale: 300, cost: 240 },
            "2":  { sale: 300, cost: 240 },
            "3":  { sale: 280, cost: 200 },
            "11": { sale: 260, cost: 190 },
            "21": { sale: 240, cost: 180 },
            "51": { sale: 220, cost: 170 }
        },

        "Диплом УФ — А4": {
            "1":  { sale: 470, cost: 420 },
            "2":  { sale: 470, cost: 420 },
            "3":  { sale: 450, cost: 400 },
            "11": { sale: 430, cost: 370 },
            "21": { sale: 410, cost: 350 },
            "51": { sale: 390, cost: 320 }
        },

        "Диплом сублимация — А5": {
            "1":  { sale: 300, cost: 240 },
            "2":  { sale: 300, cost: 240 },
            "3":  { sale: 280, cost: 190 },
            "11": { sale: 260, cost: 180 },
            "21": { sale: 240, cost: 170 },
            "51": { sale: 220, cost: 165 }
        },

        "Диплом сублимация — А4": {
            "1":  { sale: 470, cost: 400 },
            "2":  { sale: 470, cost: 400 },
            "3":  { sale: 450, cost: 390 },
            "11": { sale: 430, cost: 360 },
            "21": { sale: 410, cost: 340 },
            "51": { sale: 390, cost: 310 }
        }
    },

    readyCups: {
        "Чашка с карабином 300 мл — С/С": 159,
        "Чашка с карабином 300 мл — С/Кр": 159,
        "Чашка с карабином 300 мл — С/Черн": 159,
        "Чашка цветная внутри и ручка 330 мл": 59,
        "Белая чашка 330 мл": 47
    }
};

function loadCatalog() {
    try {
        const saved = localStorage.getItem("printCatalog");

        if (!saved) {
            return JSON.parse(JSON.stringify(DEFAULT_CATALOG));
        }

        const parsed = JSON.parse(saved);

        return {
            ...JSON.parse(JSON.stringify(DEFAULT_CATALOG)),
            ...parsed,
            diplomas: {
                ...JSON.parse(JSON.stringify(DEFAULT_CATALOG.diplomas)),
                ...(parsed.diplomas || {})
            },
            readyCups: {
                ...JSON.parse(JSON.stringify(DEFAULT_CATALOG.readyCups)),
                ...(parsed.readyCups || {})
            }
        };
    } catch (error) {
        console.error("Ошибка каталога:", error);
        return JSON.parse(JSON.stringify(DEFAULT_CATALOG));
    }
}

let catalog = loadCatalog();

function saveCatalog() {
    localStorage.setItem("printCatalog", JSON.stringify(catalog));
}


// ===============================
// ЦЕНЫ
// ===============================

function getDiplomaPrice(product, quantity) {
    const prices = catalog.diplomas[product];

    if (!prices) {
        return { sale: 0, cost: 0 };
    }

    if (quantity <= 2) return prices["1"];
    if (quantity <= 10) return prices["3"];
    if (quantity <= 20) return prices["11"];
    if (quantity <= 50) return prices["21"];

    return prices["51"];
}


// ===============================
// ОБЩИЕ РАСЧЁТЫ
// ===============================

function calculatePosition(position) {

    const quantity =
        Number(position.querySelector(".quantity")?.value) || 0;

    const category =
        position.querySelector(".category")?.value || "";

    let sale = 0;
    let cost = 0;

    // Дипломы
    if (category === "diplomas") {

        const product =
            position.querySelector(".product")?.value || "";

        const prices = getDiplomaPrice(product, quantity);

        sale = prices.sale;
        cost = prices.cost;
    }

    // Готовые чашки
    else if (category === "readyCups") {

        const product =
            position.querySelector(".product")?.value || "";

        const price = catalog.readyCups[product] || 0;

        sale = price;
        cost = price;
    }

    // Печать чашки
    else if (category === "cupPrint") {

        sale =
            Number(position.querySelector(".salePrice")?.value) || 0;

        cost = 0;
    }

    // Обычная чашка
    else if (category === "cup") {

        sale =
            Number(position.querySelector(".salePrice")?.value) || 0;

        cost =
            Number(position.querySelector(".costPrice")?.value) || 0;
    }

    // Упаковка
    else if (category === "packaging") {

        sale =
            Number(position.querySelector(".salePrice")?.value) || 0;

        cost =
            Number(position.querySelector(".costPrice")?.value) || 0;
    }

    // Дизайнер
    else if (category === "designer") {

        sale =
            Number(position.querySelector(".salePrice")?.value) || 0;

        cost = 0;
    }

    // Срочность
    else if (category === "urgent") {

        sale =
            Number(position.querySelector(".salePrice")?.value) || 0;

        cost = 0;
    }

    // Ручное изменение цены
    const manualSale =
        position.querySelector(".manualSale");

    const manualCost =
        position.querySelector(".manualCost");

    if (manualSale && manualSale.value !== "") {
        sale = Number(manualSale.value) || 0;
    }

    if (manualCost && manualCost.value !== "") {
        cost = Number(manualCost.value) || 0;
    }

    const totalSale = sale * quantity;
    const totalCost = cost * quantity;
    const profit = totalSale - totalCost;

    const saleElement =
        position.querySelector(".saleTotal");

    const costElement =
        position.querySelector(".costTotal");

    const profitElement =
        position.querySelector(".profitTotal");

    if (saleElement) {
        saleElement.textContent =
            `${totalSale.toFixed(0)} грн`;
    }

    if (costElement) {
        costElement.textContent =
            `${totalCost.toFixed(0)} грн`;
    }

    if (profitElement) {
        profitElement.textContent =
            `${profit.toFixed(0)} грн`;
    }

    updateOrderTotals();
}


// ===============================
// ИТОГИ ЗАКАЗА
// ===============================

function updateOrderTotals() {

    let totalSale = 0;
    let totalCost = 0;

    document
        .querySelectorAll(".position")
        .forEach(position => {

            const quantity =
                Number(position.querySelector(".quantity")?.value) || 0;

            const category =
                position.querySelector(".category")?.value || "";

            let sale = 0;
            let cost = 0;

            if (category === "diplomas") {

                const product =
                    position.querySelector(".product")?.value || "";

                const price =
                    getDiplomaPrice(product, quantity);

                sale = price.sale;
                cost = price.cost;
            }

            else if (category === "readyCups") {

                const product =
                    position.querySelector(".product")?.value || "";

                sale =
                    catalog.readyCups[product] || 0;

                cost = sale;
            }

            else {

                sale =
                    Number(position.querySelector(".salePrice")?.value) || 0;

                cost =
                    Number(position.querySelector(".costPrice")?.value) || 0;
            }

            const manualSale =
                position.querySelector(".manualSale");

            const manualCost =
                position.querySelector(".manualCost");

            if (manualSale && manualSale.value !== "") {
                sale = Number(manualSale.value) || 0;
            }

            if (manualCost && manualCost.value !== "") {
                cost = Number(manualCost.value) || 0;
            }

            totalSale += sale * quantity;
            totalCost += cost * quantity;
        });

    const totalProfit =
        totalSale - totalCost;

    const saleElement =
        document.querySelector("#totalSale");

    const costElement =
        document.querySelector("#totalCost");

    const profitElement =
        document.querySelector("#totalProfit");

    if (saleElement)
        saleElement.textContent =
            `${totalSale.toFixed(0)} грн`;

    if (costElement)
        costElement.textContent =
            `${totalCost.toFixed(0)} грн`;

    if (profitElement)
        profitElement.textContent =
            `${totalProfit.toFixed(0)} грн`;
}


// ===============================
// ПОЛУЧЕНИЕ ПОЗИЦИЙ ЗАКАЗА
// ===============================

function getOrderPositions() {

    const positions = [];

    document
        .querySelectorAll(".position")
        .forEach(position => {

            const category =
                position.querySelector(".category")?.value || "";

            const product =
                position.querySelector(".product")?.value || "";

            const quantity =
                Number(position.querySelector(".quantity")?.value) || 0;

            if (!quantity) return;

            let sale = 0;
            let cost = 0;
            let name = product;

            if (category === "diplomas") {

                const prices =
                    getDiplomaPrice(product, quantity);

                sale = prices.sale;
                cost = prices.cost;
            }

            else if (category === "readyCups") {

                sale =
                    catalog.readyCups[product] || 0;

                cost = sale;
            }

            else {

                sale =
                    Number(position.querySelector(".salePrice")?.value) || 0;

                cost =
                    Number(position.querySelector(".costPrice")?.value) || 0;

                if (!name) {
                    name =
                        position.querySelector(".description")?.value ||
                        category;
                }
            }

            const manualSale =
                position.querySelector(".manualSale");

            const manualCost =
                position.querySelector(".manualCost");

            if (manualSale && manualSale.value !== "") {
                sale = Number(manualSale.value) || 0;
            }

            if (manualCost && manualCost.value !== "") {
                cost = Number(manualCost.value) || 0;
            }

            positions.push({
                category,
                name,
                quantity,
                sale,
                cost,
                totalSale: sale * quantity,
                totalCost: cost * quantity,
                profit: (sale - cost) * quantity
            });
        });

    return positions;
}


// ===============================
// СОХРАНЕНИЕ ЗАКАЗА
// ===============================

function saveOrder() {

    const clientInput =
        document.querySelector("#clientName");

    const client =
        clientInput?.value.trim() || "Без имени";

    const positions =
        getOrderPositions();

    if (!positions.length) {
        alert("Добавь хотя бы одну позицию в заказ.");
        return;
    }

    const orders =
        JSON.parse(
            localStorage.getItem("printOrders") || "[]"
        );

    const orderNumber =
        orders.length
            ? Math.max(...orders.map(o => o.number || 0)) + 1
            : 1;

    const totalSale =
        positions.reduce(
            (sum, item) => sum + item.totalSale,
            0
        );

    const totalCost =
        positions.reduce(
            (sum, item) => sum + item.totalCost,
            0
        );

    const order = {

        id: Date.now(),

        number: orderNumber,

        date:
            new Date().toLocaleDateString("uk-UA"),

        time:
            new Date().toLocaleTimeString(
                "uk-UA",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        client,

        positions,

        totalSale,

        totalCost,

        profit:
            totalSale - totalCost
    };

    orders.unshift(order);

    localStorage.setItem(
        "printOrders",
        JSON.stringify(orders)
    );

    alert(
        `Заказ №${orderNumber} сохранён`
    );

    clearOrder();
}


// ===============================
// ОЧИСТКА НОВОГО ЗАКАЗА
// ===============================

function clearOrder() {

    const client =
        document.querySelector("#clientName");

    if (client) {
        client.value = "";
    }

    const positions =
        document.querySelector("#positions");

    if (!positions) return;

    const first =
        positions.querySelector(".position");

    positions.innerHTML = "";

    if (first) {
        positions.appendChild(first);

        const inputs =
            first.querySelectorAll(
                "input, select"
            );

        inputs.forEach(input => {

            if (input.tagName === "SELECT") {
                input.selectedIndex = 0;
            } else {
                input.value = "";
            }
        });
    }

    updateOrderTotals();
}


// ===============================
// РАЗДЕЛ ЗАКАЗОВ
// ===============================

function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem("printOrders") || "[]"
        );

    } catch {

        return [];
    }
}


function openOrders() {

    let screen =
        document.querySelector("#ordersScreen");

    if (!screen) {

        screen =
            document.createElement("div");

        screen.id = "ordersScreen";

        screen.innerHTML = `
            <div class="ordersHeader">
                <h2>Заказы</h2>
            </div>

            <div id="ordersList"></div>
        `;

        document.body.appendChild(screen);

        addOrdersStyles();
    }

    document
        .querySelectorAll(
            "body > *:not(#ordersScreen)"
        )
        .forEach(el => {

            if (
                !el.matches("script") &&
                !el.matches("link")
            ) {
                el.style.display = "none";
            }
        });

    screen.style.display = "block";

    renderOrders();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// СПИСОК ЗАКАЗОВ
// ===============================

function renderOrders() {

    const list =
        document.querySelector("#ordersList");

    if (!list) return;

    const orders = getOrders();

    if (!orders.length) {

        list.innerHTML = `
            <div class="emptyOrders">
                <div class="emptyIcon">📦</div>
                <h3>Заказов пока нет</h3>
                <p>Сохранённые заказы появятся здесь.</p>
            </div>
        `;

        return;
    }

    list.innerHTML = orders.map(order => `

        <div class="orderCard">

            <div class="orderTop">

                <div>
                    <strong>
                        Заказ №${order.number}
                    </strong>

                    <div class="orderDate">
                        ${order.date}
                        ${order.time || ""}
                    </div>
                </div>

                <button
                    class="deleteOrder"
                    data-id="${order.id}"
                >
                    ×
                </button>

            </div>

            <div class="orderClient">
                ${escapeHtml(order.client)}
            </div>

            <div class="orderPositions">
                Позиций: ${order.positions.length}
            </div>

            <div class="orderBottom">

                <div>
                    <span>Сумма</span>
                    <strong>
                        ${order.totalSale.toFixed(0)} грн
                    </strong>
                </div>

                <div>
                    <span>Прибыль</span>
                    <strong>
                        ${order.profit.toFixed(0)} грн
                    </strong>
                </div>

            </div>

            <button
                class="openOrder"
                data-id="${order.id}"
            >
                Подробнее
            </button>

        </div>

    `).join("");

    list
        .querySelectorAll(".openOrder")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openOrderDetails(id);
                }
            );
        });

    list
        .querySelectorAll(".deleteOrder")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        Number(button.dataset.id);

                    deleteOrder(id);
                }
            );
        });
}


// ===============================
// ПОДРОБНОСТИ ЗАКАЗА
// ===============================

function openOrderDetails(id) {

    const orders = getOrders();

    const order =
        orders.find(item => item.id === id);

    if (!order) return;

    const screen =
        document.querySelector("#ordersScreen");

    if (!screen) return;

    screen.innerHTML = `

        <div class="orderDetails">

            <button
                class="backOrders"
                id="backOrders"
            >
                ← Назад
            </button>

            <h2>
                Заказ №${order.number}
            </h2>

            <div class="detailsInfo">

                <div>
                    <span>Клиент</span>
                    <strong>
                        ${escapeHtml(order.client)}
                    </strong>
                </div>

                <div>
                    <span>Дата</span>
                    <strong>
                        ${order.date}
                    </strong>
                </div>

            </div>

            <h3>Позиции</h3>

            <div class="detailsPositions">

                ${order.positions.map(item => `

                    <div class="detailPosition">

                        <div class="detailName">
                            ${escapeHtml(item.name)}
                        </div>

                        <div>
                            ${item.quantity} шт.
                        </div>

                        <div>
                            ${item.totalSale.toFixed(0)} грн
                        </div>

                        <div class="detailProfit">
                            прибыль:
                            ${item.profit.toFixed(0)} грн
                        </div>

                    </div>

                `).join("")}

            </div>

            <div class="detailsTotal">

                <div>
                    <span>Продажа</span>
                    <strong>
                        ${order.totalSale.toFixed(0)} грн
                    </strong>
                </div>

                <div>
                    <span>Себестоимость</span>
                    <strong>
                        ${order.totalCost.toFixed(0)} грн
                    </strong>
                </div>

                <div>
                    <span>Прибыль</span>
                    <strong>
                        ${order.profit.toFixed(0)} грн
                    </strong>
                </div>

            </div>

        </div>
    `;

    document
        .querySelector("#backOrders")
        ?.addEventListener(
            "click",
            renderOrders
        );

    screen.scrollTop = 0;
}


// ===============================
// УДАЛЕНИЕ
// ===============================

function deleteOrder(id) {

    const order =
        getOrders().find(
            item => item.id === id
        );

    if (!order) return;

    const confirmed =
        confirm(
            `Удалить заказ №${order.number}?`
        );

    if (!confirmed) return;

    const orders =
        getOrders().filter(
            item => item.id !== id
        );

    localStorage.setItem(
        "printOrders",
        JSON.stringify(orders)
    );

    renderOrders();
}


// ===============================
// ЗАЩИТА HTML
// ===============================

function escapeHtml(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// НАВИГАЦИЯ
// ===============================

function setupNavigation() {

    document
        .querySelectorAll("button, a")
        .forEach(element => {

            const text =
                element.textContent
                    .trim()
                    .toLowerCase();

            if (text.includes("каталог")) {

                element.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        openCatalog();
                    },
                    true
                );
            }

            if (text.includes("заказы")) {

                element.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        openOrders();
                    },
                    true
                );
            }

            if (text.includes("заказ")) {

                if (
                    !text.includes("заказы") &&
                    !text.includes("каталог")
                ) {

                    element.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            showMainScreen();
                        },
                        true
                    );
                }
            }
        });
}


// ===============================
// ГЛАВНЫЙ ЭКРАН
// ===============================

function showMainScreen() {

    const ordersScreen =
        document.querySelector("#ordersScreen");

    if (ordersScreen) {
        ordersScreen.style.display = "none";
    }

    const catalogScreen =
        document.querySelector("#catalogScreen");

    if (catalogScreen) {
        catalogScreen.style.display = "none";
    }

    document
        .querySelectorAll("body > *")
        .forEach(el => {

            if (
                !el.matches("script") &&
                !el.matches("link") &&
                !el.matches("#ordersScreen") &&
                !el.matches("#catalogScreen")
            ) {
                el.style.display = "";
            }
        });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// КАТАЛОГ
// ===============================

function openCatalog() {

    let screen =
        document.querySelector("#catalogScreen");

    if (!screen) {

        screen =
            document.createElement("div");

        screen.id = "catalogScreen";

        document.body.appendChild(screen);

        addCatalogStyles();
    }

    document
        .querySelectorAll(
            "body > *:not(#catalogScreen)"
        )
        .forEach(el => {

            if (
                !el.matches("script") &&
                !el.matches("link")
            ) {
                el.style.display = "none";
            }
        });

    screen.style.display = "block";

    renderCatalog();

    screen.scrollTop = 0;
}


function renderCatalog() {

    const screen =
        document.querySelector("#catalogScreen");

    if (!screen) return;

    let html = `
        <div class="catalogHeader">
            <h2>Каталог</h2>
            <p>Цены и себестоимость</p>
        </div>
    `;

    html += `
        <div class="catalogSection">
            <h3>Дипломы</h3>
    `;

    Object.entries(catalog.diplomas)
        .forEach(([product, prices]) => {

            html += `
                <div class="catalogProduct">

                    <h4>
                        ${escapeHtml(product)}
                    </h4>

                    ${renderDiplomaTier(
                        product,
                        "1",
                        "1–2 шт.",
                        prices["1"]
                    )}

                    ${renderDiplomaTier(
                        product,
                        "3",
                        "3–10 шт.",
                        prices["3"]
                    )}

                    ${renderDiplomaTier(
                        product,
                        "11",
                        "11–20 шт.",
                        prices["11"]
                    )}

                    ${renderDiplomaTier(
                        product,
                        "21",
                        "21–50 шт.",
                        prices["21"]
                    )}

                    ${renderDiplomaTier(
                        product,
                        "51",
                        "50+ шт.",
                        prices["51"]
                    )}

                </div>
            `;
        });

    html += `</div>`;

    html += `
        <div class="catalogSection">
            <h3>Готовые чашки</h3>
    `;

    Object.entries(catalog.readyCups)
        .forEach(([product, price]) => {

            html += `

                <div class="cupCatalogProduct">

                    <div class="cupName">
                        ${escapeHtml(product)}
                    </div>

                    <label>
                        Цена / себестоимость

                        <input
                            type="number"
                            min="0"
                            data-cup="${escapeHtml(product)}"
                            value="${price}"
                        >
                    </label>

                </div>

            `;
        });

    html += `
        </div>

        <button
            id="saveCatalog"
            class="catalogSaveButton"
        >
            Сохранить изменения
        </button>

        <button
            id="resetCatalog"
            class="catalogResetButton"
        >
            Вернуть цены по умолчанию
        </button>
    `;

    screen.innerHTML = html;

    document
        .querySelector("#saveCatalog")
        ?.addEventListener(
            "click",
            saveCatalogFromScreen
        );

    document
        .querySelector("#resetCatalog")
        ?.addEventListener(
            "click",
            resetCatalog
        );
}


function renderDiplomaTier(
    product,
    tier,
    label,
    price
) {

    return `

        <div class="diplomaTier">

            <span>${label}</span>

            <label>
                Продажа

                <input
                    type="number"
                    min="0"
                    data-product="${escapeHtml(product)}"
                    data-tier="${tier}"
                    data-type="sale"
                    value="${price.sale}"
                >
            </label>

            <label>
                Себестоимость

                <input
                    type="number"
                    min="0"
                    data-product="${escapeHtml(product)}"
                    data-tier="${tier}"
                    data-type="cost"
                    value="${price.cost}"
                >
            </label>

        </div>
    `;
}


function saveCatalogFromScreen() {

    const screen =
        document.querySelector("#catalogScreen");

    if (!screen) return;

    screen
        .querySelectorAll(
            "[data-product][data-tier]"
        )
        .forEach(input => {

            const product =
                input.dataset.product;

            const tier =
                input.dataset.tier;

            const type =
                input.dataset.type;

            const value =
                Number(input.value) || 0;

            if (
                catalog.diplomas[product] &&
                catalog.diplomas[product][tier]
            ) {

                catalog.diplomas[product][tier][type] =
                    value;

                // 1–2 шт. используют одну цену
                if (tier === "1") {

                    catalog.diplomas[product]["2"][type] =
                        value;
                }
            }
        });

    screen
        .querySelectorAll("[data-cup]")
        .forEach(input => {

            const product =
                input.dataset.cup;

            catalog.readyCups[product] =
                Number(input.value) || 0;
        });

    saveCatalog();

    alert("Цены сохранены");

    renderCatalog();
}


function resetCatalog() {

    const confirmed =
        confirm(
            "Вернуть все цены по умолчанию?"
        );

    if (!confirmed) return;

    catalog =
        JSON.parse(
            JSON.stringify(DEFAULT_CATALOG)
        );

    saveCatalog();

    renderCatalog();
}


// ===============================
// СТИЛИ ЗАКАЗОВ
// ===============================

function addOrdersStyles() {

    if (
        document.querySelector("#ordersStyles")
    ) return;

    const style =
        document.createElement("style");

    style.id = "ordersStyles";

    style.textContent = `

        #ordersScreen {
            position: fixed;
            inset: 0;
            overflow-y: auto;
            background: #f5f5f7;
            padding: 20px;
            padding-bottom: 100px;
            z-index: 9999;
        }

        .ordersHeader {
            margin-bottom: 20px;
        }

        .ordersHeader h2 {
            margin: 0;
            font-size: 28px;
        }

        .orderCard {
            background: white;
            border-radius: 18px;
            padding: 16px;
            margin-bottom: 14px;
            box-shadow:
                0 3px 12px rgba(0,0,0,.06);
        }

        .orderTop {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .orderTop strong {
            font-size: 18px;
        }

        .orderDate {
            color: #888;
            font-size: 13px;
            margin-top: 4px;
        }

        .deleteOrder {
            border: 0;
            background: #f1f1f1;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 22px;
        }

        .orderClient {
            font-size: 18px;
            font-weight: 600;
            margin-top: 14px;
        }

        .orderPositions {
            color: #777;
            margin-top: 5px;
            font-size: 14px;
        }

        .orderBottom {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid #eee;
        }

        .orderBottom span,
        .detailsTotal span {
            display: block;
            color: #888;
            font-size: 13px;
        }

        .orderBottom strong {
            font-size: 17px;
        }

        .openOrder {
            width: 100%;
            margin-top: 14px;
            border: 0;
            border-radius: 12px;
            padding: 12px;
            background: #111;
            color: white;
            font-size: 15px;
        }

        .emptyOrders {
            text-align: center;
            margin-top: 100px;
            color: #777;
        }

        .emptyIcon {
            font-size: 50px;
        }

        .orderDetails {
            padding-bottom: 50px;
        }

        .backOrders {
            border: 0;
            background: white;
            border-radius: 10px;
            padding: 10px 14px;
            margin-bottom: 15px;
        }

        .detailsInfo {
            background: white;
            padding: 16px;
            border-radius: 16px;
            margin-bottom: 20px;
        }

        .detailsInfo div {
            margin-bottom: 12px;
        }

        .detailsInfo div:last-child {
            margin-bottom: 0;
        }

        .detailsInfo span {
            display: block;
            color: #888;
            font-size: 13px;
        }

        .detailPosition {
            background: white;
            border-radius: 14px;
            padding: 14px;
            margin-bottom: 10px;
        }

        .detailName {
            font-weight: 600;
            margin-bottom: 7px;
        }

        .detailProfit {
            color: #555;
            margin-top: 6px;
            font-size: 14px;
        }

        .detailsTotal {
            background: #111;
            color: white;
            border-radius: 18px;
            padding: 18px;
            margin-top: 20px;
        }

        .detailsTotal div {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
        }

        .detailsTotal span {
            color: #aaa;
        }
    `;

    document.head.appendChild(style);
}


// ===============================
// СТИЛИ КАТАЛОГА
// ===============================

function addCatalogStyles() {

    if (
        document.querySelector("#catalogStyles")
    ) return;

    const style =
        document.createElement("style");

    style.id = "catalogStyles";

    style.textContent = `

        #catalogScreen {
            position: fixed;
            inset: 0;
            overflow-y: auto;
            background: #f5f5f7;
            padding: 20px;
            padding-bottom: 100px;
            z-index: 9998;
        }

        .catalogHeader h2 {
            margin-bottom: 4px;
            font-size: 28px;
        }

        .catalogHeader p {
            color: #888;
            margin-top: 0;
        }

        .catalogSection {
            margin-top: 25px;
        }

        .catalogProduct,
        .cupCatalogProduct {
            background: white;
            border-radius: 18px;
            padding: 15px;
            margin-bottom: 12px;
        }

        .catalogProduct h4 {
            margin: 0 0 15px;
            font-size: 17px;
        }

        .diplomaTier {
            border-top: 1px solid #eee;
            padding: 12px 0;
        }

        .diplomaTier > span {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .diplomaTier label,
        .cupCatalogProduct label {
            display: block;
            font-size: 13px;
            color: #777;
            margin-top: 7px;
        }

        .diplomaTier input,
        .cupCatalogProduct input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin-top: 5px;
            padding: 11px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
        }

        .cupName {
            font-weight: 600;
            margin-bottom: 8px;
        }

        .catalogSaveButton,
        .catalogResetButton {
            width: 100%;
            padding: 14px;
            border-radius: 13px;
            border: 0;
            font-size: 16px;
            margin-top: 12px;
        }

        .catalogSaveButton {
            background: #111;
            color: white;
        }

        .catalogResetButton {
            background: white;
            color: #111;
            border: 1px solid #ddd;
        }
    `;

    document.head.appendChild(style);
}


// ===============================
// ЗАПУСК
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        updateOrderTotals();

        // Кнопка "Сохранить заказ"
        document
            .querySelectorAll("button")
            .forEach(button => {

                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();

                if (
                    text.includes("сохранить заказ")
                ) {

                    button.addEventListener(
                        "click",
                        saveOrder
                    );
                }

                if (
                    text.includes("очистить")
                ) {

                    button.addEventListener(
                        "click",
                        clearOrder
                    );
                }
            });

        // Пересчёт при изменении полей
        document.addEventListener(
            "input",
            event => {

                if (
                    event.target.closest(".position")
                ) {
                    calculatePosition(
                        event.target.closest(".position")
                    );
                }
            }
        );
    }
);


// ===============================
// PWA
// ===============================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "./sw.js"
            );
        }
    );
}