class ServiceRequest {
  #requestId;
  #requester;
  #title;
  #description;
  #campusLocation;
  #category;
  #priority;
  #status;
  #assignedTechnician;
  #dateSubmitted;
  #dateUpdated;
  #history;

  static VALID_STATUSES = ['Submitted', 'Reviewed', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];
  
  // Controlled State Machine Workflow Transitions
  static ALLOWED_TRANSITIONS = {
    'Submitted': ['Reviewed', 'Cancelled'],
    'Reviewed': ['Assigned', 'Cancelled'],
    'Assigned': ['In Progress', 'Cancelled'],
    'In Progress': ['Resolved', 'Cancelled'],
    'Resolved': ['Closed'],
    'Closed': [],
    'Cancelled': []
  };

  constructor(requestId, requester, title, description, campusLocation, category, priority = 'Normal') {
    // Enforce abstract-style base class check
    if (this.constructor === ServiceRequest) {
      throw new Error("Cannot instantiate abstract class ServiceRequest directly.");
    }

    this.#requestId = requestId;
    this.#requester = requester;
    this.#title = title;
    this.#description = description;
    this.#campusLocation = campusLocation;
    this.#category = category;
    this.#priority = priority;
    this.#status = 'Submitted';
    this.#assignedTechnician = null;
    this.#dateSubmitted = new Date();
    this.#dateUpdated = new Date();
    this.#history = [];

    this.logHistory('Submitted', 'Submitted', 'Initial request creation', requester.userId, 'Created request');
    this.validateBase();
  }

  // Getters
  get requestId() { return this.#requestId; }
  get requester() { return this.#requester; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get campusLocation() { return this.#campusLocation; }
  get category() { return this.#category; }
  get priority() { return this.#priority; }
  get status() { return this.#status; }
  get assignedTechnician() { return this.#assignedTechnician; }
  get dateSubmitted() { return this.#dateSubmitted; }
  get dateUpdated() { return this.#dateUpdated; }
  get history() { return [...this.#history]; }

  // Controlled Setters / State Modifiers for Repository Restoration
  set status(newStatus) { this.#status = newStatus; }
  set assignedTechnician(tech) { this.#assignedTechnician = tech; }
  set dateSubmitted(date) { this.#dateSubmitted = date; }
  set dateUpdated(date) { this.#dateUpdated = date; }

  logHistory(prevStatus, newStatus, action, actorId, comment) {
    this.#history.push({
      previousStatus: prevStatus,
      newStatus: newStatus,
      actionPerformed: action,
      actor: actorId,
      comment: comment,
      timestamp: new Date()
    });
  }

  transitionStatus(newStatus, actorId, action, comment) {
    if (!ServiceRequest.VALID_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid status: "${newStatus}".`);
    }
    const allowed = ServiceRequest.ALLOWED_TRANSITIONS[this.#status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Illegal state transition from "${this.#status}" to "${newStatus}".`);
    }
    const oldStatus = this.#status;
    this.#status = newStatus;
    this.#dateUpdated = new Date();
    this.logHistory(oldStatus, newStatus, action, actorId, comment);
  }

  validateBase() {
    if (!this.#requestId || String(this.#requestId).trim() === '') throw new Error('Request ID is missing.');
    if (!this.#requester) throw new Error('Requester object is missing.');
    if (!this.#title || this.#title.trim() === '') throw new Error('Request title is missing.');
    if (!this.#description || this.#description.trim() === '') throw new Error('Request description is missing.');
    if (!this.#campusLocation || this.#campusLocation.trim() === '') throw new Error('Campus location is missing.');
  }

  // Abstract-style methods enforcing implementation in subclasses
  calculatePriorityScore() {
    throw new Error(`Method 'calculatePriorityScore()' must be implemented by subclass ${this.constructor.name}.`);
  }

  getTargetResolutionHours() {
    throw new Error(`Method 'getTargetResolutionHours()' must be implemented by subclass ${this.constructor.name}.`);
  }

  getRequestSummary() {
    throw new Error(`Method 'getRequestSummary()' must be implemented by subclass ${this.constructor.name}.`);
  }

  toJSON() {
    return {
      requestId: this.#requestId,
      requestType: this.constructor.name,
      requesterId: this.#requester.userId,
      title: this.#title,
      description: this.#description,
      campusLocation: this.#campusLocation,
      category: this.#category,
      priority: this.#priority,
      status: this.#status,
      assignedTechnicianId: this.#assignedTechnician ? this.#assignedTechnician.userId : null,
      dateSubmitted: this.#dateSubmitted,
      dateUpdated: this.#dateUpdated,
      history: this.#history
    };
  }
}

module.exports = ServiceRequest;