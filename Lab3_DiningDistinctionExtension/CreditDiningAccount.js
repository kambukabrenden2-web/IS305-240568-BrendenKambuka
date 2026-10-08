import DiningAccount from "./DiningAccount.js";

class CreditDiningAccount extends DiningAccount {
    #creditLimit;

    constructor(accountNumber, openingBalance = 0, creditLimit = 0) {
        super(accountNumber, openingBalance);
        if (creditLimit < 0) {
            throw new Error("Credit limit cannot be negative.");
        }
        this.#creditLimit = creditLimit;
    }

    get creditLimit() {
        return this.#creditLimit;
    }

    set creditLimit(limit) {
        if (limit < 0) throw new Error("Credit limit cannot be negative.");
        this.#creditLimit = limit;
    }

    // Override payForMeal to allow balance to fall below zero down to -creditLimit
    payForMeal(amount, description = "Meal Payment (Credit)") {
        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero.");
        }

        const currentBalance = this.getBalance();
        const maximumAllowedBalance = -this.#creditLimit;

        if ((currentBalance - amount) < maximumAllowedBalance) {
            console.log(`Payment Status: Rejected (Exceeds approved credit limit of K${this.#creditLimit.toFixed(2)})`);
            return false;
        }

        this.protectedDeduct(amount, description);
        console.log("Payment Status: Successful (Credit Account)");
        return true;
    }

    displayAccountSummary() {
        console.log("========================================");
        console.log("         CREDIT DINING ACCOUNT          ");
        console.log("========================================");
        console.log(`Account Number: ${this.accountNumber}`);
        console.log(`Account Type: CreditDiningAccount`);
        console.log(`Credit Limit: K${this.#creditLimit.toFixed(2)}`);
        console.log(`Current Balance: K${this.getBalance().toFixed(2)}`);
    }
}

export default CreditDiningAccount;