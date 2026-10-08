const { ICTSupportRequest } = require('../models/ICTSupportRequest');
const { MaintenanceRequest } = require('../models/MaintenanceRequest');
const { CleaningRequest } = require('../models/CleaningRequest');

class ServiceRequestFactory {
  static createFromData(data, userManager) {
    const requester = userManager.findUserById(data.requesterId);
    if (!requester) {
      throw new Error(`Restoration Error: Requester ID "${data.requesterId}" not found for request "${data.requestId}".`);
    }

    let request;
    switch (data.requestType) {
      case 'ICTSupportRequest':
        request = new ICTSupportRequest(
          data.requestId,
          requester,
          data.title,
          data.description,
          data.campusLocation,
          data.priority,
          data.deviceType,
          data.systemName,
          data.faultType,
          data.networkImpact
        );
        break;

      case 'MaintenanceRequest':
        request = new MaintenanceRequest(
          data.requestId,
          requester,
          data.title,
          data.description,
          data.campusLocation,
          data.priority,
          data.building,
          data.roomNumber,
          data.hazardLevel,
          data.equipmentAffected
        );
        break;

      case 'CleaningRequest':
        request = new CleaningRequest(
          data.requestId,
          requester,
          data.title,
          data.description,
          data.campusLocation,
          data.priority,
          data.cleaningArea,
          data.hygieneRisk,
          data.serviceType,
          data.preferredServiceTime
        );
        break;

      default:
        throw new Error(`Restoration Error: Unknown request type "${data.requestType}" encountered.`);
    }

    // Restore hidden state and timeline timestamps
    request.status = data.status;
    if (data.assignedTechnicianId) {
      const technician = userManager.findUserById(data.assignedTechnicianId);
      if (technician) {
        request.assignedTechnician = technician;
      }
    }
    request.dateSubmitted = new Date(data.dateSubmitted);
    request.dateUpdated = new Date(data.dateUpdated);

    return request;
  }
}

module.exports = ServiceRequestFactory;