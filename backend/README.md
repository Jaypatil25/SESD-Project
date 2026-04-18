# Hostel Room Allocation System - Backend

A production-ready backend for managing hostel room allocation for students, built with **TypeScript** and **Strict Object-Oriented Programming** principles.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Design Patterns](#design-patterns)
- [OOP Principles](#oop-principles)

---

## ✨ Features

- ✅ **Student Registration & Authentication** - Students can register and login
- ✅ **Admin Management** - Admin operations for managing hostels and rooms
- ✅ **Hostel Management** - Create, update, delete hostels
- ✅ **Room Management** - Manage rooms within hostels
- ✅ **Room Availability Tracking** - Real-time room availability status
- ✅ **Smart Room Allocation** - Strategy-based allocation algorithms
- ✅ **Allocation History** - Track allocation history for students
- ✅ **Role-Based Access** - Student and Admin roles with specific permissions
- ✅ **Error Handling** - Comprehensive error handling with custom error classes
- ✅ **Data Validation** - Input validation with custom validators
- ✅ **Dependency Injection** - Loose coupling between components

---

## 🏗 Architecture

The system follows a **strict layered architecture**:

```
┌─────────────────────────────────────┐
│     Controllers (HTTP Layer)         │ ← NO business logic
├─────────────────────────────────────┤
│     Services (Business Logic)        │ ← ALL business logic
├─────────────────────────────────────┤
│     Repositories (Data Access)       │ ← Database abstraction
├─────────────────────────────────────┤
│     Models (Entities)                │ ← Core entities
└─────────────────────────────────────┘
```

### Design Patterns Used

1. **Strategy Pattern** - Room allocation strategies (FCFS)
2. **Dependency Injection** - Constructor-based DI for loose coupling
3. **Repository Pattern** - Abstract data access layer
4. **Service Layer Pattern** - Business logic separation
5. **Factory Pattern** - DIContainer for object creation

---

## 🛠 Tech Stack

- **Language**: TypeScript (Strict Mode)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Layered Architecture with OOP principles

### Dependencies

```json
{
  "express": "^4.18.2",
  "typescript": "^5.1.6"
}
```

### Dev Dependencies

```json
{
  "@types/express": "^4.17.17",
  "@types/node": "^20.3.1",
  "ts-node": "^10.9.1"
}
```

---

## 📁 Project Structure

```
src/
├── controllers/              # HTTP request handlers (NO business logic)
│   ├── StudentController.ts
│   ├── AdminController.ts
│   ├── RoomController.ts
│   ├── HostelController.ts
│   └── AllocationController.ts
│
├── services/                 # Business logic layer
│   ├── StudentService.ts
│   ├── AdminService.ts
│   ├── RoomService.ts
│   ├── HostelService.ts
│   └── AllocationService.ts
│
├── repositories/             # Data access abstraction
│   ├── StudentRepository.ts
│   ├── AdminRepository.ts
│   ├── RoomRepository.ts
│   ├── HostelRepository.ts
│   └── AllocationRepository.ts
│
├── models/                   # Core entities
│   ├── User.ts              # Abstract base class
│   ├── Student.ts           # Extends User
│   ├── Admin.ts             # Extends User
│   ├── Room.ts
│   ├── Hostel.ts
│   └── Allocation.ts
│
├── strategies/               # Allocation strategies
│   └── FirstComeFirstServeStrategy.ts
│
├── interfaces/               # Contracts
│   └── AllocationStrategy.ts
│
├── dtos/                     # Data Transfer Objects
│   ├── AuthDTOs.ts
│   ├── HostelRoomDTOs.ts
│   └── AllocationDTOs.ts
│
├── routes/                   # Route configuration
│   └── index.ts
│
├── utils/                    # Utility functions
│   ├── errors.ts            # Custom error classes
│   └── validators.ts        # Input validators
│
├── app.ts                    # Express app setup + DI Container
└── index.ts                  # Server entry point
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Or use ts-node for development
npm run dev
```

---

## ▶️ Running the Server

### Development Mode (with ts-node)

```bash
npm run dev
```

### Production Mode (compiled JavaScript)

```bash
# Build first
npm run build

# Then run
npm start
```

### Type Checking

```bash
npm run tsc
```

The server will start at `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /health
```

---

## 👨‍🎓 Student Endpoints

### Register Student
```http
POST /api/students/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Computer Science",
  "year": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science",
    "year": 2,
    "roomId": null
  }
}
```

### Get All Students
```http
GET /api/students
```

### Get Student by ID
```http
GET /api/students/:id
```

### Update Student
```http
PUT /api/students/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "department": "Electronics"
}
```

### View Allocation Status
```http
GET /api/students/:id/allocation-status
```

### Apply for Room
```http
POST /api/students/:id/apply-room
```

---

## 👨‍💼 Admin Endpoints

### Register Admin
```http
POST /api/admins/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Get All Admins
```http
GET /api/admins
```

### Get Admin by ID
```http
GET /api/admins/:id
```

### Update Admin
```http
PUT /api/admins/:id
Content-Type: application/json

{
  "name": "Updated Admin Name"
}
```

---

## 🏢 Hostel Endpoints

### Create Hostel
```http
POST /api/hostels
Content-Type: application/json

{
  "name": "Hostel A",
  "location": "Block A, Campus"
}
```

### Get All Hostels
```http
GET /api/hostels
```

### Get Hostel by ID
```http
GET /api/hostels/:id
```

### Update Hostel
```http
PUT /api/hostels/:id
Content-Type: application/json

{
  "name": "Updated Hostel A",
  "location": "Block B, Campus"
}
```

### Delete Hostel
```http
DELETE /api/hostels/:id
```

---

## 🛏 Room Endpoints

### Create Room
```http
POST /api/rooms
Content-Type: application/json

{
  "roomNumber": "A101",
  "capacity": 2,
  "hostelId": 1
}
```

### Get All Rooms
```http
GET /api/rooms
```

### Get Available Rooms
```http
GET /api/rooms/available
```

### Get Room by ID
```http
GET /api/rooms/:id
```

### Get Rooms by Hostel
```http
GET /api/rooms/hostel/:hostelId
```

### Get Available Rooms in Hostel
```http
GET /api/rooms/hostel/:hostelId/available
```

### Update Room
```http
PUT /api/rooms/:id
Content-Type: application/json

{
  "roomNumber": "A102",
  "capacity": 3
}
```

### Delete Room
```http
DELETE /api/rooms/:id
```

---

## 📋 Allocation Endpoints

### Allocate Room to Student
```http
POST /api/allocations/:studentId
```

**Response (201):**
```json
{
  "success": true,
  "message": "Room allocated successfully",
  "data": {
    "allocationId": 1,
    "allocationDate": "2024-01-15T10:30:00Z",
    "studentId": 1,
    "roomId": 1
  }
}
```

### Get All Allocations
```http
GET /api/allocations
```

### Get Allocation by ID
```http
GET /api/allocations/:id
```

### Get Student Allocation Status
```http
GET /api/allocations/student/:studentId/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentId": 1,
    "isAllocated": true,
    "roomId": 1,
    "allocationDate": "2024-01-15T10:30:00Z"
  }
}
```

### Get Student Allocation History
```http
GET /api/allocations/student/:studentId/history
```

### Deallocate Room
```http
DELETE /api/allocations/:id
```

---

## 🏛 Design Patterns

### 1. Strategy Pattern (Allocation)

The allocation system uses the Strategy pattern to allow different room allocation algorithms:

```typescript
interface IAllocationStrategy {
  allocate(studentId: number): Promise<Room | null>;
}

class FirstComeFirstServeStrategy implements IAllocationStrategy {
  async allocate(studentId: number): Promise<Room | null> {
    // FCFS logic
  }
}
```

**Usage in Service:**
```typescript
const allocation = await this.allocationStrategy.allocate(studentId);
```

### 2. Dependency Injection

Constructor-based DI ensures loose coupling:

```typescript
class AllocationService {
  constructor(
    private allocationRepository: AllocationRepository,
    private studentService: StudentService,
    private roomService: RoomService,
    private allocationStrategy: IAllocationStrategy
  ) {}
}
```

### 3. Repository Pattern

Data access abstraction:

```typescript
class StudentRepository {
  async findById(id: number): Promise<Student | null> { }
  async create(student: Student): Promise<Student> { }
  async update(id: number, student: Student): Promise<Student> { }
}
```

---

## 🎯 OOP Principles

### 1. **Encapsulation**
- Private fields with public getters/setters
- Password protected as private
- Business logic encapsulated in services

```typescript
export class Student extends User {
  private studentId: number;
  private department: string;
  
  public getStudentId(): number {
    return this.studentId;
  }
}
```

### 2. **Inheritance**
- `Student` and `Admin` extend abstract `User` class
- Code reuse and polymorphic behavior

```typescript
abstract class User {
  abstract login(): Promise<boolean>;
  abstract logout(): Promise<boolean>;
}

class Student extends User {
  public async login(): Promise<boolean> { }
  public async logout(): Promise<boolean> { }
}
```

### 3. **Abstraction**
- Abstract base classes
- Interfaces for contracts
- Hidden implementation details

```typescript
export interface IAllocationStrategy {
  allocate(studentId: number): Promise<Room | null>;
}

export abstract class User {
  abstract login(): Promise<boolean>;
}
```

### 4. **Polymorphism**
- Strategy pattern for different allocation algorithms
- Method overriding in subclasses
- Interface-based contracts

```typescript
class FirstComeFirstServeStrategy implements IAllocationStrategy {
  async allocate(studentId: number): Promise<Room | null> { }
}

// More strategies can be added following the same interface
class PreferenceBasedStrategy implements IAllocationStrategy {
  async allocate(studentId: number): Promise<Room | null> { }
}
```

---

## ⚠️ Error Handling

Custom error classes for different scenarios:

```typescript
throw new ValidationError('Invalid email format', 'email');
throw new NotFoundError('Student not found');
throw new AuthenticationError('Invalid credentials');
throw new AuthorizationError('Insufficient permissions');
throw new ConflictError('Resource already exists');
```

---

## 🧪 Example Usage Flow

### 1. Admin creates a hostel
```bash
POST /api/hostels
{
  "name": "Hostel A",
  "location": "Block A"
}
```

### 2. Admin creates rooms in the hostel
```bash
POST /api/rooms
{
  "roomNumber": "A101",
  "capacity": 2,
  "hostelId": 1
}
```

### 3. Student registers
```bash
POST /api/students/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "pass123",
  "department": "CS",
  "year": 2
}
```

### 4. Student applies for room
```bash
POST /api/students/1/apply-room
```

### 5. Admin allocates room to student
```bash
POST /api/allocations/1
```

### 6. Student checks allocation status
```bash
GET /api/allocations/student/1/status
```

---

## 📝 Notes

- In-memory storage is used for demo purposes. Replace with database (PostgreSQL, MongoDB) in production
- Password hashing uses Base64 for demo. Use bcrypt in production
- Add authentication middleware for protected routes
- Implement JWT tokens for session management
- Add rate limiting and CORS for production

---

## 📚 TypeScript Configuration

- Strict mode enabled
- No `any` types allowed
- All parameters typed
- Return types specified
- Strict null checks enabled

---

## 🎓 Learning Resources

This backend demonstrates:
- SOLID principles
- Design patterns (Strategy, Repository, DI, Factory)
- Layered architecture
- TypeScript best practices
- Object-Oriented Programming principles
- Error handling strategies
- Clean code practices

---

## 📄 License

This project is provided for educational purposes.

---

**Happy Coding! 🚀**
