const approveExpense = async () => {
    if (activeRow) {
        const id = activeRow.querySelector('.review-btn').dataset.id;

        await fetch("http://localhost:5000/approve", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id })
        });

        alert("Approved ✅");
    }
};