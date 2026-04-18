import express, { Express } from 'express';
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

import { FirstComeFirstServeStrategy } from './strategies/FirstComeFirstServeStrategy';

import { StudentController } from './controllers/StudentController';
import { AdminController } from './controllers/AdminController';
import { HostelController } from './controllers/HostelController';
import { RoomController } from './controllers/RoomController';
import { AllocationController } from './controllers/AllocationController';

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

  private studentController: StudentController;
  private adminController: AdminController;
  private hostelController: HostelController;
  private roomController: RoomController;
  private allocationController: AllocationController;

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

    this.studentController = new StudentController(this.studentService);
    this.adminController = new AdminController(this.adminService);
    this.hostelController = new HostelController(this.hostelService);
    this.roomController = new RoomController(this.roomService);
    this.allocationController = new AllocationController(this.allocationService);
  }

  public getControllers() {
    return {
      studentController: this.studentController,
      adminController: this.adminController,
      hostelController: this.hostelController,
      roomController: this.roomController,
      allocationController: this.allocationController,
    };
  }
}

export function createApp(): Express {
  const app = express();

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
      controllers.allocationController
    )
  );

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Route not found',
    });
  });

  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    });
  });

  return app;
}
