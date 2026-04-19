import express, { Express } from 'express';
import cors from 'cors';
import { configureRoutes } from './routes';

import { StudentRepository } from './repositories/StudentRepository';
import { AdminRepository } from './repositories/AdminRepository';
import { HostelRepository } from './repositories/HostelRepository';
import { RoomRepository } from './repositories/RoomRepository';
import { AllocationRepository } from './repositories/AllocationRepository';

import { StudentService } from './services/StudentService';
import { AdminService } from './services/AdminService';
import { HostelService } from './services/HostelService';
import { RoomService } from './services/RoomService';
import { AllocationService } from './services/AllocationService';
import { AuthService } from './services/AuthService';

import { FirstComeFirstServeStrategy } from './strategies/FirstComeFirstServeStrategy';

import { StudentController } from './controllers/StudentController';
import { AdminController } from './controllers/AdminController';
import { HostelController } from './controllers/HostelController';
import { RoomController } from './controllers/RoomController';
import { AllocationController } from './controllers/AllocationController';
import { AuthController } from './controllers/AuthController';

class DIContainer {
  private studentRepository: StudentRepository;
  private adminRepository: AdminRepository;
  private hostelRepository: HostelRepository;
  private roomRepository: RoomRepository;
  private allocationRepository: AllocationRepository;

  private studentService: StudentService;
  private adminService: AdminService;
  private hostelService: HostelService;
  private roomService: RoomService;
  private allocationService: AllocationService;
  private authService: AuthService;

  private studentController: StudentController;
  private adminController: AdminController;
  private hostelController: HostelController;
  private roomController: RoomController;
  private allocationController: AllocationController;
  private authController: AuthController;

  constructor() {
    
    this.studentRepository = new StudentRepository();
    this.adminRepository = new AdminRepository();
    this.hostelRepository = new HostelRepository();
    this.roomRepository = new RoomRepository();
    this.allocationRepository = new AllocationRepository();

    this.studentService = new StudentService(this.studentRepository);
    this.adminService = new AdminService(this.adminRepository);
    this.hostelService = new HostelService(this.hostelRepository);
    this.roomService = new RoomService(
      this.roomRepository,
      this.hostelService
    );

    const allocationStrategy = new FirstComeFirstServeStrategy(
      this.roomRepository
    );

    this.allocationService = new AllocationService(
      this.allocationRepository,
      this.studentService,
      this.roomService,
      allocationStrategy
    );

    this.authService = new AuthService();

    this.studentController = new StudentController(this.studentService);
    this.adminController = new AdminController(this.adminService);
    this.hostelController = new HostelController(this.hostelService);
    this.roomController = new RoomController(this.roomService);
    this.allocationController = new AllocationController(this.allocationService);
    this.authController = new AuthController(this.authService);
  }

  public getControllers() {
    return {
      studentController: this.studentController,
      adminController: this.adminController,
      hostelController: this.hostelController,
      roomController: this.roomController,
      allocationController: this.allocationController,
      authController: this.authController,
    };
  }
}

export function createApp(): Express {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: ['http://localhost:5178', 'http://localhost:5177', 'http://localhost:5176', 'http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const container = new DIContainer();
  const controllers = container.getControllers();

  app.use(
    '/api',
    configureRoutes(
      controllers.studentController,
      controllers.adminController,
      controllers.roomController,
      controllers.hostelController,
      controllers.allocationController,
      controllers.authController
    )
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Route not found',
    });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    });
  });

  return app;
}
