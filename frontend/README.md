# SecureQPM React Frontend

Complete React/Vite frontend for the Secure Question Paper Management System.

## Included

- Login
- Registration
- MFA OTP verification
- JWT Authorization
- Role-based navigation
- User dashboard
- Question Setter upload page
- Reviewer page
- Approver page
- Exam Center download page
- Admin role assignment
- Admin audit logs
- Logout
- Responsive UI
- Axios API integration
- Environment-based backend URL

## Run

```bash
npm install
npm run dev
```

Create `.env` if needed:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## Important

The frontend is built against the Spring Boot endpoint names currently established in the project:
- /users/register
- /users/login
- /users/verify-otp
- /question-papers/upload
- /question-papers/review
- /question-papers/approve
- /question-papers/download/{id}
- /admin/users/{id}/role
- /admin/audit-logs

The exact JSON fields expected by the review/approval/upload endpoints should match the current Spring Boot controller. The frontend structure is complete and those API payloads can be adjusted if your controller uses different field names.
