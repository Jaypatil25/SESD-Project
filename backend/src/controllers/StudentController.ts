import { Request, Response } from 'express';
import { StudentService } from '../services/StudentService';
import { StudentResponseDTO } from '../dtos/AuthDTOs';
import { ApplicationError } from '../utils/errors';

export class StudentController {
  constructor(private studentService: StudentService) {}

  public async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, department, year } = req.body;

      const student = await this.studentService.registerStudent(
        name,
        email,
        password,
        department,
        year
      );

      const responseDTO = new StudentResponseDTO(
        student.getId(),
        student.getStudentId(),
        student.getName(),
        student.getEmail(),
        student.getDepartment(),
        student.getYear(),
        student.getRoomId()
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const student = await this.studentService.getStudentById(studentId);

      const responseDTO = new StudentResponseDTO(
        student.getId(),
        student.getStudentId(),
        student.getName(),
        student.getEmail(),
        student.getDepartment(),
        student.getYear(),
        student.getRoomId()
      );

      res.status(200).json({
        success: true,
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await this.studentService.getAllStudents();

      const responseDTOs = students.map(
        (student) =>
          new StudentResponseDTO(
            student.getId(),
            student.getStudentId(),
            student.getName(),
            student.getEmail(),
            student.getDepartment(),
            student.getYear(),
            student.getRoomId()
          )
      );

      res.status(200).json({
        success: true,
        data: responseDTOs,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const { name, department } = req.body;

      const student = await this.studentService.updateStudent(
        studentId,
        name,
        department
      );

      const responseDTO = new StudentResponseDTO(
        student.getId(),
        student.getStudentId(),
        student.getName(),
        student.getEmail(),
        student.getDepartment(),
        student.getYear(),
        student.getRoomId()
      );

      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: responseDTO,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async viewAllocationStatus(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const status = await this.studentService.viewAllocationStatus(studentId);

      res.status(200).json({
        success: true,
        data: { status },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async applyForRoom(req: Request, res: Response): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const result = await this.studentService.applyForRoom(studentId);

      res.status(200).json({
        success: true,
        message: 'Application submitted successfully',
        data: { applied: result },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ApplicationError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.errorCode,
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unknown error occurred',
      });
    }
  }
}
