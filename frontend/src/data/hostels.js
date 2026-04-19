/**
 * Hostel Data Structure
 * Contains all hostel definitions with room capacity and sharing details
 */

export const HOSTELS = [
  {
    id: 'ys1',
    name: 'YourSpace - 1',
    location: 'Central Campus',
    totalRooms: 50,
    sharingCapacity: 4,
    amenities: ['WiFi', 'AC', 'Common Kitchen', 'Laundry', 'Gym'],
    type: 'co-ed',
    emoji: '🏢'
  },
  {
    id: 'ys2',
    name: 'YourSpace - 2',
    location: 'North Campus',
    totalRooms: 50,
    sharingCapacity: 4,
    amenities: ['WiFi', 'AC', 'Study Area', 'Cafeteria', 'Sports'],
    type: 'co-ed',
    emoji: '🏢'
  },
  {
    id: 'ib',
    name: 'Incampus - Boys',
    location: 'East Campus',
    totalRooms: 120,
    sharingCapacity: 3,
    amenities: ['WiFi', 'AC', 'Library', 'Sports Complex', 'Gym'],
    type: 'boys',
    emoji: '👨‍🎓'
  },
  {
    id: 'ig',
    name: 'Incampus - Girls',
    location: 'West Campus',
    totalRooms: 120,
    sharingCapacity: 3,
    amenities: ['WiFi', 'AC', 'Library', 'Study Center', 'Beauty Salon'],
    type: 'girls',
    emoji: '👩‍🎓'
  }
];

/**
 * Generate all rooms for a hostel
 */
export const generateRoomsForHostel = (hostel) => {
  const rooms = [];
  for (let i = 1; i <= hostel.totalRooms; i++) {
    rooms.push({
      id: `${hostel.id}-room-${i}`,
      hostelId: hostel.id,
      roomNumber: i,
      capacity: hostel.sharingCapacity,
      currentOccupants: 0,
      students: [], // Array of student IDs
      status: 'available' // available, full
    });
  }
  return rooms;
};

/**
 * Initialize all rooms for all hostels
 */
export const initializeAllRooms = () => {
  const allRooms = {};
  HOSTELS.forEach(hostel => {
    allRooms[hostel.id] = generateRoomsForHostel(hostel);
  });
  return allRooms;
};

/**
 * Get random available room from a hostel
 */
export const getRandomAvailableRoom = (hostelId, allRooms) => {
  const hostelRooms = allRooms[hostelId];
  
  if (!hostelRooms) {
    return null;
  }

  // Filter available rooms that are not full
  const availableRooms = hostelRooms.filter(room => {
    const hostel = HOSTELS.find(h => h.id === hostelId);
    return room.currentOccupants < hostel.sharingCapacity;
  });

  if (availableRooms.length === 0) {
    return null;
  }

  // Return random room from available rooms
  return availableRooms[Math.floor(Math.random() * availableRooms.length)];
};

/**
 * Allocate a student to a room
 */
export const allocateStudentToRoom = (studentId, roomId, allRooms) => {
  // Find the room
  let foundRoom = null;
  let hostelId = null;

  for (const [hId, rooms] of Object.entries(allRooms)) {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      foundRoom = room;
      hostelId = hId;
      break;
    }
  }

  if (!foundRoom) {
    return { success: false, message: 'Room not found' };
  }

  // Get hostel capacity
  const hostel = HOSTELS.find(h => h.id === hostelId);
  
  // Check if room is full
  if (foundRoom.currentOccupants >= hostel.sharingCapacity) {
    return { 
      success: false, 
      message: `Room is full. Maximum capacity is ${hostel.sharingCapacity} students.` 
    };
  }

  // Check if student is already in the room
  if (foundRoom.students.includes(studentId)) {
    return { success: false, message: 'Student is already allocated to this room' };
  }

  // Allocate student
  foundRoom.students.push(studentId);
  foundRoom.currentOccupants += 1;

  // Update room status
  if (foundRoom.currentOccupants >= hostel.sharingCapacity) {
    foundRoom.status = 'full';
  }

  return { 
    success: true, 
    message: `Successfully allocated to Room ${foundRoom.roomNumber}`,
    room: foundRoom
  };
};

/**
 * Get available hostels (those that have available rooms)
 */
export const getAvailableHostels = (allRooms) => {
  return HOSTELS.filter(hostel => {
    const availableRooms = allRooms[hostel.id].filter(room => 
      room.currentOccupants < hostel.sharingCapacity
    );
    return availableRooms.length > 0;
  });
};

/**
 * Get hostel statistics
 */
export const getHostelStats = (hostelId, allRooms) => {
  const hostel = HOSTELS.find(h => h.id === hostelId);
  const rooms = allRooms[hostelId];

  if (!hostel || !rooms) {
    return null;
  }

  const occupiedRooms = rooms.filter(r => r.currentOccupants > 0).length;
  const fullRooms = rooms.filter(r => r.status === 'full').length;
  const availableRooms = rooms.filter(r => r.currentOccupants < hostel.sharingCapacity).length;
  const totalOccupants = rooms.reduce((sum, room) => sum + room.currentOccupants, 0);

  return {
    hostel,
    totalRooms: hostel.totalRooms,
    occupiedRooms,
    fullRooms,
    availableRooms,
    totalOccupants,
    occupancyPercentage: Math.round((occupiedRooms / hostel.totalRooms) * 100),
    totalCapacity: hostel.totalRooms * hostel.sharingCapacity
  };
};
