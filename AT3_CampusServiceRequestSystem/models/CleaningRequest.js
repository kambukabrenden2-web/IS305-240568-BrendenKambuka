const ServiceRequest = require('./ServiceRequest');

class CleaningRequest extends ServiceRequest {
  #cleaningArea;
  #hygieneRisk;
  #serviceType;
  #preferredServiceTime;

  constructor(requestId, requester, title, description, campusLocation, priority, cleaningArea, hygieneRisk, serviceType, preferredServiceTime) {
    super(requestId, requester, title, description, campusLocation, 'Cleaning and Sanitation', priority);
    this.#cleaningArea = cleaningArea;
    this.#hygieneRisk = hygieneRisk;
    this.#serviceType = serviceType;
    this.#preferredServiceTime = preferredServiceTime;
    this.validateCleaning();
  }

  get cleaningArea() { return this.#cleaningArea; }
  get hygieneRisk() { return this.#hygieneRisk; }
  get serviceType() { return this.#serviceType; }
  get preferredServiceTime() { return this.#preferredServiceTime; }

  validateCleaning() {
    if (!this.#cleaningArea || this.#cleaningArea.trim() === '') throw new Error('Cleaning area is missing.');
    if (!this.#hygieneRisk || this.#hygieneRisk.trim() === '') throw new Error('Hygiene risk is missing.');
    if (!this.#serviceType || this.#serviceType.trim() === '') throw new Error('Service type is missing.');
    if (!this.#preferredServiceTime || this.#preferredServiceTime.trim() === '') throw new Error('Preferred service time is missing.');
  }

  // Overriding abstract-style methods (Polymorphism)
  calculatePriorityScore() {
    const weights = { 'Low': 10, 'Normal': 20, 'High': 30, 'Urgent': 40 };
    let score = weights[this.priority] || 20;
    if (this.#hygieneRisk === 'High' || this.#hygieneRisk === 'Critical') score += 15;
    return score;
  }

  getTargetResolutionHours() {
    return 12; // Cleaning standard resolution target
  }

  getRequestSummary() {
    return `[Clean][ID: ${this.requestId}] ${this.title} | Area: ${this.#cleaningArea} | Risk: ${this.#hygieneRisk} | Status: ${this.status}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      cleaningArea: this.#cleaningArea,
      hygieneRisk: this.#hygieneRisk,
      serviceType: this.#serviceType,
      preferredServiceTime: this.#preferredServiceTime
    };
  }
}

module.exports = { CleaningRequest };