import { prisma } from '../lib/prisma';
// Uncomment when using Prisma types
// import { Allocation as PrismaAllocation, AllocationStatus } from '@prisma/client';
type PrismaAllocation = any;
type AllocationStatus = any;

/**
 * Example Allocation Repository using Prisma ORM
 * 
 * Demonstrates allocation management including:
 * - Creating allocations with automatic room occupancy updates
 * - Deallocating with rollback logic
 * - Transaction-based operations for atomicity
 * - Status tracking and statistics
 */

export class AllocationRepository {
  /**
   * Create a new allocation (allocate student to room)
   * 
   * This is a transactional operation to ensure:
   * - Allocation record is created
   * - Student's roomId is updated
   * - Room occupancy is incremented
   * - All happen atomically or all roll back
   */
  async allocateStudentToRoom(
    studentId: number,
    roomId: number,
    notes?: string
  ): Promise<PrismaAllocation> {
    try {
      // Use transaction to ensure all operations succeed or all fail
      return await prisma.$transaction(async (tx: any) => {
        // Check if room exists and has capacity
        const room = await tx.room.findUnique({
          where: { id: roomId },
        });

        if (!room) {
          throw new Error('Room not found');
        }

        if (room.currentCount >= room.capacity) {
          throw new Error('Room is full, cannot allocate');
        }

        // Check if student already has an allocation
        const existingAllocation = await tx.allocation.findFirst({
          where: {
            studentId,
            status: 'ALLOCATED',
          },
        });

        if (existingAllocation) {
          throw new Error('Student already has an allocation');
        }

        // Create allocation record
        const allocation = await tx.allocation.create({
          data: {
            studentId,
            roomId,
            status: 'ALLOCATED',
            allocationDate: new Date(),
            approvalDate: new Date(),
            notes: notes || '',
          },
          include: {
            student: {
              include: {
                user: true,
              },
            },
            room: {
              include: {
                hostel: true,
              },
            },
          },
        });

        // Update student with room assignment
        await tx.student.update({
          where: { id: studentId },
          data: { roomId },
        });

        // Increment room occupancy
        await tx.room.update({
          where: { id: roomId },
          data: {
            currentCount: {
              increment: 1,
            },
            // Mark as unavailable if now full
            ...(room.currentCount + 1 >= room.capacity && {
              isAvailable: false,
            }),
          },
        });

        return allocation;
      });
    } catch (error) {
      console.error('Error allocating student to room:', error);
      throw error;
    }
  }

  /**
   * Deallocate student from room
   * 
   * Transactional operation that:
   * - Updates allocation status to DEALLOCATED
   * - Clears student's roomId
   * - Decrements room occupancy
   * - Marks room as available if now has capacity
   */
  async deallocateStudent(studentId: number): Promise<PrismaAllocation> {
    try {
      return await prisma.$transaction(async (tx: any) => {
        // Find student's current allocation
        const allocation = await tx.allocation.findFirst({
          where: {
            studentId,
            status: 'ALLOCATED',
          },
        });

        if (!allocation) {
          throw new Error('No active allocation found for student');
        }

        // Update allocation status
        const updatedAllocation = await tx.allocation.update({
          where: { id: allocation.id },
          data: {
            status: 'DEALLOCATED',
          },
        });

        // Clear student's room assignment
        await tx.student.update({
          where: { id: studentId },
          data: { roomId: null },
        });

        // Get room to update occupancy
        const room = await tx.room.findUnique({
          where: { id: allocation.roomId },
        });

        if (room) {
          // Decrement room occupancy
          await tx.room.update({
            where: { id: allocation.roomId },
            data: {
              currentCount: {
                decrement: 1,
              },
              // Mark as available if now has capacity
              ...(room.currentCount - 1 < room.capacity && {
                isAvailable: true,
              }),
            },
          });
        }

        return updatedAllocation;
      });
    } catch (error) {
      console.error('Error deallocating student:', error);
      throw error;
    }
  }

  /**
   * Get allocation by ID
   */
  async getById(id: number): Promise<PrismaAllocation | null> {
    try {
      return await prisma.allocation.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              user: true,
            },
          },
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
   * Get all allocations for a student
   */
  async getByStudentId(studentId: number): Promise<PrismaAllocation[]> {
    try {
      return await prisma.allocation.findMany({
        where: { studentId },
        include: {
          room: {
            include: {
              hostel: true,
            },
          },
        },
        orderBy: { allocationDate: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching allocations by student:', error);
      throw error;
    }
  }

  /**
   * Get current allocation for a student
   */
  async getCurrentAllocation(studentId: number): Promise<PrismaAllocation | null> {
    try {
      return await prisma.allocation.findFirst({
        where: {
          studentId,
          status: 'ALLOCATED',
        },
        include: {
          room: {
            include: {
              hostel: true,
              students: {
                include: {
                  user: true,
                },
              },
            },
          },
          student: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching current allocation:', error);
      throw error;
    }
  }

  /**
   * Get all allocations in a room
   */
  async getByRoomId(roomId: number): Promise<PrismaAllocation[]> {
    try {
      return await prisma.allocation.findMany({
        where: { roomId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { allocationDate: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching allocations by room:', error);
      throw error;
    }
  }

  /**
   * Get all allocations with optional filtering
   */
  async getAll(
    status?: AllocationStatus,
    skip: number = 0,
    take: number = 50
  ): Promise<PrismaAllocation[]> {
    try {
      const whereClause = status ? { status } : undefined;

      return await prisma.allocation.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          student: {
            include: {
              user: true,
            },
          },
          room: {
            include: {
              hostel: true,
            },
          },
        },
        orderBy: { allocationDate: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching allocations:', error);
      throw error;
    }
  }

  /**
   * Get allocations by hostel
   */
  async getByHostelId(hostelId: number): Promise<PrismaAllocation[]> {
    try {
      return await prisma.allocation.findMany({
        where: {
          room: {
            hostelId,
          },
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          room: {
            include: {
              hostel: true,
            },
          },
        },
        orderBy: { allocationDate: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching allocations by hostel:', error);
      throw error;
    }
  }

  /**
   * Approve a pending allocation
   */
  async approveAllocation(allocationId: number): Promise<PrismaAllocation> {
    try {
      return await prisma.allocation.update({
        where: { id: allocationId },
        data: {
          status: 'APPROVED',
          approvalDate: new Date(),
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          room: {
            include: {
              hostel: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error approving allocation:', error);
      throw error;
    }
  }

  /**
   * Reject an allocation
   */
  async rejectAllocation(
    allocationId: number,
    reason?: string
  ): Promise<PrismaAllocation> {
    try {
      return await prisma.allocation.update({
        where: { id: allocationId },
        data: {
          status: 'REJECTED',
          notes: reason || '',
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          room: {
            include: {
              hostel: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error rejecting allocation:', error);
      throw error;
    }
  }

  /**
   * Get allocation statistics
   */
  async getStatistics(): Promise<{
    total: number;
    allocated: number;
    pending: number;
    approved: number;
    rejected: number;
    deallocated: number;
  }> {
    try {
      const results = await Promise.all([
        prisma.allocation.count(),
        prisma.allocation.count({ where: { status: 'ALLOCATED' } }),
        prisma.allocation.count({ where: { status: 'PENDING' } }),
        prisma.allocation.count({ where: { status: 'APPROVED' } }),
        prisma.allocation.count({ where: { status: 'REJECTED' } }),
        prisma.allocation.count({ where: { status: 'DEALLOCATED' } }),
      ]);

      return {
        total: results[0],
        allocated: results[1],
        pending: results[2],
        approved: results[3],
        rejected: results[4],
        deallocated: results[5],
      };
    } catch (error) {
      console.error('Error getting allocation statistics:', error);
      throw error;
    }
  }

  /**
   * Get recent allocations
   */
  async getRecent(limit: number = 10): Promise<PrismaAllocation[]> {
    try {
      return await prisma.allocation.findMany({
        take: limit,
        orderBy: { allocationDate: 'desc' },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          room: {
            include: {
              hostel: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching recent allocations:', error);
      throw error;
    }
  }

  /**
   * Check if student is allocated
   */
  async isStudentAllocated(studentId: number): Promise<boolean> {
    try {
      const allocation = await prisma.allocation.findFirst({
        where: {
          studentId,
          status: 'ALLOCATED',
        },
      });

      return !!allocation;
    } catch (error) {
      console.error('Error checking student allocation:', error);
      throw error;
    }
  }

  /**
   * Delete an allocation (use with caution)
   */
  async delete(allocationId: number): Promise<void> {
    try {
      await prisma.allocation.delete({
        where: { id: allocationId },
      });
    } catch (error) {
      console.error('Error deleting allocation:', error);
      throw error;
    }
  }
}

export default new AllocationRepository();
