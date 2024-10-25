document.addEventListener('DOMContentLoaded', function () {
    
    let totalBudget = 0;
    let allocatedTotal = 0;
    let currentRow = null;  
    let rowToDelete = null; 
    let amountToDelete = 0;   

    const totalBudgetInput = document.getElementById('total-budget');
    const remainingBudgetDisplay = document.getElementById('remainingBudget');
    const allocatedTotalDisplay = document.getElementById('allocatedTotal');
    const budgetForm = document.getElementById('budget-form');
    const budgetTableBody = document.querySelector('#budget-table tbody');
    const progressBar = document.getElementById('progressBar');
    const confirmModal = document.getElementById('confirm-modal');  
    const confirmDeleteButton = document.getElementById('confirm-delete');  
    const cancelDeleteButton = document.getElementById('cancel-delete'); 

    totalBudgetInput.addEventListener('input', function () {
        totalBudget = parseFloat(this.value) || 0;
        updateRemainingBudget();
    });

    budgetForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const budgetName = document.getElementById('budget-name').value;
        const budgetAmount = parseFloat(document.getElementById('budget-amount').value) || 0;
        const budgetCategory = document.getElementById('budget-category').value;

        if (allocatedTotal + budgetAmount > totalBudget && !currentRow) {
            alert('You cannot allocate more than the remaining budget!');
            return;
        }

        // If editing an existing row
        if (currentRow) {
            const oldAmount = parseFloat(currentRow.querySelector('td:nth-child(2)').textContent);
            allocatedTotal = allocatedTotal - oldAmount + budgetAmount;
            updateRow(currentRow, budgetName, budgetAmount, budgetCategory);
        } else {
            allocatedTotal += budgetAmount;
            addBudgetToTable(budgetName, budgetAmount, budgetCategory);
        }

        updateRemainingBudget();
        updateProgressBar();
        allocatedTotalDisplay.textContent = allocatedTotal.toFixed(2);
        budgetForm.reset();
        currentRow = null;  // Reset currentRow after edit
    });

    function updateRemainingBudget() {
        const remaining = totalBudget - allocatedTotal;
        remainingBudgetDisplay.textContent = remaining.toFixed(2);
    }

    function updateProgressBar() {
        const progress = (allocatedTotal / totalBudget) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function addBudgetToTable(name, amount, category) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        row.appendChild(nameCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = amount.toFixed(2);
        row.appendChild(amountCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);

        const actionsCell = document.createElement('td');

        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function () {
            loadBudgetForEdit(row);
        });
        actionsCell.appendChild(editButton);

        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            rowToDelete = row;  // Save the row that will be deleted
            amountToDelete = amount;  // Save the amount to subtract
            confirmModal.style.display = 'block';  // Show the confirmation modal
        });
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        budgetTableBody.appendChild(row);
    }

    // Function to load a budget row for editing
    function loadBudgetForEdit(row) {
        const name = row.querySelector('td:nth-child(1)').textContent;
        const amount = row.querySelector('td:nth-child(2)').textContent;
        const category = row.querySelector('td:nth-child(3)').textContent;

        document.getElementById('budget-name').value = name;
        document.getElementById('budget-amount').value = amount;
        document.getElementById('budget-category').value = category;

        currentRow = row;  // Set currentRow to the row being edited
    }

    function updateRow(row, name, amount, category) {
        row.querySelector('td:nth-child(1)').textContent = name;
        row.querySelector('td:nth-child(2)').textContent = amount.toFixed(2);
        row.querySelector('td:nth-child(3)').textContent = category;
    }

    // Function to delete a budget entry
    confirmDeleteButton.addEventListener('click', function () {
        allocatedTotal -= amountToDelete;
        updateRemainingBudget();
        updateProgressBar();
        allocatedTotalDisplay.textContent = allocatedTotal.toFixed(2);
        rowToDelete.remove();  
        confirmModal.style.display = 'none';  
    });

    // When the user clicks "Cancel", just hide the modal
    cancelDeleteButton.addEventListener('click', function () {
        confirmModal.style.display = 'none';  
    });
});