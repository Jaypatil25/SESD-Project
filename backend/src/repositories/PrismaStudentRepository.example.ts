import { prisma } from '../lib/prisma';
// Uncomment when using Prisma types
// import { Student as PrismaStudent } from '@prisma/client';
type PrismaStudent = any;

/**
 * Example Student Repository using Prisma ORM
 * 
 * This demonstrates how to replace manual queries with Prisma Client.
 * Use this as a template for converting your existing repositories.
 */

export class StudentRepository {
  /**
   * Create a new student
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    department: string;
    year: number;
    phoneNumber?: string;
    address?: string;
  }): Promise<PrismaStudent> {
    try {
      return await prisma.student.create({
        data: {
          studentId: data.studentId,
          department: data.department,
          year: data.year,
          phoneNumber: data.phoneNumber,
          address: data.address,
          user: {
            create: {
              name: data.name,
              email: data.email,
              password: data.password,
              role: 'STUDENT',
            },
          },
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  async getById(id: number): Promise<PrismaStudent | null> {
    try {
      return await prisma.student.findUnique({
        where: { id },
        include: {
          user: true,
          room: {
            include: {
              hostel: true,
            },
          },
          allocations: {
            include: {
              room: {
                include: {
                  hostel: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  /**
   * Get student by student ID
   */
  async getByStudentId(studentId: string): Promise<PrismaStudent | null> {
    try {
      return await prisma.student.findUnique({
        where: { studentId },
        include: { user: true },
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  /**
   * Get all students
   */
  async getAll(
    skip: number = 0,
    take: number = 10
  ): Promise<PrismaStudent[]> {
    try {
      return await prisma.student.findMany({
        skip,
        take,
        include: {
          user: true,
          room: {
            include: {
              hostel: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  /**
   * Get all students with their allocations
   */
  async getAllWithAllocations(): Promise<any[]> {
    try {
      return await prisma.student.findMany({
        include: {
          user: true,
          allocations: {
            include: {
              room: {
                include: {
                  hostel: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching students with allocations:', error);
      throw error;
    }
  }

  /**
   * Update student
   */
  async update(
    id: number,
    data: Partial<{
      department: string;
      year: number;
      phoneNumber: string;
      address: string;
    }>
  ): Promise<PrismaStudent> {
    try {
      return await prisma.student.update({
        where: { id },
        data,
        include: { user: true },
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Delete student
   */
  async delete(id: number): Promise<void> {
    try {
      await prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Allocate room to student
   */
  async allocateRoom(studentId: number, roomId: number): Promise<any> {
    try {
      // Update student with room
      const student = await prisma.student.update({
        where: { id: studentId },
        data: { roomId },
      });

      // Create allocation record
      const allocation = await prisma.allocation.create({
        data: {
          studentId,
          roomId,
          status: 'ALLOCATED',
        },
      });

      // Update room occupancy
      await prisma.room.update({
        where: { id: roomId },
        data: {
          currentCount: {
            increment: 1,
          },
        },
      });

      return { student, allocation };
    } catch (error) {
      console.error('Error allocating room:', error);
      throw error;
    }
  }

  /**
   * Get student's allocation
   */
  async getAllocation(studentId: number): Promise<any | null> {
    try {
      return await prisma.allocation.findFirst({
        where: { studentId },
        include: {
          room: {
            include: {
              hostel: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching allocation:', error);
      throw error;
    }
  }

  /**
   * Get students by department
   */
  async getByDepartment(department: string): Promise<PrismaStudent[]> {
    try {
      return await prisma.student.findMany({
        where: { department },
        include: { user: true },
      });
    } catch (error) {
      console.error('Error fetching students by department:', error);
      throw error;
    }
  }

  /**
   * Get students by year
   */
  async getByYear(year: number): Promise<PrismaStudent[]> {
    try {
      return await prisma.student.findMany({
        where: { year },
        include: { user: true },
      });
    } catch (error) {
      console.error('Error fetching students by year:', error);
      throw error;
    }
  }

  /**
   * Get unallocated students
   */
  async getUnallocated(): Promise<PrismaStudent[]> {
    try {
      return await prisma.student.findMany({
        where: { roomId: null },
        include: { user: true },
      });
    } catch (error) {
      console.error('Error fetching unallocated students:', error);
      throw error;
    }
  }

  /**
   * Get allocated students
   */
  async getAllocated(): Promise<PrismaStudent[]> {
    try {
      return await prisma.student.findMany({
        where: { NOT: { roomId: null } },
        include: {
          user: true,
          room: {
            include: {
              hostel: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching allocated students:', error);
      throw error;
    }
  }

  /**
   * Get count by status
   */
  async getCountByStatus(): Promise<{
    total: number;
    allocated: number;
    unallocated: number;
  }> {
    try {
      const total = await prisma.student.count();
      const allocated = await prisma.student.count({
        where: { NOT: { roomId: null } },
      });

      return {
        total,
        allocated,
        unallocated: total - allocated,
      };
    } catch (error) {
      console.error('Error getting counts:', error);
      throw error;
    }
  }
}

export default new StudentRepository();
