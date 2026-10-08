class DiningAccount {
    #accountNumber;
    #balance;
    #transactions;

    constructor(accountNumber, openingBalance = 0) {
        if (!accountNumber || accountNumber.trim() === "") {
            throw new Error("Account number cannot be empty.");
        }
        if (openingBalance < 0) {
            throw new Error("Opening balance cannot be negative.");
        }

        this.#accountNumber = accountNumber;
        this.#balance = openingBalance;
        this.#transactions = [];

        if (openingBalance > 0) {
            this.#transactions.push({
                type: "DEPOSIT",
                amount: openingBalance,
                description: "Opening balance",
                date: new Date(),
                balanceAfter: this.#balance
            });
        }
    }

    get accountNumber() {
        return this.#accountNumber;
    }

    getBalance() {
        return this.#balance;
    }

    getTransactions() {
        return [...this.#transactions];
    }

    deposit(amount, description = "Deposit") {
        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than zero.");
        }
        this.#balance += amount;
        this.#transactions.push({
            type: "DEPOSIT",
            amount: amount,
            description: description,
            date: new Date(),
            balanceAfter: this.#balance
        });
        return this.#balance;
    }

    payForMeal(amount, description = "Meal Payment") {
        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero.");
        }
        if (amount > this.#balance) {
            console.log(`Payment Status: Rejected (Insufficient funds for K${amount.toFixed(2)})`);
            return false;
        }

        this.#balance -= amount;
        this.#transactions.push({
            type: "PAYMENT",
            amount: amount,
            description: description,
            date: new Date(),
            balanceAfter: this.#balance
        });

        console.log("Payment Status: Successful");
        return true;
    }

    // Protected helper method for derived subclasses to adjust private balance securely
    protectedDeduct(amount, description) {
        this.#balance -= amount;
        this.#transactions.push({
            type: "PAYMENT",
            amount: amount,
            description: description,
            date: new Date(),
            balanceAfter: this.#balance
        });
        return this.#balance;
    }

    displayAccountSummary() {
        console.log("========================================");
        console.log("       STANDARD DINING ACCOUNT          ");
        console.log("========================================");
        console.log(`Account Number: ${this.#accountNumber}`);
        console.log(`Account Type: Standard Dining Account`);
        console.log(`Current Balance: K${this.#balance.toFixed(2)}`);
    }
}

export default DiningAccount;