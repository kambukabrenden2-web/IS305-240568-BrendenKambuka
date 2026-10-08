/*
  Program: Dining Meal Booking Feature
  Student Name: Brenden Kambuka
  Student ID: 240568
  Date: 24 July 2026
  Description: Complete Node.js console application with validation,
  controlled methods, array storage and error handling.
*/

class MealBooking {
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = "Pending";
  }

  get studentId() { return this.#studentId; }
  get studentName() { return this.#studentName; }
  get mealDate() { return this.#mealDate; }
  get mealType() { return this.#mealType; }
  get quantity() { return this.#quantity; }
  get dietaryNote() { return this.#dietaryNote; }
  get bookingStatus() { return this.#bookingStatus; }

  set bookingStatus(value) { this.#bookingStatus = value; }

  validate() {
    if (!this.#studentId || !this.#studentName || !this.#mealDate) {
      throw new Error("Missing required booking information.");
    }
    if (!["Breakfast", "Lunch", "Dinner"].includes(this.#mealType)) {
      throw new Error("Invalid meal type. Must be Breakfast, Lunch or Dinner.");
    }
    if (this.#quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }
    return true;
  }

  calculateTotal() {
    let pricePerMeal = 0;
    if (this.#mealType === "Breakfast") pricePerMeal = 10;
    else if (this.#mealType === "Lunch") pricePerMeal = 15;
    else if (this.#mealType === "Dinner") pricePerMeal = 20;
    return pricePerMeal * this.#quantity;
  }

  confirmBooking() { this.#bookingStatus = "Confirmed"; }
  cancelBooking() { this.#bookingStatus = "Cancelled"; }

  getSummary() {
    return `
========================================
       DWU DINING MEAL BOOKING
========================================
Student: ${this.#studentName} (${this.#studentId})
Meal: ${this.#mealType} x ${this.#quantity}
Date: ${this.#mealDate}
Dietary note: ${this.#dietaryNote}
Status: ${this.#bookingStatus}
Total cost: K${this.calculateTotal().toFixed(2)}
========================================
    `;
  }
}

module.exports = MealBooking;
