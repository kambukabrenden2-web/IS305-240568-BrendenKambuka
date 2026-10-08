const ServiceRequest = require('./ServiceRequest');

class MaintenanceRequest extends ServiceRequest {
  #building;
  #roomNumber;
  #hazardLevel;
  #equipmentAffected;

  constructor(requestId, requester, title, description, campusLocation, priority, building, roomNumber, hazardLevel, equipmentAffected) {
    super(requestId, requester, title, description, campusLocation, 'Facilities Maintenance', priority);
    this.#building = building;
    this.#roomNumber = roomNumber;
    this.#hazardLevel = hazardLevel;
    this.#equipmentAffected = equipmentAffected;
    this.validateMaintenance();
  }

  get building() { return this.#building; }
  get roomNumber() { return this.#roomNumber; }
  get hazardLevel() { return this.#hazardLevel; }
  get equipmentAffected() { return this.#equipmentAffected; }

  validateMaintenance() {
    if (!this.#building || this.#building.trim() === '') throw new Error('Building is missing.');
    if (!this.#roomNumber || this.#roomNumber.trim() === '') throw new Error('Room number is missing.');
    if (!this.#hazardLevel || this.#hazardLevel.trim() === '') throw new Error('Hazard level is missing.');
    if (!this.#equipmentAffected || this.#equipmentAffected.trim() === '') throw new Error('Equipment affected is missing.');
  }

  // Overriding abstract-style methods (Polymorphism)
  calculatePriorityScore() {
    const weights = { 'Low': 10, 'Normal': 20, 'High': 30, 'Urgent': 40 };
    let score = weights[this.priority] || 20;
    if (this.#hazardLevel === 'High' || this.#hazardLevel === 'Critical') score += 25;
    return score;
  }

  getTargetResolutionHours() {
    return 48; // Maintenance standard resolution target
  }

  getRequestSummary() {
    return `[Maint][ID: ${this.requestId}] ${this.title} | Bldg: ${this.#building}, Rm: ${this.#roomNumber} | Hazard: ${this.#hazardLevel} | Status: ${this.status}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      building: this.#building,
      roomNumber: this.#roomNumber,
      hazardLevel: this.#hazardLevel,
      equipmentAffected: this.#equipmentAffected
    };
  }
}

module.exports = { MaintenanceRequest };