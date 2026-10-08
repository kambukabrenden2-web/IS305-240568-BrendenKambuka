const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

// Import User Subclasses
const StudentRequester = require('./models/StudentRequester');
const StaffRequester = require('./models/StaffRequester');
const ServiceOfficer = require('./models/ServiceOfficer');
const Technician = require('./models/Technician');

// Import Request Subclasses
const { ICTSupportRequest } = require('./models/ICTSupportRequest');
const { MaintenanceRequest } = require('./models/MaintenanceRequest');
const { CleaningRequest } = require('./models/CleaningRequest');

// Import Repositories and Services
const UserFileRepository = require('./repositories/UserFileRepository');
const ServiceRequestFileRepository = require('./repositories/ServiceRequestFileRepository');
const ServiceRequestManager = require('./services/ServiceRequestManager');
const ReportService = require('./services/ReportService');

const userRepo = new UserFileRepository();
const requestRepo = new ServiceRequestFileRepository();
const manager = new ServiceRequestManager();
const reportService = new ReportService(manager);

const rl = readline.createInterface({ input, output });

async function initializeData() {
  try {
    const users = await userRepo.loadAll();
    manager.setUsers(users);

    const requests = await requestRepo.loadAll(manager);
    manager.setRequests(requests);
    console.log(`[System]: Loaded ${users.length} users and ${requests.length} requests from JSON storage.`);
  } catch (error) {
    console.log(`[Startup Warning]: Could not load data files (${error.message}). Starting with empty state.`);
  }
}

async function persistData() {
  try {
    await userRepo.saveAll(manager.getAllUsers());
    await requestRepo.saveAll(manager.getAllRequests());
  } catch (error) {
    console.log(`[Persistence Error]: Failed to save data - ${error.message}`);
  }
}

function displayMenu() {
  console.log('\n==================================================');
  console.log('     CAMPUS SERVICE REQUEST MANAGEMENT SYSTEM');
  console.log('==================================================');
  console.log('1. Register User');
  console.log('2. Submit Service Request');
  console.log('3. View Request Details by ID');
  console.log('4. View My Requests');
  console.log('5. View All Requests (Polymorphic Summaries)');
  console.log('6. Service Officer Workflow (Review / Assign)');
  console.log('7. Technician Workflow (Start / Resolve Work)');
  console.log('8. Service Officer Workflow (Close Request)');
  console.log('9. Cancel Request');
  console.log('10. Search & Filter Requests');
  console.log('11. View Management Reports');
  console.log('12. Exit System');
  console.log('==================================================');
}

async function main() {
  await initializeData();
  let running = true;

  while (running) {
    displayMenu();
    const choice = await rl.question('Select an option (1-12): ');

    try {
      switch (choice.trim()) {
        case '1':
          await handleRegisterUser();
          break;
        case '2':
          await handleSubmitRequest();
          break;
        case '3':
          await handleViewRequestById();
          break;
        case '4':
          await handleViewMyRequests();
          break;
        case '5':
          handleViewAllRequests();
          break;
        case '6':
          await handleOfficerWorkflow();
          break;
        case '7':
          await handleTechnicianWorkflow();
          break;
        case '8':
          await handleCloseRequest();
          break;
        case '9':
          await handleCancelRequest();
          break;
        case '10':
          await handleSearchAndFilter();
          break;
        case '11':
          handleManagementReports();
          break;
        case '12':
          await persistData();
          console.log('\nData saved successfully. Exiting system. Goodbye!');
          running = false;
          break;
        default:
          console.log('\n[Error]: Invalid option. Please enter a number between 1 and 12.');
      }
    } catch (error) {
      console.log(`\n[Application Error]: ${error.message}`);
    }
  }
  rl.close();
}

// --- Menu Handlers ---

async function handleRegisterUser() {
  console.log('\n--- Register User ---');
  const userId = await rl.question('Enter User ID: ');
  const firstName = await rl.question('Enter First Name: ');
  const lastName = await rl.question('Enter Last Name: ');
  const email = await rl.question('Enter Email Address: ');
  
  console.log('\nSelect User Role:');
  console.log('1. Student Requester');
  console.log('2. Staff Requester');
  console.log('3. Service Officer');
  console.log('4. Technician');
  const roleChoice = await rl.question('Select role (1-4): ');

  let user;
  if (roleChoice === '1') {
    const programme = await rl.question('Enter Programme: ');
    const yearLevel = parseInt(await rl.question('Enter Year Level (1-5): '));
    user = new StudentRequester(userId, firstName, lastName, email, programme, yearLevel);
  } else if (roleChoice === '2') {
    const department = await rl.question('Enter Department: ');
    user = new StaffRequester(userId, firstName, lastName, email, department);
  } else if (roleChoice === '3') {
    const section = await rl.question('Enter Service Section: ');
    user = new ServiceOfficer(userId, firstName, lastName, email, section);
  } else if (roleChoice === '4') {
    const speciality = await rl.question('Enter Technical Speciality: ');
    user = new Technician(userId, firstName, lastName, email, speciality);
  } else {
    throw new Error('Invalid role selection.');
  }

  manager.registerUser(user);
  await persistData();
  console.log(`\nSuccess: User ${user.getFullName()} (${user.userType}) registered successfully.`);
}

async function handleSubmitRequest() {
  console.log('\n--- Submit Service Request ---');
  const userId = await rl.question('Enter your User ID: ');
  const requester = manager.findUserById(userId);
  if (!requester) {
    console.log('\n[Error]: User ID not found. Please register first.');
    return;
  }

  const requestId = await rl.question('Enter Request ID: ');
  const title = await rl.question('Enter Title: ');
  const description = await rl.question('Enter Description: ');
  const campusLocation = await rl.question('Enter Campus Location: ');

  console.log('\nSelect Request Category:');
  console.log('1. ICT Support');
  console.log('2. Facilities Maintenance');
  console.log('3. Cleaning and Sanitation');
  const catChoice = await rl.question('Select category (1-3): ');

  console.log('\nPriorities: 1. Low | 2. Normal | 3. High | 4. Urgent');
  const prioChoice = await rl.question('Select priority (1-4, default Normal): ');
  const priorities = ['Low', 'Normal', 'High', 'Urgent'];
  const priority = priorities[parseInt(prioChoice) - 1] || 'Normal';

  let request;
  if (catChoice === '1') {
    const deviceType = await rl.question('Enter Device Type (e.g. Laptop, Projector): ');
    const systemName = await rl.question('Enter System Name: ');
    const faultType = await rl.question('Enter Fault Type: ');
    const networkImpact = await rl.question('Enter Network Impact (Low, High, Critical): ');
    request = new ICTSupportRequest(requestId, requester, title, description, campusLocation, priority, deviceType, systemName, faultType, networkImpact);
  } else if (catChoice === '2') {
    const building = await rl.question('Enter Building Name: ');
    const roomNumber = await rl.question('Enter Room Number: ');
    const hazardLevel = await rl.question('Enter Hazard Level (Low, Medium, High): ');
    const equipmentAffected = await rl.question('Enter Equipment Affected: ');
    request = new MaintenanceRequest(requestId, requester, title, description, campusLocation, priority, building, roomNumber, hazardLevel, equipmentAffected);
  } else if (catChoice === '3') {
    const cleaningArea = await rl.question('Enter Cleaning Area: ');
    const hygieneRisk = await rl.question('Enter Hygiene Risk (Low, Medium, High): ');
    const serviceType = await rl.question('Enter Service Type: ');
    const preferredServiceTime = await rl.question('Enter Preferred Time: ');
    request = new CleaningRequest(requestId, requester, title, description, campusLocation, priority, cleaningArea, hygieneRisk, serviceType, preferredServiceTime);
  } else {
    throw new Error('Invalid category selection.');
  }

  manager.submitRequest(request);
  await persistData();
  console.log(`\nSuccess: Request ${requestId} submitted successfully with status [Submitted].`);
}

async function handleViewRequestById() {
  const requestId = await rl.question('\nEnter Request ID to view: ');
  const request = manager.findRequestById(requestId);
  if (!request) {
    console.log('\n[Error]: Request not found.');
  } else {
    console.log('\n--- Request Details & Polymorphic Behaviour ---');
    console.log(request.getRequestSummary());
    console.log(`Calculated Priority Score: ${request.calculatePriorityScore()}`);
    console.log(`Target Resolution Hours: ${request.getTargetResolutionHours()} hrs`);
    console.log(`Requester: ${request.requester.getFullName()} (${request.requester.userId})`);
    console.log(`Location: ${request.campusLocation} | Status: ${request.status}`);
    console.log(`Assigned Technician: ${request.assignedTechnician ? request.assignedTechnician.getFullName() : 'None'}`);
    console.log(`Description: ${request.description}`);
    console.log('--- Audit / History Trail ---');
    request.history.forEach((h, idx) => {
      console.log(`${idx + 1}. [${h.timestamp.toISOString()}] ${h.actionPerformed} (${h.previousStatus} -> ${h.newStatus}) by ${h.actor}: "${h.comment}"`);
    });
  }
}

async function handleViewMyRequests() {
  const userId = await rl.question('\nEnter your User ID: ');
  const requests = manager.getRequestsByUser(userId);
  if (requests.length === 0) {
    console.log('\nNo requests found for this user ID.');
  } else {
    console.log(`\n--- Requests for User ID: ${userId} ---`);
    requests.forEach(r => console.log(r.getRequestSummary()));
  }
}

function handleViewAllRequests() {
  const requests = manager.getAllRequests();
  if (requests.length === 0) {
    console.log('\nNo requests in the system.');
  } else {
    console.log('\n--- All Service Requests (Polymorphic Iteration) ---');
    requests.forEach(r => {
      console.log(r.getRequestSummary());
      console.log(`   -> Priority Score: ${r.calculatePriorityScore()} | Target Hours: ${r.getTargetResolutionHours()}h`);
    });
  }
}

async function handleOfficerWorkflow() {
  console.log('\n--- Service Officer Workflow ---');
  const officerId = await rl.question('Enter your Service Officer User ID: ');
  const requestId = await rl.question('Enter Request ID: ');
  
  console.log('1. Review Request');
  console.log('2. Assign Technician');
  const action = await rl.question('Select action (1-2): ');

  if (action === '1') {
    const comment = await rl.question('Enter review comment: ');
    manager.reviewRequest(requestId, officerId, comment);
    console.log('\nSuccess: Request marked as [Reviewed].');
  } else if (action === '2') {
    const techId = await rl.question('Enter Technician User ID to assign: ');
    const comment = await rl.question('Enter assignment comment: ');
    manager.assignTechnician(requestId, officerId, techId, comment);
    console.log('\nSuccess: Technician assigned and request marked as [Assigned].');
  }
  await persistData();
}

async function handleTechnicianWorkflow() {
  console.log('\n--- Technician Workflow ---');
  const techId = await rl.question('Enter your Technician User ID: ');
  const requestId = await rl.question('Enter Request ID: ');

  console.log('1. Begin Work (In Progress)');
  console.log('2. Resolve Request (Resolved)');
  const action = await rl.question('Select action (1-2): ');

  if (action === '1') {
    const comment = await rl.question('Enter progress note: ');
    manager.startWork(requestId, techId, comment);
    console.log('\nSuccess: Request marked as [In Progress].');
  } else if (action === '2') {
    const comment = await rl.question('Enter resolution summary: ');
    manager.resolveRequest(requestId, techId, comment);
    console.log('\nSuccess: Request marked as [Resolved].');
  }
  await persistData();
}

async function handleCloseRequest() {
  console.log('\n--- Close Request (Service Officer) ---');
  const officerId = await rl.question('Enter your Service Officer User ID: ');
  const requestId = await rl.question('Enter Request ID to close: ');
  const comment = await rl.question('Enter closure verification comment: ');

  manager.closeRequest(requestId, officerId, comment);
  await persistData();
  console.log('\nSuccess: Request verified and marked as [Closed].');
}

async function handleCancelRequest() {
  const requestId = await rl.question('\nEnter Request ID to cancel: ');
  const userId = await rl.question('Enter your User ID (Requester verification): ');
  const comment = await rl.question('Enter cancellation reason: ');

  manager.cancelRequest(requestId, userId, comment);
  await persistData();
  console.log(`\nSuccess: Request ${requestId} has been cancelled.`);
}

async function handleSearchAndFilter() {
  console.log('\n--- Search & Filter ---');
  console.log('1. Free-text Search');
  console.log('2. Filter by Category & Status');
  const choice = await rl.question('Select option (1-2): ');

  if (choice === '1') {
    const query = await rl.question('Enter search keyword: ');
    const results = manager.searchRequests(query);
    console.log(`\n--- Search Results (${results.length}) ---`);
    results.forEach(r => console.log(r.getRequestSummary()));
  } else {
    const category = await rl.question('Category filter (leave blank to ignore): ');
    const status = await rl.question('Status filter (leave blank to ignore): ');
    const results = manager.filterRequests({
      category: category.trim() || undefined,
      status: status.trim() || undefined
    });
    console.log(`\n--- Filter Results (${results.length}) ---`);
    results.forEach(r => console.log(r.getRequestSummary()));
  }
}

function handleManagementReports() {
  console.log('\n==================================================');
  console.log('              MANAGEMENT REPORTS');
  console.log('==================================================');
  console.log('Requests by Status:', reportService.getRequestsByStatus());
  console.log('Requests by Category:', reportService.getRequestsByCategory());
  console.log('Requests by Priority:', reportService.getRequestsByPriority());
  console.log('Urgent Requests Count:', reportService.getUrgentRequests().length);
  console.log('Volume by Location:', reportService.getRequestVolumeByLocation());
  console.log(`Average Resolution Time: ${reportService.getAverageResolutionTimeHours()} hours`);
  console.log('==================================================');
}

if (require.main === module) {
  main();
}