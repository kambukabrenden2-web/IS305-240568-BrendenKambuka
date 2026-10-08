const User = require('./User');

class Technician extends User {
  #technicalSpeciality;

  constructor(userId, firstName, lastName, email, technicalSpeciality) {
    super(userId, firstName, lastName, email, 'Technician');
    this.#technicalSpeciality = technicalSpeciality;
    this.validateTechnician();
  }

  get technicalSpeciality() { return this.#technicalSpeciality; }

  validateTechnician() {
    if (!this.#technicalSpeciality || this.#technicalSpeciality.trim() === '') {
      throw new Error('Technical speciality cannot be empty.');
    }
  }

  displayInfo() {
    return `${super.displayInfo()} | Speciality: ${this.#technicalSpeciality}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      technicalSpeciality: this.#technicalSpeciality
    };
  }
}

module.exports = Technician;