document.addEventListener('DOMContentLoaded', () => {
    // --- Dashboard Logic ---

    // Tab Navigation Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                if (!tabName) return;

                // Update active buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update visible sections
                document.querySelectorAll('.dashboard-section').forEach(sec => {
                    sec.classList.remove('active');
                });
                const targetSection = document.getElementById(tabName + 'Section');
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    // Expense Form submission placeholder
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Expense submitted successfully! View status in the pipeline below.');
        });
    }

    // Upload zone simulation (Optional styling for better UX)
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('click', () => {
            alert('Opening file selector for receipt scanning...');
        });
    }
});
