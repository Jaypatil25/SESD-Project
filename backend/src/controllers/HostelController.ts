import { Request, Response } from 'express';
import { HostelService } from '../services/HostelService';
import { HostelResponseDTO } from '../dtos/HostelRoomDTOs';
import { ApplicationError } from '../utils/errors';

export class HostelController {
  constructor(private hostelService: HostelService) {}

  public async createHostel(req: Request, res: Response): Promise<void> {
    try {
      const { name, location } = req.body;

      const hostel = await this.hostelService.createHostel(name, location);

      const responseDTO = new HostelResponseDTO(
        hostel.getHostelId(),
        hostel.getName(),
        hostel.getLocation()
      );

      res.status(201).json({
        success: true,
        message: 'Hostel created successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getHostel(req: Request, res: Response): Promise<void> {
    try {
      const hostelId = parseInt(req.params.id, 10);
      const hostel = await this.hostelService.getHostelById(hostelId);

      const responseDTO = new HostelResponseDTO(
        hostel.getHostelId(),
        hostel.getName(),
        hostel.getLocation()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllHostels(_req: Request, res: Response): Promise<void> {
    try {
      const hostels = await this.hostelService.getAllHostels();

      const responseDTOs = hostels.map(
        (hostel) =>
          new HostelResponseDTO(
            hostel.getHostelId(),
            hostel.getName(),
            hostel.getLocation()
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

  public async updateHostel(req: Request, res: Response): Promise<void> {
    try {
      const hostelId = parseInt(req.params.id, 10);
      const { name, location } = req.body;

      const hostel = await this.hostelService.updateHostel(
        hostelId,
        name,
        location
      );

      const responseDTO = new HostelResponseDTO(
        hostel.getHostelId(),
        hostel.getName(),
        hostel.getLocation()
      );

      res.status(200).json({
        success: true,
        message: 'Hostel updated successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async deleteHostel(req: Request, res: Response): Promise<void> {
    try {
      const hostelId = parseInt(req.params.id, 10);
      await this.hostelService.deleteHostel(hostelId);

      res.status(200).json({
        success: true,
        message: 'Hostel deleted successfully',
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
