import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { RoomResponseDTO } from '../dtos/HostelRoomDTOs';
import { ApplicationError } from '../utils/errors';

export class RoomController {
  constructor(private roomService: RoomService) {}

  public async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomNumber, capacity, hostelId } = req.body;

      const room = await this.roomService.createRoom(
        roomNumber,
        capacity,
        hostelId
      );

      const responseDTO = new RoomResponseDTO(
        room.getRoomId(),
        room.getRoomNumber(),
        room.getCapacity(),
        room.getIsAvailable(),
        room.getHostelId()
      );

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const roomId = parseInt(req.params.id, 10);
      const room = await this.roomService.getRoomById(roomId);

      const responseDTO = new RoomResponseDTO(
        room.getRoomId(),
        room.getRoomNumber(),
        room.getCapacity(),
        room.getIsAvailable(),
        room.getHostelId()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllRooms(_req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAllRooms();

      const responseDTOs = rooms.map(
        (room) =>
          new RoomResponseDTO(
            room.getRoomId(),
            room.getRoomNumber(),
            room.getCapacity(),
            room.getIsAvailable(),
            room.getHostelId()
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

  public async getAvailableRooms(_req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAvailableRooms();

      const responseDTOs = rooms.map(
        (room) =>
          new RoomResponseDTO(
            room.getRoomId(),
            room.getRoomNumber(),
            room.getCapacity(),
            room.getIsAvailable(),
            room.getHostelId()
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

  public async getRoomsByHostel(req: Request, res: Response): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const rooms = await this.roomService.getRoomsByHostel(hostelId);

      const responseDTOs = rooms.map(
        (room) =>
          new RoomResponseDTO(
            room.getRoomId(),
            room.getRoomNumber(),
            room.getCapacity(),
            room.getIsAvailable(),
            room.getHostelId()
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

  public async getAvailableRoomsByHostel(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const rooms = await this.roomService.getAvailableRoomsByHostel(hostelId);

      const responseDTOs = rooms.map(
        (room) =>
          new RoomResponseDTO(
            room.getRoomId(),
            room.getRoomNumber(),
            room.getCapacity(),
            room.getIsAvailable(),
            room.getHostelId()
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

  public async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const roomId = parseInt(req.params.id, 10);
      const { roomNumber, capacity } = req.body;

      const room = await this.roomService.updateRoom(roomId, roomNumber, capacity);

      const responseDTO = new RoomResponseDTO(
        room.getRoomId(),
        room.getRoomNumber(),
        room.getCapacity(),
        room.getIsAvailable(),
        room.getHostelId()
      );

      res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const roomId = parseInt(req.params.id, 10);
      await this.roomService.deleteRoom(roomId);

      res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
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
