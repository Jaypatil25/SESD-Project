import { Room } from '../models/Room';
import { NotFoundError } from '../utils/errors';

export class RoomRepository {
  
  private rooms: Map<number, Room> = new Map();
  private roomCounter: number = 1;

  public async create(room: Room): Promise<Room> {
    this.rooms.set(room.getRoomId(), room);
    return room;
  }

  public async findById(id: number): Promise<Room | null> {
    return this.rooms.get(id) || null;
  }

  public async findAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  public async findByHostelId(hostelId: number): Promise<Room[]> {
    const hostelRooms: Room[] = [];
    for (const room of this.rooms.values()) {
      if (room.getHostelId() === hostelId) {
        hostelRooms.push(room);
      }
    }
    return hostelRooms;
  }

  public async findAvailable(): Promise<Room[]> {
    const availableRooms: Room[] = [];
    for (const room of this.rooms.values()) {
      if (room.getIsAvailable()) {
        availableRooms.push(room);
      }
    }
    return availableRooms;
  }

  public async findAvailableByHostelId(hostelId: number): Promise<Room[]> {
    const availableRooms: Room[] = [];
    for (const room of this.rooms.values()) {
      if (room.getHostelId() === hostelId && room.getIsAvailable()) {
        availableRooms.push(room);
      }
    }
    return availableRooms;
  }

  public async update(id: number, room: Room): Promise<Room> {
    if (!this.rooms.has(id)) {
      throw new NotFoundError(`Room with ID ${id} not found`);
    }
    this.rooms.set(id, room);
    return room;
  }

  public async updateAvailability(roomId: number, isAvailable: boolean): Promise<Room> {
    const room = await this.findById(roomId);
    if (!room) {
      throw new NotFoundError(`Room with ID ${roomId} not found`);
    }
    room.setIsAvailable(isAvailable);
    return this.update(roomId, room);
  }

  public async delete(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  public getNextId(): number {
    return this.roomCounter++;
  }
}
