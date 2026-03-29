// CURRENCY
document.getElementById("amountInput").addEventListener("input", convert);
document.getElementById("currencySelect").addEventListener("change", convert);

async function convert() {
    const amount = document.getElementById("amountInput").value;
    const currency = document.getElementById("currencySelect").value;

    if (!amount) return;

    const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            amount,
            from: currency,
            to: "INR"
        })
    });

    const data = await res.json();
    document.getElementById("liveConvAmount").innerText = "₹ " + data.converted;
}

// FILE UPLOAD + OCR
document.getElementById("ocrUploadZone").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("receipt", file);

        const res = await fetch("http://localhost:5000/ocr", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        document.getElementById("amountInput").value = data.amount;
        alert("OCR Done ✅");
    };

    input.click();
});

// SUBMIT EXPENSE
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        amount: document.getElementById("amountInput").value,
        category: document.getElementById("categorySelect").value,
        date: document.getElementById("dateInput").value,
        desc: document.getElementById("descInput").value
    };

    await fetch("http://localhost:5000/submit-expense", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    alert("Expense Submitted ✅");
});