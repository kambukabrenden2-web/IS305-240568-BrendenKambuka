const User = require('./User');

class StudentRequester extends User {
  #programme;
  #yearLevel;

  constructor(userId, firstName, lastName, email, programme, yearLevel) {
    super(userId, firstName, lastName, email, 'Student');
    this.#programme = programme;
    this.#yearLevel = yearLevel;
    this.validateStudent();
  }

  get programme() { return this.#programme; }
  get yearLevel() { return this.#yearLevel; }

  validateStudent() {
    if (!this.#programme || this.#programme.trim() === '') {
      throw new Error('Student programme cannot be empty.');
    }
    if (!this.#yearLevel || isNaN(this.#yearLevel)) {
      throw new Error('Valid year level is required.');
    }
  }

  displayInfo() {
    return `${super.displayInfo()} | Programme: ${this.#programme} (Year ${this.#yearLevel})`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      programme: this.#programme,
      yearLevel: this.#yearLevel
    };
  }
}

module.exports = StudentRequester;