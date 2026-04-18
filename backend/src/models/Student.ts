import { User } from './User';

export class Student extends User {
  private studentId: number;
  private department: string;
  private year: number;
  private roomId?: number;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    studentId: number,
    department: string,
    year: number,
    roomId?: number
  ) {
    super(id, name, email, password);
    this.studentId = studentId;
    this.department = department;
    this.year = year;
    this.roomId = roomId;
  }

  public getStudentId(): number {
    return this.studentId;
  }

  public getDepartment(): string {
    return this.department;
  }

  public getYear(): number {
    return this.year;
  }

  public getRoomId(): number | undefined {
    return this.roomId;
  }

  public setRoomId(roomId: number): void {
    this.roomId = roomId;
  }

  public async applyForRoom(): Promise<boolean> {

    return true;
  }

  public async viewAllocationStatus(): Promise<string> {
    if (this.roomId) {
      return `Allocated to room with ID: ${this.roomId}`;
    }
    return 'No room allocated yet';
  }

  public async login(): Promise<boolean> {
    
    return true;
  }

  public async logout(): Promise<boolean> {
    
    return true;
  }
}
