import { Student } from '../models/Student';
import { StudentRepository } from '../repositories/StudentRepository';
import {
  validateEmail,
  validatePassword,
  validateNonEmptyString,
  validatePositiveNumber,
  hashPassword,
} from '../utils/validators';
import { ValidationError, NotFoundError } from '../utils/errors';

export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  public async registerStudent(
    name: string,
    email: string,
    password: string,
    department: string,
    year: number
  ): Promise<Student> {
    
    validateNonEmptyString(name, 'name');
    validateEmail(email);
    validatePassword(password);
    validateNonEmptyString(department, 'department');
    validatePositiveNumber(year, 'year');

    const existingStudent = await this.studentRepository.findByEmail(email);
    if (existingStudent) {
      throw new ValidationError('Email already registered', 'email');
    }

    const hashedPassword = hashPassword(password);

    const studentId = this.studentRepository.getNextId();
    const userId = this.studentRepository.getNextId();
    const student = new Student(
      userId,
      name,
      email,
      hashedPassword,
      studentId,
      department,
      year
    );

    return this.studentRepository.create(student);
  }

  public async getStudentById(id: number): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }
    return student;
  }

  public async getStudentByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findByEmail(email);
    if (!student) {
      throw new NotFoundError(`Student with email ${email} not found`);
    }
    return student;
  }

  public async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  public async updateStudent(
    id: number,
    name: string,
    department: string
  ): Promise<Student> {
    const student = await this.getStudentById(id);
    validateNonEmptyString(name, 'name');
    validateNonEmptyString(department, 'department');

    const updatedStudent = new Student(
      student.getId(),
      name,
      student.getEmail(),
      (student as any).getPassword?.() || '',
      student.getStudentId(),
      department,
      student.getYear(),
      student.getRoomId()
    );

    return this.studentRepository.update(id, updatedStudent);
  }

  public async applyForRoom(studentId: number): Promise<boolean> {
    const student = await this.getStudentById(studentId);
    return student.applyForRoom();
  }

  public async viewAllocationStatus(studentId: number): Promise<string> {
    const student = await this.getStudentById(studentId);
    return student.viewAllocationStatus();
  }

  public async verifyCredentials(email: string, password: string): Promise<Student> {
    const student = await this.getStudentByEmail(email);
    const hashedPassword = hashPassword(password);

    if (!student.verifyPassword(hashedPassword)) {
      throw new ValidationError('Invalid email or password', 'password');
    }

    return student;
  }
}
