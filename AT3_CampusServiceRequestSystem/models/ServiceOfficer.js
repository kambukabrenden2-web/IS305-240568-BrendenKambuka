const User = require('./User');

class ServiceOfficer extends User {
  #serviceSection;

  constructor(userId, firstName, lastName, email, serviceSection) {
    super(userId, firstName, lastName, email, 'ServiceOfficer');
    this.#serviceSection = serviceSection;
    this.validateOfficer();
  }

  get serviceSection() { return this.#serviceSection; }

  validateOfficer() {
    if (!this.#serviceSection || this.#serviceSection.trim() === '') {
      throw new Error('Service section cannot be empty.');
    }
  }

  displayInfo() {
    return `${super.displayInfo()} | Section: ${this.#serviceSection}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      serviceSection: this.#serviceSection
    };
  }
}

module.exports = ServiceOfficer;