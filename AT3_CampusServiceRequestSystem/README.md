# Campus Service Request Management System (IS305 Major Project)

## Student Information
* **Student Name:** Brenden Kambuka
* **Student ID:** 240568
* **Course:** IS305 – Object-Oriented Programming
* **Institution:** Divine Word University, Faculty of Business and Informatics
* **Department:** Department of Information Systems

## GitHub Repository
* **Repository URL:** https://github.com/BrendenKambuka/IS305-240568
* **Project Folder:** `AT3_CampusServiceRequestSystem/`

---

## Project Overview
The Campus Service Request Management System is an advanced, object-oriented Node.js console application designed to digitize and streamline how students and staff report, assign, process, and monitor campus service issues. The application is built across progressive tiers (Pass, Credit, and Distinction), implementing encapsulation, inheritance, constructor chaining, polymorphism, abstract-style base classes, file repositories, the factory pattern, asynchronous JSON persistence using `fs/promises`, management analytics, and an automated unit test suite.

---

## Achievement Components Attempted
- [x] **Pass Component (25 Marks):** Core classes, private fields, encapsulation, accessors, validation arrays, and interactive console workflow.
- [x] **Credit Component (10 Marks):** Inheritance hierarchies (`User` and `ServiceRequest` subclasses), constructor chaining (`super()`), role permissions, controlled state-machine workflows, method overriding, search/filter/sort, and audit history.
- [x] **Distinction Component (15 Marks):** Abstract-style base class enforcement, polymorphism across a mixed collection, JSON file persistence via repositories, object restoration factory, management analytics reports using array algorithms, and an automated test suite.

---

## Features Completed
1. **Role-Based User Hierarchy:** Base `User` class extended into specialized subclasses: `StudentRequester`, `StaffRequester`, `ServiceOfficer`, and `Technician`.
2. **Specialised Request Subclasses:** Abstract-style base `ServiceRequest` class extended into `ICTSupportRequest`, `MaintenanceRequest`, and `CleaningRequest`, implementing custom priority scoring and resolution hours via method overriding (polymorphism).
3. **Controlled State-Machine Workflow:** Strict status transitions (`Submitted` → `Reviewed` → `Assigned` → `In Progress` → `Resolved` → `Closed`, with `Cancelled` as a terminal state) guarded by role permission checks.
4. **JSON File Persistence & Repositories:** Asynchronous file I/O using `node:fs/promises` via dedicated repository classes (`UserFileRepository`, `ServiceRequestFileRepository`) without external databases.
5. **Object Restoration Factory:** `ServiceRequestFactory` dynamically re-instantiates plain JSON data back into active specialised class instances upon system startup, preserving full method and polymorphic behavior.
6. **Management Analytics:** Advanced reports using high-order array methods (`filter`, `map`, `reduce`, `sort`) to calculate status summaries, category distribution, technician workload, location volume, and average resolution times.
7. **Automated Unit Testing:** Comprehensive test suite leveraging Node.js built-in test runner (`node --test`) covering validation, permissions, polymorphic execution, and file persistence.

---

## Project Folder Structure
```text
AT3_CampusServiceRequestSystem/
│
├── data/
│   ├── users.json
│   ├── serviceRequests.json
│   └── auditLog.json
│
├── models/
│   ├── User.js
│   ├── StudentRequester.js
│   ├── StaffRequester.js
│   ├── ServiceOfficer.js
│   ├── Technician.js
│   ├── ServiceRequest.js
│   ├── ICTSupportRequest.js
│   ├── MaintenanceRequest.js
│   └── CleaningRequest.js
│
├── factories/
│   └── ServiceRequestFactory.js
│
├── repositories/
│   ├── UserFileRepository.js
│   └── ServiceRequestFileRepository.js
│
├── services/
│   ├── ServiceRequestManager.js
│   └── ReportService.js
│
├── tests/
│   └── system.test.js
│
├── app.js
├── package.json
└── README.md

```

---

## Installation Instructions

1. Ensure **Node.js** (v18 or higher) is installed on your machine.
2. Clone or extract the project repository.
3. Open your terminal inside the `AT3_CampusServiceRequestSystem` directory.
4. Install dependencies (if any required packages):
```bash
npm install

```



---

## Commands for Running the Application

To launch the interactive console application menu:

```bash
npm start

```

*(Alternatively, you can run `node app.js`)*

---

## Commands for Running Tests

To execute the automated unit test suite using Node's built-in test runner (`node --test`):

```bash
npm test

```

---

## Explanation of the JSON Data Files

* **Storage Strategy:** All application data is persisted locally inside the `data/` directory using standard JSON files (`users.json` and `serviceRequests.json`). No external database is utilized.
* **`users.json`**: Stores serialized records of all registered students, staff, service officers, and technicians, including their specific roles and attributes.
* **`serviceRequests.json`**: Stores serialized records of all submitted service requests, including category-specific fields, assigned technicians, current status, and full historical audit trails.

---

## Explanation of How Objects Are Restored from Saved Data

When the application starts up, plain JSON records read from storage lose their class methods and prototype bindings. To restore full object-oriented capabilities:

1. **User Repositories** inspect the stored `userType` attribute and map plain objects back to their respective specialised subclasses (`StudentRequester`, `StaffRequester`, `ServiceOfficer`, `Technician`).
2. **Service Request Repositories** utilize **`ServiceRequestFactory`**, which reads the stored `requestType` field, re-instantiates the correct specialised subclass (`ICTSupportRequest`, `MaintenanceRequest`, or `CleaningRequest`), rebinds the requester user object, and restores full method functionality and polymorphic behavior.

---

## Sample User Scenario

1. **Register User:** Register a Student (`240568`), a Service Officer (`OFF001`), and a Technician (`TECH001`).
2. **Submit Request:** Student submits an `ICTSupportRequest` for campus Wi-Fi failure in Library Level 2.
3. **Review & Assign:** Service Officer reviews the submission, sets priority, and assigns `TECH001`.
4. **Work Progress:** Technician starts work, updates progress notes, and marks the request as `Resolved`.
5. **Closure:** Service Officer reviews the resolution details and officially closes the request.

---

## Known Limitations & Future Improvements

* **Limitation:** Console-based text interface lacks graphical user interaction.
* **Limitation:** File-locking mechanisms are not implemented, which could cause race conditions in multi-process environments.
* **Future Improvement:** Develop a REST API backend using Express.js and transition file persistence to an ORM-backed relational database for enterprise scaling.

---

## Approved AI Use Declaration

*In accordance with Divine Word University policy, generative AI tools were consulted as an educational collaborator for architectural guidance, debugging assistance, and syntax reference during the development of this project. All code architecture, testing, and documentation have been thoroughly reviewed, understood, and defended by the student.*

```

```