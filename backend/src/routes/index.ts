import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { AdminController } from '../controllers/AdminController';
import { RoomController } from '../controllers/RoomController';
import { HostelController } from '../controllers/HostelController';
import { AllocationController } from '../controllers/AllocationController';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

export function configureRoutes(
  studentController: StudentController,
  adminController: AdminController,
  roomController: RoomController,
  hostelController: HostelController,
  allocationController: AllocationController,
  authController: AuthController
): Router {
  const router = Router();

  // ==================== AUTHENTICATION ROUTES ====================
  // Public routes - no auth required
  router.post('/auth/student/login', (req, res) =>
    authController.studentLogin(req, res)
  );
  router.post('/auth/admin/login', (req, res) =>
    authController.adminLogin(req, res)
  );
  router.post('/auth/student/register', (req, res) =>
    authController.studentRegister(req, res)
  );
  router.post('/auth/admin/register', (req, res) =>
    authController.adminRegister(req, res)
  );

  // Protected routes - auth required
  router.post('/auth/verify', authMiddleware, (req, res) =>
    authController.verifyToken(req, res)
  );

  router.post('/students/register', (req, res) =>
    studentController.registerStudent(req, res)
  );
  router.get('/students', (req, res) =>
    studentController.getAllStudents(req, res)
  );
  router.get('/students/:id', (req, res) =>
    studentController.getStudent(req, res)
  );
  router.put('/students/:id', (req, res) =>
    studentController.updateStudent(req, res)
  );
  router.get('/students/:id/allocation-status', (req, res) =>
    studentController.viewAllocationStatus(req, res)
  );
  router.post('/students/:id/apply-room', (req, res) =>
    studentController.applyForRoom(req, res)
  );

  router.post('/admins/register', (req, res) =>
    adminController.registerAdmin(req, res)
  );
  router.get('/admins', (req, res) =>
    adminController.getAllAdmins(req, res)
  );
  router.get('/admins/:id', (req, res) =>
    adminController.getAdmin(req, res)
  );
  router.put('/admins/:id', (req, res) =>
    adminController.updateAdmin(req, res)
  );

  router.post('/hostels', (req, res) =>
    hostelController.createHostel(req, res)
  );
  router.get('/hostels', (req, res) =>
    hostelController.getAllHostels(req, res)
  );
  router.get('/hostels/:id', (req, res) =>
    hostelController.getHostel(req, res)
  );
  router.put('/hostels/:id', (req, res) =>
    hostelController.updateHostel(req, res)
  );
  router.delete('/hostels/:id', (req, res) =>
    hostelController.deleteHostel(req, res)
  );

  router.post('/rooms', (req, res) =>
    roomController.createRoom(req, res)
  );
  router.get('/rooms', (req, res) =>
    roomController.getAllRooms(req, res)
  );
  router.get('/rooms/available', (req, res) =>
    roomController.getAvailableRooms(req, res)
  );
  router.get('/rooms/:id', (req, res) =>
    roomController.getRoom(req, res)
  );
  router.get('/rooms/hostel/:hostelId', (req, res) =>
    roomController.getRoomsByHostel(req, res)
  );
  router.get('/rooms/hostel/:hostelId/available', (req, res) =>
    roomController.getAvailableRoomsByHostel(req, res)
  );
  router.put('/rooms/:id', (req, res) =>
    roomController.updateRoom(req, res)
  );
  router.delete('/rooms/:id', (req, res) =>
    roomController.deleteRoom(req, res)
  );

  router.post('/allocations/:studentId', (req, res) =>
    allocationController.allocateRoom(req, res)
  );
  router.get('/allocations', (req, res) =>
    allocationController.getAllAllocations(req, res)
  );
  router.get('/allocations/:id', (req, res) =>
    allocationController.getAllocation(req, res)
  );
  router.get('/allocations/student/:studentId/status', (req, res) =>
    allocationController.getAllocationStatus(req, res)
  );
  router.get('/allocations/student/:studentId/history', (req, res) =>
    allocationController.getAllocationHistory(req, res)
  );
  router.delete('/allocations/:id', (req, res) =>
    allocationController.deallocateRoom(req, res)
  );

  return router;
}
