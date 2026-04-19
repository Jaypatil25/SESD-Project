import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { AdminResponseDTO } from '../dtos/AuthDTOs';
import { ApplicationError } from '../utils/errors';

export class AdminController {
  constructor(private adminService: AdminService) {}

  public async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const admin = await this.adminService.registerAdmin(name, email, password);

      const responseDTO = new AdminResponseDTO(
        admin.getId(),
        admin.getAdminId(),
        admin.getName(),
        admin.getEmail()
      );

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAdmin(req: Request, res: Response): Promise<void> {
    try {
      const adminId = parseInt(req.params.id, 10);
      const admin = await this.adminService.getAdminById(adminId);

      const responseDTO = new AdminResponseDTO(
        admin.getId(),
        admin.getAdminId(),
        admin.getName(),
        admin.getEmail()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllAdmins(_req: Request, res: Response): Promise<void> {
    try {
      const admins = await this.adminService.getAllAdmins();

      const responseDTOs = admins.map(
        (admin) =>
          new AdminResponseDTO(
            admin.getId(),
            admin.getAdminId(),
            admin.getName(),
            admin.getEmail()
          )
      );

      res.status(200).json({
        success: true,
        data: responseDTOs,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const adminId = parseInt(req.params.id, 10);
      const { name } = req.body;

      const admin = await this.adminService.updateAdmin(adminId, name);

      const responseDTO = new AdminResponseDTO(
        admin.getId(),
        admin.getAdminId(),
        admin.getName(),
        admin.getEmail()
      );

      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ApplicationError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.errorCode,
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unknown error occurred',
      });
    }
  }
}
