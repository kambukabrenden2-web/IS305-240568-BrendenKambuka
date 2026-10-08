const User = require('./User');

class StaffRequester extends User {
  #department;

  constructor(userId, firstName, lastName, email, department) {
    super(userId, firstName, lastName, email, 'Staff');
    this.#department = department;
    this.validateStaff();
  }

  get department() { return this.#department; }

  validateStaff() {
    if (!this.#department || this.#department.trim() === '') {
      throw new Error('Staff department cannot be empty.');
    }
  }

  displayInfo() {
    return `${super.displayInfo()} | Department: ${this.#department}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      department: this.#department
    };
  }
}

module.exports = StaffRequester;