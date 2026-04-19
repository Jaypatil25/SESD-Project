import { prisma } from '../lib/prisma';
import { PasswordHelper } from '../utils/passwordHelper';
import { TokenHelper } from '../utils/tokenHelper';

/**
 * AuthService handles authentication logic:
 * - Student login
 * - Admin login
 * - Password validation
 * - Token generation
 */
export class AuthService {
  /**
   * Student login - validates email and password
   * Returns JWT token if credentials are correct
   */
  async loginStudent(email: string, password: string) {
    try {
      // Find user by email with role = STUDENT
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          student: true,
        },
      });

      if (!user || user.role !== 'STUDENT') {
        throw new Error('Invalid email or password');
      }

      if (!user.student) {
        throw new Error('Student profile not found');
      }

      // Validate password
      const isPasswordValid = await PasswordHelper.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = TokenHelper.generateToken({
        id: user.id,
        email: user.email,
        role: 'STUDENT',
        type: 'student',
      });

      return {
        token,
        userType: 'student',
        user: {
          id: user.student.id,
          userId: user.id,
          studentId: user.student.studentId,
          name: user.name,
          email: user.email,
          department: user.student.department,
          year: user.student.year,
          roomId: user.student.roomId,
          phoneNumber: user.student.phoneNumber,
          address: user.student.address,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Admin login - validates email and password
   * Returns JWT token if credentials are correct
   */
  async loginAdmin(email: string, password: string) {
    try {
      // Find user by email with role = ADMIN
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          admin: true,
        },
      });

      if (!user || user.role !== 'ADMIN') {
        throw new Error('Invalid email or password');
      }

      if (!user.admin) {
        throw new Error('Admin profile not found');
      }

      // Validate password
      const isPasswordValid = await PasswordHelper.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = TokenHelper.generateToken({
        id: user.id,
        email: user.email,
        role: 'ADMIN',
        type: 'admin',
      });

      return {
        token,
        userType: 'admin',
        user: {
          id: user.admin.id,
          userId: user.id,
          adminId: user.admin.adminId,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new student with password hashing
   */
  async registerStudent(
    name: string,
    email: string,
    password: string,
    department: string,
    year: number,
    phoneNumber?: string,
    address?: string
  ) {
    try {
      // Validate password strength
      const passwordValidation = PasswordHelper.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hashPassword(password);

      // Generate unique student ID (S001, S002, etc)
      const studentCount = await prisma.student.count();
      const studentId = `S${String(studentCount + 1).padStart(3, '0')}`;

      // Create user and student in transaction
      const result = await prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'STUDENT',
          },
        });

        const student = await tx.student.create({
          data: {
            studentId,
            department,
            year,
            phoneNumber: phoneNumber || '',
            address: address || '',
            userId: user.id,
          },
        });

        return { user, student };
      });

      // Generate token
      const token = TokenHelper.generateToken({
        id: result.user.id,
        email: result.user.email,
        role: 'STUDENT',
        type: 'student',
      });

      return {
        token,
        userType: 'student',
        user: {
          id: result.student.id,
          userId: result.user.id,
          studentId: result.student.studentId,
          name: result.user.name,
          email: result.user.email,
          department: result.student.department,
          year: result.student.year,
          roomId: result.student.roomId,
          phoneNumber: result.student.phoneNumber,
          address: result.student.address,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new admin with password hashing
   */
  async registerAdmin(name: string, email: string, password: string) {
    try {
      // Validate password strength
      const passwordValidation = PasswordHelper.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hashPassword(password);

      // Generate unique admin ID (A001, A002, etc)
      const adminCount = await prisma.admin.count();
      const adminId = `A${String(adminCount + 1).padStart(3, '0')}`;

      // Create user and admin in transaction
      const result = await prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN',
          },
        });

        const admin = await tx.admin.create({
          data: {
            adminId,
            userId: user.id,
          },
        });

        return { user, admin };
      });

      // Generate token
      const token = TokenHelper.generateToken({
        id: result.user.id,
        email: result.user.email,
        role: 'ADMIN',
        type: 'admin',
      });

      return {
        token,
        userType: 'admin',
        user: {
          id: result.admin.id,
          userId: result.user.id,
          adminId: result.admin.adminId,
          name: result.user.name,
          email: result.user.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify token and get user info
   */
  async verifyToken(token: string) {
    try {
      const payload = TokenHelper.verifyToken(token);

      // Get user details based on role
      if (payload.role === 'STUDENT') {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
          include: { student: true },
        });

        if (!user || !user.student) {
          throw new Error('User not found');
        }

        return {
          token: token,
          userType: 'student',
          user: {
            id: user.student.id,
            userId: user.id,
            studentId: user.student.studentId,
            name: user.name,
            email: user.email,
            department: user.student.department,
            year: user.student.year,
            roomId: user.student.roomId,
          },
        };
      } else if (payload.role === 'ADMIN') {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
          include: { admin: true },
        });

        if (!user || !user.admin) {
          throw new Error('User not found');
        }

        return {
          token: token,
          userType: 'admin',
          user: {
            id: user.admin.id,
            userId: user.id,
            adminId: user.admin.adminId,
            name: user.name,
            email: user.email,
          },
        };
      } else {
        throw new Error('Invalid token role');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
