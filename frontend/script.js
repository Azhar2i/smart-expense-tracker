// =====================================
// SMART EXPENSE TRACKER
// =====================================


// Get HTML elements
const transactionForm =
    document.getElementById("transactionForm");

const transactionList =
    document.getElementById("transactionList");

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const balanceElement =
    document.getElementById("balance");

const clearAllButton =
    document.getElementById("clearAll");

const smartTip =
    document.getElementById("smartTip");


// =====================================
// TRANSACTION DATA
// =====================================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// =====================================
// SET TODAY'S DATE
// =====================================

const dateInput =
    document.getElementById("date");

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;


// =====================================
// ADD TRANSACTION
// =====================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            document.getElementById("description").value;


        const amount =
            Number(
                document.getElementById("amount").value
            );


        const type =
            document.getElementById("type").value;


        const category =
            document.getElementById("category").value;


        const date =
            document.getElementById("date").value;


        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        transactions.push(transaction);


        saveTransactions();

        displayTransactions();

        updateSummary();

        updateSmartTip();


        transactionForm.reset();


        dateInput.value = today;

    }
);


// =====================================
// SAVE TRANSACTIONS
// =====================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =====================================
// DISPLAY TRANSACTIONS
// =====================================

function displayTransactions() {

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💳
                </div>

                <h3>No transactions yet</h3>

                <p>
                    Add your first transaction to get started.
                </p>

            </div>

        `;

        return;
    }


    transactionList.innerHTML = "";


    // Show newest transaction first
    const sortedTransactions =
        [...transactions].reverse();


    sortedTransactions.forEach(
        function (transaction) {

            const div =
                document.createElement("div");


            div.className = "transaction";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const amountClass =
                transaction.type === "income"
                    ? "income"
                    : "expense";


            const icon =
                getCategoryIcon(
                    transaction.category
                );


            div.innerHTML = `

                <div class="transaction-info">

                    <div class="transaction-icon">
                        ${icon}
                    </div>

                    <div>

                        <div class="transaction-name">
                            ${transaction.description}
                        </div>

                        <div class="transaction-category">
                            ${transaction.category}
                            •
                            ${transaction.date}
                        </div>

                    </div>

                </div>


                <div class="transaction-right">

                    <span class="${amountClass}">
                        ${sign}₹${transaction.amount.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="delete-button"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        🗑️
                    </button>

                </div>

            `;


            transactionList.appendChild(div);

        }
    );

}


// =====================================
// CATEGORY ICON
// =====================================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Travel: "🚗",

        Shopping: "🛍️",

        Bills: "🧾",

        Education: "📚",

        Entertainment: "🎬",

        Health: "🏥",

        Other: "📦"

    };


    return icons[category] || "📦";

}


// =====================================
// DELETE TRANSACTION
// =====================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();

    displayTransactions();

    updateSummary();

    updateSmartTip();

}


// =====================================
// UPDATE SUMMARY
// =====================================

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(
        function (transaction) {

            if (transaction.type === "income") {

                totalIncome += transaction.amount;

            } else {

                totalExpense += transaction.amount;

            }

        }
    );


    const balance =
        totalIncome - totalExpense;


    totalIncomeElement.textContent =
        "₹" + totalIncome.toLocaleString("en-IN");


    totalExpenseElement.textContent =
        "₹" + totalExpense.toLocaleString("en-IN");


    balanceElement.textContent =
        "₹" + balance.toLocaleString("en-IN");

}


// =====================================
// CLEAR ALL
// =====================================

clearAllButton.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            return;

        }


        const confirmation =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (confirmation) {

            transactions = [];

            saveTransactions();

            displayTransactions();

            updateSummary();

            updateSmartTip();

        }

    }
);


// =====================================
// SMART SPENDING TIP
// =====================================

function updateSmartTip() {

    if (transactions.length === 0) {

        smartTip.textContent =
            "Start tracking your expenses to get personalized spending insights.";

        return;

    }


    let totalExpense = 0;

    let categoryExpenses = {};


    transactions.forEach(
        function (transaction) {

            if (transaction.type === "expense") {

                totalExpense += transaction.amount;


                if (
                    !categoryExpenses[
                        transaction.category
                    ]
                ) {

                    categoryExpenses[
                        transaction.category
                    ] = 0;

                }


                categoryExpenses[
                    transaction.category
                ] += transaction.amount;

            }

        }
    );


    if (totalExpense === 0) {

        smartTip.textContent =
            "Great! You haven't recorded any expenses yet.";

        return;

    }


    let highestCategory = "";

    let highestAmount = 0;


    for (
        const category in categoryExpenses
    ) {

        if (
            categoryExpenses[category]
            > highestAmount
        ) {

            highestAmount =
                categoryExpenses[category];

            highestCategory =
                category;

        }

    }


    const percentage =
        Math.round(
            (highestAmount / totalExpense) * 100
        );


    smartTip.textContent =
        `Your highest spending category is ${highestCategory}, 
        which represents ${percentage}% of your total expenses. 
        Keep an eye on this category to manage your budget better.`;

}


// =====================================
// INITIAL LOAD
// =====================================

displayTransactions();

updateSummary();

updateSmartTip();