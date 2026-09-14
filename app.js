// ========================================
// PRINT APP — ОСНОВНОЙ КОД
// ========================================

const DEFAULT_CATALOG = {
    diplomas: {
        "Диплом УФ — А5": {
            "1": { sale: 300, cost: 240 },
            "2": { sale: 300, cost: 240 },
            "3": { sale: 280, cost: 200 },
            "11": { sale: 260, cost: 190 },
            "21": { sale: 240, cost: 180 },
            "50": { sale: 220, cost: 170 }
        },

        "Диплом УФ — А4": {
            "1": { sale: 470, cost: 420 },
            "2": { sale: 470, cost: 420 },
            "3": { sale: 450, cost: 400 },
            "11": { sale: 430, cost: 370 },
            "21": { sale: 410, cost: 350 },
            "50": { sale: 390, cost: 320 }
        },

        "Диплом сублимация — А5": {
            "1": { sale: 300, cost: 240 },
            "2": { sale: 300, cost: 240 },
            "3": { sale: 280, cost: 190 },
            "11": { sale: 260, cost: 180 },
            "21": { sale: 240, cost: 170 },
            "50": { sale: 220, cost: 165 }
        },

        "Диплом сублимация — А4": {
            "1": { sale: 470, cost: 400 },
            "2": { sale: 470, cost: 400 },
            "3": { sale: 450, cost: 390 },
            "11": { sale: 430, cost: 360 },
            "21": { sale: 410, cost: 340 },
            "50": { sale: 390, cost: 310 }
        }
    },

    readyCups: {
        "Чашка с карабином 300 мл — С/С": {
            sale: 159,
            cost: 159
        },

        "Чашка с карабином 300 мл — С/Кр": {
            sale: 159,
            cost: 159
        },

        "Чашка с карабином 300 мл — С/Черн": {
            sale: 159,
            cost: 159
        },

        "Чашка цветная внутри и ручка 330 мл": {
            sale: 59,
            cost: 59
        },

        "Белая чашка 330 мл": {
            sale: 47,
            cost: 47
        }
    }
};


// ========================================
// КАТАЛОГ
// ========================================

function loadCatalog() {
    try {
        const saved = localStorage.getItem("printCatalog");

        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
    }

    return JSON.parse(JSON.stringify(DEFAULT_CATALOG));
}


function saveCatalog(catalog) {
    localStorage.setItem(
        "printCatalog",
        JSON.stringify(catalog)
    );
}


function getDiplomaPrice(product, quantity) {
    const catalog = loadCatalog();

    if (
        !catalog.diplomas ||
        !catalog.diplomas[product]
    ) {
        return {
            sale: 0,
            cost: 0
        };
    }

    const tiers = catalog.diplomas[product];

    let tier = "1";

    if (quantity >= 50) {
        tier = "50";
    } else if (quantity >= 21) {
        tier = "21";
    } else if (quantity >= 11) {
        tier = "11";
    } else if (quantity >= 3) {
        tier = "3";
    }

    return tiers[tier] || tiers["1"];
}


// ========================================
// ПОЗИЦИИ ЗАКАЗА
// ========================================

function setupPosition(position) {
    if (!position) return;

    const category = position.querySelector(".category");

    if (!category) return;

    category.addEventListener("change", () => {
        renderPositionFields(position);
        updateOrderTotals();
    });

    renderPositionFields(position);
}


function renderPositionFields(position) {
    const category = position.querySelector(".category");

    if (!category) return;

    let dynamic = position.querySelector(".dynamicFields");

    if (!dynamic) {
        dynamic = document.createElement("div");
        dynamic.className = "dynamicFields";

        category.insertAdjacentElement(
            "afterend",
            dynamic
        );
    }

    const type = category.value;

    dynamic.innerHTML = "";

    // -----------------------------
    // ДИПЛОМЫ
    // -----------------------------

    if (type === "diplomas") {

        const catalog = loadCatalog();

        const products = Object.keys(
            catalog.diplomas
        );

        dynamic.innerHTML = `
            <label>Вид диплома</label>

            <select class="productSelect">
                ${products.map(product => `
                    <option value="${escapeHtml(product)}">
                        ${escapeHtml(product)}
                    </option>
                `).join("")}
            </select>

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <div class="manualPrices">
                <label>Цена продажи за 1 шт.</label>

                <input
                    type="number"
                    class="salePrice"
                    min="0"
                >

                <label>Себестоимость за 1 шт.</label>

                <input
                    type="number"
                    class="costPrice"
                    min="0"
                >
            </div>

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        const productSelect =
            dynamic.querySelector(".productSelect");

        const quantity =
            dynamic.querySelector(".quantity");

        const salePrice =
            dynamic.querySelector(".salePrice");

        const costPrice =
            dynamic.querySelector(".costPrice");


        function updateDiplomaPrices() {

            const product =
                productSelect.value;

            const qty =
                Math.max(
                    1,
                    Number(quantity.value) || 1
                );

            const prices =
                getDiplomaPrice(
                    product,
                    qty
                );

            salePrice.value = prices.sale;
            costPrice.value = prices.cost;

            updateOrderTotals();
        }


        productSelect.addEventListener(
            "change",
            updateDiplomaPrices
        );

        quantity.addEventListener(
            "input",
            updateDiplomaPrices
        );

        salePrice.addEventListener(
            "input",
            updateOrderTotals
        );

        costPrice.addEventListener(
            "input",
            updateOrderTotals
        );

        updateDiplomaPrices();

        return;
    }


    // -----------------------------
    // ГОТОВЫЕ ЧАШКИ
    // -----------------------------

    if (type === "readyCups") {

        const catalog = loadCatalog();

        const products =
            Object.keys(
                catalog.readyCups
            );

        dynamic.innerHTML = `
            <label>Вид чашки</label>

            <select class="productSelect">
                ${products.map(product => `
                    <option value="${escapeHtml(product)}">
                        ${escapeHtml(product)}
                    </option>
                `).join("")}
            </select>

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <label>Цена продажи за 1 шт.</label>

            <input
                type="number"
                class="salePrice"
                min="0"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        const productSelect =
            dynamic.querySelector(".productSelect");

        const quantity =
            dynamic.querySelector(".quantity");

        const salePrice =
            dynamic.querySelector(".salePrice");


        function updateCupPrices() {

            const product =
                productSelect.value;

            const item =
                catalog.readyCups[product];

            salePrice.value =
                item ? item.sale : 0;

            updateOrderTotals();
        }


        productSelect.addEventListener(
            "change",
            updateCupPrices
        );

        quantity.addEventListener(
            "input",
            updateOrderTotals
        );

        salePrice.addEventListener(
            "input",
            updateOrderTotals
        );

        updateCupPrices();

        return;
    }


    // -----------------------------
    // ПЕЧАТЬ НА ЧАШКЕ
    // -----------------------------

    if (type === "cupPrint") {

        dynamic.innerHTML = `
            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <label>Цена печати за 1 шт.</label>

            <input
                type="number"
                class="salePrice"
                min="0"
                value="0"
                placeholder="Введите сумму"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        dynamic
            .querySelector(".quantity")
            .addEventListener(
                "input",
                updateOrderTotals
            );

        dynamic
            .querySelector(".salePrice")
            .addEventListener(
                "input",
                updateOrderTotals
            );

        return;
    }


    // -----------------------------
    // ЧАШКА
    // -----------------------------

    if (type === "cup") {

        dynamic.innerHTML = `
            <label>Описание</label>

            <input
                type="text"
                class="description"
                placeholder="Например: белая чашка"
            >

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <label>Цена продажи за 1 шт.</label>

            <input
                type="number"
                class="salePrice"
                min="0"
            >

            <label>Себестоимость за 1 шт.</label>

            <input
                type="number"
                class="costPrice"
                min="0"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        addCalculationListeners(dynamic);

        return;
    }


    // -----------------------------
    // УПАКОВКА
    // -----------------------------

    if (type === "packaging") {

        dynamic.innerHTML = `
            <label>Вид упаковки</label>

            <input
                type="text"
                class="description"
                placeholder="Например: коробка"
            >

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <label>Цена продажи за 1 шт.</label>

            <input
                type="number"
                class="salePrice"
                min="0"
            >

            <label>Себестоимость за 1 шт.</label>

            <input
                type="number"
                class="costPrice"
                min="0"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        addCalculationListeners(dynamic);

        return;
    }


    // -----------------------------
    // ДИЗАЙНЕР
    // -----------------------------

    if (type === "designer") {

        dynamic.innerHTML = `
            <label>Описание</label>

            <input
                type="text"
                class="description"
                placeholder="Например: разработка макета"
            >

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
            >

            <label>Стоимость</label>

            <input
                type="number"
                class="salePrice"
                min="0"
                value="0"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        dynamic
            .querySelector(".quantity")
            .addEventListener(
                "input",
                updateOrderTotals
            );

        dynamic
            .querySelector(".salePrice")
            .addEventListener(
                "input",
                updateOrderTotals
            );

        return;
    }


    // -----------------------------
    // СРОЧНОСТЬ
    // -----------------------------

    if (type === "urgent") {

        dynamic.innerHTML = `
            <label>Описание</label>

            <input
                type="text"
                class="description"
                placeholder="Например: срочное изготовление"
            >

            <label>Стоимость</label>

            <input
                type="number"
                class="salePrice"
                min="0"
                value="0"
            >

            <div class="positionTotals">
                <div>
                    Продажа:
                    <strong class="lineSale">0 грн</strong>
                </div>

                <div>
                    Себестоимость:
                    <strong class="lineCost">0 грн</strong>
                </div>

                <div>
                    Прибыль:
                    <strong class="lineProfit">0 грн</strong>
                </div>
            </div>
        `;

        dynamic
            .querySelector(".salePrice")
            .addEventListener(
                "input",
                updateOrderTotals
            );

        return;
    }
}


// ========================================
// СЛУШАТЕЛИ РАСЧЁТА
// ========================================

function addCalculationListeners(container) {

    const inputs =
        container.querySelectorAll(
            ".quantity, .salePrice, .costPrice"
        );

    inputs.forEach(input => {

        input.addEventListener(
            "input",
            updateOrderTotals
        );

    });
}


// ========================================
// РАСЧЁТ ОДНОЙ ПОЗИЦИИ
// ========================================

function calculatePosition(position) {

    const category =
        position.querySelector(".category");

    if (!category) {
        return {
            sale: 0,
            cost: 0,
            profit: 0
        };
    }

    const type = category.value;

    const dynamic =
        position.querySelector(".dynamicFields");

    if (!dynamic) {
        return {
            sale: 0,
            cost: 0,
            profit: 0
        };
    }

    const quantity =
        Math.max(
            1,
            Number(
                dynamic.querySelector(".quantity")?.value
            ) || 1
        );

    const salePrice =
        Number(
            dynamic.querySelector(".salePrice")?.value
        ) || 0;

    const costPrice =
        Number(
            dynamic.querySelector(".costPrice")?.value
        ) || 0;

    let sale = 0;
    let cost = 0;

    // Дипломы
    if (type === "diplomas") {

        sale = salePrice * quantity;
        cost = costPrice * quantity;
    }

    // Готовые чашки
    else if (type === "readyCups") {

        const product =
            dynamic.querySelector(
                ".productSelect"
            )?.value;

        const catalog =
            loadCatalog();

        const item =
            catalog.readyCups?.[product];

        cost =
            (item?.cost || 0) * quantity;

        sale =
            salePrice * quantity;
    }

    // Печать чашки
    else if (type === "cupPrint") {

        sale =
            salePrice * quantity;

        cost = 0;
    }

    // Обычная чашка
    else if (type === "cup") {

        sale =
            salePrice * quantity;

        cost =
            costPrice * quantity;
    }

    // Упаковка
    else if (type === "packaging") {

        sale =
            salePrice * quantity;

        cost =
            costPrice * quantity;
    }

    // Дизайнер
    else if (type === "designer") {

        sale =
            salePrice * quantity;

        cost = 0;
    }

    // Срочность
    else if (type === "urgent") {

        sale = salePrice;
        cost = 0;
    }

    const profit =
        sale - cost;

    return {
        sale,
        cost,
        profit
    };
}


// ========================================
// ОБЩИЕ ИТОГИ
// ========================================

function updateOrderTotals() {

    const positions =
        document.querySelectorAll(
            "#positions .position"
        );

    let totalSale = 0;
    let totalCost = 0;

    positions.forEach(position => {

        const result =
            calculatePosition(position);

        totalSale += result.sale;
        totalCost += result.cost;


        const saleElement =
            position.querySelector(
                ".lineSale"
            );

        const costElement =
            position.querySelector(
                ".lineCost"
            );

        const profitElement =
            position.querySelector(
                ".lineProfit"
            );


        if (saleElement) {
            saleElement.textContent =
                `${result.sale} грн`;
        }

        if (costElement) {
            costElement.textContent =
                `${result.cost} грн`;
        }

        if (profitElement) {
            profitElement.textContent =
                `${result.profit} грн`;
        }

    });


    const totalProfit =
        totalSale - totalCost;


    const totalSaleElement =
        document.getElementById(
            "totalSale"
        );

    const totalCostElement =
        document.getElementById(
            "totalCost"
        );

    const totalProfitElement =
        document.getElementById(
            "totalProfit"
        );


    if (totalSaleElement) {
        totalSaleElement.textContent =
            `${totalSale} грн`;
    }

    if (totalCostElement) {
        totalCostElement.textContent =
            `${totalCost} грн`;
    }

    if (totalProfitElement) {
        totalProfitElement.textContent =
            `${totalProfit} грн`;
    }
}


// ========================================
// ДОБАВИТЬ ПОЗИЦИЮ
// ========================================

function addNewPosition() {

    const positions =
        document.getElementById(
            "positions"
        );

    if (!positions) return;

    const existing =
        positions.querySelectorAll(
            ".position"
        );

    if (existing.length === 0) return;

    const first =
        existing[0];

    const newPosition =
        first.cloneNode(true);


    // Удаляем динамические поля
    const dynamic =
        newPosition.querySelector(
            ".dynamicFields"
        );

    if (dynamic) {
        dynamic.remove();
    }


    // Возвращаем категорию
    const category =
        newPosition.querySelector(
            ".category"
        );

    if (category) {
        category.selectedIndex = 0;
    }


    // Удаляем старые обработчики невозможно,
    // поэтому клонирование безопаснее делать
    // через чистый HTML
    newPosition
        .querySelectorAll(
            "input"
        )
        .forEach(input => {
            input.value = "";
        });


    positions.appendChild(
        newPosition
    );

    setupPosition(
        newPosition
    );

    updateOrderTotals();
}


// ========================================
// КНОПКА "+ ДОБАВИТЬ ПОЗИЦИЮ"
// ========================================

function setupAddPositionButton() {

    const buttons =
        document.querySelectorAll(
            "button"
        );

    buttons.forEach(button => {

        if (
            button.dataset.positionButton === "true"
        ) {
            return;
        }

        const text =
            button.textContent
                .trim()
                .toLowerCase();

        if (
            text.includes(
                "добавить позицию"
            )
        ) {

            button.dataset.positionButton =
                "true";

            button.addEventListener(
                "click",
                addNewPosition
            );
        }

    });
}


// ========================================
// ПОЛУЧЕНИЕ ПОЗИЦИЙ ДЛЯ СОХРАНЕНИЯ
// ========================================

function getOrderPositions() {

    const positions =
        document.querySelectorAll(
            "#positions .position"
        );

    return Array.from(
        positions
    ).map(position => {

        const category =
            position.querySelector(
                ".category"
            );

        const dynamic =
            position.querySelector(
                ".dynamicFields"
            );

        if (!category || !dynamic) {
            return null;
        }

        const type =
            category.value;

        const result =
            calculatePosition(position);

        const quantity =
            Number(
                dynamic.querySelector(
                    ".quantity"
                )?.value
            ) || 1;

        const description =
            dynamic.querySelector(
                ".description"
            )?.value || "";


        const product =
            dynamic.querySelector(
                ".productSelect"
            )?.value || "";


        return {
            type,
            product,
            description,
            quantity,

            salePerUnit:
                Number(
                    dynamic.querySelector(
                        ".salePrice"
                    )?.value
                ) || 0,

            costPerUnit:
                Number(
                    dynamic.querySelector(
                        ".costPrice"
                    )?.value
                ) || 0,

            sale: result.sale,
            cost: result.cost,
            profit: result.profit
        };

    }).filter(Boolean);
}


// ========================================
// СОХРАНЕНИЕ ЗАКАЗА
// ========================================

function saveOrder() {

    const client =
        document.getElementById(
            "clientName"
        )?.value.trim() || "";


    const positions =
        getOrderPositions();


    if (positions.length === 0) {
        alert(
            "Добавьте хотя бы одну позицию."
        );

        return;
    }


    const totals =
        positions.reduce(
            (sum, item) => {

                sum.sale += item.sale;
                sum.cost += item.cost;
                sum.profit += item.profit;

                return sum;

            },
            {
                sale: 0,
                cost: 0,
                profit: 0
            }
        );


    const orders =
        getOrders();


    const order = {

        id:
            Date.now(),

        number:
            orders.length + 1,

        date:
            new Date().toISOString(),

        client,

        positions,

        totalSale:
            totals.sale,

        totalCost:
            totals.cost,

        totalProfit:
            totals.profit
    };


    orders.unshift(
        order
    );


    localStorage.setItem(
        "printOrders",
        JSON.stringify(orders)
    );


    alert(
        "Заказ сохранён!"
    );


    clearOrder();
}


// ========================================
// ОЧИСТКА ЗАКАЗА
// ========================================

function clearOrder() {

    const positions =
        document.getElementById(
            "positions"
        );

    if (!positions) return;


    const first =
        positions.querySelector(
            ".position"
        );


    if (!first) return;


    // Оставляем только первую позицию
    positions.innerHTML = "";


    const clean =
        first.cloneNode(false);


    clean.innerHTML = `
        <select class="category">
            <option value="diplomas">
                Дипломы
            </option>

            <option value="readyCups">
                Готовые чашки
            </option>

            <option value="cupPrint">
                Печать чашка
            </option>

            <option value="cup">
                Чашка
            </option>

            <option value="packaging">
                Упаковка для чашки
            </option>

            <option value="designer">
                Услуги дизайнера
            </option>

            <option value="urgent">
                Срочность
            </option>
        </select>
    `;


    positions.appendChild(
        clean
    );


    const client =
        document.getElementById(
            "clientName"
        );

    if (client) {
        client.value = "";
    }


    setupPosition(
        clean
    );

    updateOrderTotals();
}


// ========================================
// ЗАКАЗЫ
// ========================================

function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "printOrders"
            ) || "[]"
        );

    } catch {

        return [];
    }
}


function openOrders() {

    const orders =
        getOrders();


    let html = `
        <div class="catalogScreen">

            <h2>Заказы</h2>

            <button
                class="backToOrder"
                type="button"
            >
                ← Новый заказ
            </button>

            <div id="ordersList">
    `;


    if (orders.length === 0) {

        html += `
            <div class="emptyOrders">
                Пока нет сохранённых заказов.
            </div>
        `;

    } else {

        orders.forEach(order => {

            const date =
                new Date(
                    order.date
                ).toLocaleString(
                    "uk-UA"
                );


            html += `
                <div
                    class="orderCard"
                    data-id="${order.id}"
                >

                    <div class="orderTop">
                        <strong>
                            Заказ №${order.number}
                        </strong>

                        <span>
                            ${date}
                        </span>
                    </div>

                    <div>
                        ${
                            escapeHtml(
                                order.client ||
                                "Клиент не указан"
                            )
                        }
                    </div>

                    <div>
                        Позиции:
                        ${order.positions.length}
                    </div>

                    <div class="orderMoney">
                        Продажа:
                        <strong>
                            ${order.totalSale} грн
                        </strong>
                    </div>

                    <div>
                        Себестоимость:
                        ${order.totalCost} грн
                    </div>

                    <div>
                        Прибыль:
                        <strong>
                            ${order.totalProfit} грн
                        </strong>
                    </div>

                    <button
                        type="button"
                        class="viewOrder"
                        data-id="${order.id}"
                    >
                        Открыть
                    </button>

                    <button
                        type="button"
                        class="deleteOrder"
                        data-id="${order.id}"
                    >
                        Удалить
                    </button>

                </div>
            `;
        });
    }


    html += `
            </div>
        </div>
    `;


    const positions =
        document.getElementById(
            "positions"
        );


    if (positions) {
        positions.style.display =
            "none";
    }


    let screen =
        document.getElementById(
            "extraScreen"
        );


    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "extraScreen";

        document.body.appendChild(
            screen
        );
    }


    screen.innerHTML =
        html;

    screen.style.display =
        "block";


    document
        .querySelector(".backToOrder")
        ?.addEventListener(
            "click",
            () => {

                screen.style.display =
                    "none";

                if (positions) {
                    positions.style.display =
                        "";
                }

            }
        );


    screen
        .querySelectorAll(
            ".viewOrder"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openOrderDetails(
                        Number(
                            button.dataset.id
                        )
                    );

                }
            );

        });


    screen
        .querySelectorAll(
            ".deleteOrder"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteOrder(
                        Number(
                            button.dataset.id
                        )
                    );

                }
            );

        });
}


// ========================================
// ДЕТАЛИ ЗАКАЗА
// ========================================

function openOrderDetails(id) {

    const order =
        getOrders().find(
            item => item.id === id
        );


    if (!order) return;


    let html = `
        <div class="catalogScreen">

            <button
                type="button"
                class="backToOrders"
            >
                ← Все заказы
            </button>

            <h2>
                Заказ №${order.number}
            </h2>

            <p>
                <strong>Клиент:</strong>
                ${escapeHtml(
                    order.client ||
                    "Не указан"
                )}
            </p>

            <h3>Позиции</h3>
    `;


    order.positions.forEach(
        (item, index) => {

            let title =
                item.product ||
                item.description ||
                "Позиция";


            html += `
                <div class="orderCard">

                    <strong>
                        ${index + 1}.
                        ${escapeHtml(title)}
                    </strong>

                    <div>
                        Количество:
                        ${item.quantity}
                    </div>

                    <div>
                        Продажа:
                        ${item.sale} грн
                    </div>

                    <div>
                        Себестоимость:
                        ${item.cost} грн
                    </div>

                    <div>
                        Прибыль:
                        ${item.profit} грн
                    </div>

                </div>
            `;
        }
    );


    html += `
            <div class="orderCard">

                <strong>Итого</strong>

                <div>
                    Продажа:
                    ${order.totalSale} грн
                </div>

                <div>
                    Себестоимость:
                    ${order.totalCost} грн
                </div>

                <div>
                    Прибыль:
                    ${order.totalProfit} грн
                </div>

            </div>

        </div>
    `;


    const screen =
        document.getElementById(
            "extraScreen"
        );


    if (!screen) return;


    screen.innerHTML =
        html;


    screen
        .querySelector(
            ".backToOrders"
        )
        ?.addEventListener(
            "click",
            openOrders
        );
}


// ========================================
// УДАЛЕНИЕ ЗАКАЗА
// ========================================

function deleteOrder(id) {

    if (
        !confirm(
            "Удалить этот заказ?"
        )
    ) {
        return;
    }


    const orders =
        getOrders().filter(
            order =>
                order.id !== id
        );


    localStorage.setItem(
        "printOrders",
        JSON.stringify(orders)
    );


    openOrders();
}


// ========================================
// НАВИГАЦИЯ
// ========================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".bottom-nav button, nav button"
        );


    buttons.forEach(button => {

        const text =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            text.includes("заказ")
        ) {

            button.addEventListener(
                "click",
                () => {

                    const screen =
                        document.getElementById(
                            "extraScreen"
                        );

                    if (screen) {
                        screen.style.display =
                            "none";
                    }

                    const positions =
                        document.getElementById(
                            "positions"
                        );

                    if (positions) {
                        positions.style.display =
                            "";
                    }

                }
            );

        }


        if (
            text.includes("каталог")
        ) {

            button.addEventListener(
                "click",
                openCatalog
            );

        }


        if (
            text.includes("заказы")
        ) {

            button.addEventListener(
                "click",
                openOrders
            );

        }

    });
}


// ========================================
// КАТАЛОГ
// ========================================

function openCatalog() {

    const positions =
        document.getElementById(
            "positions"
        );

    if (positions) {
        positions.style.display =
            "none";
    }


    let screen =
        document.getElementById(
            "extraScreen"
        );


    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "extraScreen";

        document.body.appendChild(
            screen
        );
    }


    screen.style.display =
        "block";


    renderCatalog();
}


function renderCatalog() {

    const screen =
        document.getElementById(
            "extraScreen"
        );

    if (!screen) return;


    const catalog =
        loadCatalog();


    let html = `
        <div class="catalogScreen">

            <button
                type="button"
                class="backToOrder"
            >
                ← Новый заказ
            </button>

            <h2>Каталог</h2>

            <p>
                Здесь можно изменить цены.
            </p>

            <h3>Дипломы</h3>
    `;


    Object.entries(
        catalog.diplomas
    ).forEach(
        ([product, tiers]) => {

            html += `
                <div class="catalogItem">

                    <h4>
                        ${escapeHtml(product)}
                    </h4>

                    <div class="tierGrid">

                        ${renderTier(
                            "1–2",
                            tiers["1"]
                        )}

                        ${renderTier(
                            "3–10",
                            tiers["3"]
                        )}

                        ${renderTier(
                            "11–20",
                            tiers["11"]
                        )}

                        ${renderTier(
                            "21–50",
                            tiers["21"]
                        )}

                        ${renderTier(
                            "50+",
                            tiers["50"]
                        )}

                    </div>

                </div>
            `;
        }
    );


    html += `
        <h3>Готовые чашки</h3>
    `;


    Object.entries(
        catalog.readyCups
    ).forEach(
        ([product, item]) => {

            html += `
                <div class="catalogItem">

                    <h4>
                        ${escapeHtml(product)}
                    </h4>

                    <label>
                        Цена продажи
                    </label>

                    <input
                        type="number"
                        class="catalogCupSale"
                        data-product="${escapeHtml(product)}"
                        value="${item.sale}"
                    >

                    <label>
                        Себестоимость
                    </label>

                    <input
                        type="number"
                        class="catalogCupCost"
                        data-product="${escapeHtml(product)}"
                        value="${item.cost}"
                    >

                </div>
            `;
        }
    );


    html += `
            <button
                type="button"
                id="saveCatalogButton"
            >
                Сохранить изменения
            </button>

            <button
                type="button"
                id="resetCatalogButton"
            >
                Сбросить цены
            </button>

        </div>
    `;


    screen.innerHTML =
        html;


    screen
        .querySelector(
            ".backToOrder"
        )
        ?.addEventListener(
            "click",
            () => {

                screen.style.display =
                    "none";

                if (positionsVisible()) {

                    document
                        .getElementById(
                            "positions"
                        )
                        .style.display =
                        "";

                }

            }
        );


    document
        .getElementById(
            "saveCatalogButton"
        )
        ?.addEventListener(
            "click",
            saveCatalogFromScreen
        );


    document
        .getElementById(
            "resetCatalogButton"
        )
        ?.addEventListener(
            "click",
            resetCatalog
        );
}


function renderTier(name, tier) {

    return `
        <div class="catalogTier">

            <strong>
                ${name}
            </strong>

            <label>
                Продажа
            </label>

            <input
                type="number"
                class="catalogSale"
                data-tier="${name}"
                value="${tier?.sale || 0}"
            >

            <label>
                Себестоимость
            </label>

            <input
                type="number"
                class="catalogCost"
                data-tier="${name}"
                value="${tier?.cost || 0}"
            >

        </div>
    `;
}


function saveCatalogFromScreen() {

    const catalog =
        loadCatalog();


    const items =
        document.querySelectorAll(
            ".catalogItem"
        );


    let diplomaIndex = 0;


    Object.keys(
        catalog.diplomas
    ).forEach(
        product => {

            const item =
                items[diplomaIndex];

            if (!item) return;


            const saleInputs =
                item.querySelectorAll(
                    ".catalogSale"
                );

            const costInputs =
                item.querySelectorAll(
                    ".catalogCost"
                );


            const tiers = [
                "1",
                "3",
                "11",
                "21",
                "50"
            ];


            tiers.forEach(
                (tier, index) => {

                    if (
                        saleInputs[index]
                    ) {

                        catalog
                            .diplomas
                            [product]
                            [tier]
                            .sale =
                            Number(
                                saleInputs[index]
                                    .value
                            ) || 0;
                    }


                    if (
                        costInputs[index]
                    ) {

                        catalog
                            .diplomas
                            [product]
                            [tier]
                            .cost =
                            Number(
                                costInputs[index]
                                    .value
                            ) || 0;
                    }

                }
            );


            diplomaIndex++;
        }
    );


    const cupSales =
        document.querySelectorAll(
            ".catalogCupSale"
        );

    const cupCosts =
        document.querySelectorAll(
            ".catalogCupCost"
        );


    cupSales.forEach(
        input => {

            const product =
                input.dataset.product;

            if (
                catalog.readyCups[product]
            ) {

                catalog
                    .readyCups[product]
                    .sale =
                    Number(
                        input.value
                    ) || 0;
            }

        }
    );


    cupCosts.forEach(
        input => {

            const product =
                input.dataset.product;

            if (
                catalog.readyCups[product]
            ) {

                catalog
                    .readyCups[product]
                    .cost =
                    Number(
                        input.value
                    ) || 0;
            }

        }
    );


    saveCatalog(
        catalog
    );


    alert(
        "Цены сохранены!"
    );


    openCatalog();
}


function resetCatalog() {

    if (
        !confirm(
            "Сбросить все цены к исходным?"
        )
    ) {
        return;
    }


    const catalog =
        JSON.parse(
            JSON.stringify(
                DEFAULT_CATALOG
            )
        );


    saveCatalog(
        catalog
    );


    openCatalog();
}


// ========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ========================================

function positionsVisible() {

    const positions =
        document.getElementById(
            "positions"
        );

    return (
        positions &&
        positions.style.display !== "none"
    );
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ========================================
// СТИЛИ ДЛЯ ДОПОЛНИТЕЛЬНЫХ ЭКРАНОВ
// ========================================

function addExtraStyles() {

    if (
        document.getElementById(
            "extraAppStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "extraAppStyles";


    style.textContent = `

        #extraScreen {
            padding: 16px;
            padding-bottom: 100px;
        }

        .catalogScreen {
            max-width: 700px;
            margin: 0 auto;
        }

        .catalogScreen h2 {
            margin-top: 10px;
            margin-bottom: 16px;
        }

        .catalogScreen h3 {
            margin-top: 24px;
        }

        .catalogItem,
        .orderCard {
            background: white;
            border-radius: 16px;
            padding: 16px;
            margin: 12px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,.08);
        }

        .catalogItem h4 {
            margin-top: 0;
        }

        .catalogItem input,
        .catalogScreen input,
        .catalogScreen select {
            width: 100%;
            box-sizing: border-box;
            margin-top: 5px;
            margin-bottom: 10px;
            padding: 11px;
            border-radius: 10px;
            border: 1px solid #ddd;
            font-size: 16px;
        }

        .catalogTier {
            background: #f7f7f7;
            border-radius: 12px;
            padding: 10px;
            margin-bottom: 10px;
        }

        .catalogTier strong {
            display: block;
            margin-bottom: 8px;
        }

        .catalogTier label {
            font-size: 13px;
            display: block;
        }

        .catalogScreen button {
            padding: 12px 16px;
            border: none;
            border-radius: 12px;
            margin: 5px 0;
            font-size: 16px;
        }

        #saveCatalogButton {
            width: 100%;
        }

        #resetCatalogButton {
            width: 100%;
        }

        .backToOrder,
        .backToOrders {
            background: #eee;
        }

        .orderTop {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
        }

        .orderTop span {
            color: #777;
            font-size: 13px;
        }

        .orderMoney {
            margin-top: 10px;
        }

        .orderCard button {
            margin-right: 5px;
        }

        .viewOrder {
            background: #eee;
        }

        .deleteOrder {
            background: #ffe1e1;
        }

        .emptyOrders {
            padding: 30px 10px;
            text-align: center;
            color: #777;
        }

        .positionTotals {
            margin-top: 15px;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 12px;
            line-height: 1.8;
        }

        .positionTotals strong {
            float: right;
        }

    `;


    document.head.appendChild(
        style
    );
}


// ========================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addExtraStyles();


        // Настройка первой позиции
        document
            .querySelectorAll(
                "#positions .position"
            )
            .forEach(
                setupPosition
            );


        // Кнопка добавить позицию
        setupAddPositionButton();


        // Навигация
        setupNavigation();


        // Расчёт
        updateOrderTotals();


        // Сохранить заказ
        const saveButton =
            document.querySelector(
                "#saveOrder"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveOrder
            );
        }


        // Если id другой — ищем по тексту
        document
            .querySelectorAll(
                "button"
            )
            .forEach(button => {

                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text ===
                    "сохранить заказ"
                ) {

                    button.addEventListener(
                        "click",
                        saveOrder
                    );
                }


                if (
                    text ===
                    "очистить"
                ) {

                    button.addEventListener(
                        "click",
                        clearOrder
                    );
                }

            });

    }
);


// ========================================
// PWA
// ========================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .catch(
                    error =>
                        console.log(
                            "Service Worker:",
                            error
                        )
                );

        }
    );
}