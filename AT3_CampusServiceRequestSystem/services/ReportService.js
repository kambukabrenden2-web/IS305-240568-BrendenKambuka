class ReportService {
  constructor(requestManager) {
    this.requestManager = requestManager;
  }

  getRequestsByStatus() {
    const requests = this.requestManager.getAllRequests();
    return requests.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
  }

  getRequestsByCategory() {
    const requests = this.requestManager.getAllRequests();
    return requests.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
  }

  getRequestsByPriority() {
    const requests = this.requestManager.getAllRequests();
    return requests.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});
  }

  getUrgentRequests() {
    return this.requestManager.getAllRequests().filter(r => r.priority === 'Urgent');
  }

  getCompletedRequestsByTechnician(technicianId) {
    return this.requestManager.getAllRequests().filter(r => 
      r.assignedTechnician && 
      r.assignedTechnician.userId === technicianId && 
      (r.status === 'Resolved' || r.status === 'Closed')
    );
  }

  getRequestVolumeByLocation() {
    const requests = this.requestManager.getAllRequests();
    return requests.reduce((acc, r) => {
      const loc = r.campusLocation;
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
  }

  getAverageResolutionTimeHours() {
    const resolved = this.requestManager.getAllRequests().filter(r => r.status === 'Closed' || r.status === 'Resolved');
    if (resolved.length === 0) return 0;

    const totalHours = resolved.reduce((sum, r) => {
      const submitted = new Date(r.dateSubmitted);
      const updated = new Date(r.dateUpdated);
      const diffHours = (updated - submitted) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return Number((totalHours / resolved.length).toFixed(2));
  }
}

module.exports = ReportService;