class MealBooking {
    #mealName;
    #quantity;
    #unitPrice;
    #status;
    #isPaid;

    constructor(mealName, quantity, unitPrice) {
        if (!mealName) throw new Error("Meal name is required.");
        if (quantity <= 0) throw new Error("Quantity must be greater than zero.");
        if (unitPrice <= 0) throw new Error("Unit price must be greater than zero.");

        this.#mealName = mealName;
        this.#quantity = quantity;
        this.#unitPrice = unitPrice;
        this.#status = "Pending";
        this.#isPaid = false;
    }

    getTotalCost() {
        return this.#quantity * this.#unitPrice;
    }

    get status() {
        return this.#status;
    }

    get isPaid() {
        return this.#isPaid;
    }

    processPayment(diningAccount) {
        if (this.#isPaid || this.#status === "Confirmed") {
            console.log("Payment Error: This booking has already been paid and confirmed.");
            return false;
        }

        if (!diningAccount) {
            console.log("Payment Error: No dining account assigned to student.");
            return false;
        }

        const totalCost = this.getTotalCost();
        console.log(`Meal: ${this.#mealName}`);
        console.log(`Quantity: ${this.#quantity}`);
        console.log(`Total Cost: K${totalCost.toFixed(2)}`);

        // Polymorphic call: executes appropriate payForMeal based on account type
        const success = diningAccount.payForMeal(totalCost, `${this.#mealName} booking payment`);

        if (success) {
            this.#isPaid = true;
            this.#status = "Confirmed";
            console.log("Payment Status: Successful");
            console.log("Booking Status: Confirmed");
        } else {
            this.#status = "Pending";
            console.log("Payment Status: Failed");
            console.log("Booking Status: Pending");
        }

        console.log(`Remaining Balance: K${diningAccount.getBalance().toFixed(2)}`);
        return success;
    }
}

export default MealBooking;