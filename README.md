# Secure Management of Competitive Examination Question Papers

## 1. Project Description

The **Secure Management of Competitive Examination Question Papers** system is a secure web-based application designed to manage government competitive examination question papers throughout their lifecycle.

The system controls access to question papers from upload to examination release. Different users are assigned different roles such as Question Setter, Reviewer, Approver, and Exam Center. Authentication, role-based authorization, multi-factor authentication, encryption, integrity verification, audit logging, and scheduled release mechanisms are used to reduce the risk of unauthorized access, modification, and leakage.

The system is designed with a cloud deployment architecture so that the frontend, backend, database, and file storage can be hosted separately and securely.

---

## 2. Objectives

* Securely upload and store examination question papers.
* Restrict access based on user roles.
* Provide multi-factor authentication using OTP.
* Encrypt question papers before storage.
* Verify file integrity using SHA-256 hashing.
* Maintain an audit trail of important activities.
* Support reviewer and approver workflows.
* Prevent question papers from being downloaded before the scheduled release time.
* Provide controlled access to examination centers.

---

## 3. Technologies and Tools Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Axios
* Vite

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* REST API
* Maven
* JSON Web Token (JWT)

### Database and Storage

* PostgreSQL
* Supabase PostgreSQL Database
* Supabase Private Storage

### Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Multi-Factor Authentication (MFA)
* OTP
* BCrypt password/OTP hashing
* AES-GCM encryption
* SHA-256 file integrity verification
* HTTPS
* Audit Logging
* Time-based release control

### Development and Deployment Tools

* IntelliJ IDEA
* Visual Studio Code
* Postman
* Git
* GitHub
* Cloudflare Pages
* Render
* Supabase

---



## 6. Project Structure

```text
secure-question-paper-management/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/securequestionpaper/
│       │   │       └── questionpapermanagement/
│       │   │           ├── config/
│       │   │           ├── controller/
│       │   │           ├── dto/
│       │   │           ├── entity/
│       │   │           ├── repository/
│       │   │           ├── service/
│       │   │           └── util/
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    │
    └── src/
        ├── components/
        ├── pages/
        ├── App.jsx
        ├── api.js
        ├── auth.js
        ├── main.jsx
        └── styles.css
```

---

## 7. Backend Modules

### Config

Contains security, JWT authentication filter, and CORS configuration.

### Controller

Provides REST API endpoints for users, question papers, administration, and audit logs.

### DTO

Contains request data structures used by authentication and OTP operations.

### Entity

Contains database entities such as User, QuestionPaper, AuditLog, and SecuritySetting.

### Repository

Provides database access using Spring Data JPA.

### Service

Contains business logic for authentication, JWT generation, OTP/MFA, email, Supabase storage, and audit logging.

### Utility

Contains encryption, hashing, and OTP utility functions.

---

## 8. Frontend Modules

### Authentication

Provides registration, login, and OTP verification.

### Dashboard

Displays role-specific information and available actions.

### Question Paper Upload

Allows authorized Question Setters to upload PDF question papers.

### Review

Allows Reviewers to view and review submitted question papers.

### Approval

Allows Approvers to approve or reject reviewed question papers.

### Schedule Release

Allows Approvers to schedule the release time.

### Download

Allows Exam Centers to download question papers after release.

### Administration

Allows Administrators to manage users, roles, MFA settings, and audit logs.

---

## 9. Installation and Setup

### Prerequisites

Install the following:

* Java JDK
* Maven
* Node.js and npm
* Git
* A Supabase account

### Clone the Repository

```bash
git clone https://github.com/Aashima0805/secure-question-paper-management.git
cd secure-question-paper-management
```

---

## 10. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Configure the required environment variables:

```text
SUPABASE_URL
SUPABASE_KEY
ENCRYPTION_SECRET_KEY
JWT_SECRET
```

Email configuration is also required for OTP functionality:

```text
MAIL_USERNAME
MAIL_PASSWORD
```

Run the Spring Boot application using:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 11. Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 12. Sample Input and Output

### Sample Input

Question Setter uploads:

```text
Title: Mathematics Competitive Examination 2026
File: mathematics_question_paper.pdf
```

### Sample Output

The system returns a successful upload response and assigns a question paper ID.

Example:

```text
Question Paper ID: 4
Status: PENDING_REVIEW
Message: Question paper uploaded successfully.
```

### Review Example

Input:

```text
Question Paper ID: 4
Decision: REVIEWED
```

Output:

```text
Question paper marked as reviewed.
```

### Rejection Example

Input:

```text
Question Paper ID: 5
Decision: REJECTED
Reason: Incorrect question paper format.
```

Output:

```text
Question paper rejected successfully.
```

### Download Before Release

Output:

```text
Question paper is not yet available for download.
```

### Download After Release

Output:

```text
Question paper PDF downloaded successfully.
```

---

## 13. Cloud Deployment Architecture

The application is designed for deployment using separate cloud services.

```text
                     Users
                       │
                       ▼
              ┌─────────────────┐
              │  React Frontend │
              │ Cloudflare Pages│
              └────────┬────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │ Spring Boot API │
              │     Render      │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      ┌──────────────┐    ┌────────────────┐
      │   Supabase   │    │ Supabase       │
      │  PostgreSQL  │    │ Private Storage│
      └──────────────┘    └────────────────┘
             │                   │
             └─────────┬─────────┘
                       ▼
              Secure Question Papers
```

### Cloud Components

**Cloudflare Pages**

Hosts the React frontend and provides the public web interface.

**Render**

Hosts the Spring Boot backend and REST APIs.

**Supabase PostgreSQL**

Stores users, question paper metadata, audit logs, security settings, and other application data.

**Supabase Private Storage**

Stores encrypted question paper files.

### Cloud Security Flow

```text
User
 ↓
HTTPS
 ↓
React Frontend
 ↓
JWT Authentication + RBAC
 ↓
Spring Boot Backend
 ↓
Authorization + Security Checks
 ↓
Encrypted Private Storage
```

The frontend does not directly access the private question paper files. Access is controlled through the backend.

---

## 14. Future Cloud Deployment Steps

The following deployment configuration is planned:

1. Push the complete source code to GitHub.
2. Deploy the Spring Boot backend on Render.
3. Configure backend environment variables in Render.
4. Deploy the React frontend on Cloudflare Pages.
5. Update the frontend API URL to the deployed Render backend.
6. Configure CORS for the deployed frontend domain.
7. Verify authentication, authorization, upload, review, approval, scheduling, and download workflows in the cloud environment.

---

## 15. Expected Outcome

The system provides a controlled lifecycle for sensitive examination question papers. Access is restricted according to user roles, stored papers are encrypted, file integrity is verified, important actions are logged, and question papers are released only after the configured schedule.

The architecture also supports cloud deployment using separate frontend, backend, database, and storage services.

---

## 16. Repository

GitHub Repository:

```text
https://github.com/Aashima0805/secure-question-paper-management
```

---
