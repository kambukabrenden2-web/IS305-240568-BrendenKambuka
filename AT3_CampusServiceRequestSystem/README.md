# Campus Service Request Management System (IS305 Major Project)

## Student Information
* **Student Name:** Brenden Kambuka
* **Student ID:** 240568
* **Course:** IS305 – Object-Oriented Programming
* **Institution:** Divine Word University, Faculty of Business and Informatics
* **Department:** Department of Information Systems

## GitHub Repository
* **Repository URL:**  https://github.com/kambukabrenden2-web/IS305-240568-BrendenKambuka.git
* **Project Folder:** `AT3_CampusServiceRequestSystem/`

---

## Project Overview
The Campus Service Request Management System is a robust, object-oriented Node.js console application designed to digitize and streamline how students and staff report, assign, process, and monitor campus service issues (ICT Support, Facilities Maintenance, Cleaning and Sanitation, and General Services). The application is built across progressive tiers (Pass, Credit, and Distinction), implementing encapsulation, inheritance, constructor chaining, polymorphism, abstract-style base classes, file repositories, the factory pattern, asynchronous JSON persistence using `fs/promises`, management analytics, and automated unit testing.

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