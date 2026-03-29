**ReimbursePro**

A modern, streamlined expense management system built with Editorial Minimalism. ReimbursePro provides a high-fidelity solution for managing corporate expenditures, bridging the gap between financial complexity and intuitive user experience.

-  Highlights
  
OCR Scan: Snap and upload receipts instantly, with automatic form-filling capabilities.

Smart Tracker: Real-time currency conversion (USD/EUR to INR) using live conversion rates.

Approval Flow: A vertical pipeline to track reimbursements through multi-level sequential approvals.

Hybrid Rules: Advanced approval logic including 60% threshold rules and specific role (CFO) auto-approvals.

Dashboards: Dedicated, role-based views for Employees, Managers, and Admins.

- Tech Stack
  
Frontend: HTML5, Vanilla CSS, JavaScript (ES6+).

Backend: Node.js, Express, MySQL.

Design: "Atelier Void" style featuring Emerald Green (#10B981).

File Handling: Multer for secure local receipt storage.

- Getting Started
  
1. Database Configuration
Import the provided database.sql into your MySQL instance.

This sets up the core tables for users, expenses, and the dynamic approval sequence.

2. Installation
Clone the repository to your local machine.

Navigate to the root folder and run:

Bash
npm install
This installs essential dependencies: express, mysql2, cors, and multer.

3. Environment Setup
Ensure a local directory exists at ./uploads/receipts for receipt image storage.

Update the database credentials in server.js with your MySQL user and password.

4. Launch
Start the backend server:

Bash
node backend/server.js
Open frontend/login.html in your browser to begin.

- Approval Logic & Sequence
  
ReimbursePro supports an admin-defined vertical pipeline:

Sequence: Expenses move sequentially (e.g., Manager → Finance → CFO).

CFO Rule: Any approval by a user with the CFO role triggers an automatic final approval bypass.

Progression: An expense only moves to the next stage once the current step is approved.
