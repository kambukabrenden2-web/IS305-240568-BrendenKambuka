class ServiceRequestManager {
  #users;
  #requests;

  constructor() {
    this.#users = [];
    this.#requests = [];
  }

  // --- User Management ---
  registerUser(user) {
    const existing = this.findUserById(user.userId);
    if (existing) {
      throw new Error(`Duplicate user ID: "${user.userId}" already exists.`);
    }
    this.#users.push(user);
    return true;
  }

  findUserById(userId) {
    return this.#users.find(u => u.userId === userId) || null;
  }

  getAllUsers() {
    return [...this.#users];
  }

  // --- Request Management ---
  submitRequest(request) {
    const existing = this.findRequestById(request.requestId);
    if (existing) {
      throw new Error(`Duplicate request ID: "${request.requestId}" already exists.`);
    }
    const userExists = this.findUserById(request.requester.userId);
    if (!userExists) {
      throw new Error('Requester must be registered in the system before submitting a request.');
    }
    this.#requests.push(request);
    return true;
  }

  findRequestById(requestId) {
    return this.#requests.find(r => r.requestId === requestId) || null;
  }

  getRequestsByUser(userId) {
    return this.#requests.filter(r => r.requester.userId === userId);
  }

  getAllRequests() {
    return [...this.#requests];
  }

  // Setters for repository loading restoration
  setUsers(users) {
    this.#users = [...users];
  }

  setRequests(requests) {
    this.#requests = [...requests];
  }

  // --- Controlled Workflow Actions ---
  reviewRequest(requestId, officerId, comment) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    const officer = this.findUserById(officerId);
    if (!officer || officer.userType !== 'ServiceOfficer') {
      throw new Error('Unauthorized: Only a Service Officer can review requests.');
    }
    request.transitionStatus('Reviewed', officerId, 'Review Request', comment);
    return true;
  }

  assignTechnician(requestId, officerId, technicianId, comment) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    const officer = this.findUserById(officerId);
    if (!officer || officer.userType !== 'ServiceOfficer') {
      throw new Error('Unauthorized: Only a Service Officer can assign Technicians.');
    }
    const technician = this.findUserById(technicianId);
    if (!technician || technician.userType !== 'Technician') {
      throw new Error(`User ID "${technicianId}" is not a registered Technician.`);
    }
    request.assignedTechnician = technician;
    request.transitionStatus('Assigned', officerId, 'Assign Technician', comment);
    return true;
  }

  startWork(requestId, technicianId, comment) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    if (!request.assignedTechnician || request.assignedTechnician.userId !== technicianId) {
      throw new Error('Unauthorized: Only the assigned Technician can start work.');
    }
    request.transitionStatus('In Progress', technicianId, 'Begin Work', comment);
    return true;
  }

  resolveRequest(requestId, technicianId, comment) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    if (!request.assignedTechnician || request.assignedTechnician.userId !== technicianId) {
      throw new Error('Unauthorized: Only the assigned Technician can resolve work.');
    }
    request.transitionStatus('Resolved', technicianId, 'Resolve Request', comment);
    return true;
  }

  closeRequest(requestId, officerId, comment) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    const officer = this.findUserById(officerId);
    if (!officer || officer.userType !== 'ServiceOfficer') {
      throw new Error('Unauthorized: Only a Service Officer can close requests.');
    }
    request.transitionStatus('Closed', officerId, 'Close Request', comment);
    return true;
  }

  cancelRequest(requestId, userId, comment = 'Request cancelled by user') {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    if (request.requester.userId !== userId) {
      throw new Error('Unauthorized: Cancellation can only be attempted by the original requester.');
    }
    request.transitionStatus('Cancelled', userId, 'Cancel Request', comment);
    return true;
  }

  // --- Search, Filter, and Sort ---
  searchRequests(searchText) {
    const query = searchText.toLowerCase();
    return this.#requests.filter(r => 
      r.requestId.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.campusLocation.toLowerCase().includes(query) ||
      r.status.toLowerCase().includes(query)
    );
  }

  filterRequests({ category, status, priority, technicianId }) {
    return this.#requests.filter(r => {
      if (category && r.category !== category) return false;
      if (status && r.status !== status) return false;
      if (priority && r.priority !== priority) return false;
      if (technicianId && (!r.assignedTechnician || r.assignedTechnician.userId !== technicianId)) return false;
      return true;
    });
  }

  sortRequests(criteria = 'dateSubmitted') {
    const sorted = [...this.#requests];
    if (criteria === 'dateSubmitted') {
      sorted.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
    } else if (criteria === 'priority') {
      sorted.sort((a, b) => b.calculatePriorityScore() - a.calculatePriorityScore());
    }
    return sorted;
  }
}

module.exports = ServiceRequestManager;