# Student Management System - Backend API

## Overview
This is a RESTful API backend for a Student Management System, designed as part of a frontend developer assessment project. The backend provides authentication and CRUD operations for managing students.

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **File-based JSON storage** - Simple database (database.json)
- **CORS enabled** - For frontend integration

## Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- Postman or curl for testing APIs (optional)

## Installation & Setup

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd student-management-backend

# Or simply download and extract the ZIP file
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing middleware
- `nodemon` (dev) - Auto-restart on file changes

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3001`

### 4. Verify Server is Running
Open your browser and navigate to:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-10-27T10:30:00.000Z"
}
```

## Default Login Credentials
```
Email: teacher@school.com
Password: teacher123
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login and receive authentication token.

**Request Body:**
```json
{
  "email": "teacher@school.com",
  "password": "teacher123"
}
```

**Response (200 OK):**
```json
{
  "token": "valid-teacher-token",
  "teacher": {
    "id": "teacher-001",
    "name": "John Smith",
    "email": "teacher@school.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Students

All student endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer valid-teacher-token
```

#### GET /api/students
Get paginated list of students with optional search.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Students per page
- `search` (optional) - Search by name or email

**Example Request:**
```
GET /api/students?page=1&limit=10&search=emma
```

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "stu-001",
      "firstName": "Emma",
      "lastName": "Johnson",
      "email": "emma.johnson@email.com",
      "age": 20,
      "enrollmentDate": "2023-09-01",
      "courses": ["Mathematics", "Physics", "Computer Science"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalStudents": 12,
    "studentsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### GET /api/students/:id
Get details of a specific student.

**Example Request:**
```
GET /api/students/stu-001
```

**Response (200 OK):**
```json
{
  "id": "stu-001",
  "firstName": "Emma",
  "lastName": "Johnson",
  "email": "emma.johnson@email.com",
  "age": 20,
  "enrollmentDate": "2023-09-01",
  "courses": ["Mathematics", "Physics", "Computer Science"]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Student not found"
}
```

#### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "age": 19,
  "enrollmentDate": "2024-01-15",
  "courses": ["Mathematics", "English"]
}
```

**Required Fields:** `firstName`, `lastName`, `email`

**Response (201 Created):**
```json
{
  "id": "stu-013",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "age": 19,
  "enrollmentDate": "2024-01-15",
  "courses": ["Mathematics", "English"]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Student with this email already exists"
}
```

#### PUT /api/students/:id
Update an existing student.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@email.com",
  "age": 20,
  "enrollmentDate": "2023-09-01",
  "courses": ["Biology", "Chemistry"]
}
```

**Response (200 OK):**
Returns the updated student object.

#### DELETE /api/students/:id
Delete a student.

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully",
  "student": {
    "id": "stu-001",
    "firstName": "Emma",
    "lastName": "Johnson",
    ...
  }
}
```

## Testing the API

### Using curl

**1. Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@school.com","password":"teacher123"}'
```

**2. Get Students (with token):**
```bash
curl http://localhost:3001/api/students \
  -H "Authorization: Bearer valid-teacher-token"
```

**3. Create Student:**
```bash
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-teacher-token" \
  -d '{"firstName":"Test","lastName":"Student","email":"test@email.com"}'
```

### Using Postman

1. **Import Collection** (or create requests manually)
2. **Set Base URL:** `http://localhost:3001`
3. **Login:** POST to `/api/auth/login` with credentials
4. **Copy Token** from response
5. **Set Authorization:** For other requests, add header `Authorization: Bearer valid-teacher-token`

## Database

The application uses a file-based JSON database (`database.json`) that is automatically created on first run with sample data.

**Sample Data Includes:**
- 1 teacher account
- 12 student records with various courses

You can manually edit `database.json` if needed, but restart the server after editing.

## Project Structure
```
student-management-backend/
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── database.json       # Auto-generated database file
├── node_modules/       # Installed dependencies
└── README.md          # This file
```

## Notes for Frontend Developers

- The API uses simple token-based authentication (not JWT for simplicity)
- Token received from login: `valid-teacher-token`
- All student routes require this token in Authorization header
- The backend persists data to `database.json` file
- Server automatically handles CORS for frontend integration
- Default port is 3001 (frontend typically runs on 3000)

## Support

If you encounter issues:
1. Check that Node.js is installed: `node --version`
2. Verify dependencies are installed: Check `node_modules` folder exists
3. Ensure port 3001 is available
4. Check server logs in terminal for error messages

For additional help, contact the assessment coordinator.