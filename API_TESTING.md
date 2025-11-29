# API Testing Collection - Employee Leave Management System

This document contains sample API requests for testing the ELS backend.

## Authentication

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123"
}
```

### Verify Email
```bash
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "token": "YOUR_VERIFICATION_TOKEN_FROM_EMAIL"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@test.com",
  "password": "password123"
}
```

### Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Profile
```bash
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

## Leave Management - Employee

### Apply for Leave
```bash
POST http://localhost:5000/api/leaves
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "leaveType": "sick",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "totalDays": 3,
  "reason": "Medical appointment and recovery"
}
```

### Get My Requests
```bash
GET http://localhost:5000/api/leaves/my-requests?status=pending&page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cancel Leave Request
```bash
DELETE http://localhost:5000/api/leaves/REQUEST_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Leave Balance
```bash
GET http://localhost:5000/api/leaves/balance
Authorization: Bearer YOUR_JWT_TOKEN
```

## Leave Management - Manager

### Get All Requests
```bash
GET http://localhost:5000/api/leaves/all?status=approved&page=1&limit=10
Authorization: Bearer MANAGER_JWT_TOKEN
```

### Get Pending Requests
```bash
GET http://localhost:5000/api/leaves/pending?page=1&limit=10
Authorization: Bearer MANAGER_JWT_TOKEN
```

### Approve Leave Request
```bash
PUT http://localhost:5000/api/leaves/REQUEST_ID/approve
Authorization: Bearer MANAGER_JWT_TOKEN
Content-Type: application/json

{
  "managerComment": "Approved. Have a good rest."
}
```

### Reject Leave Request
```bash
PUT http://localhost:5000/api/leaves/REQUEST_ID/reject
Authorization: Bearer MANAGER_JWT_TOKEN
Content-Type: application/json

{
  "managerComment": "Cannot approve due to project deadlines. Please reschedule."
}
```

## Dashboard

### Employee Dashboard
```bash
GET http://localhost:5000/api/dashboard/employee
Authorization: Bearer YOUR_JWT_TOKEN
```

### Manager Dashboard
```bash
GET http://localhost:5000/api/dashboard/manager
Authorization: Bearer MANAGER_JWT_TOKEN
```

## Notifications

### Get Notifications
```bash
GET http://localhost:5000/api/notifications?unreadOnly=true&page=1&limit=20
Authorization: Bearer YOUR_JWT_TOKEN
```

### Mark Notification as Read
```bash
PUT http://localhost:5000/api/notifications/NOTIFICATION_ID/read
Authorization: Bearer YOUR_JWT_TOKEN
```

### Mark All Notifications as Read
```bash
PUT http://localhost:5000/api/notifications/mark-all-read
Authorization: Bearer YOUR_JWT_TOKEN
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'
```

### Apply Leave (with token)
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"leaveType":"sick","startDate":"2025-12-01","endDate":"2025-12-03","totalDays":3,"reason":"Medical appointment"}'
```

## Testing with Postman

1. Import this file as a collection
2. Create environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)
   - `manager_token`: (will be set after manager login)

3. After login, save the token:
   ```javascript
   // In Tests tab of login request
   const response = pm.response.json();
   pm.environment.set("token", response.data.token);
   ```

4. Use `{{base_url}}` and `{{token}}` in requests

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (only in development)"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
