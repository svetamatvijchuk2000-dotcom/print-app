/* =========================================================
   PRINT APP — РАСЧЁТ ЗАКАЗОВ + КАТАЛОГ + ЗАКАЗЫ
   ========================================================= */


/* =========================================================
   ЦЕНЫ ПО УМОЛЧАНИЮ
   ========================================================= */

const DEFAULT_DIPLOMA_PRICES = {

    diploma_uv_A5: {
        "1": { sale: 300, cost: 240 },
        "2": { sale: 300, cost: 240 },
        "3-10": { sale: 280, cost: 200 },
        "11-20": { sale: 260, cost: 190 },
        "21-50": { sale: 240, cost: 180 },
        "50+": { sale: 220, cost: 170 }
    },

    diploma_uv_A4: {
        "1": { sale: 470, cost: 420 },
        "2": { sale: 470, cost: 420 },
        "3-10": { sale: 450, cost: 400 },
        "11-20": { sale: 430, cost: 370 },
        "21-50": { sale: 410, cost: 350 },
        "50+": { sale: 390, cost: 320 }
    },

    diploma_sub_A5: {
        "1": { sale: 300, cost: 240 },
        "2": { sale: 300, cost: 240 },
        "3-10": { sale: 280, cost: 190 },
        "11-20": { sale: 260, cost: 180 },
        "21-50": { sale: 240, cost: 170 },
        "50+": { sale: 220, cost: 165 }
    },

    diploma_sub_A4: {
        "1": { sale: 470, cost: 400 },
        "2": { sale: 470, cost: 400 },
        "3-10": { sale: 450, cost: 390 },
        "11-20": { sale: 430, cost: 360 },
        "21-50": { sale: 410, cost: 340 },
        "50+": { sale: 390, cost: 310 }
    }

};


/* =========================================================
   ГОТОВЫЕ ЧАШКИ
   ========================================================= */

const DEFAULT_READY_CUPS = {

    cup_carabiner_300_ss: {
        name: "Чашка с карабином 300 мл — С/С",
        price: 159
    },

    cup_carabiner_300_sk: {
        name: "Чашка с карабином 300 мл — С/Кр",
        price: 159
    },

    cup_carabiner_300_black: {
        name: "Чашка с карабином 300 мл — С/Черн",
        price: 159
    },

    cup_color_330: {
        name: "Чашка цветная внутри и ручка 330 мл",
        price: 59,
        colorRequired: true
    },

    cup_white_330: {
        name: "Белая чашка 330 мл",
        price: 47
    }

};


/* =========================================================
   КАТАЛОГ
   ========================================================= */

let diplomaPrices = {};
let readyCups = {};

function loadCatalog() {

    try {

        const savedDiplomas =
            localStorage.getItem("diplomaPrices");

        const savedCups =
            localStorage.getItem("readyCups");

        diplomaPrices =
            savedDiplomas
                ? JSON.parse(savedDiplomas)
                : JSON.parse(
                    JSON.stringify(DEFAULT_DIPLOMA_PRICES)
                );

        readyCups =
            savedCups
                ? JSON.parse(savedCups)
                : JSON.parse(
                    JSON.stringify(DEFAULT_READY_CUPS)
                );

    } catch (error) {

        console.error(
            "Ошибка загрузки каталога:",
            error
        );

        diplomaPrices =
            JSON.parse(
                JSON.stringify(DEFAULT_DIPLOMA_PRICES)
            );

        readyCups =
            JSON.parse(
                JSON.stringify(DEFAULT_READY_CUPS)
            );

    }

}

loadCatalog();


function saveCatalog() {

    localStorage.setItem(
        "diplomaPrices",
        JSON.stringify(diplomaPrices)
    );

    localStorage.setItem(
        "readyCups",
        JSON.stringify(readyCups)
    );

}


/* =========================================================
   СОЗДАНИЕ ПОЗИЦИИ
   ========================================================= */

function addPosition() {

    const positions =
        document.getElementById("positions");

    if (!positions) {
        return;
    }

    const positionCount =
        positions.querySelectorAll(".position").length + 1;

    const position =
        document.createElement("div");

    position.className = "position";

    position.innerHTML = `

        <div class="position-header">

            <strong>
                Позиция ${positionCount}
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

    positions.appendChild(position);

    renumberPositions();

}


/* =========================================================
   УДАЛЕНИЕ ПОЗИЦИИ
   ========================================================= */

function removePosition(button) {

    const positions =
        document.querySelectorAll(".position");

    if (positions.length <= 1) {

        alert(
            "В заказе должна остаться хотя бы одна позиция."
        );

        return;
    }

    const position =
        button.closest(".position");

    if (position) {
        position.remove();
    }

    renumberPositions();

    calculateAll();

}


/* =========================================================
   НУМЕРАЦИЯ
   ========================================================= */

function renumberPositions() {

    const positions =
        document.querySelectorAll(".position");

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


/* =========================================================
   ВЫБОР КАТЕГОРИИ
   ========================================================= */

function updateProductOptions(categorySelect) {

    const position =
        categorySelect.closest(".position");

    if (!position) {
        return;
    }

    const category =
        categorySelect.value;

    const productArea =
        position.querySelector(".product-area");

    const manualFields =
        position.querySelector(".manual-fields");

    productArea.innerHTML = "";

    manualFields.innerHTML = "";


    /* ---------- ДИПЛОМЫ ---------- */

    if (category === "diploma") {

        productArea.innerHTML = `

            <label>Вид диплома</label>

            <select
                class="diploma-type"
                onchange="updateDiploma(this)"
            >

                <option value="">
                    Выберите вид
                </option>

                <option value="diploma_uv">
                    Диплом УФ
                </option>

                <option value="diploma_sub">
                    Диплом сублимация
                </option>

            </select>

            <label>Размер</label>

            <select
                class="diploma-size"
                onchange="updateDiploma(this)"
            >

                <option value="">
                    Выберите размер
                </option>

                <option value="A5">
                    А5
                </option>

                <option value="A4">
                    А4
                </option>

            </select>

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="updateDiploma(this)"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- ГОТОВЫЕ ЧАШКИ ---------- */

    if (category === "cup_ready") {

        productArea.innerHTML = `

            <label>Вид чашки</label>

            <select
                class="ready-cup"
                onchange="updateReadyCup(this)"
            >

                <option value="">
                    Выберите чашку
                </option>

                <option value="cup_carabiner_300_ss">
                    Чашка с карабином 300 мл — С/С
                </option>

                <option value="cup_carabiner_300_sk">
                    Чашка с карабином 300 мл — С/Кр
                </option>

                <option value="cup_carabiner_300_black">
                    Чашка с карабином 300 мл — С/Черн
                </option>

                <option value="cup_color_330">
                    Чашка цветная внутри и ручка 330 мл
                </option>

                <option value="cup_white_330">
                    Белая чашка 330 мл
                </option>

            </select>

            <div class="cup-extra"></div>

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- ПЕЧАТЬ ЧАШКА ---------- */

    if (category === "cup_print") {

        manualFields.innerHTML = `

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />

            <label>
                Сумма печати за 1 шт.
            </label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                placeholder="Введите сумму"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- НЕСТАНДАРТНАЯ ЧАШКА ---------- */

    if (category === "cup_custom") {

        manualFields.innerHTML = `

            <label>Какая чашка</label>

            <input
                type="text"
                class="description"
                placeholder="Например: кружка стекло 350 мл"
                oninput="calculateAll()"
            />

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />

            <label>
                Себестоимость за 1 шт.
            </label>

            <input
                type="number"
                class="manual-cost"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

            <label>
                Цена продажи за 1 шт.
            </label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- УПАКОВКА ---------- */

    if (category === "packaging") {

        manualFields.innerHTML = `

            <label>Вид упаковки</label>

            <input
                type="text"
                class="description"
                placeholder="Например: коробка для кружки"
                oninput="calculateAll()"
            />

            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />

            <label>
                Себестоимость за 1 шт.
            </label>

            <input
                type="number"
                class="manual-cost"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

            <label>
                Цена продажи за 1 шт.
            </label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- ДИЗАЙНЕР ---------- */

    if (category === "designer") {

        manualFields.innerHTML = `

            <label>
                Стоимость услуги
            </label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                placeholder="Введите сумму"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

        return;
    }


    /* ---------- СРОЧНОСТЬ ---------- */

    if (category === "urgent") {

        manualFields.innerHTML = `

            <label>
                Стоимость срочности
            </label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                placeholder="Введите сумму"
                oninput="calculateAll()"
            />

        `;

        calculatePosition(position);

    }

}


/* =========================================================
   ДИПЛОМ
   ========================================================= */

function updateDiploma(element) {

    const position =
        element.closest(".position");

    calculatePosition(position);

    calculateAll();

}


/* =========================================================
   ГОТОВАЯ ЧАШКА
   ========================================================= */

function updateReadyCup(select) {

    const position =
        select.closest(".position");

    if (!position) {
        return;
    }

    const cup =
        readyCups[select.value];

    const extra =
        position.querySelector(".cup-extra");

    if (!extra) {
        return;
    }

    if (!cup) {

        extra.innerHTML = "";

        calculateAll();

        return;
    }

    if (cup.colorRequired) {

        extra.innerHTML = `

            <label>
                Цвет чашки
            </label>

            <input
                type="text"
                class="cup-color"
                placeholder="Например: красная"
                oninput="calculateAll()"
            />

        `;

    } else {

        extra.innerHTML = "";

    }

    calculateAll();

}


/* =========================================================
   ЦЕНА ДИПЛОМА
   ========================================================= */

function getDiplomaPrice(
    type,
    size,
    quantity
) {

    const key =
        `${type}_${size}`;

    const prices =
        diplomaPrices[key];

    if (!prices) {
        return null;
    }

    if (quantity <= 2) {
        return prices["1"];
    }

    if (quantity <= 10) {
        return prices["3-10"];
    }

    if (quantity <= 20) {
        return prices["11-20"];
    }

    if (quantity <= 50) {
        return prices["21-50"];
    }

    return prices["50+"];

}


/* =========================================================
   РАСЧЁТ ПОЗИЦИИ
   ========================================================= */

function calculatePosition(position) {

    if (!position) {
        return;
    }

    const category =
        position.querySelector(
            ".category"
        )?.value || "";

    let sale = 0;
    let cost = 0;


    if (category === "diploma") {

        const type =
            position.querySelector(
                ".diploma-type"
            )?.value || "";

        const size =
            position.querySelector(
                ".diploma-size"
            )?.value || "";

        const quantity =
            Number(
                position.querySelector(
                    ".quantity"
                )?.value
            ) || 0;

        if (
            type &&
            size &&
            quantity > 0
        ) {

            const price =
                getDiplomaPrice(
                    type,
                    size,
                    quantity
                );

            if (price) {

                sale =
                    price.sale * quantity;

                cost =
                    price.cost * quantity;

            }

        }

    }


    if (category === "cup_ready") {

        const cupId =
            position.querySelector(
                ".ready-cup"
            )?.value || "";

        const quantity =
            Number(
                position.querySelector(
                    ".quantity"
                )?.value
            ) || 0;

        const cup =
            readyCups[cupId];

        if (
            cup &&
            quantity > 0
        ) {

            sale =
                cup.price * quantity;

            cost =
                cup.price * quantity;

        }

    }


    if (category === "cup_print") {

        const quantity =
            Number(
                position.querySelector(
                    ".quantity"
                )?.value
            ) || 0;

        const price =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        sale =
            price * quantity;

        cost = 0;

    }


    if (category === "cup_custom") {

        const quantity =
            Number(
                position.querySelector(
                    ".quantity"
                )?.value
            ) || 0;

        const salePrice =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        const costPrice =
            Number(
                position.querySelector(
                    ".manual-cost"
                )?.value
            ) || 0;

        sale =
            salePrice * quantity;

        cost =
            costPrice * quantity;

    }


    if (category === "packaging") {

        const quantity =
            Number(
                position.querySelector(
                    ".quantity"
                )?.value
            ) || 0;

        const salePrice =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        const costPrice =
            Number(
                position.querySelector(
                    ".manual-cost"
                )?.value
            ) || 0;

        sale =
            salePrice * quantity;

        cost =
            costPrice * quantity;

    }


    if (category === "designer") {

        sale =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        cost = 0;

    }


    if (category === "urgent") {

        sale =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        cost = 0;

    }


    const profit =
        sale - cost;


    const saleElement =
        position.querySelector(
            ".sale-price"
        );

    const costElement =
        position.querySelector(
            ".cost-price"
        );

    const profitElement =
        position.querySelector(
            ".profit-price"
        );

    if (saleElement) {
        saleElement.textContent =
            `${sale} грн`;
    }

    if (costElement) {
        costElement.textContent =
            `${cost} грн`;
    }

    if (profitElement) {
        profitElement.textContent =
            `${profit} грн`;
    }

}


/* =========================================================
   ОБЩИЙ РАСЧЁТ
   ========================================================= */

function calculateAll() {

    const positions =
        document.querySelectorAll(
            ".position"
        );

    let totalSale = 0;
    let totalCost = 0;

    positions.forEach(
        position => {

            calculatePosition(position);

            const saleText =
                position.querySelector(
                    ".sale-price"
                )?.textContent || "0";

            const costText =
                position.querySelector(
                    ".cost-price"
                )?.textContent || "0";

            const sale =
                parseFloat(
                    saleText.replace(
                        ",",
                        "."
                    )
                ) || 0;

            const cost =
                parseFloat(
                    costText.replace(
                        ",",
                        "."
                    )
                ) || 0;

            totalSale += sale;
            totalCost += cost;

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


/* =========================================================
   ОЧИСТКА ЗАКАЗА
   ========================================================= */

function clearOrder() {

    const confirmed =
        confirm(
            "Очистить текущий заказ?"
        );

    if (!confirmed) {
        return;
    }

    const clientName =
        document.getElementById(
            "clientName"
        );

    if (clientName) {
        clientName.value = "";
    }

    const positions =
        document.getElementById(
            "positions"
        );

    if (!positions) {
        return;
    }

    positions.innerHTML = "";

    addPosition();

    calculateAll();

}


/* =========================================================
   СОХРАНЕНИЕ ЗАКАЗА
   ========================================================= */

function saveOrder() {

    calculateAll();

    const client =
        document.getElementById(
            "clientName"
        )?.value.trim() || "";

    const positions =
        document.querySelectorAll(
            ".position"
        );

    const orderPositions = [];

    positions.forEach(
        position => {

            const category =
                position.querySelector(
                    ".category"
                )?.value || "";

            if (!category) {
                return;
            }

            const quantity =
                Number(
                    position.querySelector(
                        ".quantity"
                    )?.value
                ) || 0;

            const description =
                position.querySelector(
                    ".description"
                )?.value || "";

            const diplomaType =
                position.querySelector(
                    ".diploma-type"
                )?.value || "";

            const diplomaSize =
                position.querySelector(
                    ".diploma-size"
                )?.value || "";

            const readyCup =
                position.querySelector(
                    ".ready-cup"
                )?.value || "";

            const cupColor =
                position.querySelector(
                    ".cup-color"
                )?.value || "";

            const manualSale =
                Number(
                    position.querySelector(
                        ".manual-sale"
                    )?.value
                ) || 0;

            const manualCost =
                Number(
                    position.querySelector(
                        ".manual-cost"
                    )?.value
                ) || 0;

            orderPositions.push({

                category,
                quantity,
                description,
                diplomaType,
                diplomaSize,
                readyCup,
                cupColor,
                manualSale,
                manualCost,

                sale:
                    position.querySelector(
                        ".sale-price"
                    )?.textContent ||
                    "0 грн",

                cost:
                    position.querySelector(
                        ".cost-price"
                    )?.textContent ||
                    "0 грн",

                profit:
                    position.querySelector(
                        ".profit-price"
                    )?.textContent ||
                    "0 грн"

            });

        }
    );


    if (
        orderPositions.length === 0
    ) {

        alert(
            "Добавьте хотя бы одну позицию."
        );

        return;
    }


    const order = {

        id:
            Date.now(),

        date:
            new Date().toLocaleString(
                "uk-UA"
            ),

        client,

        positions:
            orderPositions,

        totalSale:
            document.getElementById(
                "totalSale"
            )?.textContent ||
            "0 грн",

        totalCost:
            document.getElementById(
                "totalCost"
            )?.textContent ||
            "0 грн",

        totalProfit:
            document.getElementById(
                "totalProfit"
            )?.textContent ||
            "0 грн"

    };


    const orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            ) || "[]"
        );

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    alert(
        "Заказ сохранён."
    );

    clearOrder();

}


/* =========================================================
   НАЗВАНИЯ КАТЕГОРИЙ
   ========================================================= */

const categoryNames = {

    diploma:
        "Диплом",

    cup_ready:
        "Готовая чашка",

    cup_print:
        "Печать чашка",

    cup_custom:
        "Чашка",

    packaging:
        "Упаковка для чашки",

    designer:
        "Услуги дизайнера",

    urgent:
        "Срочность"

};


const catalogNames = {

    diploma_uv_A5:
        "Диплом УФ — А5",

    diploma_uv_A4:
        "Диплом УФ — А4",

    diploma_sub_A5:
        "Диплом сублимация — А5",

    diploma_sub_A4:
        "Диплом сублимация — А4"

};


const catalogTiers = [

    {
        key: "1",
        label: "1–2 шт."
    },

    {
        key: "3-10",
        label: "3–10 шт."
    },

    {
        key: "11-20",
        label: "11–20 шт."
    },

    {
        key: "21-50",
        label: "21–50 шт."
    },

    {
        key: "50+",
        label: "50+ шт."
    }

];


/* =========================================================
   СТИЛИ ДОПОЛНИТЕЛЬНЫХ ЭКРАНОВ
   ========================================================= */

function addCatalogStyles() {

    if (
        document.getElementById(
            "catalog-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "catalog-styles";

    style.textContent = `

        .catalog-screen,
        .orders-screen,
        .order-details-screen {

            position: fixed;
            inset: 0;
            z-index: 99999;

            background: #f5f5f7;

            overflow-y: auto;

            padding:
                20px
                16px
                calc(100px + env(safe-area-inset-bottom));

            -webkit-overflow-scrolling: touch;

        }


        .catalog-header,
        .orders-header {

            display: flex;
            align-items: center;
            justify-content: space-between;

            margin-bottom: 20px;

        }


        .catalog-header h2,
        .orders-header h2 {

            margin: 0;
            font-size: 25px;

        }


        .catalog-close,
        .orders-close {

            border: none;
            background: #e5e5ea;

            width: 42px;
            height: 42px;

            border-radius: 50%;

            font-size: 25px;

        }


        .catalog-section {

            background: white;

            border-radius: 18px;

            padding: 16px;

            margin-bottom: 16px;

            box-shadow:
                0 2px 10px
                rgba(0,0,0,.05);

        }


        .catalog-section h3 {

            margin:
                0 0 14px;

            font-size: 18px;

        }


        .catalog-product {

            padding:
                14px 0;

            border-top:
                1px solid #eee;

        }


        .catalog-product:first-of-type {

            border-top: none;

        }


        .catalog-product-name {

            font-weight: 600;

            margin-bottom: 12px;

        }


        .catalog-tier {

            display: grid;

            grid-template-columns:
                75px 1fr 1fr;

            gap: 8px;

            align-items: end;

            margin-bottom: 10px;

        }


        .catalog-tier-name {

            font-size: 13px;
            color: #666;
            padding-bottom: 11px;

        }


        .catalog-field label {

            display: block;

            font-size: 12px;

            color: #777;

            margin-bottom: 5px;

        }


        .catalog-field input {

            width: 100%;

            box-sizing: border-box;

            padding: 11px;

            border:
                1px solid #ddd;

            border-radius: 10px;

            font-size: 16px;

            background: #fafafa;

        }


        .catalog-row {

            display: grid;

            grid-template-columns: 1fr;

            gap: 10px;

        }


        .catalog-actions {

            margin-top: 18px;

        }


        .catalog-save {

            width: 100%;

            border: none;

            border-radius: 14px;

            padding: 14px;

            background: #111;

            color: white;

            font-size: 17px;

            font-weight: 600;

        }


        .catalog-reset {

            width: 100%;

            border: none;

            background: transparent;

            padding: 14px;

            color: #d00;

            font-size: 15px;

        }


        .catalog-note {

            font-size: 13px;

            color: #777;

            line-height: 1.4;

            margin-bottom: 16px;

        }


        /* ---------- ЗАКАЗЫ ---------- */

        .orders-empty {

            background: white;

            border-radius: 18px;

            padding: 30px 20px;

            text-align: center;

            color: #777;

        }


        .order-card {

            background: white;

            border-radius: 18px;

            padding: 16px;

            margin-bottom: 12px;

            box-shadow:
                0 2px 10px
                rgba(0,0,0,.05);

        }


        .order-card-top {

            display: flex;

            justify-content: space-between;

            gap: 10px;

            margin-bottom: 8px;

        }


        .order-card-client {

            font-weight: 700;

            font-size: 17px;

        }


        .order-card-date {

            font-size: 12px;

            color: #777;

            margin-bottom: 10px;

        }


        .order-card-total {

            font-size: 18px;

            font-weight: 700;

            margin-bottom: 4px;

        }


        .order-card-profit {

            font-size: 14px;

            color: #555;

            margin-bottom: 14px;

        }


        .order-card-buttons {

            display: flex;

            gap: 8px;

        }


        .order-view-button {

            flex: 1;

            border: none;

            border-radius: 12px;

            padding: 11px;

            background: #111;

            color: white;

            font-size: 15px;

        }


        .order-delete-button {

            border: none;

            border-radius: 12px;

            padding: 11px 15px;

            background: #eee;

            color: #d00;

            font-size: 15px;

        }


        /* ---------- ДЕТАЛИ ЗАКАЗА ---------- */

        .details-back {

            border: none;

            background: #e5e5ea;

            border-radius: 12px;

            padding: 10px 15px;

            font-size: 15px;

            margin-bottom: 15px;

        }


        .details-card {

            background: white;

            border-radius: 18px;

            padding: 16px;

            margin-bottom: 14px;

        }


        .details-card h3 {

            margin-top: 0;

        }


        .details-position {

            border-top: 1px solid #eee;

            padding: 14px 0;

        }


        .details-position:first-child {

            border-top: none;

        }


        .details-position-name {

            font-weight: 600;

            margin-bottom: 7px;

        }


        .details-line {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            margin-top: 5px;

            font-size: 14px;

        }


        .details-total {

            font-size: 18px;

            font-weight: 700;

        }

    `;

    document.head.appendChild(style);

}


/* =========================================================
   КАТАЛОГ
   ========================================================= */

function openCatalog() {

    addCatalogStyles();

    closeOrders();

    closeOrderDetails();

    const main =
        document.querySelector("main.container");

    const header =
        document.querySelector("header.header");

    if (main) {
        main.style.display = "none";
    }

    if (header) {
        header.style.display = "none";
    }

    let screen =
        document.getElementById(
            "catalogScreen"
        );

    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "catalogScreen";

        screen.className =
            "catalog-screen";

        document.body.appendChild(
            screen
        );

    }

    renderCatalog();

    screen.style.display =
        "block";

    document.body.style.overflow =
        "hidden";

    setActiveNav("Каталог");

}


function closeCatalog() {

    const screen =
        document.getElementById(
            "catalogScreen"
        );

    if (screen) {
        screen.style.display =
            "none";
    }

    document.body.style.overflow =
        "";

}


/* =========================================================
   ОТОБРАЖЕНИЕ КАТАЛОГА
   ========================================================= */

function renderCatalog() {

    const screen =
        document.getElementById(
            "catalogScreen"
        );

    if (!screen) {
        return;
    }

    let html = `

        <div class="catalog-header">

            <h2>Каталог</h2>

            <button
                type="button"
                class="catalog-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>

        <div class="catalog-note">

            Здесь можно менять цены продажи
            и себестоимость.
            Изменения сохраняются на этом телефоне
            и автоматически используются в новых заказах.

        </div>

        <div class="catalog-section">

            <h3>Дипломы</h3>

    `;


    Object.keys(
        catalogNames
    ).forEach(key => {

        const product =
            diplomaPrices[key];

        if (!product) {
            return;
        }

        html += `

            <div class="catalog-product">

                <div class="catalog-product-name">
                    ${catalogNames[key]}
                </div>

        `;

        catalogTiers.forEach(
            tierInfo => {

                const tier =
                    tierInfo.key;

                const values =
                    product[tier];

                if (!values) {
                    return;
                }

                html += `

                    <div class="catalog-tier">

                        <div class="catalog-tier-name">
                            ${tierInfo.label}
                        </div>

                        <div class="catalog-field">

                            <label>
                                Продажа
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                data-diploma="${key}"
                                data-tier="${tier}"
                                data-type="sale"
                                value="${values.sale}"
                            />

                        </div>

                        <div class="catalog-field">

                            <label>
                                Себестоимость
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                data-diploma="${key}"
                                data-tier="${tier}"
                                data-type="cost"
                                value="${values.cost}"
                            />

                        </div>

                    </div>

                `;

            }
        );

        html += `</div>`;

    });


    html += `

        </div>

        <div class="catalog-section">

            <h3>Готовые чашки</h3>

    `;


    Object.keys(
        readyCups
    ).forEach(key => {

        const cup =
            readyCups[key];

        html += `

            <div class="catalog-product">

                <div class="catalog-product-name">
                    ${cup.name}
                </div>

                <div class="catalog-row">

                    <div class="catalog-field">

                        <label>
                            Цена / себестоимость
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            data-cup="${key}"
                            value="${cup.price}"
                        />

                    </div>

                </div>

            </div>

        `;

    });


    html += `

        </div>

        <div class="catalog-actions">

            <button
                type="button"
                class="catalog-save"
                onclick="saveCatalogFromScreen()"
            >
                Сохранить изменения
            </button>

            <button
                type="button"
                class="catalog-reset"
                onclick="resetCatalog()"
            >
                Вернуть цены по умолчанию
            </button>

        </div>

    `;

    screen.innerHTML =
        html;

}


/* =========================================================
   СОХРАНЕНИЕ КАТАЛОГА
   ========================================================= */

function saveCatalogFromScreen() {

    const diplomaInputs =
        document.querySelectorAll(
            "#catalogScreen [data-diploma]"
        );

    diplomaInputs.forEach(
        input => {

            const key =
                input.dataset.diploma;

            const tier =
                input.dataset.tier;

            const type =
                input.dataset.type;

            const value =
                Number(
                    input.value
                ) || 0;

            if (
                diplomaPrices[key] &&
                diplomaPrices[key][tier]
            ) {

                diplomaPrices[key][tier][type] =
                    value;

                if (tier === "1") {

                    diplomaPrices[key]["2"][type] =
                        value;

                }

            }

        }
    );


    const cupInputs =
        document.querySelectorAll(
            "#catalogScreen [data-cup]"
        );

    cupInputs.forEach(
        input => {

            const key =
                input.dataset.cup;

            const value =
                Number(
                    input.value
                ) || 0;

            if (readyCups[key]) {

                readyCups[key].price =
                    value;

            }

        }
    );


    saveCatalog();

    calculateAll();

    alert(
        "Цены сохранены."
    );

}


/* =========================================================
   СБРОС КАТАЛОГА
   ========================================================= */

function resetCatalog() {

    const confirmed =
        confirm(
            "Вернуть все цены по умолчанию?"
        );

    if (!confirmed) {
        return;
    }

    diplomaPrices =
        JSON.parse(
            JSON.stringify(
                DEFAULT_DIPLOMA_PRICES
            )
        );

    readyCups =
        JSON.parse(
            JSON.stringify(
                DEFAULT_READY_CUPS
            )
        );

    saveCatalog();

    renderCatalog();

    calculateAll();

    alert(
        "Цены восстановлены."
    );

}


/* =========================================================
   ЗАКАЗЫ
   ========================================================= */

function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "orders"
            ) || "[]"
        );

    } catch (error) {

        console.error(
            "Ошибка загрузки заказов:",
            error
        );

        return [];

    }

}


/* =========================================================
   ОТКРЫТЬ ЗАКАЗЫ
   ========================================================= */

function openOrders() {

    addCatalogStyles();

    closeCatalog();
    closeOrderDetails();

    const main =
        document.querySelector(
            "main.container"
        );

    const header =
        document.querySelector(
            "header.header"
        );

    if (main) {
        main.style.display = "none";
    }

    if (header) {
        header.style.display = "none";
    }

    let screen =
        document.getElementById(
            "ordersScreen"
        );

    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "ordersScreen";

        screen.className =
            "orders-screen";

        document.body.appendChild(
            screen
        );

    }

    renderOrders();

    screen.style.display =
        "block";

    document.body.style.overflow =
        "hidden";

    setActiveNav("Заказы");

}


/* =========================================================
   РЕНДЕР ЗАКАЗОВ
   ========================================================= */

function renderOrders() {

    const screen =
        document.getElementById(
            "ordersScreen"
        );

    if (!screen) {
        return;
    }

    const orders =
        getOrders();

    let html = `

        <div class="orders-header">

            <h2>Заказы</h2>

            <button
                type="button"
                class="orders-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>

    `;


    if (orders.length === 0) {

        html += `

            <div class="orders-empty">

                <div style="font-size:40px;">
                    📋
                </div>

                <p>
                    Сохранённых заказов пока нет.
                </p>

            </div>

        `;

        screen.innerHTML =
            html;

        return;
    }


    const reversed =
        [...orders].reverse();


    reversed.forEach(
        order => {

            const client =
                order.client ||
                "Без имени";


            html += `

                <div class="order-card">

                    <div class="order-card-top">

                        <div class="order-card-client">
                            ${escapeHtml(client)}
                        </div>

                    </div>

                    <div class="order-card-date">
                        ${escapeHtml(order.date || "")}
                    </div>

                    <div class="order-card-total">
                        Продажа:
                        ${escapeHtml(order.totalSale || "0 грн")}
                    </div>

                    <div class="order-card-profit">
                        Прибыль:
                        ${escapeHtml(order.totalProfit || "0 грн")}
                    </div>

                    <div class="order-card-buttons">

                        <button
                            type="button"
                            class="order-view-button"
                            onclick="openOrderDetails(${order.id})"
                        >
                            Открыть
                        </button>

                        <button
                            type="button"
                            class="order-delete-button"
                            onclick="deleteOrder(${order.id})"
                        >
                            Удалить
                        </button>

                    </div>

                </div>

            `;

        }
    );


    screen.innerHTML =
        html;

}


/* =========================================================
   ДЕТАЛИ ЗАКАЗА
   ========================================================= */

function openOrderDetails(orderId) {

    const orders =
        getOrders();

    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );

    if (!order) {

        alert(
            "Заказ не найден."
        );

        return;
    }


    const main =
        document.querySelector(
            "main.container"
        );

    const header =
        document.querySelector(
            "header.header"
        );

    if (main) {
        main.style.display = "none";
    }

    if (header) {
        header.style.display = "none";
    }


    const ordersScreen =
        document.getElementById(
            "ordersScreen"
        );

    if (ordersScreen) {
        ordersScreen.style.display =
            "none";
    }


    let screen =
        document.getElementById(
            "orderDetailsScreen"
        );

    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "orderDetailsScreen";

        screen.className =
            "order-details-screen";

        document.body.appendChild(
            screen
        );

    }


    let html = `

        <button
            type="button"
            class="details-back"
            onclick="openOrders()"
        >
            ← Назад к заказам
        </button>

        <div class="details-card">

            <h3>
                ${escapeHtml(
                    order.client ||
                    "Без имени"
                )}
            </h3>

            <div>
                Дата:
                ${escapeHtml(
                    order.date || ""
                )}
            </div>

        </div>


        <div class="details-card">

            <h3>
                Позиции
            </h3>

    `;


    (order.positions || []).forEach(
        (position, index) => {

            let title =
                categoryNames[
                    position.category
                ] ||
                position.category ||
                "Позиция";


            if (
                position.category ===
                "diploma"
            ) {

                const diplomaNames = {

                    diploma_uv:
                        "Диплом УФ",

                    diploma_sub:
                        "Диплом сублимация"

                };

                title =
                    diplomaNames[
                        position.diplomaType
                    ] ||
                    "Диплом";

                if (position.diplomaSize) {

                    title +=
                        ` — ${position.diplomaSize}`;

                }

            }


            if (
                position.category ===
                "cup_ready"
            ) {

                title =
                    readyCups[
                        position.readyCup
                    ]?.name ||
                    "Готовая чашка";

                if (position.cupColor) {

                    title +=
                        ` — ${position.cupColor}`;

                }

            }


            if (
                position.category ===
                "cup_custom" &&
                position.description
            ) {

                title =
                    position.description;

            }


            if (
                position.category ===
                "packaging" &&
                position.description
            ) {

                title =
                    position.description;

            }


            html += `

                <div class="details-position">

                    <div class="details-position-name">

                        ${index + 1}.
                        ${escapeHtml(title)}

                    </div>

                    <div class="details-line">

                        <span>
                            Количество
                        </span>

                        <strong>
                            ${position.quantity || 0} шт.
                        </strong>

                    </div>

                    <div class="details-line">

                        <span>
                            Продажа
                        </span>

                        <strong>
                            ${escapeHtml(
                                position.sale ||
                                "0 грн"
                            )}
                        </strong>

                    </div>

                    <div class="details-line">

                        <span>
                            Себестоимость
                        </span>

                        <strong>
                            ${escapeHtml(
                                position.cost ||
                                "0 грн"
                            )}
                        </strong>

                    </div>

                    <div class="details-line">

                        <span>
                            Прибыль
                        </span>

                        <strong>
                            ${escapeHtml(
                                position.profit ||
                                "0 грн"
                            )}
                        </strong>

                    </div>

                </div>

            `;

        }
    );


    html += `

        </div>


        <div class="details-card">

            <div class="details-line">

                <span>
                    Продажа
                </span>

                <strong class="details-total">
                    ${escapeHtml(
                        order.totalSale ||
                        "0 грн"
                    )}
                </strong>

            </div>

            <div class="details-line">

                <span>
                    Себестоимость
                </span>

                <strong>
                    ${escapeHtml(
                        order.totalCost ||
                        "0 грн"
                    )}
                </strong>

            </div>

            <div class="details-line">

                <span>
                    Прибыль
                </span>

                <strong>
                    ${escapeHtml(
                        order.totalProfit ||
                        "0 грн"
                    )}
                </strong>

            </div>

        </div>

    `;


    screen.innerHTML =
        html;

    screen.style.display =
        "block";

    document.body.style.overflow =
        "hidden";

    setActiveNav("Заказы");

}


/* =========================================================
   УДАЛЕНИЕ ЗАКАЗА
   ========================================================= */

function deleteOrder(orderId) {

    const confirmed =
        confirm(
            "Удалить этот заказ?"
        );

    if (!confirmed) {
        return;
    }


    const orders =
        getOrders().filter(
            order =>
                Number(order.id) !==
                Number(orderId)
        );


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    renderOrders();

}


/* =========================================================
   ЗАКРЫТЬ ЭКРАН ЗАКАЗОВ
   ========================================================= */

function closeOrders() {

    const screen =
        document.getElementById(
            "ordersScreen"
        );

    if (screen) {

        screen.style.display =
            "none";

    }

}


/* =========================================================
   ЗАКРЫТЬ ДЕТАЛИ
   ========================================================= */

function closeOrderDetails() {

    const screen =
        document.getElementById(
            "orderDetailsScreen"
        );

    if (screen) {

        screen.style.display =
            "none";

    }

}


/* =========================================================
   ГЛАВНЫЙ ЭКРАН — НОВЫЙ ЗАКАЗ
   ========================================================= */

function showOrderScreen() {

    closeCatalog();
    closeOrders();
    closeOrderDetails();

    const main =
        document.querySelector(
            "main.container"
        );

    const header =
        document.querySelector(
            "header.header"
        );

    if (main) {
        main.style.display = "";
    }

    if (header) {
        header.style.display = "";
    }

    document.body.style.overflow =
        "";

    setActiveNav("Заказ");

    calculateAll();

}


/* =========================================================
   ФУНКЦИИ ДЛЯ INDEX.HTML
   ========================================================= */

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

    setActiveNav("Настройки");

    alert(
        "Настройки пока находятся в разработке."
    );

}


/* =========================================================
   АКТИВНАЯ КНОПКА НИЖНЕЙ НАВИГАЦИИ
   ========================================================= */

function setActiveNav(name) {

    const buttons =
        document.querySelectorAll(
            ".bottom-nav .nav-item"
        );

    buttons.forEach(
        button => {

            const text =
                button.textContent
                    .trim();

            if (
                text.includes(name)
            ) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
   ========================================================= */

function escapeHtml(value) {

    return String(value)
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


/* =========================================================
   PWA
   ========================================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(
                    registration => {

                        console.log(
                            "PWA готово",
                            registration
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Ошибка PWA:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================================
   ЗАПУСК
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Если позиций ещё нет —
           создаём первую.
        */

        const positions =
            document.getElementById(
                "positions"
            );

        if (
            positions &&
            positions.querySelectorAll(
                ".position"
            ).length === 0
        ) {

            addPosition();

        }

        calculateAll();

        /*
           ВАЖНО:
           не перехватываем кнопки каталога
           отдельным обработчиком.
           index.html уже вызывает
           showCatalog().
        */

    }
);