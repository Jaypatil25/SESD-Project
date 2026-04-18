import { Room } from '../models/Room';
import { RoomRepository } from '../repositories/RoomRepository';
import { HostelService } from './HostelService';
import { validateNonEmptyString, validatePositiveNumber } from '../utils/validators';
import { NotFoundError } from '../utils/errors';

export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private hostelService: HostelService
  ) {}

  public async createRoom(
    roomNumber: string,
    capacity: number,
    hostelId: number
  ): Promise<Room> {
    
    validateNonEmptyString(roomNumber, 'roomNumber');
    validatePositiveNumber(capacity, 'capacity');
    validatePositiveNumber(hostelId, 'hostelId');

    await this.hostelService.getHostelById(hostelId);

    const roomId = this.roomRepository.getNextId();
    const room = new Room(roomId, roomNumber, capacity, true, hostelId);

    return this.roomRepository.create(room);
  }

  public async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundError(`Room with ID ${id} not found`);
    }
    return room;
  }

  public async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  public async getRoomsByHostel(hostelId: number): Promise<Room[]> {
    
    await this.hostelService.getHostelById(hostelId);
    return this.roomRepository.findByHostelId(hostelId);
  }

  public async getAvailableRooms(): Promise<Room[]> {
    return this.roomRepository.findAvailable();
  }

  public async getAvailableRoomsByHostel(hostelId: number): Promise<Room[]> {
    
    await this.hostelService.getHostelById(hostelId);
    return this.roomRepository.findAvailableByHostelId(hostelId);
  }

  public async updateRoom(
    id: number,
    roomNumber: string,
    capacity: number
  ): Promise<Room> {
    const room = await this.getRoomById(id);
    validateNonEmptyString(roomNumber, 'roomNumber');
    validatePositiveNumber(capacity, 'capacity');

    const updatedRoom = new Room(
      id,
      roomNumber,
      capacity,
      room.getIsAvailable(),
      room.getHostelId()
    );

    return this.roomRepository.update(id, updatedRoom);
  }

  public async updateRoomAvailability(roomId: number, isAvailable: boolean): Promise<Room> {
    return this.roomRepository.updateAvailability(roomId, isAvailable);
  }

  public async allocateRoom(roomId: number): Promise<Room> {
    const room = await this.getRoomById(roomId);
    room.allocate();
    return this.roomRepository.update(roomId, room);
  }

  public async deallocateRoom(roomId: number): Promise<Room> {
    const room = await this.getRoomById(roomId);
    room.deallocate();
    return this.roomRepository.update(roomId, room);
  }

  public async deleteRoom(id: number): Promise<boolean> {
    await this.getRoomById(id);
    return this.roomRepository.delete(id);
  }
}
