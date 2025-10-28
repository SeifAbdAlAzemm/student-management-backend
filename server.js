// server.js - Student Management System Backend
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return getInitialDatabase();
  }
}

// Helper function to write database
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

// Initial database structure
function getInitialDatabase() {
  return {
    teacher: {
      email: 'teacher@school.com',
      password: 'teacher123',
      name: 'John Smith',
      image: 'https://reqres.in/img/faces/1-image.jpg',
      id: 'teacher-001'
    },
    students: [
      {
        id: 'stu-001',
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma.johnson@email.com',
        age: 20,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/2-image.jpg',
        courses: ['Mathematics', 'Physics', 'Computer Science']
      },
      {
        id: 'stu-002',
        firstName: 'Liam',
        lastName: 'Williams',
        email: 'liam.williams@email.com',
        age: 19,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/3-image.jpg',
        courses: ['English Literature', 'History', 'Philosophy']
      },
      {
        id: 'stu-003',
        firstName: 'Olivia',
        lastName: 'Brown',
        email: 'olivia.brown@email.com',
        age: 21,
        enrollmentDate: '2022-09-01',
        image: 'https://reqres.in/img/faces/4-image.jpg',
        courses: ['Biology', 'Chemistry', 'Environmental Science']
      },
      {
        id: 'stu-004',
        firstName: 'Noah',
        lastName: 'Davis',
        email: 'noah.davis@email.com',
        age: 20,
        enrollmentDate: '2023-01-15',
        image: 'https://reqres.in/img/faces/5-image.jpg',
        courses: ['Economics', 'Business Management', 'Statistics']
      },
      {
        id: 'stu-005',
        firstName: 'Ava',
        lastName: 'Martinez',
        email: 'ava.martinez@email.com',
        age: 19,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/6-image.jpg',
        courses: ['Art History', 'Studio Art', 'Design']
      },
      {
        id: 'stu-006',
        firstName: 'Ethan',
        lastName: 'Garcia',
        email: 'ethan.garcia@email.com',
        age: 22,
        enrollmentDate: '2022-01-10',
        image: 'https://reqres.in/img/faces/7-image.jpg',
        courses: ['Computer Science', 'Mathematics', 'Data Science']
      },
      {
        id: 'stu-007',
        firstName: 'Sophia',
        lastName: 'Rodriguez',
        email: 'sophia.rodriguez@email.com',
        age: 20,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/8-image.jpg',
        courses: ['Psychology', 'Sociology', 'Communications']
      },
      {
        id: 'stu-008',
        firstName: 'Mason',
        lastName: 'Wilson',
        email: 'mason.wilson@email.com',
        age: 21,
        enrollmentDate: '2022-09-01',
        image: 'https://reqres.in/img/faces/9-image.jpg',
        courses: ['Mechanical Engineering', 'Physics', 'Mathematics']
      },
      {
        id: 'stu-009',
        firstName: 'Isabella',
        lastName: 'Anderson',
        email: 'isabella.anderson@email.com',
        age: 19,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/10-image.jpg',
        courses: ['Political Science', 'International Relations', 'Law']
      },
      {
        id: 'stu-010',
        firstName: 'James',
        lastName: 'Thomas',
        email: 'james.thomas@email.com',
        age: 20,
        enrollmentDate: '2023-01-15',
        image: 'https://reqres.in/img/faces/11-image.jpg',
        courses: ['Music Theory', 'Performance', 'Music History']
      },
      {
        id: 'stu-011',
        firstName: 'Mia',
        lastName: 'Taylor',
        email: 'mia.taylor@email.com',
        age: 22,
        enrollmentDate: '2021-09-01',
        image: 'https://reqres.in/img/faces/12-image.jpg',
        courses: ['Nursing', 'Anatomy', 'Public Health']
      },
      {
        id: 'stu-012',
        firstName: 'Benjamin',
        lastName: 'Moore',
        email: 'benjamin.moore@email.com',
        age: 19,
        enrollmentDate: '2023-09-01',
        image: 'https://reqres.in/img/faces/13-image.jpg',
        courses: ['Film Studies', 'Media Production', 'Digital Arts']
      }
    ]
  };
}

// Initialize database if it doesn't exist
async function initializeDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const initialData = getInitialDatabase();
    await writeDatabase(initialData);
    console.log('Database initialized with sample data');
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Simple token validation (in production, use JWT)
  if (token !== 'valid-teacher-token') {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  next();
}

// ============================================
// ROUTES
// ============================================

// POST /api/auth/login - Teacher login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = await readDatabase();

  if (email === db.teacher.email && password === db.teacher.password) {
    return res.json({
      token: 'valid-teacher-token',
      teacher: {
        id: db.teacher.id,
        name: db.teacher.name,
        email: db.teacher.email
      }
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// GET /api/stats - Get system statistics
app.get('/api/stats', authenticateToken, async (req, res) => {
  const db = await readDatabase();
  const totalStudents = db.students.length;

  const allCourses = new Set();
  let totalAge = 0;
  let validAges = 0;
  let thisYearEnrollments = 0;
  const currentYear = new Date().getFullYear();

  db.students.forEach(student => {
    student.courses.forEach(course => allCourses.add(course));
    if (student.age !== null) {
      totalAge += student.age;
      validAges++;
    }
    if (new Date(student.enrollmentDate).getFullYear() === currentYear) {
      thisYearEnrollments++;
    }
  });

  const averageAge = validAges > 0 ? Math.round(totalAge / validAges) : null;

  res.json({
    totalStudents,
    totalUniqueCourses: allCourses.size,
    averageAge,
    enrollmentsThisYear: thisYearEnrollments
  });
});

// GET /api/students - Get paginated list of students
app.get('/api/students', authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const db = await readDatabase();
  let students = db.students;

  // Filter by search query if provided
  if (search) {
    const searchLower = search.toLowerCase();
    students = students.filter(student => 
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  }

  const total = students.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedStudents = students.slice(startIndex, endIndex);

  res.json({
    students: paginatedStudents,
    pagination: {
      currentPage: page,
      totalPages,
      totalStudents: total,
      studentsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

// GET /api/students/:id - Get single student details
app.get('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const db = await readDatabase();

  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(student);
});

// POST /api/students - Create new student
app.post('/api/students', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, age, enrollmentDate, courses, image } = req.body;

  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  if (age && (age < 16 || age > 100)) {
    return res.status(400).json({ error: 'Age must be between 16 and 100' });
  }

  const db = await readDatabase();

  // Check for duplicate email
  const existingStudent = db.students.find(s => s.email === email);
  if (existingStudent) {
    return res.status(400).json({ error: 'Student with this email already exists' });
  }

  // Generate new ID
  const newId = `stu-${String(db.students.length + 1).padStart(3, '0')}`;

  const newStudent = {
    id: newId,
    firstName,
    lastName,
    email,
    age: age || null,
    enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
    image: image || `https://reqres.in/img/faces/${Math.floor(Math.random() * 12) + 1}-image.jpg`,
    courses: courses || []
  };

  db.students.push(newStudent);
  await writeDatabase(db);

  res.status(201).json(newStudent);
});

// PUT /api/students/:id - Update student
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, age, enrollmentDate, courses, image } = req.body;

  const db = await readDatabase();
  const studentIndex = db.students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Check for duplicate email (excluding current student)
  if (email) {
    const duplicateStudent = db.students.find(s => s.email === email && s.id !== id);
    if (duplicateStudent) {
      return res.status(400).json({ error: 'Another student with this email already exists' });
    }
  }

  // Validate age if provided
  if (age && (age < 16 || age > 100)) {
    return res.status(400).json({ error: 'Age must be between 16 and 100' });
  }

  // Update student
  const updatedStudent = {
    ...db.students[studentIndex],
    firstName: firstName || db.students[studentIndex].firstName,
    lastName: lastName || db.students[studentIndex].lastName,
    email: email || db.students[studentIndex].email,
    age: age !== undefined ? age : db.students[studentIndex].age,
    enrollmentDate: enrollmentDate || db.students[studentIndex].enrollmentDate,
    image: image || db.students[studentIndex].image,
    courses: courses !== undefined ? courses : db.students[studentIndex].courses
  };

  db.students[studentIndex] = updatedStudent;
  await writeDatabase(db);

  res.json(updatedStudent);
});

// DELETE /api/students/:id - Delete student
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const db = await readDatabase();

  const studentIndex = db.students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const deletedStudent = db.students[studentIndex];
  db.students.splice(studentIndex, 1);
  await writeDatabase(db);

  res.json({ 
    message: 'Student deleted successfully',
    student: deletedStudent
  });
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`\n🚀 Student Management Backend Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`\n📚 API Endpoints:`);
    console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET    http://localhost:${PORT}/api/stats`);
    console.log(`   GET    http://localhost:${PORT}/api/students`);
    console.log(`   GET    http://localhost:${PORT}/api/students/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/students`);
    console.log(`   PUT    http://localhost:${PORT}/api/students/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/students/:id`);
    console.log(`\n🔑 Test Credentials:`);
    console.log(`   Email: teacher@school.com`);
    console.log(`   Password: teacher123\n`);
  });
}

startServer().catch(console.error);