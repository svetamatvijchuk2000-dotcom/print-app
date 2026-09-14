/* =========================================================
   PRINT APP — РАСЧЁТ ЗАКАЗОВ + КАТАЛОГ + ЗАКАЗЫ +
   СТАТУСЫ + СТАТИСТИКА + ПОИСК
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


/* =========================================================
   СТАТУСЫ
   ========================================================= */

const ORDER_STATUSES = [
    "Новый",
    "В работе",
    "Готов",
    "Выдан",
    "Отменён"
];


/* =========================================================
   КАТАЛОГ
   ========================================================= */

let diplomaPrices = {};
let readyCups = {};


/* =========================================================
   ЗАГРУЗКА КАТАЛОГА
   ========================================================= */

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


        /*
           Совместимость со старой версией.

           Раньше чашки хранились так:

           price: 159

           Теперь:

           sale: 159
           cost: 159
        */

        Object.keys(readyCups).forEach(key => {

            const cup = readyCups[key];

            if (!cup) {
                return;
            }

            if (
                cup.sale === undefined ||
                cup.sale === null
            ) {

                cup.sale =
                    Number(
                        cup.price
                    ) || 0;

            }

            if (
                cup.cost === undefined ||
                cup.cost === null
            ) {

                cup.cost =
                    Number(
                        cup.price
                    ) || 0;

            }

        });


        /*
           Гарантируем наличие всех новых
           стандартных товаров.
        */

        Object.keys(DEFAULT_READY_CUPS).forEach(key => {

            if (!readyCups[key]) {

                readyCups[key] =
                    JSON.parse(
                        JSON.stringify(
                            DEFAULT_READY_CUPS[key]
                        )
                    );

            }

        });

    } catch (error) {

        console.error(
            "Ошибка загрузки каталога:",
            error
        );

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

    }

}


loadCatalog();


/* =========================================================
   СОХРАНЕНИЕ КАТАЛОГА
   ========================================================= */

function saveCatalog() {

    localStorage.setItem(
        "diplomaPrices",
        JSON.stringify(
            diplomaPrices
        )
    );

    localStorage.setItem(
        "readyCups",
        JSON.stringify(
            readyCups
        )
    );

}


/* =========================================================
   СОЗДАНИЕ ПОЗИЦИИ
   ========================================================= */

function addPosition() {

    const positions =
        document.getElementById(
            "positions"
        );

    if (!positions) {
        return;
    }


    const positionCount =
        positions.querySelectorAll(
            ".position"
        ).length + 1;


    const position =
        document.createElement(
            "div"
        );


    position.className =
        "position";


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
                <span>
                    Цена продажи:
                </span>

                <strong class="sale-price">
                    0 грн
                </strong>
            </div>


            <div>
                <span>
                    Себестоимость:
                </span>

                <strong class="cost-price">
                    0 грн
                </strong>
            </div>


            <div>
                <span>
                    Прибыль:
                </span>

                <strong class="profit-price">
                    0 грн
                </strong>
            </div>

        </div>

    `;


    positions.appendChild(
        position
    );


    renumberPositions();

}


/* =========================================================
   УДАЛЕНИЕ ПОЗИЦИИ
   ========================================================= */

function removePosition(button) {

    const positions =
        document.querySelectorAll(
            ".position"
        );


    if (
        positions.length <= 1
    ) {

        alert(
            "В заказе должна остаться хотя бы одна позиция."
        );

        return;

    }


    const position =
        button.closest(
            ".position"
        );


    if (position) {

        position.remove();

    }


    renumberPositions();

    calculateAll();

}


/* =========================================================
   НУМЕРАЦИЯ ПОЗИЦИЙ
   ========================================================= */

function renumberPositions() {

    const positions =
        document.querySelectorAll(
            ".position"
        );


    positions.forEach(
        (
            position,
            index
        ) => {

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

function updateProductOptions(
    categorySelect
) {

    const position =
        categorySelect.closest(
            ".position"
        );


    if (!position) {
        return;
    }


    const category =
        categorySelect.value;


    const productArea =
        position.querySelector(
            ".product-area"
        );


    const manualFields =
        position.querySelector(
            ".manual-fields"
        );


    productArea.innerHTML = "";

    manualFields.innerHTML = "";


    /* =====================================================
       ДИПЛОМЫ
       ===================================================== */

    if (
        category === "diploma"
    ) {

        productArea.innerHTML = `

            <label>
                Вид диплома
            </label>


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


            <label>
                Размер
            </label>


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


            <label>
                Количество
            </label>


            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="updateDiploma(this)"
            />


            <div class="manual-price-box">

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

            </div>

        `;


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       ГОТОВЫЕ ЧАШКИ
       ===================================================== */

    if (
        category === "cup_ready"
    ) {

        productArea.innerHTML = `

            <label>
                Вид чашки
            </label>


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


            <label>
                Количество
            </label>


            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                oninput="calculateAll()"
            />


            <div class="manual-price-box">

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

            </div>

        `;


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       ПЕЧАТЬ ЧАШКА
       ===================================================== */

    if (
        category === "cup_print"
    ) {

        manualFields.innerHTML = `

            <label>
                Количество
            </label>


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


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       НЕСТАНДАРТНАЯ ЧАШКА
       ===================================================== */

    if (
        category === "cup_custom"
    ) {

        manualFields.innerHTML = `

            <label>
                Какая чашка
            </label>


            <input
                type="text"
                class="description"
                placeholder="Например: кружка стекло 350 мл"
                oninput="calculateAll()"
            />


            <label>
                Количество
            </label>


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


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       УПАКОВКА
       ===================================================== */

    if (
        category === "packaging"
    ) {

        manualFields.innerHTML = `

            <label>
                Вид упаковки
            </label>


            <input
                type="text"
                class="description"
                placeholder="Например: коробка для кружки"
                oninput="calculateAll()"
            />


            <label>
                Количество
            </label>


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


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       ДИЗАЙНЕР
       ===================================================== */

    if (
        category === "designer"
    ) {

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


        calculatePosition(
            position
        );

        return;

    }


    /* =====================================================
       СРОЧНОСТЬ
       ===================================================== */

    if (
        category === "urgent"
    ) {

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


        calculatePosition(
            position
        );

    }

}


/* =========================================================
   ДИПЛОМ
   ========================================================= */

function updateDiploma(element) {

    const position =
        element.closest(
            ".position"
        );


    if (!position) {
        return;
    }


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


    const saleInput =
        position.querySelector(
            ".manual-sale"
        );


    const costInput =
        position.querySelector(
            ".manual-cost"
        );


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

            if (saleInput) {

                saleInput.value =
                    price.sale;

            }


            if (costInput) {

                costInput.value =
                    price.cost;

            }

        }

    }


    calculateAll();

}


/* =========================================================
   ГОТОВАЯ ЧАШКА
   ========================================================= */

function updateReadyCup(select) {

    const position =
        select.closest(
            ".position"
        );


    if (!position) {
        return;
    }


    const cup =
        readyCups[
            select.value
        ];


    const extra =
        position.querySelector(
            ".cup-extra"
        );


    const saleInput =
        position.querySelector(
            ".manual-sale"
        );


    const costInput =
        position.querySelector(
            ".manual-cost"
        );


    if (!cup) {

        if (extra) {
            extra.innerHTML = "";
        }

        if (saleInput) {
            saleInput.value = 0;
        }

        if (costInput) {
            costInput.value = 0;
        }

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


    if (saleInput) {

        saleInput.value =
            Number(
                cup.sale
            ) || 0;

    }


    if (costInput) {

        costInput.value =
            Number(
                cup.cost
            ) || 0;

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


    if (
        quantity <= 2
    ) {

        return prices["1"];

    }


    if (
        quantity <= 10
    ) {

        return prices["3-10"];

    }


    if (
        quantity <= 20
    ) {

        return prices["11-20"];

    }


    if (
        quantity <= 50
    ) {

        return prices["21-50"];

    }


    return prices["50+"];

}


/* =========================================================
   РАСЧЁТ ПОЗИЦИИ
   ========================================================= */

function calculatePosition(
    position
) {

    if (!position) {
        return {
            sale: 0,
            cost: 0,
            profit: 0
        };
    }


    const category =
        position.querySelector(
            ".category"
        )?.value || "";


    let sale = 0;
    let cost = 0;


    /* =====================================================
       ДИПЛОМ
       ===================================================== */

    if (
        category === "diploma"
    ) {

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
            salePrice *
            quantity;


        cost =
            costPrice *
            quantity;

    }


    /* =====================================================
       ГОТОВАЯ ЧАШКА
       ===================================================== */

    if (
        category === "cup_ready"
    ) {

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
            salePrice *
            quantity;


        cost =
            costPrice *
            quantity;

    }


    /* =====================================================
       ПЕЧАТЬ ЧАШКА
       ===================================================== */

    if (
        category === "cup_print"
    ) {

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
            price *
            quantity;


        cost = 0;

    }


    /* =====================================================
       НЕСТАНДАРТНАЯ ЧАШКА
       ===================================================== */

    if (
        category === "cup_custom"
    ) {

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
            salePrice *
            quantity;


        cost =
            costPrice *
            quantity;

    }


    /* =====================================================
       УПАКОВКА
       ===================================================== */

    if (
        category === "packaging"
    ) {

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
            salePrice *
            quantity;


        cost =
            costPrice *
            quantity;

    }


    /* =====================================================
       ДИЗАЙНЕР
       ===================================================== */

    if (
        category === "designer"
    ) {

        sale =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;


        cost = 0;

    }


    /* =====================================================
       СРОЧНОСТЬ
       ===================================================== */

    if (
        category === "urgent"
    ) {

        sale =
            Number(
                position.querySelector(
                    ".manual-sale"
                )?.value
            ) || 0;


        cost = 0;

    }


    const profit =
        sale -
        cost;


    /* =====================================================
       СОХРАНЯЕМ ЧИСЛОВЫЕ ЗНАЧЕНИЯ
       ===================================================== */

    position.dataset.sale =
        sale;


    position.dataset.cost =
        cost;


    position.dataset.profit =
        profit;


    /* =====================================================
       ПОКАЗЫВАЕМ
       ===================================================== */

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


    return {
        sale,
        cost,
        profit
    };

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

            const result =
                calculatePosition(
                    position
                );


            totalSale +=
                Number(
                    result.sale
                ) || 0;


            totalCost +=
                Number(
                    result.cost
                ) || 0;

        }
    );


    const totalProfit =
        totalSale -
        totalCost;


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


    return {
        sale: totalSale,
        cost: totalCost,
        profit: totalProfit
    };

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
   ПОЛУЧЕНИЕ СЛЕДУЮЩЕГО НОМЕРА ЗАКАЗА
   ========================================================= */

function getNextOrderNumber() {

    const orders =
        getOrders();


    let maxNumber = 0;


    orders.forEach(
        order => {

            const number =
                parseInt(
                    String(
                        order.number || ""
                    ).replace(
                        /\D/g,
                        ""
                    ),
                    10
                );


            if (
                !isNaN(number) &&
                number > maxNumber
            ) {

                maxNumber =
                    number;

            }

        }
    );


    return String(
        maxNumber + 1
    ).padStart(
        4,
        "0"
    );

}


/* =========================================================
   ПОЛУЧЕНИЕ ЧИСЛА ИЗ СТРОКИ
   ========================================================= */

function parseMoney(value) {

    if (
        typeof value ===
        "number"
    ) {

        return value;

    }


    const number =
        parseFloat(
            String(
                value || ""
            )
            .replace(
                /[^\d.,-]/g,
                ""
            )
            .replace(
                ",",
                "."
            )
        );


    return isNaN(number)
        ? 0
        : number;

}


/* =========================================================
   СОХРАНЕНИЕ ЗАКАЗА
   ========================================================= */

function saveOrder() {

    const totals =
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


            const sale =
                Number(
                    position.dataset.sale
                ) || 0;


            const cost =
                Number(
                    position.dataset.cost
                ) || 0;


            const profit =
                Number(
                    position.dataset.profit
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

                sale,

                cost,

                profit

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


    const now =
        Date.now();


    const order = {

        id:
            now,

        number:
            getNextOrderNumber(),

        createdAt:
            now,

        date:
            new Date(
                now
            ).toLocaleString(
                "uk-UA"
            ),

        client,

        status:
            "Новый",

        positions:
            orderPositions,

        saleTotal:
            totals.sale,

        costTotal:
            totals.cost,

        profitTotal:
            totals.profit,

        /*
           Старые названия полей
           сохраняем для совместимости.
        */

        totalSale:
            `${totals.sale} грн`,

        totalCost:
            `${totals.cost} грн`,

        totalProfit:
            `${totals.profit} грн`

    };


    const orders =
        getOrders();


    orders.push(
        order
    );


    localStorage.setItem(
        "orders",
        JSON.stringify(
            orders
        )
    );


    alert(
        `Заказ №${order.number} сохранён.`
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


/* =========================================================
   НАЗВАНИЯ КАТАЛОГА
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


/* =========================================================
   ДИАПАЗОНЫ
   ========================================================= */

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
        .order-details-screen,
        .statistics-screen,
        .settings-screen {

            position: fixed;
            inset: 0;

            z-index: 99999;

            background: #f5f5f7;

            overflow-y: auto;

            padding:
                20px
                16px
                calc(110px + env(safe-area-inset-bottom));

            -webkit-overflow-scrolling: touch;

        }


        .catalog-header,
        .orders-header,
        .statistics-header,
        .settings-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 12px;

            margin-bottom: 20px;

        }


        .catalog-header h2,
        .orders-header h2,
        .statistics-header h2,
        .settings-header h2 {

            margin: 0;

            font-size: 25px;

        }


        .catalog-close,
        .orders-close,
        .statistics-close,
        .settings-close {

            border: none;

            background: #e5e5ea;

            width: 42px;

            height: 42px;

            border-radius: 50%;

            font-size: 25px;

        }


        .catalog-section,
        .stats-card,
        .settings-card {

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


        .catalog-field input,
        .orders-search input,
        .orders-filter select,
        .stats-filter select {

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

            grid-template-columns: 1fr 1fr;

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


        /* =================================================
           ДОПОЛНИТЕЛЬНАЯ НАВИГАЦИЯ
           ================================================= */

        .extra-bottom-nav {

            position: fixed;

            left: 10px;

            right: 10px;

            bottom:
                calc(
                    10px +
                    env(safe-area-inset-bottom)
                );

            z-index: 100001;

            display: grid;

            grid-template-columns:
                repeat(5, 1fr);

            gap: 5px;

            padding: 7px;

            background:
                rgba(255,255,255,.96);

            border:
                1px solid #ddd;

            border-radius: 18px;

            box-shadow:
                0 5px 25px
                rgba(0,0,0,.12);

        }


        .extra-nav-item {

            border: none;

            background: transparent;

            border-radius: 12px;

            padding: 7px 2px;

            font-size: 11px;

            color: #666;

        }


        .extra-nav-item.active {

            background: #111;

            color: white;

        }


        /* =================================================
           ЗАКАЗЫ
           ================================================= */

        .orders-tools {

            background: white;

            border-radius: 18px;

            padding: 14px;

            margin-bottom: 16px;

            box-shadow:
                0 2px 10px
                rgba(0,0,0,.05);

        }


        .orders-search {

            margin-bottom: 10px;

        }


        .orders-filter {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 8px;

        }


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


        .order-number {

            font-size: 13px;

            font-weight: 700;

            color: #555;

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

            margin-bottom: 12px;

        }


        .status-select {

            width: 100%;

            padding: 10px;

            border:
                1px solid #ddd;

            border-radius: 10px;

            background: #fafafa;

            font-size: 15px;

            margin-bottom: 12px;

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


        /* =================================================
           ДЕТАЛИ
           ================================================= */

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

            border-top:
                1px solid #eee;

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


        /* =================================================
           СТАТИСТИКА
           ================================================= */

        .stats-filter {

            background: white;

            border-radius: 18px;

            padding: 14px;

            margin-bottom: 16px;

        }


        .stats-grid {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 10px;

        }


        .stats-number {

            font-size: 24px;

            font-weight: 700;

            margin-top: 5px;

        }


        .stats-label {

            color: #777;

            font-size: 13px;

        }


        .stats-status-row {

            display: flex;

            justify-content: space-between;

            padding: 10px 0;

            border-bottom:
                1px solid #eee;

        }


        .stats-status-row:last-child {

            border-bottom: none;

        }


        /* =================================================
           НАСТРОЙКИ
           ================================================= */

        .settings-button {

            width: 100%;

            border: none;

            border-radius: 14px;

            padding: 14px;

            background: #111;

            color: white;

            font-size: 16px;

        }


        .settings-danger {

            background: #d00;

        }


        /* =================================================
           ЦЕНЫ В ЗАКАЗЕ
           ================================================= */

        .manual-price-box {

            margin-top: 12px;

            padding: 12px;

            background: #f7f7f7;

            border-radius: 12px;

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   НИЖНЯЯ НАВИГАЦИЯ ДЛЯ ДОПОЛНИТЕЛЬНЫХ ЭКРАНОВ
   ========================================================= */

function getBottomNavigation(
    active = ""
) {

    return `

        <div class="extra-bottom-nav">

            <button
                type="button"
                class="extra-nav-item ${active === "Заказ" ? "active" : ""}"
                data-nav="Заказ"
                onclick="showOrder()"
            >
                ＋<br>
                Заказ
            </button>


            <button
                type="button"
                class="extra-nav-item ${active === "Каталог" ? "active" : ""}"
                data-nav="Каталог"
                onclick="showCatalog()"
            >
                📦<br>
                Каталог
            </button>


            <button
                type="button"
                class="extra-nav-item ${active === "Заказы" ? "active" : ""}"
                data-nav="Заказы"
                onclick="showOrders()"
            >
                📋<br>
                Заказы
            </button>


            <button
                type="button"
                class="extra-nav-item ${active === "Статистика" ? "active" : ""}"
                data-nav="Статистика"
                onclick="showStatistics()"
            >
                📊<br>
                Статистика
            </button>


            <button
                type="button"
                class="extra-nav-item ${active === "Настройки" ? "active" : ""}"
                data-nav="Настройки"
                onclick="showSettings()"
            >
                ⚙️<br>
                Настройки
            </button>

        </div>

    `;

}


/* =========================================================
   ДОБАВИТЬ НАВИГАЦИЮ НА ЭКРАН
   ========================================================= */

function addExtraNavigation(
    screen,
    active
) {

    if (!screen) {
        return;
    }


    const oldNav =
        screen.querySelector(
            ".extra-bottom-nav"
        );


    if (oldNav) {
        oldNav.remove();
    }


    screen.insertAdjacentHTML(
        "beforeend",
        getBottomNavigation(
            active
        )
    );

}


/* =========================================================
   КАТАЛОГ
   ========================================================= */

function openCatalog() {

    addCatalogStyles();

    closeOrders();
    closeOrderDetails();
    closeStatistics();
    closeSettings();


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


    setActiveNav(
        "Каталог"
    );

}


/* =========================================================
   ЗАКРЫТЬ КАТАЛОГ
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
   РЕНДЕР КАТАЛОГА
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

            <h2>
                Каталог
            </h2>

            <button
                type="button"
                class="catalog-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>


        <div class="catalog-note">

            Здесь можно менять цену продажи
            и себестоимость.
            Изменения сохраняются на этом телефоне
            и используются в новых заказах.

        </div>


        <div class="catalog-section">

            <h3>
                Дипломы
            </h3>

    `;


    Object.keys(
        catalogNames
    ).forEach(
        key => {

            const product =
                diplomaPrices[key];


            if (!product) {
                return;
            }


            html += `

                <div class="catalog-product">

                    <div class="catalog-product-name">
                        ${escapeHtml(
                            catalogNames[key]
                        )}
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
                                    value="${Number(values.sale) || 0}"
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
                                    value="${Number(values.cost) || 0}"
                                />

                            </div>

                        </div>

                    `;

                }
            );


            html += `
                </div>
            `;

        }
    );


    html += `

        </div>


        <div class="catalog-section">

            <h3>
                Готовые чашки
            </h3>

    `;


    Object.keys(
        readyCups
    ).forEach(
        key => {

            const cup =
                readyCups[key];


            html += `

                <div class="catalog-product">

                    <div class="catalog-product-name">

                        ${escapeHtml(
                            cup.name
                        )}

                    </div>


                    <div class="catalog-row">

                        <div class="catalog-field">

                            <label>
                                Цена продажи
                            </label>


                            <input
                                type="number"
                                min="0"
                                step="1"
                                data-cup="${key}"
                                data-type="sale"
                                value="${Number(cup.sale) || 0}"
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
                                data-cup="${key}"
                                data-type="cost"
                                value="${Number(cup.cost) || 0}"
                            />

                        </div>

                    </div>

                </div>

            `;

        }
    );


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


    addExtraNavigation(
        screen,
        "Каталог"
    );

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


                /*
                   1–2 диапазон один
                   и тот же для 1 и 2 шт.
                */

                if (
                    tier === "1"
                ) {

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


            const type =
                input.dataset.type;


            const value =
                Number(
                    input.value
                ) || 0;


            if (
                readyCups[key]
            ) {

                readyCups[key][type] =
                    value;

            }

        }
    );


    saveCatalog();


    calculateAll();


    renderCatalog();


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
   ПОЛУЧИТЬ ДАТУ ЗАКАЗА
   ========================================================= */

function getOrderTimestamp(
    order
) {

    if (
        order.createdAt
    ) {

        return Number(
            order.createdAt
        ) || 0;

    }


    if (
        order.id
    ) {

        return Number(
            order.id
        ) || 0;

    }


    return 0;

}


/* =========================================================
   ПОЛУЧИТЬ ПРОДАЖУ
   ========================================================= */

function getOrderSale(
    order
) {

    if (
        order.saleTotal !== undefined
    ) {

        return Number(
            order.saleTotal
        ) || 0;

    }


    return parseMoney(
        order.totalSale
    );

}


/* =========================================================
   ПОЛУЧИТЬ СЕБЕСТОИМОСТЬ
   ========================================================= */

function getOrderCost(
    order
) {

    if (
        order.costTotal !== undefined
    ) {

        return Number(
            order.costTotal
        ) || 0;

    }


    return parseMoney(
        order.totalCost
    );

}


/* =========================================================
   ПОЛУЧИТЬ ПРИБЫЛЬ
   ========================================================= */

function getOrderProfit(
    order
) {

    if (
        order.profitTotal !== undefined
    ) {

        return Number(
            order.profitTotal
        ) || 0;

    }


    return parseMoney(
        order.totalProfit
    );

}


/* =========================================================
   СТАТУС ЗАКАЗА
   ========================================================= */

function getOrderStatus(
    order
) {

    if (
        ORDER_STATUSES.includes(
            order.status
        )
    ) {

        return order.status;

    }


    return "Новый";

}


/* =========================================================
   ОТКРЫТЬ ЗАКАЗЫ
   ========================================================= */

function openOrders() {

    addCatalogStyles();


    closeCatalog();
    closeOrderDetails();
    closeStatistics();
    closeSettings();


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


    setActiveNav(
        "Заказы"
    );

}


/* =========================================================
   ИЗМЕНЕНИЕ СТАТУСА
   ========================================================= */

function changeOrderStatus(
    orderId,
    status
) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {
        return;
    }


    order.status =
        status;


    localStorage.setItem(
        "orders",
        JSON.stringify(
            orders
        )
    );


    renderOrders();

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

            <h2>
                Заказы
            </h2>


            <button
                type="button"
                class="orders-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>


        <div class="orders-tools">

            <div class="orders-search">

                <input
                    type="search"
                    id="orderSearch"
                    placeholder="Поиск по номеру или клиенту"
                    oninput="renderOrdersList()"
                />

            </div>


            <div class="orders-filter">

                <select
                    id="orderStatusFilter"
                    onchange="renderOrdersList()"
                >

                    <option value="">
                        Все статусы
                    </option>

                    ${ORDER_STATUSES.map(
                        status => `
                            <option value="${escapeHtml(status)}">
                                ${escapeHtml(status)}
                            </option>
                        `
                    ).join("")}

                </select>


                <select
                    id="orderSort"
                    onchange="renderOrdersList()"
                >

                    <option value="newest">
                        Сначала новые
                    </option>

                    <option value="oldest">
                        Сначала старые
                    </option>

                    <option value="sale">
                        По продаже
                    </option>

                    <option value="profit">
                        По прибыли
                    </option>

                </select>

            </div>

        </div>


        <div id="ordersList">
        </div>

    `;


    screen.innerHTML =
        html;


    renderOrdersList();


    addExtraNavigation(
        screen,
        "Заказы"
    );

}


/* =========================================================
   СПИСОК ЗАКАЗОВ
   ========================================================= */

function renderOrdersList() {

    const container =
        document.getElementById(
            "ordersList"
        );


    if (!container) {
        return;
    }


    const search =
        document.getElementById(
            "orderSearch"
        )?.value
        .trim()
        .toLowerCase() || "";


    const statusFilter =
        document.getElementById(
            "orderStatusFilter"
        )?.value || "";


    const sort =
        document.getElementById(
            "orderSort"
        )?.value || "newest";


    let orders =
        getOrders();


    orders =
        orders.filter(
            order => {

                const client =
                    String(
                        order.client ||
                        ""
                    ).toLowerCase();


                const number =
                    String(
                        order.number ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    client.includes(
                        search
                    ) ||
                    number.includes(
                        search
                    );


                const matchesStatus =
                    !statusFilter ||
                    getOrderStatus(
                        order
                    ) ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    orders.sort(
        (
            a,
            b
        ) => {

            if (
                sort === "oldest"
            ) {

                return (
                    getOrderTimestamp(a) -
                    getOrderTimestamp(b)
                );

            }


            if (
                sort === "sale"
            ) {

                return (
                    getOrderSale(b) -
                    getOrderSale(a)
                );

            }


            if (
                sort === "profit"
            ) {

                return (
                    getOrderProfit(b) -
                    getOrderProfit(a)
                );

            }


            return (
                getOrderTimestamp(b) -
                getOrderTimestamp(a)
            );

        }
    );


    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="orders-empty">

                <div style="font-size:40px;">
                    📋
                </div>


                <p>
                    Заказов по заданным условиям нет.
                </p>

            </div>

        `;


        return;

    }


    let html = "";


    orders.forEach(
        order => {

            const client =
                order.client ||
                "Без имени";


            const sale =
                getOrderSale(
                    order
                );


            const profit =
                getOrderProfit(
                    order
                );


            const status =
                getOrderStatus(
                    order
                );


            const number =
                order.number ||
                "—";


            html += `

                <div class="order-card">

                    <div class="order-card-top">

                        <div>

                            <div class="order-number">
                                Заказ №${escapeHtml(number)}
                            </div>


                            <div class="order-card-client">
                                ${escapeHtml(client)}
                            </div>

                        </div>

                    </div>


                    <div class="order-card-date">

                        ${escapeHtml(
                            order.date ||
                            ""
                        )}

                    </div>


                    <div class="order-card-total">

                        Продажа:
                        ${sale} грн

                    </div>


                    <div class="order-card-profit">

                        Прибыль:
                        ${profit} грн

                    </div>


                    <select
                        class="status-select"
                        onchange="changeOrderStatus(${Number(order.id)}, this.value)"
                    >

                        ${ORDER_STATUSES.map(
                            item => `
                                <option
                                    value="${escapeHtml(item)}"
                                    ${item === status ? "selected" : ""}
                                >
                                    ${escapeHtml(item)}
                                </option>
                            `
                        ).join("")}

                    </select>


                    <div class="order-card-buttons">

                        <button
                            type="button"
                            class="order-view-button"
                            onclick="openOrderDetails(${Number(order.id)})"
                        >
                            Открыть
                        </button>


                        <button
                            type="button"
                            class="order-delete-button"
                            onclick="deleteOrder(${Number(order.id)})"
                        >
                            Удалить
                        </button>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


/* =========================================================
   ДЕТАЛИ ЗАКАЗА
   ========================================================= */

function openOrderDetails(
    orderId
) {

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


    addCatalogStyles();


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


    const status =
        getOrderStatus(
            order
        );


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

                Заказ №
                ${escapeHtml(
                    order.number ||
                    "—"
                )}

            </h3>


            <div>

                Клиент:
                ${escapeHtml(
                    order.client ||
                    "Без имени"
                )}

            </div>


            <div>

                Дата:
                ${escapeHtml(
                    order.date ||
                    ""
                )}

            </div>


            <div style="margin-top:12px;">

                <label>
                    Статус
                </label>


                <select
                    class="status-select"
                    onchange="changeOrderStatusFromDetails(${Number(order.id)}, this.value)"
                >

                    ${ORDER_STATUSES.map(
                        item => `
                            <option
                                value="${escapeHtml(item)}"
                                ${item === status ? "selected" : ""}
                            >
                                ${escapeHtml(item)}
                            </option>
                        `
                    ).join("")}

                </select>

            </div>

        </div>


        <div class="details-card">

            <h3>
                Позиции
            </h3>

    `;


    (
        order.positions ||
        []
    ).forEach(
        (
            position,
            index
        ) => {

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


                if (
                    position.diplomaSize
                ) {

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


                if (
                    position.cupColor
                ) {

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


            const sale =
                Number(
                    position.sale
                ) ||
                parseMoney(
                    position.sale
                );


            const cost =
                Number(
                    position.cost
                ) ||
                parseMoney(
                    position.cost
                );


            const profit =
                Number(
                    position.profit
                ) ||
                parseMoney(
                    position.profit
                );


            html += `

                <div class="details-position">

                    <div class="details-position-name">

                        ${index + 1}.
                        ${escapeHtml(
                            title
                        )}

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
                            ${sale} грн
                        </strong>

                    </div>


                    <div class="details-line">

                        <span>
                            Себестоимость
                        </span>

                        <strong>
                            ${cost} грн
                        </strong>

                    </div>


                    <div class="details-line">

                        <span>
                            Прибыль
                        </span>

                        <strong>
                            ${profit} грн
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

                    ${getOrderSale(order)}
                    грн

                </strong>

            </div>


            <div class="details-line">

                <span>
                    Себестоимость
                </span>


                <strong>

                    ${getOrderCost(order)}
                    грн

                </strong>

            </div>


            <div class="details-line">

                <span>
                    Прибыль
                </span>


                <strong>

                    ${getOrderProfit(order)}
                    грн

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


    addExtraNavigation(
        screen,
        "Заказы"
    );


    setActiveNav(
        "Заказы"
    );

}


/* =========================================================
   СТАТУС ИЗ ДЕТАЛЕЙ
   ========================================================= */

function changeOrderStatusFromDetails(
    orderId,
    status
) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {
        return;
    }


    order.status =
        status;


    localStorage.setItem(
        "orders",
        JSON.stringify(
            orders
        )
    );


    openOrderDetails(
        orderId
    );

}


/* =========================================================
   УДАЛЕНИЕ ЗАКАЗА
   ========================================================= */

function deleteOrder(
    orderId
) {

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
        JSON.stringify(
            orders
        )
    );


    renderOrders();

}


/* =========================================================
   ЗАКРЫТЬ ЗАКАЗЫ
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
   СТАТИСТИКА
   ========================================================= */

function openStatistics() {

    addCatalogStyles();


    closeCatalog();
    closeOrders();
    closeOrderDetails();
    closeSettings();


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
            "statisticsScreen"
        );


    if (!screen) {

        screen =
            document.createElement(
                "div"
            );


        screen.id =
            "statisticsScreen";


        screen.className =
            "statistics-screen";


        document.body.appendChild(
            screen
        );

    }


    renderStatistics();


    screen.style.display =
        "block";


    document.body.style.overflow =
        "hidden";


    setActiveNav(
        "Статистика"
    );

}


/* =========================================================
   ЗАКРЫТЬ СТАТИСТИКУ
   ========================================================= */

function closeStatistics() {

    const screen =
        document.getElementById(
            "statisticsScreen"
        );


    if (screen) {

        screen.style.display =
            "none";

    }

}


/* =========================================================
   ФИЛЬТР СТАТИСТИКИ
   ========================================================= */

function getStatisticsStart(
    period
) {

    const now =
        new Date();


    if (
        period === "today"
    ) {

        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

    }


    if (
        period === "7days"
    ) {

        return (
            Date.now() -
            7 * 24 * 60 * 60 * 1000
        );

    }


    if (
        period === "month"
    ) {

        return new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        ).getTime();

    }


    return 0;

}


/* =========================================================
   РЕНДЕР СТАТИСТИКИ
   ========================================================= */

function renderStatistics() {

    const screen =
        document.getElementById(
            "statisticsScreen"
        );


    if (!screen) {
        return;
    }


    const period =
        document.getElementById(
            "statisticsPeriod"
        )?.value ||
        "all";


    const start =
        getStatisticsStart(
            period
        );


    const orders =
        getOrders().filter(
            order =>
                getOrderTimestamp(
                    order
                ) >= start
        );


    let sale = 0;
    let cost = 0;
    let profit = 0;


    orders.forEach(
        order => {

            sale +=
                getOrderSale(
                    order
                );


            cost +=
                getOrderCost(
                    order
                );


            profit +=
                getOrderProfit(
                    order
                );

        }
    );


    const average =
        orders.length
            ? sale / orders.length
            : 0;


    const margin =
        sale
            ? (
                profit /
                sale *
                100
            )
            : 0;


    const statusCounts = {};


    ORDER_STATUSES.forEach(
        status => {

            statusCounts[status] =
                0;

        }
    );


    orders.forEach(
        order => {

            const status =
                getOrderStatus(
                    order
                );


            statusCounts[status] =
                (
                    statusCounts[status] ||
                    0
                ) + 1;

        }
    );


    let html = `

        <div class="statistics-header">

            <h2>
                Статистика
            </h2>


            <button
                type="button"
                class="statistics-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>


        <div class="stats-filter">

            <label>
                Период
            </label>


            <select
                id="statisticsPeriod"
                onchange="renderStatistics()"
            >

                <option
                    value="all"
                    ${period === "all" ? "selected" : ""}
                >
                    Всё время
                </option>


                <option
                    value="today"
                    ${period === "today" ? "selected" : ""}
                >
                    Сегодня
                </option>


                <option
                    value="7days"
                    ${period === "7days" ? "selected" : ""}
                >
                    Последние 7 дней
                </option>


                <option
                    value="month"
                    ${period === "month" ? "selected" : ""}
                >
                    Текущий месяц
                </option>

            </select>

        </div>


        <div class="stats-grid">

            <div class="stats-card">

                <div class="stats-label">
                    Заказов
                </div>

                <div class="stats-number">
                    ${orders.length}
                </div>

            </div>


            <div class="stats-card">

                <div class="stats-label">
                    Продажи
                </div>

                <div class="stats-number">
                    ${roundMoney(sale)} грн
                </div>

            </div>


            <div class="stats-card">

                <div class="stats-label">
                    Себестоимость
                </div>

                <div class="stats-number">
                    ${roundMoney(cost)} грн
                </div>

            </div>


            <div class="stats-card">

                <div class="stats-label">
                    Прибыль
                </div>

                <div class="stats-number">
                    ${roundMoney(profit)} грн
                </div>

            </div>


            <div class="stats-card">

                <div class="stats-label">
                    Средний заказ
                </div>

                <div class="stats-number">
                    ${roundMoney(average)} грн
                </div>

            </div>


            <div class="stats-card">

                <div class="stats-label">
                    Маржа
                </div>

                <div class="stats-number">
                    ${roundMoney(margin)}%
                </div>

            </div>

        </div>


        <div class="stats-card">

            <h3>
                Заказы по статусам
            </h3>

    `;


    ORDER_STATUSES.forEach(
        status => {

            html += `

                <div class="stats-status-row">

                    <span>
                        ${escapeHtml(status)}
                    </span>


                    <strong>
                        ${statusCounts[status] || 0}
                    </strong>

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    screen.innerHTML =
        html;


    addExtraNavigation(
        screen,
        "Статистика"
    );

}


/* =========================================================
   ОКРУГЛЕНИЕ
   ========================================================= */

function roundMoney(
    value
) {

    return Number(
        Number(value || 0)
            .toFixed(2)
    );

}


/* =========================================================
   НАСТРОЙКИ
   ========================================================= */

function openSettings() {

    addCatalogStyles();


    closeCatalog();
    closeOrders();
    closeOrderDetails();
    closeStatistics();


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
            "settingsScreen"
        );


    if (!screen) {

        screen =
            document.createElement(
                "div"
            );


        screen.id =
            "settingsScreen";


        screen.className =
            "settings-screen";


        document.body.appendChild(
            screen
        );

    }


    renderSettings();


    screen.style.display =
        "block";


    document.body.style.overflow =
        "hidden";


    setActiveNav(
        "Настройки"
    );

}


/* =========================================================
   ЗАКРЫТЬ НАСТРОЙКИ
   ========================================================= */

function closeSettings() {

    const screen =
        document.getElementById(
            "settingsScreen"
        );


    if (screen) {

        screen.style.display =
            "none";

    }

}


/* =========================================================
   РЕНДЕР НАСТРОЕК
   ========================================================= */

function renderSettings() {

    const screen =
        document.getElementById(
            "settingsScreen"
        );


    if (!screen) {
        return;
    }


    const ordersCount =
        getOrders().length;


    screen.innerHTML = `

        <div class="settings-header">

            <h2>
                Настройки
            </h2>


            <button
                type="button"
                class="settings-close"
                onclick="showOrder()"
            >
                ×
            </button>

        </div>


        <div class="settings-card">

            <h3>
                Заказы
            </h3>


            <p>
                Сохранено заказов:
                <strong>
                    ${ordersCount}
                </strong>
            </p>


            <button
                type="button"
                class="settings-button settings-danger"
                onclick="deleteAllOrders()"
            >
                Удалить все заказы
            </button>

        </div>


        <div class="settings-card">

            <h3>
                О приложении
            </h3>


            <p>
                Локальный калькулятор заказов
                для печати и сувенирной продукции.
            </p>


            <p>
                Данные сохраняются
                на этом устройстве.
            </p>

        </div>

    `;


    addExtraNavigation(
        screen,
        "Настройки"
    );

}


/* =========================================================
   УДАЛИТЬ ВСЕ ЗАКАЗЫ
   ========================================================= */

function deleteAllOrders() {

    const orders =
        getOrders();


    if (
        orders.length === 0
    ) {

        alert(
            "Сохранённых заказов нет."
        );

        return;

    }


    const confirmed =
        confirm(
            `Удалить все заказы (${orders.length} шт.)?`
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "orders"
    );


    renderSettings();


    alert(
        "Все заказы удалены."
    );

}


/* =========================================================
   ГЛАВНЫЙ ЭКРАН — НОВЫЙ ЗАКАЗ
   ========================================================= */

function showOrderScreen() {

    closeCatalog();
    closeOrders();
    closeOrderDetails();
    closeStatistics();
    closeSettings();


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


    document.body.style.overflow =
        "";


    setActiveNav(
        "Заказ"
    );


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


function showStatistics() {

    openStatistics();

}


function showSettings() {

    openSettings();

}


/* =========================================================
   АКТИВНАЯ КНОПКА НАВИГАЦИИ
   ========================================================= */

function setActiveNav(
    name
) {

    const buttons =
        document.querySelectorAll(
            ".bottom-nav .nav-item, .extra-nav-item"
        );


    buttons.forEach(
        button => {

            const dataNav =
                button.dataset.nav ||
                "";


            const text =
                button.textContent
                    .trim();


            if (
                dataNav === name ||
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

function escapeHtml(
    value
) {

    return String(
        value
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
                .register(
                    "./sw.js"
                )
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

    }
);