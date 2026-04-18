import { Student } from '../models/Student';
import { NotFoundError } from '../utils/errors';

export class StudentRepository {
  
  private students: Map<number, Student> = new Map();
  private studentCounter: number = 1;

  public async create(student: Student): Promise<Student> {
    this.students.set(student.getId(), student);
    return student;
  }

  public async findById(id: number): Promise<Student | null> {
    return this.students.get(id) || null;
  }

  public async findByEmail(email: string): Promise<Student | null> {
    for (const student of this.students.values()) {
      if (student.getEmail() === email) {
        return student;
      }
    }
    return null;
  }

  public async findAll(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  public async update(id: number, student: Student): Promise<Student> {
    if (!this.students.has(id)) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }
    this.students.set(id, student);
    return student;
  }

  public async updateRoom(studentId: number, roomId: number): Promise<Student> {
    const student = await this.findById(studentId);
    if (!student) {
      throw new NotFoundError(`Student with ID ${studentId} not found`);
    }
    student.setRoomId(roomId);
    return this.update(studentId, student);
  }

  public async delete(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  public getNextId(): number {
    return this.studentCounter++;
  }
}
