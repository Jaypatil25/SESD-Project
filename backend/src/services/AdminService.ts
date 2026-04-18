import { Admin } from '../models/Admin';
import { AdminRepository } from '../repositories/AdminRepository';
import {
  validateEmail,
  validatePassword,
  validateNonEmptyString,
  hashPassword,
} from '../utils/validators';
import { ValidationError, NotFoundError } from '../utils/errors';

export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  public async registerAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<Admin> {
    
    validateNonEmptyString(name, 'name');
    validateEmail(email);
    validatePassword(password);

    const existingAdmin = await this.adminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new ValidationError('Email already registered', 'email');
    }

    const hashedPassword = hashPassword(password);

    const adminId = this.adminRepository.getNextId();
    const userId = this.adminRepository.getNextId();
    const admin = new Admin(userId, name, email, hashedPassword, adminId);

    return this.adminRepository.create(admin);
  }

  public async getAdminById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundError(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  public async getAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundError(`Admin with email ${email} not found`);
    }
    return admin;
  }

  public async getAllAdmins(): Promise<Admin[]> {
    return this.adminRepository.findAll();
  }

  public async updateAdmin(id: number, name: string): Promise<Admin> {
    const admin = await this.getAdminById(id);
    validateNonEmptyString(name, 'name');

    const updatedAdmin = new Admin(
      admin.getId(),
      name,
      admin.getEmail(),
      (admin as any).getPassword?.() || '',
      admin.getAdminId()
    );

    return this.adminRepository.update(id, updatedAdmin);
  }

  public async verifyCredentials(email: string, password: string): Promise<Admin> {
    const admin = await this.getAdminByEmail(email);
    const hashedPassword = hashPassword(password);

    if (!admin.verifyPassword(hashedPassword)) {
      throw new ValidationError('Invalid email or password', 'password');
    }

    return admin;
  }
}
