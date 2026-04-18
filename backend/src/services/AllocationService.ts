import { Allocation } from '../models/Allocation';
import { Room } from '../models/Room';
import { AllocationRepository } from '../repositories/AllocationRepository';
import { StudentService } from './StudentService';
import { RoomService } from './RoomService';
import { IAllocationStrategy } from '../interfaces/AllocationStrategy';
import { NotFoundError, ValidationError } from '../utils/errors';

export class AllocationService {
  constructor(
    private allocationRepository: AllocationRepository,
    private studentService: StudentService,
    private roomService: RoomService,
    private allocationStrategy: IAllocationStrategy
  ) {}

  public setAllocationStrategy(strategy: IAllocationStrategy): void {
    this.allocationStrategy = strategy;
  }

  public async allocateRoom(studentId: number): Promise<Allocation> {
    
    const student = await this.studentService.getStudentById(studentId);

    const existingAllocation = await this.allocationRepository.findLatestByStudentId(
      studentId
    );
    if (existingAllocation) {
      throw new ValidationError(
        'Student already has an allocated room',
        'studentId'
      );
    }

    const room = await this.allocationStrategy.allocate(studentId);
    if (!room) {
      throw new ValidationError('No available rooms for allocation', 'studentId');
    }

    const allocatedRoom = await this.roomService.allocateRoom(room.getRoomId());

    await this.studentService.getStudentById(studentId);
    student.setRoomId(room.getRoomId());

    const allocationId = this.allocationRepository.getNextId();
    const allocation = new Allocation(
      allocationId,
      new Date(),
      studentId,
      room.getRoomId()
    );

    return this.allocationRepository.create(allocation);
  }

  public async getAllocationById(id: number): Promise<Allocation> {
    const allocation = await this.allocationRepository.findById(id);
    if (!allocation) {
      throw new NotFoundError(`Allocation with ID ${id} not found`);
    }
    return allocation;
  }

  public async getAllAllocations(): Promise<Allocation[]> {
    return this.allocationRepository.findAll();
  }

  public async getAllocationsByStudent(studentId: number): Promise<Allocation[]> {
    
    await this.studentService.getStudentById(studentId);
    return this.allocationRepository.findByStudentId(studentId);
  }

  public async getLatestAllocationByStudent(studentId: number): Promise<Allocation | null> {
    
    await this.studentService.getStudentById(studentId);
    return this.allocationRepository.findLatestByStudentId(studentId);
  }

  public async getAllocationsByRoom(roomId: number): Promise<Allocation[]> {
    
    await this.roomService.getRoomById(roomId);
    return this.allocationRepository.findByRoomId(roomId);
  }

  public async deallocateRoom(allocationId: number): Promise<Allocation> {
    const allocation = await this.getAllocationById(allocationId);

    await this.roomService.deallocateRoom(allocation.getRoomId());

    const student = await this.studentService.getStudentById(
      allocation.getStudentId()
    );
    student.setRoomId(undefined);

    await this.allocationRepository.delete(allocationId);

    return allocation;
  }

  public async getStudentAllocationHistory(
    studentId: number
  ): Promise<Allocation[]> {
    
    await this.studentService.getStudentById(studentId);

    const allocations = await this.allocationRepository.findByStudentId(
      studentId
    );

    allocations.sort((a, b) => 
      b.getAllocationDate().getTime() - a.getAllocationDate().getTime()
    );

    return allocations;
  }
}
