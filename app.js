// ========================================
// PRINT APP
// ========================================


// ========================================
// КАТАЛОГ ПО УМОЛЧАНИЮ
// ========================================

const DEFAULT_CATALOG = {

    diplomas: {

        "Диплом УФ — А5": {
            "1":  { sale: 300, cost: 240 },
            "3":  { sale: 280, cost: 200 },
            "11": { sale: 260, cost: 190 },
            "21": { sale: 240, cost: 180 },
            "50": { sale: 220, cost: 170 }
        },

        "Диплом УФ — А4": {
            "1":  { sale: 470, cost: 420 },
            "3":  { sale: 450, cost: 400 },
            "11": { sale: 430, cost: 370 },
            "21": { sale: 410, cost: 350 },
            "50": { sale: 390, cost: 320 }
        },

        "Диплом сублимация — А5": {
            "1":  { sale: 300, cost: 240 },
            "3":  { sale: 280, cost: 190 },
            "11": { sale: 260, cost: 180 },
            "21": { sale: 240, cost: 170 },
            "50": { sale: 220, cost: 165 }
        },

        "Диплом сублимация — А4": {
            "1":  { sale: 470, cost: 400 },
            "3":  { sale: 450, cost: 390 },
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
// КАТАЛОГ: ЗАГРУЗКА / СОХРАНЕНИЕ
// ========================================

function loadCatalog() {

    try {

        const saved =
            localStorage.getItem("printCatalog");

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "Ошибка загрузки каталога:",
            error
        );
    }

    return JSON.parse(
        JSON.stringify(DEFAULT_CATALOG)
    );
}


function saveCatalog(catalog) {

    localStorage.setItem(
        "printCatalog",
        JSON.stringify(catalog)
    );
}


// ========================================
// ЦЕНА ДИПЛОМА
// ========================================

function getDiplomaPrice(product, quantity) {

    const catalog = loadCatalog();

    const item =
        catalog.diplomas?.[product];

    if (!item) {

        return {
            sale: 0,
            cost: 0
        };
    }

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

    return item[tier] || item["1"];
}


// ========================================
// ДОБАВЛЕНИЕ ПОЗИЦИИ
// ========================================

function addPosition() {

    const container =
        document.getElementById("positions");

    if (!container) return;

    const position =
        document.createElement("div");

    position.className = "position";

    position.innerHTML = `

        <div class="position-header">

            <strong>
                Позиция ${container.children.length + 1}
            </strong>

            <button
                type="button"
                class="delete-button"
                onclick="removePosition(this)"
            >
                ×
            </button>

        </div>

        <label>Категория</label>

        <select
            class="category"
            onchange="updateProductOptions(this)"
        >

            <option value="">
                Выберите категорию
            </option>

            <option value="diploma">
                Дипломы
            </option>

            <option value="cup_ready">
                Готовые чашки
            </option>

            <option value="cup_print">
                Печать чашка
            </option>

            <option value="cup_custom">
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

        <div class="product-area"></div>

        <div class="manual-fields"></div>

        <div class="price-info">

            <div>
                <span>Цена продажи:</span>
                <strong class="sale-price">
                    0 грн
                </strong>
            </div>

            <div>
                <span>Себестоимость:</span>
                <strong class="cost-price">
                    0 грн
                </strong>
            </div>

            <div>
                <span>Прибыль:</span>
                <strong class="profit-price">
                    0 грн
                </strong>
            </div>

        </div>
    `;

    container.appendChild(position);

    updatePositionNumbers();

    updateOrderTotals();
}


// ========================================
// УДАЛЕНИЕ ПОЗИЦИИ
// ========================================

function removePosition(button) {

    const position =
        button.closest(".position");

    if (!position) return;

    const container =
        document.getElementById("positions");

    if (!container) return;

    if (container.children.length <= 1) {

        clearPosition(position);

    } else {

        position.remove();

    }

    updatePositionNumbers();

    updateOrderTotals();
}


// ========================================
// НОМЕРА ПОЗИЦИЙ
// ========================================

function updatePositionNumbers() {

    const positions =
        document.querySelectorAll(
            "#positions .position"
        );

    positions.forEach(
        (position, index) => {

            const title =
                position.querySelector(
                    ".position-header strong"
                );

            if (title) {

                title.textContent =
                    `Позиция ${index + 1}`;
            }
        }
    );
}


// ========================================
// ОЧИСТИТЬ ОДНУ ПОЗИЦИЮ
// ========================================

function clearPosition(position) {

    const category =
        position.querySelector(".category");

    if (category) {
        category.value = "";
    }

    const productArea =
        position.querySelector(".product-area");

    const manualFields =
        position.querySelector(".manual-fields");

    if (productArea) {
        productArea.innerHTML = "";
    }

    if (manualFields) {
        manualFields.innerHTML = "";
    }

    updateOrderTotals();
}


// ========================================
// ГЛАВНАЯ ФУНКЦИЯ КАТЕГОРИИ
// ========================================

function updateProductOptions(select) {

    const position =
        select.closest(".position");

    if (!position) return;

    const type = select.value;

    const productArea =
        position.querySelector(".product-area");

    const manualFields =
        position.querySelector(".manual-fields");

    if (!productArea || !manualFields) {
        return;
    }

    productArea.innerHTML = "";
    manualFields.innerHTML = "";


    if (type === "diploma") {

        renderDiplomaFields(position);

        return;
    }


    if (type === "cup_ready") {

        renderReadyCupFields(position);

        return;
    }


    if (type === "cup_print") {

        renderCupPrintFields(position);

        return;
    }


    if (type === "cup_custom") {

        renderCustomCupFields(position);

        return;
    }


    if (type === "packaging") {

        renderPackagingFields(position);

        return;
    }


    if (type === "designer") {

        renderDesignerFields(position);

        return;
    }


    if (type === "urgent") {

        renderUrgentFields(position);

        return;
    }

    updateOrderTotals();
}


// ========================================
// ДИПЛОМЫ
// ========================================

function renderDiplomaFields(position) {

    const productArea =
        position.querySelector(
            ".product-area"
        );

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    const catalog =
        loadCatalog();

    const products =
        Object.keys(
            catalog.diplomas
        );

    productArea.innerHTML = `

        <label>
            Вид диплома
        </label>

        <select class="product-select">

            ${products.map(
                product => `
                    <option value="${escapeHtml(product)}">
                        ${escapeHtml(product)}
                    </option>
                `
            ).join("")}

        </select>

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >
    `;

    manual.innerHTML = `

        <label>
            Цена продажи за 1 шт.
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
        >

        <label>
            Себестоимость за 1 шт.
        </label>

        <input
            type="number"
            class="cost-input"
            min="0"
        >
    `;


    const product =
        productArea.querySelector(
            ".product-select"
        );

    const quantity =
        productArea.querySelector(
            ".quantity"
        );

    const sale =
        manual.querySelector(
            ".sale-input"
        );

    const cost =
        manual.querySelector(
            ".cost-input"
        );


    function updatePrice() {

        const prices =
            getDiplomaPrice(
                product.value,
                Number(quantity.value) || 1
            );

        sale.value =
            prices.sale;

        cost.value =
            prices.cost;

        updateOrderTotals();
    }


    product.addEventListener(
        "change",
        updatePrice
    );

    quantity.addEventListener(
        "input",
        updatePrice
    );

    sale.addEventListener(
        "input",
        updateOrderTotals
    );

    cost.addEventListener(
        "input",
        updateOrderTotals
    );


    updatePrice();
}


// ========================================
// ГОТОВЫЕ ЧАШКИ
// ========================================

function renderReadyCupFields(position) {

    const productArea =
        position.querySelector(
            ".product-area"
        );

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    const catalog =
        loadCatalog();

    const products =
        Object.keys(
            catalog.readyCups
        );


    productArea.innerHTML = `

        <label>
            Вид чашки
        </label>

        <select class="product-select">

            ${products.map(
                product => `
                    <option value="${escapeHtml(product)}">
                        ${escapeHtml(product)}
                    </option>
                `
            ).join("")}

        </select>

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >
    `;


    manual.innerHTML = `

        <label>
            Цена продажи за 1 шт.
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
        />
    `;


    const product =
        productArea.querySelector(
            ".product-select"
        );

    const quantity =
        productArea.querySelector(
            ".quantity"
        );

    const sale =
        manual.querySelector(
            ".sale-input"
        );


    function updatePrice() {

        const item =
            catalog.readyCups[
                product.value
            ];

        sale.value =
            item ? item.sale : 0;

        updateOrderTotals();
    }


    product.addEventListener(
        "change",
        updatePrice
    );

    quantity.addEventListener(
        "input",
        updateOrderTotals
    );

    sale.addEventListener(
        "input",
        updateOrderTotals
    );


    updatePrice();
}


// ========================================
// ПЕЧАТЬ НА ЧАШКЕ
// ========================================

function renderCupPrintFields(position) {

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    manual.innerHTML = `

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >

        <label>
            Цена печати за 1 шт.
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
            value="0"
            placeholder="Введите сумму"
        >
    `;


    addInputListeners(
        manual
    );
}


// ========================================
// ОБЫЧНАЯ ЧАШКА
// ========================================

function renderCustomCupFields(position) {

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    manual.innerHTML = `

        <label>
            Описание
        </label>

        <input
            type="text"
            class="description"
            placeholder="Например: белая чашка"
        >

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >

        <label>
            Цена продажи за 1 шт.
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
        >

        <label>
            Себестоимость за 1 шт.
        </label>

        <input
            type="number"
            class="cost-input"
            min="0"
        >
    `;


    addInputListeners(
        manual
    );
}


// ========================================
// УПАКОВКА
// ========================================

function renderPackagingFields(position) {

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    manual.innerHTML = `

        <label>
            Вид упаковки
        </label>

        <input
            type="text"
            class="description"
            placeholder="Например: коробка"
        >

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >

        <label>
            Цена продажи за 1 шт.
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
        >

        <label>
            Себестоимость за 1 шт.
        </label>

        <input
            type="number"
            class="cost-input"
            min="0"
        >
    `;


    addInputListeners(
        manual
    );
}


// ========================================
// ДИЗАЙНЕР
// ========================================

function renderDesignerFields(position) {

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    manual.innerHTML = `

        <label>
            Описание
        </label>

        <input
            type="text"
            class="description"
            placeholder="Например: разработка макета"
        >

        <label>
            Количество
        </label>

        <input
            type="number"
            class="quantity"
            min="1"
            value="1"
        >

        <label>
            Стоимость
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
            value="0"
        >
    `;


    addInputListeners(
        manual
    );
}


// ========================================
// СРОЧНОСТЬ
// ========================================

function renderUrgentFields(position) {

    const manual =
        position.querySelector(
            ".manual-fields"
        );

    manual.innerHTML = `

        <label>
            Описание
        </label>

        <input
            type="text"
            class="description"
            placeholder="Например: срочное изготовление"
        >

        <label>
            Стоимость
        </label>

        <input
            type="number"
            class="sale-input"
            min="0"
            value="0"
        >
    `;


    addInputListeners(
        manual
    );
}


// ========================================
// ОБРАБОТКА INPUT
// ========================================

function addInputListeners(container) {

    container
        .querySelectorAll("input")
        .forEach(
            input => {

                input.addEventListener(
                    "input",
                    updateOrderTotals
                );

            }
        );
}


// ========================================
// РАСЧЁТ ПОЗИЦИИ
// ========================================

function calculatePosition(position) {

    const category =
        position.querySelector(
            ".category"
        );

    if (!category) {

        return {
            sale: 0,
            cost: 0,
            profit: 0
        };
    }


    const type =
        category.value;


    const quantityInput =
        position.querySelector(
            ".quantity"
        );

    const quantity =
        Math.max(
            1,
            Number(
                quantityInput?.value
            ) || 1
        );


    const saleInput =
        position.querySelector(
            ".sale-input"
        );

    const costInput =
        position.querySelector(
            ".cost-input"
        );


    const salePerUnit =
        Number(
            saleInput?.value
        ) || 0;


    const costPerUnit =
        Number(
            costInput?.value
        ) || 0;


    let sale = 0;
    let cost = 0;


    if (type === "diploma") {

        sale =
            salePerUnit * quantity;

        cost =
            costPerUnit * quantity;
    }


    else if (type === "cup_ready") {

        const product =
            position.querySelector(
                ".product-select"
            )?.value;

        const catalog =
            loadCatalog();

        const item =
            catalog.readyCups?.[product];


        sale =
            salePerUnit * quantity;

        cost =
            (item?.cost || 0) * quantity;
    }


    else if (type === "cup_print") {

        sale =
            salePerUnit * quantity;

        cost = 0;
    }


    else if (type === "cup_custom") {

        sale =
            salePerUnit * quantity;

        cost =
            costPerUnit * quantity;
    }


    else if (type === "packaging") {

        sale =
            salePerUnit * quantity;

        cost =
            costPerUnit * quantity;
    }


    else if (type === "designer") {

        sale =
            salePerUnit * quantity;

        cost = 0;
    }


    else if (type === "urgent") {

        sale =
            salePerUnit;

        cost = 0;
    }


    return {
        sale,
        cost,
        profit: sale - cost
    };
}


// ========================================
// ОБНОВЛЕНИЕ ЦЕНЫ ПОЗИЦИИ
// ========================================

function updatePositionPrice(position) {

    const result =
        calculatePosition(position);


    const sale =
        position.querySelector(
            ".sale-price"
        );

    const cost =
        position.querySelector(
            ".cost-price"
        );

    const profit =
        position.querySelector(
            ".profit-price"
        );


    if (sale) {

        sale.textContent =
            `${result.sale} грн`;
    }

    if (cost) {

        cost.textContent =
            `${result.cost} грн`;
    }

    if (profit) {

        profit.textContent =
            `${result.profit} грн`;
    }
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


    positions.forEach(
        position => {

            const result =
                calculatePosition(
                    position
                );


            totalSale +=
                result.sale;

            totalCost +=
                result.cost;


            updatePositionPrice(
                position
            );

        }
    );


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
// ПОЛУЧЕНИЕ ПОЗИЦИЙ ЗАКАЗА
// ========================================

function getOrderPositions() {

    const positions =
        document.querySelectorAll(
            "#positions .position"
        );


    return Array.from(
        positions
    )
        .map(position => {

            const category =
                position.querySelector(
                    ".category"
                );

            if (
                !category ||
                !category.value
            ) {
                return null;
            }


            const type =
                category.value;


            const result =
                calculatePosition(
                    position
                );


            const quantity =
                Math.max(
                    1,
                    Number(
                        position.querySelector(
                            ".quantity"
                        )?.value
                    ) || 1
                );


            const product =
                position.querySelector(
                    ".product-select"
                )?.value || "";


            const description =
                position.querySelector(
                    ".description"
                )?.value || "";


            const salePerUnit =
                Number(
                    position.querySelector(
                        ".sale-input"
                    )?.value
                ) || 0;


            const costPerUnit =
                Number(
                    position.querySelector(
                        ".cost-input"
                    )?.value
                ) || 0;


            return {

                type,

                product,

                description,

                quantity,

                salePerUnit,

                costPerUnit,

                sale:
                    result.sale,

                cost:
                    result.cost,

                profit:
                    result.profit
            };

        })
        .filter(Boolean);
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


    if (
        positions.length === 0
    ) {

        alert(
            "Выберите категорию хотя бы для одной позиции."
        );

        return;
    }


    const totals =
        positions.reduce(
            (sum, item) => {

                sum.sale +=
                    item.sale;

                sum.cost +=
                    item.cost;

                sum.profit +=
                    item.profit;

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
        JSON.stringify(
            orders
        )
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

    const container =
        document.getElementById(
            "positions"
        );

    if (!container) return;


    container.innerHTML = `

        <div class="position">

            <div class="position-header">

                <strong>
                    Позиция 1
                </strong>

                <button
                    type="button"
                    class="delete-button"
                    onclick="removePosition(this)"
                >
                    ×
                </button>

            </div>

            <label>
                Категория
            </label>

            <select
                class="category"
                onchange="updateProductOptions(this)"
            >

                <option value="">
                    Выберите категорию
                </option>

                <option value="diploma">
                    Дипломы
                </option>

                <option value="cup_ready">
                    Готовые чашки
                </option>

                <option value="cup_print">
                    Печать чашка
                </option>

                <option value="cup_custom">
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

            <div class="product-area"></div>

            <div class="manual-fields"></div>

            <div class="price-info">

                <div>
                    <span>Цена продажи:</span>
                    <strong class="sale-price">
                        0 грн
                    </strong>
                </div>

                <div>
                    <span>Себестоимость:</span>
                    <strong class="cost-price">
                        0 грн
                    </strong>
                </div>

                <div>
                    <span>Прибыль:</span>
                    <strong class="profit-price">
                        0 грн
                    </strong>
                </div>

            </div>

        </div>
    `;


    const client =
        document.getElementById(
            "clientName"
        );

    if (client) {
        client.value = "";
    }


    updateOrderTotals();
}


// ========================================
// ЭКРАН ЗАКАЗОВ
// ========================================

function openOrders() {

    hideOrderScreen();

    const screen =
        getExtraScreen();


    const orders =
        getOrders();


    let html = `

        <div class="catalogScreen">

            <button
                type="button"
                class="backToOrder"
                onclick="showOrderScreen()"
            >
                ← Новый заказ
            </button>

            <h2>
                Заказы
            </h2>
    `;


    if (orders.length === 0) {

        html += `

            <div class="emptyOrders">
                Пока нет сохранённых заказов.
            </div>

        `;

    } else {

        orders.forEach(
            order => {

                const date =
                    new Date(
                        order.date
                    ).toLocaleString(
                        "uk-UA"
                    );


                html += `

                    <div
                        class="orderCard"
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
                            ${escapeHtml(
                                order.client ||
                                "Клиент не указан"
                            )}
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
                            onclick="openOrderDetails(${order.id})"
                        >
                            Открыть
                        </button>

                        <button
                            type="button"
                            class="deleteOrder"
                            onclick="deleteOrder(${order.id})"
                        >
                            Удалить
                        </button>

                    </div>
                `;
            }
        );
    }


    html += `

        </div>
    `;


    screen.innerHTML =
        html;

    screen.style.display =
        "block";

    setActiveNav("Заказы");
}


// ========================================
// ДЕТАЛИ ЗАКАЗА
// ========================================

function openOrderDetails(id) {

    const order =
        getOrders().find(
            item =>
                item.id === id
        );


    if (!order) return;


    hideOrderScreen();

    const screen =
        getExtraScreen();


    let html = `

        <div class="catalogScreen">

            <button
                type="button"
                class="backToOrders"
                onclick="openOrders()"
            >
                ← Все заказы
            </button>

            <h2>
                Заказ №${order.number}
            </h2>

            <p>
                <strong>
                    Клиент:
                </strong>

                ${escapeHtml(
                    order.client ||
                    "Не указан"
                )}
            </p>

            <h3>
                Позиции
            </h3>
    `;


    order.positions.forEach(
        (item, index) => {

            let title =
                item.product ||
                item.description ||
                getCategoryName(
                    item.type
                );


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

                <strong>
                    Итого
                </strong>

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


    screen.innerHTML =
        html;

    screen.style.display =
        "block";

    setActiveNav("Заказы");
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
        JSON.stringify(
            orders
        )
    );


    openOrders();
}


// ========================================
// ЭКРАН КАТАЛОГА
// ========================================

function openCatalog() {

    hideOrderScreen();

    const screen =
        getExtraScreen();


    renderCatalog();


    screen.style.display =
        "block";

    setActiveNav("Каталог");
}


// ========================================
// ОТРИСОВКА КАТАЛОГА
// ========================================

function renderCatalog() {

    const screen =
        getExtraScreen();


    const catalog =
        loadCatalog();


    let html = `

        <div class="catalogScreen">

            <button
                type="button"
                class="backToOrder"
                onclick="showOrderScreen()"
            >
                ← Новый заказ
            </button>

            <h2>
                Каталог
            </h2>

            <p>
                Здесь можно изменить цены.
            </p>

            <h3>
                Дипломы
            </h3>
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

        <h3>
            Готовые чашки
        </h3>
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
                onclick="saveCatalogFromScreen()"
            >
                Сохранить изменения
            </button>

            <button
                type="button"
                id="resetCatalogButton"
                onclick="resetCatalog()"
            >
                Сбросить цены
            </button>

        </div>
    `;


    screen.innerHTML =
        html;
}


// ========================================
// СТРОКА ЦЕНЫ ДИПЛОМА
// ========================================

function renderTier(
    name,
    tier
) {

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
                value="${tier?.sale ?? 0}"
            >

            <label>
                Себестоимость
            </label>

            <input
                type="number"
                class="catalogCost"
                value="${tier?.cost ?? 0}"
            >

        </div>
    `;
}


// ========================================
// СОХРАНЕНИЕ ЦЕН КАТАЛОГА
// ========================================

function saveCatalogFromScreen() {

    const catalog =
        loadCatalog();


    const diplomaItems =
        document.querySelectorAll(
            "#extraScreen .catalogItem"
        );


    let diplomaIndex = 0;


    Object.keys(
        catalog.diplomas
    ).forEach(
        product => {

            const item =
                diplomaItems[
                    diplomaIndex
                ];


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
                                saleInputs[
                                    index
                                ].value
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
                                costInputs[
                                    index
                                ].value
                            ) || 0;
                    }

                }
            );


            diplomaIndex++;
        }
    );


    const cupSales =
        document.querySelectorAll(
            "#extraScreen .catalogCupSale"
        );

    const cupCosts =
        document.querySelectorAll(
            "#extraScreen .catalogCupCost"
        );


    cupSales.forEach(
        input => {

            const product =
                input.dataset.product;


            if (
                catalog.readyCups[product]
            ) {

                catalog
                    .readyCups
                    [product]
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
                    .readyCups
                    [product]
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


    renderCatalog();
}


// ========================================
// СБРОС ЦЕН
// ========================================

function resetCatalog() {

    if (
        !confirm(
            "Сбросить все цены к исходным?"
        )
    ) {
        return;
    }


    saveCatalog(
        JSON.parse(
            JSON.stringify(
                DEFAULT_CATALOG
            )
        )
    );


    renderCatalog();
}


// ========================================
// ЭКРАНЫ
// ========================================

function getExtraScreen() {

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


    return screen;
}


function hideExtraScreen() {

    const screen =
        document.getElementById(
            "extraScreen"
        );


    if (screen) {

        screen.style.display =
            "none";
    }
}


// ========================================
// СКРЫТИЕ ОСНОВНОГО ЭКРАНА
// ========================================

function hideOrderScreen() {

    const main =
        document.querySelector(
            "main.container"
        );

    const header =
        document.querySelector(
            "header.header"
        );


    if (main) {

        main.style.display =
            "none";
    }


    if (header) {

        header.style.display =
            "none";
    }
}


// ========================================
// ПОКАЗ ОСНОВНОГО ЭКРАНА
// ========================================

function showOrderScreen() {

    hideExtraScreen();


    const main =
        document.querySelector(
            "main.container"
        );

    const header =
        document.querySelector(
            "header.header"
        );


    if (main) {

        main.style.display =
            "";
    }


    if (header) {

        header.style.display =
            "";
    }


    setActiveNav(
        "Заказ"
    );
}


// ========================================
// АКТИВНАЯ КНОПКА НАВИГАЦИИ
// ========================================

function setActiveNav(name) {

    const buttons =
        document.querySelectorAll(
            ".bottom-nav .nav-item"
        );


    buttons.forEach(
        button => {

            const text =
                button
                    .textContent
                    .trim()
                    .toLowerCase();


            button.classList.toggle(
                "active",
                text === name.toLowerCase()
            );
        }
    );
}


// ========================================
// КНОПКИ ИЗ INDEX.HTML
// ========================================

function showOrder() {

    showOrderScreen();
}


function showCatalog() {

    openCatalog();
}


function showOrders() {

    openOrders();
}


function showSettings() {

    setActiveNav(
        "Настройки"
    );

    alert(
        "Настройки пока находятся в разработке."
    );
}


// ========================================
// НАВИГАЦИЯ
// ========================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".bottom-nav .nav-item"
        );


    buttons.forEach(
        button => {

            const text =
                button
                    .textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes("заказ") &&
                !text.includes("заказы")
            ) {

                button.onclick =
                    showOrderScreen;
            }


            else if (
                text.includes("каталог")
            ) {

                button.onclick =
                    openCatalog;
            }


            else if (
                text.includes("заказы")
            ) {

                button.onclick =
                    openOrders;
            }


            else if (
                text.includes("настройки")
            ) {

                button.onclick =
                    showSettings;
            }

        }
    );
}


// ========================================
// НАЗВАНИЕ КАТЕГОРИИ
// ========================================

function getCategoryName(type) {

    const names = {

        diploma:
            "Диплом",

        cup_ready:
            "Готовая чашка",

        cup_print:
            "Печать чашки",

        cup_custom:
            "Чашка",

        packaging:
            "Упаковка для чашки",

        designer:
            "Услуги дизайнера",

        urgent:
            "Срочность"
    };


    return (
        names[type] ||
        "Позиция"
    );
}


// ========================================
// БЕЗОПАСНЫЙ ТЕКСТ
// ========================================

function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


// ========================================
// ДОПОЛНИТЕЛЬНЫЕ СТИЛИ
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
            display: none;
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

        #saveCatalogButton,
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

    `;


    document.head.appendChild(
        style
    );
}


// ========================================
// ЗАПУСК
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addExtraStyles();

        setupNavigation();

        showOrderScreen();

        updateOrderTotals();

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