import { Request, Response } from 'express';
import { AllocationService } from '../services/AllocationService';
import { AllocationResponseDTO, AllocationStatusResponseDTO } from '../dtos/AllocationDTOs';
import { ApplicationError } from '../utils/errors';

export class AllocationController {
  constructor(private allocationService: AllocationService) {}

  public async allocateRoom(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.studentId, 10);

      const allocation = await this.allocationService.allocateRoom(studentId);

      const responseDTO = new AllocationResponseDTO(
        allocation.getAllocationId(),
        allocation.getAllocationDate(),
        allocation.getStudentId(),
        allocation.getRoomId()
      );

      res.status(201).json({
        success: true,
        message: 'Room allocated successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllocation(req: Request, res: Response): Promise<void> {
    try {
      const allocationId = parseInt(req.params.id, 10);
      const allocation = await this.allocationService.getAllocationById(allocationId);

      const responseDTO = new AllocationResponseDTO(
        allocation.getAllocationId(),
        allocation.getAllocationDate(),
        allocation.getStudentId(),
        allocation.getRoomId()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllAllocations(req: Request, res: Response): Promise<void> {
    try {
      const allocations = await this.allocationService.getAllAllocations();

      const responseDTOs = allocations.map(
        (allocation) =>
          new AllocationResponseDTO(
            allocation.getAllocationId(),
            allocation.getAllocationDate(),
            allocation.getStudentId(),
            allocation.getRoomId()
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

  public async getAllocationStatus(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.studentId, 10);

      const allocation = await this.allocationService.getLatestAllocationByStudent(
        studentId
      );

      if (!allocation) {
        res.status(200).json({
          success: true,
          data: new AllocationStatusResponseDTO(studentId, false),
        });
        return;
      }

      const responseDTO = new AllocationStatusResponseDTO(
        studentId,
        true,
        allocation.getRoomId(),
        allocation.getAllocationDate()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllocationHistory(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.studentId, 10);

      const allocations = await this.allocationService.getStudentAllocationHistory(
        studentId
      );

      const responseDTOs = allocations.map(
        (allocation) =>
          new AllocationResponseDTO(
            allocation.getAllocationId(),
            allocation.getAllocationDate(),
            allocation.getStudentId(),
            allocation.getRoomId()
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

  public async deallocateRoom(req: Request, res: Response): Promise<void> {
    try {
      const allocationId = parseInt(req.params.id, 10);

      const allocation = await this.allocationService.deallocateRoom(allocationId);

      const responseDTO = new AllocationResponseDTO(
        allocation.getAllocationId(),
        allocation.getAllocationDate(),
        allocation.getStudentId(),
        allocation.getRoomId()
      );

      res.status(200).json({
        success: true,
        message: 'Room deallocated successfully',
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
