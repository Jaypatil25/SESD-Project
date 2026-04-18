import { Room } from '../models/Room';

export interface IAllocationStrategy {
  allocate(studentId: number): Promise<Room | null>;
}
