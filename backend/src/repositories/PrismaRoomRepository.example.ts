import { prisma } from '../lib/prisma';
// Uncomment when using Prisma types
// import { Room as PrismaRoom } from '@prisma/client';
type PrismaRoom = any;

/**
 * Example Room Repository using Prisma ORM
 * 
 * Demonstrates room management including:
 * - Availability checks
 * - Capacity enforcement
 * - Random room selection
 * - Occupancy tracking
 */

export class RoomRepository {
  /**
   * Create a room
   */
  async create(data: {
    roomNumber: number;
    capacity: number;
    hostelId: number;
    amenities?: string[];
  }): Promise<PrismaRoom> {
    try {
      return await prisma.room.create({
        data: {
          roomNumber: data.roomNumber,
          capacity: data.capacity,
          amenities: JSON.stringify(data.amenities || []),
          hostelId: data.hostelId,
        },
        include: {
          hostel: true,
          students: true,
          allocations: true,
        },
      });
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Get room by ID
   */
  async getById(id: number): Promise<PrismaRoom | null> {
    try {
      return await prisma.room.findUnique({
        where: { id },
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
          allocations: true,
        },
      });
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  /**
   * Get all rooms in a hostel
   */
  async getByHostelId(hostelId: number): Promise<PrismaRoom[]> {
    try {
      return await prisma.room.findMany({
        where: { hostelId },
        include: {
          students: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching rooms by hostel:', error);
      throw error;
    }
  }

  /**
   * Get all rooms
   */
  async getAll(skip: number = 0, take: number = 100): Promise<PrismaRoom[]> {
    try {
      return await prisma.room.findMany({
        skip,
        take,
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { hostelId: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  /**
   * Get available rooms in a hostel
   * (rooms that haven't reached capacity)
   */
  async getAvailableInHostel(hostelId: number): Promise<PrismaRoom[]> {
    try {
      return await prisma.room.findMany({
        where: {
          hostelId,
          currentCount: {
            lt: prisma.room.fields.capacity, // currentCount < capacity
          },
        },
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }

  /**
   * Get a random available room in a hostel
   */
  async getRandomAvailableInHostel(hostelId: number): Promise<PrismaRoom | null> {
    try {
      // Get all available rooms
      const availableRooms = await prisma.room.findMany({
        where: {
          hostelId,
          currentCount: {
            lt: prisma.room.fields.capacity,
          },
        },
      });

      if (availableRooms.length === 0) {
        return null;
      }

      // Select random room
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      const randomRoom = availableRooms[randomIndex];

      // Return full details
      return await prisma.room.findUnique({
        where: { id: randomRoom.id },
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching random available room:', error);
      throw error;
    }
  }

  /**
   * Check if room has capacity
   */
  async hasCapacity(roomId: number): Promise<boolean> {
    try {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) return false;
      return room.currentCount < room.capacity;
    } catch (error) {
      console.error('Error checking room capacity:', error);
      throw error;
    }
  }

  /**
   * Check if room is full
   */
  async isFull(roomId: number): Promise<boolean> {
    try {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) return false;
      return room.currentCount >= room.capacity;
    } catch (error) {
      console.error('Error checking if room is full:', error);
      throw error;
    }
  }

  /**
   * Increment room occupancy
   */
  async incrementOccupancy(roomId: number): Promise<PrismaRoom> {
    try {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      // Check if adding one more would exceed capacity
      if (room.currentCount + 1 > room.capacity) {
        throw new Error('Room is full, cannot add more students');
      }

      // Update occupancy
      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: {
          currentCount: {
            increment: 1,
          },
          // Update status if full
          ...(room.currentCount + 1 >= room.capacity && {
            isAvailable: false,
          }),
        },
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
      });

      return updatedRoom;
    } catch (error) {
      console.error('Error incrementing occupancy:', error);
      throw error;
    }
  }

  /**
   * Decrement room occupancy
   */
  async decrementOccupancy(roomId: number): Promise<PrismaRoom> {
    try {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      if (room.currentCount <= 0) {
        throw new Error('Room occupancy cannot go below 0');
      }

      // Update occupancy
      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: {
          currentCount: {
            decrement: 1,
          },
          // Mark as available if it now has capacity
          ...(room.currentCount - 1 < room.capacity && {
            isAvailable: true,
          }),
        },
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
      });

      return updatedRoom;
    } catch (error) {
      console.error('Error decrementing occupancy:', error);
      throw error;
    }
  }

  /**
   * Get occupancy statistics
   */
  async getOccupancyStats(hostelId?: number): Promise<{
    totalRooms: number;
    fullRooms: number;
    emptyRooms: number;
    partiallyFilled: number;
    totalOccupants: number;
    averageOccupancy: number;
    occupancyPercentage: number;
  }> {
    try {
      const whereClause = hostelId ? { hostelId } : undefined;

      const rooms = await prisma.room.findMany({
        where: whereClause,
      });

      const totalRooms = rooms.length;
      const totalCapacity = rooms.reduce((sum: any, r: any) => sum + r.capacity, 0);
      const totalOccupants = rooms.reduce((sum: any, r: any) => sum + r.currentCount, 0);

      const fullRooms = rooms.filter((r: any) => r.currentCount >= r.capacity).length;
      const emptyRooms = rooms.filter((r: any) => r.currentCount === 0).length;
      const partiallyFilled = totalRooms - fullRooms - emptyRooms;

      return {
        totalRooms,
        fullRooms,
        emptyRooms,
        partiallyFilled,
        totalOccupants,
        averageOccupancy:
          totalRooms > 0 ? Math.round((totalOccupants / totalRooms) * 10) / 10 : 0,
        occupancyPercentage:
          totalCapacity > 0 ? Math.round((totalOccupants / totalCapacity) * 100) : 0,
      };
    } catch (error) {
      console.error('Error getting occupancy stats:', error);
      throw error;
    }
  }

  /**
   * Get full rooms
   */
  async getFullRooms(hostelId?: number): Promise<PrismaRoom[]> {
    try {
      const whereClause = {
        ...(hostelId && { hostelId }),
        isAvailable: false,
      };

      return await prisma.room.findMany({
        where: whereClause,
        include: {
          hostel: true,
          students: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching full rooms:', error);
      throw error;
    }
  }

  /**
   * Get empty rooms
   */
  async getEmptyRooms(hostelId?: number): Promise<PrismaRoom[]> {
    try {
      const whereClause = {
        ...(hostelId && { hostelId }),
        currentCount: 0,
      };

      return await prisma.room.findMany({
        where: whereClause,
        include: {
          hostel: true,
        },
      });
    } catch (error) {
      console.error('Error fetching empty rooms:', error);
      throw error;
    }
  }

  /**
   * Update room amenities
   */
  async updateAmenities(
    roomId: number,
    amenities: string[]
  ): Promise<PrismaRoom> {
    try {
      return await prisma.room.update({
        where: { id: roomId },
        data: {
          amenities: JSON.stringify(amenities),
        },
        include: {
          hostel: true,
        },
      });
    } catch (error) {
      console.error('Error updating amenities:', error);
      throw error;
    }
  }

  /**
   * Delete a room
   */
  async delete(roomId: number): Promise<void> {
    try {
      // Note: This might fail if room has students
      // Consider soft delete or deallocating students first
      await prisma.room.delete({
        where: { id: roomId },
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}

export default new RoomRepository();
