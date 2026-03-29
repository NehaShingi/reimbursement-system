document.addEventListener('DOMContentLoaded', () => {
    // --- Team Table Filtering ---
    const memberFilter = document.getElementById('memberFilter');
    const teamTable = document.getElementById('teamTable');

    if (memberFilter && teamTable) {
        memberFilter.addEventListener('input', () => {
            const filterValue = memberFilter.value.toLowerCase();
            const rows = teamTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.querySelector('.emp-name').textContent.toLowerCase();
                if (text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- Review Panel Logic ---
    const reviewBtns = document.querySelectorAll('.review-btn');
    const reviewPanel = document.getElementById('reviewPanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const btnApprove = document.getElementById('btnApprove');
    const btnReject = document.getElementById('btnReject');
    const btnApproveInline = document.getElementById('btnApproveInline');
    const btnRejectInline = document.getElementById('btnRejectInline');

    let activeRow = null;

    reviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            activeRow = this.closest('tr');
            const empName = activeRow.querySelector('.emp-name').textContent;
            const category = activeRow.cells[1].textContent;
            const amount = activeRow.cells[2].textContent;
            const date = activeRow.cells[3].textContent;

            // Mock update panel details
            document.getElementById('reviewEmpName').textContent = `${empName} — ${date}`;
            document.getElementById('reviewCategory').textContent = category;
            document.getElementById('reviewAmount').textContent = amount;
            
            // Show panel
            reviewPanel.classList.add('active');
            panelOverlay.style.display = 'block';
        });
    });

    const closePanel = () => {
        reviewPanel.classList.remove('active');
        panelOverlay.style.display = 'none';
        activeRow = null;
    };

    const approveExpense = () => {
        if (activeRow) {
            const statusBadge = activeRow.querySelector('.badge');
            statusBadge.className = 'badge badge-approved';
            statusBadge.textContent = 'Approved';
            activeRow.querySelector('.review-btn').style.display = 'none';
            alert('Expense Approved Successfully!');
            closePanel();
        }
    };

    const rejectExpense = () => {
        if (activeRow) {
            const statusBadge = activeRow.querySelector('.badge');
            statusBadge.style.backgroundColor = '#fef2f2';
            statusBadge.style.color = '#ef4444';
            statusBadge.textContent = 'Rejected';
            activeRow.querySelector('.review-btn').style.display = 'none';
            alert('Expense Rejected.');
            closePanel();
        }
    };

    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanel);
    }

    // --- decision logic ---
    if (btnApprove) btnApprove.addEventListener('click', approveExpense);
    if (btnReject) btnReject.addEventListener('click', rejectExpense);
});
