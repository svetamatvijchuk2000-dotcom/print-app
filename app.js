function calculate() {

    const product = document.getElementById("product").value;
    const size = document.getElementById("size").value;
    const quantity = Number(
        document.getElementById("quantity").value
    );

    let price = 0;

    if (product === "diploma_uv") {

        if (size === "A5") price = 100;
        if (size === "A4") price = 150;
        if (size === "A3") price = 200;

    }

    if (product === "diploma_sublimation") {

        if (size === "A5") price = 80;
        if (size === "A4") price = 120;
        if (size === "A3") price = 170;

    }

    const total = price * quantity;

    document.getElementById("total").textContent =
        total + " грн";
}