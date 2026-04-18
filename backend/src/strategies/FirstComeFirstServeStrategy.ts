import { IAllocationStrategy } from '../interfaces/AllocationStrategy';
import { Room } from '../models/Room';
import { RoomRepository } from '../repositories/RoomRepository';

export class FirstComeFirstServeStrategy implements IAllocationStrategy {
  constructor(private roomRepository: RoomRepository) {}

  public async allocate(studentId: number): Promise<Room | null> {
    
    const availableRooms = await this.roomRepository.findAvailable();

    if (availableRooms.length === 0) {
      return null;
    }

    return availableRooms[0];
  }
}
