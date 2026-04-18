import { Allocation } from '../models/Allocation';
import { NotFoundError } from '../utils/errors';

export class AllocationRepository {
  
  private allocations: Map<number, Allocation> = new Map();
  private allocationCounter: number = 1;

  public async create(allocation: Allocation): Promise<Allocation> {
    this.allocations.set(allocation.getAllocationId(), allocation);
    return allocation;
  }

  public async findById(id: number): Promise<Allocation | null> {
    return this.allocations.get(id) || null;
  }

  public async findAll(): Promise<Allocation[]> {
    return Array.from(this.allocations.values());
  }

  public async findByStudentId(studentId: number): Promise<Allocation[]> {
    const studentAllocations: Allocation[] = [];
    for (const allocation of this.allocations.values()) {
      if (allocation.getStudentId() === studentId) {
        studentAllocations.push(allocation);
      }
    }
    return studentAllocations;
  }

  public async findLatestByStudentId(studentId: number): Promise<Allocation | null> {
    const allocations = await this.findByStudentId(studentId);
    if (allocations.length === 0) {
      return null;
    }
    
    allocations.sort((a, b) => 
      b.getAllocationDate().getTime() - a.getAllocationDate().getTime()
    );
    return allocations[0];
  }

  public async findByRoomId(roomId: number): Promise<Allocation[]> {
    const roomAllocations: Allocation[] = [];
    for (const allocation of this.allocations.values()) {
      if (allocation.getRoomId() === roomId) {
        roomAllocations.push(allocation);
      }
    }
    return roomAllocations;
  }

  public async update(id: number, allocation: Allocation): Promise<Allocation> {
    if (!this.allocations.has(id)) {
      throw new NotFoundError(`Allocation with ID ${id} not found`);
    }
    this.allocations.set(id, allocation);
    return allocation;
  }

  public async delete(id: number): Promise<boolean> {
    return this.allocations.delete(id);
  }

  public getNextId(): number {
    return this.allocationCounter++;
  }
}
