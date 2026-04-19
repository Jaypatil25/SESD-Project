import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

/**
 * AuthController handles authentication endpoints:
 * - Student login
 * - Admin login
 * - Student registration
 * - Admin registration
 * - Token verification
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/student/login
   * Student login endpoint
   */
  public async studentLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Call auth service
      const result = await this.authService.loginStudent(email, password);

      res.status(200).json({
        success: true,
        message: 'Student logged in successfully',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /auth/admin/login
   * Admin login endpoint
   */
  public async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Call auth service
      const result = await this.authService.loginAdmin(email, password);

      res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /auth/student/register
   * Student registration endpoint
   */
  public async studentRegister(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, department, year, phoneNumber, address } = req.body;

      // Validate required fields
      if (!name || !email || !password || !department || !year) {
        res.status(400).json({
          success: false,
          message: 'Name, email, password, department, and year are required',
        });
        return;
      }

      // Call auth service
      const result = await this.authService.registerStudent(
        name,
        email,
        password,
        department,
        year,
        phoneNumber,
        address
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /auth/admin/register
   * Admin registration endpoint
   */
  public async adminRegister(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        });
        return;
      }

      // Call auth service
      const result = await this.authService.registerAdmin(name, email, password);

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /auth/verify
   * Verify JWT token endpoint
   */
  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token is required',
        });
        return;
      }

      const result = await this.authService.verifyToken(token);

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Error handling helper
   */
  private handleError(error: any, res: Response): void {
    const message = error instanceof Error ? error.message : 'An error occurred';

    if (message.includes('Invalid email or password')) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    } else if (message.includes('Email already registered')) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    } else if (message.includes('Password must')) {
      res.status(400).json({
        success: false,
        message,
      });
    } else if (message.includes('Invalid or expired token')) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    } else {
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}
