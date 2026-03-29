document.addEventListener('DOMContentLoaded', () => {
    // --- Table Filtering Logic ---
    const tableFilter = document.getElementById('tableFilter');
    const employeeTable = document.getElementById('employeeTable');
    const recordCountDisplay = document.getElementById('recordCount');

    if (tableFilter && employeeTable) {
        tableFilter.addEventListener('input', () => {
            const filterValue = tableFilter.value.toLowerCase();
            const rows = employeeTable.querySelectorAll('tbody tr');
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(filterValue)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (recordCountDisplay) {
                recordCountDisplay.textContent = visibleCount;
            }
        });
    }

    // --- Row Actions (Delete & Edit) ---
    if (employeeTable) {
        employeeTable.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.action-icon-btn.delete');
            const editBtn = e.target.closest('.action-icon-btn.edit');

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                const name = row.querySelector('.emp-name').textContent;
                if (confirm(`Are you sure you want to remove ${name}?`)) {
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        updateStats();
                    }, 300);
                }
            }

            if (editBtn) {
                const row = editBtn.closest('tr');
                const name = row.querySelector('.emp-name').textContent;
                alert(`Editing details for ${name}... (Modal placeholder)`);
            }
        });
    }

    // --- Add Employee Modal Logic ---
    const btnAddUser = document.getElementById('btnAddUser');
    const addUserModal = document.getElementById('addUserModal');
    const btnCancelAdd = document.getElementById('btnCancelAdd');
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    if (btnAddUser && addUserModal) {
        btnAddUser.addEventListener('click', () => {
            addUserModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (btnCancelAdd && addUserModal) {
        btnCancelAdd.addEventListener('click', () => {
            addUserModal.classList.remove('active');
            document.body.style.overflow = '';
            if (addEmployeeForm) addEmployeeForm.reset();
        });
    }

    if (addUserModal) {
        addUserModal.addEventListener('click', (e) => {
            if (e.target === addUserModal) {
                addUserModal.classList.remove('active');
                document.body.style.overflow = '';
                if (addEmployeeForm) addEmployeeForm.reset();
            }
        });
    }

    // Form Submission
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Employee added successfully!');
            
            // Close modal
            addUserModal.classList.remove('active');
            document.body.style.overflow = '';
            addEmployeeForm.reset();

            // In a real app, we'd add the row to the table here
        });
    }

    // --- Notification Bell ---
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            const dot = notificationBtn.querySelector('.dot');
            if (dot) dot.style.display = 'none';
            alert('Opening Notifications center...');
        });
    }

    // --- Helper to update stats ---
    function updateStats() {
        const rows = employeeTable.querySelectorAll('tbody tr');
        if (recordCountDisplay) recordCountDisplay.textContent = rows.length;
        
        // Update any other count displays if needed
        const totalCountEl = document.getElementById('totalCount');
        if (totalCountEl) totalCountEl.textContent = rows.length;
    }
});
