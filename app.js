/* =========================================================
   РАСЧЁТ ЗАКАЗОВ
   ========================================================= */


/* ---------- ЦЕНЫ ДИПЛОМОВ ---------- */

const diplomaPrices = {

    diploma_uv_A5: {
        "1":  { sale: 300, cost: 240 },
        "2":  { sale: 300, cost: 240 },
        "3-10": { sale: 280, cost: 200 },
        "11-20": { sale: 260, cost: 190 },
        "21-50": { sale: 240, cost: 180 },
        "50+": { sale: 220, cost: 170 }
    },

    diploma_uv_A4: {
        "1":  { sale: 470, cost: 420 },
        "2":  { sale: 470, cost: 420 },
        "3-10": { sale: 450, cost: 400 },
        "11-20": { sale: 430, cost: 370 },
        "21-50": { sale: 410, cost: 350 },
        "50+": { sale: 390, cost: 320 }
    },

    diploma_sub_A5: {
        "1":  { sale: 300, cost: 240 },
        "2":  { sale: 300, cost: 240 },
        "3-10": { sale: 280, cost: 190 },
        "11-20": { sale: 260, cost: 180 },
        "21-50": { sale: 240, cost: 170 },
        "50+": { sale: 220, cost: 165 }
    },

    diploma_sub_A4: {
        "1":  { sale: 470, cost: 400 },
        "2":  { sale: 470, cost: 400 },
        "3-10": { sale: 450, cost: 390 },
        "11-20": { sale: 430, cost: 360 },
        "21-50": { sale: 410, cost: 340 },
        "50+": { sale: 390, cost: 310 }
    }

};


/* ---------- ГОТОВЫЕ ЧАШКИ ---------- */

const readyCups = {

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
   СОЗДАНИЕ / УДАЛЕНИЕ ПОЗИЦИЙ
   ========================================================= */

function addPosition() {

    const positions = document.getElementById("positions");

    const positionCount =
        positions.querySelectorAll(".position").length + 1;


    const position = document.createElement("div");

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


/* ---------- УДАЛЕНИЕ ---------- */

function removePosition(button) {

    const positions =
        document.querySelectorAll(".position");


    if (positions.length <= 1) {

        alert("В заказе должна остаться хотя бы одна позиция.");

        return;
    }


    button.closest(".position").remove();

    renumberPositions();

    calculateAll();

}


/* ---------- НУМЕРАЦИЯ ---------- */

function renumberPositions() {

    const positions =
        document.querySelectorAll(".position");


    positions.forEach((position, index) => {

        const title =
            position.querySelector(".position-header strong");

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
                onchange="updateDiploma()"
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
                onchange="updateDiploma()"
            >

                <option value="">
                    Выберите размер
                </option>

                <option value="A5">А5</option>
                <option value="A4">А4</option>

            </select>


            <label>Количество</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="updateDiploma()"
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

function updateDiploma() {

    const position =
        event.target.closest(".position");

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
   ОПРЕДЕЛЕНИЕ ЦЕНЫ ДИПЛОМА
   ========================================================= */

function getDiplomaPrice(type, size, quantity) {

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
        position.querySelector(".category")?.value;


    let sale = 0;
    let cost = 0;


    /* ---------- ДИПЛОМ ---------- */

    if (category === "diploma") {

        const type =
            position.querySelector(".diploma-type")?.value;

        const size =
            position.querySelector(".diploma-size")?.value;

        const quantity =
            Number(
                position.querySelector(".quantity")?.value
            ) || 0;


        if (type && size && quantity > 0) {

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
            position.querySelector(".ready-cup")?.value;

        const quantity =
            Number(
                position.querySelector(".quantity")?.value
            ) || 0;


        const cup =
            readyCups[cupId];


        if (cup && quantity > 0) {

            /*
                У готовой чашки:
                продажа = себестоимость
            */

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
                position.querySelector(".quantity")?.value
            ) || 0;

        const price =
            Number(
                position.querySelector(".manual-sale")?.value
            ) || 0;


        sale =
            price * quantity;

        /*
            Пока себестоимость печати = 0.
        */

        cost = 0;

    }


    /* ---------- НЕСТАНДАРТНАЯ ЧАШКА ---------- */

    if (category === "cup_custom") {

        const quantity =
            Number(
                position.querySelector(".quantity")?.value
            ) || 0;

        const salePrice =
            Number(
                position.querySelector(".manual-sale")?.value
            ) || 0;

        const costPrice =
            Number(
                position.querySelector(".manual-cost")?.value
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
                position.querySelector(".quantity")?.value
            ) || 0;

        const salePrice =
            Number(
                position.querySelector(".manual-sale")?.value
            ) || 0;

        const costPrice =
            Number(
                position.querySelector(".manual-cost")?.value
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
                position.querySelector(".manual-sale")?.value
            ) || 0;

        cost = 0;

    }


    /* ---------- СРОЧНОСТЬ ---------- */

    if (category === "urgent") {

        sale =
            Number(
                position.querySelector(".manual-sale")?.value
            ) || 0;

        cost = 0;

    }


    const profit =
        sale - cost;


    position.querySelector(".sale-price").textContent =
        `${sale} грн`;

    position.querySelector(".cost-price").textContent =
        `${cost} грн`;

    position.querySelector(".profit-price").textContent =
        `${profit} грн`;

}


/* =========================================================
   ОБЩИЙ РАСЧЁТ
   ========================================================= */

function calculateAll() {

    const positions =
        document.querySelectorAll(".position");


    let totalSale = 0;
    let totalCost = 0;


    positions.forEach(position => {

        calculatePosition(position);


        const sale =
            parseFloat(
                position
                    .querySelector(".sale-price")
                    .textContent
            ) || 0;


        const cost =
            parseFloat(
                position
                    .querySelector(".cost-price")
                    .textContent
            ) || 0;


        totalSale += sale;
        totalCost += cost;

    });


    const totalProfit =
        totalSale - totalCost;


    document.getElementById("totalSale").textContent =
        `${totalSale} грн`;

    document.getElementById("totalCost").textContent =
        `${totalCost} грн`;

    document.getElementById("totalProfit").textContent =
        `${totalProfit} грн`;

}


/* =========================================================
   ОЧИСТКА ЗАКАЗА
   ========================================================= */

function clearOrder() {

    const confirmed =
        confirm("Очистить текущий заказ?");


    if (!confirmed) {
        return;
    }


    document.getElementById("clientName").value = "";


    const positions =
        document.getElementById("positions");


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
        document.getElementById("clientName").value.trim();


    const positions =
        document.querySelectorAll(".position");


    const orderPositions = [];


    positions.forEach(position => {

        const category =
            position.querySelector(".category")?.value || "";


        if (!category) {
            return;
        }


        orderPositions.push({

            category: category,

            sale:
                position.querySelector(".sale-price")
                    ?.textContent || "0 грн",

            cost:
                position.querySelector(".cost-price")
                    ?.textContent || "0 грн",

            profit:
                position.querySelector(".profit-price")
                    ?.textContent || "0 грн"

        });

    });


    if (orderPositions.length === 0) {

        alert("Добавьте хотя бы одну позицию.");

        return;
    }


    const order = {

        id: Date.now(),

        date:
            new Date().toLocaleString("uk-UA"),

        client: client,

        positions: orderPositions,

        totalSale:
            document.getElementById("totalSale").textContent,

        totalCost:
            document.getElementById("totalCost").textContent,

        totalProfit:
            document.getElementById("totalProfit").textContent

    };


    const orders =
        JSON.parse(
            localStorage.getItem("orders") || "[]"
        );


    orders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    alert("Заказ сохранён.");


    clearOrder();

}


/* =========================================================
   PWA
   ========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {

                console.log("PWA готово");

            })
            .catch(error => {

                console.log(
                    "Ошибка PWA:",
                    error
                );

            });

    });

}


/* =========================================================
   ЗАПУСК
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        calculateAll();

    }
);