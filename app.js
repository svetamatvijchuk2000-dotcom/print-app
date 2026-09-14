/* =========================================================
   PRINT APP — РАСЧЁТ ЗАКАЗОВ + КАТАЛОГ
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
   ГОТОВЫЕ ЧАШКИ ПО УМОЛЧАНИЮ
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
   ЗАГРУЗКА ЦЕН ИЗ ПАМЯТИ
   ========================================================= */

let diplomaPrices =
    JSON.parse(
        localStorage.getItem("diplomaPrices") ||
        "null"
    );

let readyCups =
    JSON.parse(
        localStorage.getItem("readyCups") ||
        "null"
    );


if (!diplomaPrices) {

    diplomaPrices =
        JSON.parse(
            JSON.stringify(DEFAULT_DIPLOMA_PRICES)
        );

}


if (!readyCups) {

    readyCups =
        JSON.parse(
            JSON.stringify(DEFAULT_READY_CUPS)
        );

}


/* =========================================================
   СОХРАНЕНИЕ ЦЕН
   ========================================================= */

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
   СОЗДАНИЕ / УДАЛЕНИЕ ПОЗИЦИЙ
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

            <strong>Позиция ${positionCount}</strong>

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
                <strong class="sale-price">0 грн</strong>
            </div>

            <div>
                <span>Себестоимость:</span>
                <strong class="cost-price">0 грн</strong>
            </div>

            <div>
                <span>Прибыль:</span>
                <strong class="profit-price">0 грн</strong>
            </div>

        </div>

    `;


    positions.appendChild(position);

    renumberPositions();

}


/* =========================================================
   УДАЛЕНИЕ
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


    button.closest(".position").remove();

    renumberPositions();

    calculateAll();

}


/* =========================================================
   НУМЕРАЦИЯ
   ========================================================= */

function renumberPositions() {

    const positions =
        document.querySelectorAll(".position");


    positions.forEach((position, index) => {

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


/* =========================================================
   ВЫБОР КАТЕГОРИИ
   ========================================================= */

function updateProductOptions(categorySelect) {

    const position =
        categorySelect.closest(".position");

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

        return;
    }


    /* ---------- ПЕЧАТЬ НА ЧАШКЕ ---------- */

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


            <label>Сумма печати за 1 шт.</label>

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
            />


            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />


            <label>Себестоимость за 1 шт.</label>

            <input
                type="number"
                class="manual-cost"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />


            <label>Цена продажи за 1 шт.</label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

        `;

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
            />


            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />


            <label>Себестоимость за 1 шт.</label>

            <input
                type="number"
                class="manual-cost"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />


            <label>Цена продажи за 1 шт.</label>

            <input
                type="number"
                class="manual-sale"
                min="0"
                step="1"
                value="0"
                oninput="calculateAll()"
            />

        `;

        return;
    }


    /* ---------- ДИЗАЙНЕР ---------- */

    if (category === "designer") {

        manualFields.innerHTML = `

            <label>Стоимость услуги</label>

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

        return;
    }


    /* ---------- СРОЧНОСТЬ ---------- */

    if (category === "urgent") {

        manualFields.innerHTML = `

            <label>Стоимость срочности</label>

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

    }

}


/* =========================================================
   ДИПЛОМЫ
   ========================================================= */

function updateDiploma(element) {

    const position =
        element.closest(".position");

    calculatePosition(position);

}


/* =========================================================
   ГОТОВАЯ ЧАШКА
   ========================================================= */

function updateReadyCup(select) {

    const position =
        select.closest(".position");

    const cup =
        readyCups[select.value];


    const extra =
        position.querySelector(".cup-extra");


    if (!cup) {

        extra.innerHTML = "";

        calculateAll();

        return;
    }


    if (cup.colorRequired) {

        extra.innerHTML = `

            <label>Цвет чашки</label>

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
   РАСЧЁТ ОДНОЙ ПОЗИЦИИ
   ========================================================= */

function calculatePosition(position) {

    if (!position) {
        return;
    }


    const category =
        position.querySelector(
            ".category"
        )?.value;


    let sale = 0;

    let cost = 0;


    /* ---------- ДИПЛОМ ---------- */

    if (category === "diploma") {

        const type =
            position.querySelector(
                ".diploma-type"
            )?.value;


        const size =
            position.querySelector(
                ".diploma-size"
            )?.value;


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


    /* ---------- ГОТОВАЯ ЧАШКА ---------- */

    if (category === "cup_ready") {

        const cupId =
            position.querySelector(
                ".ready-cup"
            )?.value;


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


    /* ---------- ПЕЧАТЬ ЧАШКА ---------- */

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


    /* ---------- НЕСТАНДАРТНАЯ ЧАШКА ---------- */

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


    /* ---------- УПАКОВКА ---------- */

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


    /* ---------- ДИЗАЙНЕР ---------- */

    if (category === "designer") {

        sale =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;

        cost = 0;

    }


    /* ---------- СРОЧНОСТЬ ---------- */

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


    positions.forEach(position => {

        calculatePosition(position);


        const sale =
            parseFloat(
                position.querySelector(
                    ".sale-price"
                )?.textContent
            ) || 0;


        const cost =
            parseFloat(
                position.querySelector(
                    ".cost-price"
                )?.textContent
            ) || 0;


        totalSale += sale;

        totalCost += cost;

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


    positions.forEach(position => {

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
                )?.textContent || "0 грн",

            cost:
                position.querySelector(
                    ".cost-price"
                )?.textContent || "0 грн",

            profit:
                position.querySelector(
                    ".profit-price"
                )?.textContent || "0 грн"

        });

    });


    if (
        orderPositions.length === 0
    ) {

        alert(
            "Добавьте хотя бы одну позицию."
        );

        return;
    }


    const order = {

        id: Date.now(),

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
            )?.textContent || "0 грн",

        totalCost:
            document.getElementById(
                "totalCost"
            )?.textContent || "0 грн",

        totalProfit:
            document.getElementById(
                "totalProfit"
            )?.textContent || "0 грн"

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
   КАТАЛОГ
   ========================================================= */

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


const catalogTierNames = {

    "1":
        "1–2 шт.",

    "2":
        "2 шт.",

    "3-10":
        "3–10 шт.",

    "11-20":
        "11–20 шт.",

    "21-50":
        "21–50 шт.",

    "50+":
        "50+ шт."

};


/* =========================================================
   СТИЛИ КАТАЛОГА
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

        .catalog-screen {

            position: fixed;
            inset: 0;
            z-index: 9999;

            background: #f5f5f7;

            overflow-y: auto;

            padding:
                20px
                16px
                calc(100px + env(safe-area-inset-bottom));

        }


        .catalog-header {

            display: flex;
            align-items: center;
            justify-content: space-between;

            margin-bottom: 20px;

        }


        .catalog-header h2 {

            margin: 0;
            font-size: 25px;

        }


        .catalog-close {

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


        .catalog-row {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 10px;

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


        .catalog-tier {

            display: grid;

            grid-template-columns:
                90px 1fr 1fr;

            gap: 8px;

            align-items: center;

            margin-bottom: 8px;

        }


        .catalog-tier-name {

            font-size: 13px;

            color: #666;

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

    `;


    document.head.appendChild(style);

}


/* =========================================================
   ОТКРЫТИЕ КАТАЛОГА
   ========================================================= */

function openCatalog() {

    addCatalogStyles();


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


    window.scrollTo(
        0,
        0
    );

}


/* =========================================================
   ЗАКРЫТИЕ КАТАЛОГА
   ========================================================= */

function closeCatalog() {

    const screen =
        document.getElementById(
            "catalogScreen"
        );


    if (screen) {

        screen.style.display =
            "none";

    }

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
                class="catalog-close"
                onclick="closeCatalog()"
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
        diplomaPrices
    ).forEach(key => {

        const product =
            diplomaPrices[key];


        html += `

            <div class="catalog-product">

                <div class="catalog-product-name">

                    ${catalogNames[key]}

                </div>

        `;


        Object.keys(product)
            .forEach(tier => {

                const values =
                    product[tier];


                html += `

                    <div class="catalog-tier">

                        <div class="catalog-tier-name">

                            ${catalogTierNames[tier] || tier}

                        </div>


                        <div class="catalog-field">

                            <label>
                                Продажа
                            </label>

                            <input
                                type="number"
                                min="0"
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
                                data-diploma="${key}"
                                data-tier="${tier}"
                                data-type="cost"
                                value="${values.cost}"
                            />

                        </div>

                    </div>

                `;

            });


        html += `

            </div>

        `;

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
                class="catalog-save"
                onclick="saveCatalogFromScreen()"
            >
                Сохранить изменения
            </button>


            <button
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
   СОХРАНЕНИЕ КАТАЛОГА ИЗ ЭКРАНА
   ========================================================= */

function saveCatalogFromScreen() {

    const diplomaInputs =
        document.querySelectorAll(
            "[data-diploma]"
        );


    diplomaInputs.forEach(input => {

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

        }

    });


    const cupInputs =
        document.querySelectorAll(
            "[data-cup]"
        );


    cupInputs.forEach(input => {

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

    });


    saveCatalog();


    calculateAll();


    alert(
        "Цены сохранены."
    );

}


/* =========================================================
   СБРОС ЦЕН
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
   ПОДКЛЮЧЕНИЕ КНОПКИ «КАТАЛОГ»
   ========================================================= */

function setupCatalogNavigation() {

    const elements =
        document.querySelectorAll(
            "button, a"
        );


    elements.forEach(element => {

        const text =
            element.textContent
                .trim()
                .toLowerCase();


        if (
            text === "каталог"
        ) {

            element.onclick =
                function(event) {

                    event.preventDefault();

                    openCatalog();

                };

        }

    });

}


/* =========================================================
   PWA
   ========================================================= */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(() => {

                    console.log(
                        "PWA готово"
                    );

                })
                .catch(error => {

                    console.log(
                        "Ошибка PWA:",
                        error
                    );

                });

        }
    );

}


/* =========================================================
   ЗАПУСК
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        calculateAll();

        setupCatalogNavigation();

    }
);