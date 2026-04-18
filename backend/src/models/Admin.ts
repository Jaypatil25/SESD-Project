import { User } from './User';

export class Admin extends User {
  private adminId: number;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    adminId: number
  ) {
    super(id, name, email, password);
    this.adminId = adminId;
  }

  public getAdminId(): number {
    return this.adminId;
  }

  public async addHostel(name: string, location: string): Promise<boolean> {
    
    return true;
  }

  public async addRoom(
    roomNumber: string,
    capacity: number,
    hostelId: number
  ): Promise<boolean> {
    
    return true;
  }

  public async assignRoom(studentId: number, roomId: number): Promise<boolean> {
    
    return true;
  }

  public async login(): Promise<boolean> {
    
    return true;
  }

  public async logout(): Promise<boolean> {
    
    return true;
  }
}
