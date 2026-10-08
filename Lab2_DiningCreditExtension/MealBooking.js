// MealBooking.js
import Student from './Student.js';

class MealBooking {
  #student;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor(student, mealDate, mealType, quantity, dietaryNote = 'None', bookingStatus = 'Confirmed') {
    this.student = student;
    this.mealDate = mealDate;
    this.mealType = mealType;
    this.quantity = quantity;
    this.dietaryNote = dietaryNote;
    this.bookingStatus = bookingStatus;
  }

  // --- Getters ---
  get student() {
    return this.#student;
  }

  get mealDate() {
    return this.#mealDate;
  }

  get mealType() {
    return this.#mealType;
  }

  get quantity() {
    return this.#quantity;
  }

  get dietaryNote() {
    return this.#dietaryNote;
  }

  get bookingStatus() {
    return this.#bookingStatus;
  }

  // --- Setters with Validation ---
  set student(s) {
    if (!(s instanceof Student)) {
      throw new Error('A valid Student object must be provided for the booking.');
    }
    this.#student = s;
  }

  set mealDate(date) {
    if (!date || typeof date !== 'string' || date.trim() === '') {
      throw new Error('Meal date cannot be empty.');
    }
    this.#mealDate = date.trim();
  }

  set mealType(type) {
    const validTypes = ['Breakfast', 'Lunch', 'Dinner'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid meal type. Must be one of: ${validTypes.join(', ')}`);
    }
    this.#mealType = type;
  }

  set quantity(qty) {
    const num = Number(qty);
    if (isNaN(num) || num <= 0) {
      throw new Error('Quantity must be a positive number greater than 0.');
    }
    this.#quantity = num;
  }

  set dietaryNote(note) {
    this.#dietaryNote = note ? note.trim() : 'None';
  }

  set bookingStatus(status) {
    const validStatuses = ['Confirmed', 'Pending', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid booking status. Must be one of: ${validStatuses.join(', ')}`);
    }
    this.#bookingStatus = status;
  }

  // --- Calculations & Summary ---
  calculateTotal() {
    let unitPrice = 15.00; // Standard Lunch/Dinner price
    if (this.#mealType === 'Breakfast') {
      unitPrice = 10.00;
    }
    return this.#quantity * unitPrice;
  }

  getSummary(index = 1) {
    const costFormatted = `K${this.calculateTotal().toFixed(2)}`;
    return `${index}. ${this.#mealType} - ${this.#mealDate}\n   Quantity: ${this.#quantity}\n   Status: ${this.#bookingStatus}\n   Cost: ${costFormatted}`;
  }
}

export default MealBooking;