const ServiceRequest = require('./ServiceRequest');

class ICTSupportRequest extends ServiceRequest {
  #deviceType;
  #systemName;
  #faultType;
  #networkImpact;

  constructor(requestId, requester, title, description, campusLocation, priority, deviceType, systemName, faultType, networkImpact) {
    super(requestId, requester, title, description, campusLocation, 'ICT Support', priority);
    this.#deviceType = deviceType;
    this.#systemName = systemName;
    this.#faultType = faultType;
    this.#networkImpact = networkImpact;
    this.validateICT();
  }

  get deviceType() { return this.#deviceType; }
  get systemName() { return this.#systemName; }
  get faultType() { return this.#faultType; }
  get networkImpact() { return this.#networkImpact; }

  validateICT() {
    if (!this.#deviceType || this.#deviceType.trim() === '') throw new Error('Device type is missing.');
    if (!this.#systemName || this.#systemName.trim() === '') throw new Error('System name is missing.');
    if (!this.#faultType || this.#faultType.trim() === '') throw new Error('Fault type is missing.');
    if (!this.#networkImpact || this.#networkImpact.trim() === '') throw new Error('Network impact is missing.');
  }

  // Overriding abstract-style methods (Polymorphism)
  calculatePriorityScore() {
    const weights = { 'Low': 10, 'Normal': 20, 'High': 30, 'Urgent': 40 };
    let score = weights[this.priority] || 20;
    if (this.#networkImpact === 'High' || this.#networkImpact === 'Critical') score += 20;
    return score;
  }

  getTargetResolutionHours() {
    return 24; // ICT standard resolution target
  }

  getRequestSummary() {
    return `[ICT][ID: ${this.requestId}] ${this.title} | Device: ${this.#deviceType} | Impact: ${this.#networkImpact} | Status: ${this.status}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      deviceType: this.#deviceType,
      systemName: this.#systemName,
      faultType: this.#faultType,
      networkImpact: this.#networkImpact
    };
  }
}

module.exports = { ICTSupportRequest };