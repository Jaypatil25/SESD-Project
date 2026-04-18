export class AllocationResponseDTO {
  constructor(
    public allocationId: number,
    public allocationDate: Date,
    public studentId: number,
    public roomId: number
  ) {}
}

export class AllocationStatusResponseDTO {
  constructor(
    public studentId: number,
    public isAllocated: boolean,
    public roomId?: number,
    public allocationDate?: Date
  ) {}
}
