const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.querySelector('#expense-table tbody');
const feedbackMessage = document.getElementById('feedback-message');
let editingRow = null; 
// Get the current date and set the min and max date limits
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const minYear = currentYear - 100;
const maxYear = currentYear;

// Create the min and max date strings in YYYY-MM-DD format
const minDate = new Date(minYear, 0, 1).toISOString().split('T')[0]; // January 1 of minYear
const maxDate = new Date(maxYear, 11, 31).toISOString().split('T')[0]; // December 31 of maxYear

// Set the min and max attributes for the date input
const dateInput = document.getElementById('expense-date');
dateInput.setAttribute('min', minDate);
dateInput.setAttribute('max', maxDate);


expenseForm.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = document.getElementById('expense-amount').value;
    const expenseCategory = document.getElementById('expense-category').value;
    const expenseDate = document.getElementById('expense-date').value;
    if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
        showFeedback('Please fill in all fields!', 'error');
        return;
    }
    if (expenseDate < minDate || expenseDate > maxDate) {
        showFeedback('Please enter a date within the last 100 years.', 'error');
        return;
    }

    

    // Check if we are editing an existing row
    if (editingRow) {
        editingRow.cells[0].textContent = expenseName;
        editingRow.cells[1].textContent = parseFloat(expenseAmount).toFixed(2);
        editingRow.cells[2].textContent = expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1);
        editingRow.cells[3].textContent = expenseDate;
        editingRow = null; // Reset after editing
        showFeedback('Expense updated successfully!', 'success');
    } else {
        // Create a new row if not editing
        const newRow = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = expenseName;
        newRow.appendChild(nameCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = parseFloat(expenseAmount).toFixed(2);
        newRow.appendChild(amountCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1);
        newRow.appendChild(categoryCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = expenseDate; 
        newRow.appendChild(dateCell);

        const actionsCell = document.createElement('td');

        // Create the Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function () {
            document.getElementById('expense-name').value = nameCell.textContent;
            document.getElementById('expense-amount').value = amountCell.textContent.slice(1); // Remove $ sign
            document.getElementById('expense-category').value = categoryCell.textContent.toLowerCase();
            document.getElementById('expense-date').value = dateCell.textContent;
            editingRow = newRow; // Set the row that is being edited
        });
        actionsCell.appendChild(editButton);

        // Create the Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            newRow.remove(); 
            showFeedback('Expense deleted successfully!', 'success');
        });
        actionsCell.appendChild(deleteButton);

        newRow.appendChild(actionsCell);
        expenseTableBody.appendChild(newRow);
        showFeedback('Expense added successfully!', 'success');
    }

    expenseForm.reset();
});
function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = ''; 
    feedbackMessage.classList.add(type); // Add the class based on the type ('success' or 'error')
    feedbackMessage.style.display = 'block';

    // Automatically hide the feedback message after 3 seconds
    setTimeout(function () {
        feedbackMessage.style.display = 'none';
    }, 2000);
}
