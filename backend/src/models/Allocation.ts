export class Allocation {
  private allocationId: number;
  private allocationDate: Date;
  private studentId: number;
  private roomId: number;

  constructor(
    allocationId: number,
    allocationDate: Date,
    studentId: number,
    roomId: number
  ) {
    this.allocationId = allocationId;
    this.allocationDate = allocationDate;
    this.studentId = studentId;
    this.roomId = roomId;
  }

  public getAllocationId(): number {
    return this.allocationId;
  }

  public getAllocationDate(): Date {
    return this.allocationDate;
  }

  public getStudentId(): number {
    return this.studentId;
  }

  public getRoomId(): number {
    return this.roomId;
  }
}
