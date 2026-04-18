import { Admin } from '../models/Admin';
import { NotFoundError } from '../utils/errors';

export class AdminRepository {
  
  private admins: Map<number, Admin> = new Map();
  private adminCounter: number = 1;

  public async create(admin: Admin): Promise<Admin> {
    this.admins.set(admin.getId(), admin);
    return admin;
  }

  public async findById(id: number): Promise<Admin | null> {
    return this.admins.get(id) || null;
  }

  public async findByEmail(email: string): Promise<Admin | null> {
    for (const admin of this.admins.values()) {
      if (admin.getEmail() === email) {
        return admin;
      }
    }
    return null;
  }

  public async findAll(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  public async update(id: number, admin: Admin): Promise<Admin> {
    if (!this.admins.has(id)) {
      throw new NotFoundError(`Admin with ID ${id} not found`);
    }
    this.admins.set(id, admin);
    return admin;
  }

  public async delete(id: number): Promise<boolean> {
    return this.admins.delete(id);
  }

  public getNextId(): number {
    return this.adminCounter++;
  }
}
