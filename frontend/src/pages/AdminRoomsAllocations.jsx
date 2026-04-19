import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, StatusBadge } from '../components/index';
import { PageHeader } from '../components/Layout';
import { HOSTELS } from '../data/hostels';
import { Eye, Edit2 } from 'lucide-react';

export const AdminRoomsPage = () => {
  const { allRooms } = useAuth();

  // Flatten all rooms from all hostels
  const allRoomsList = [];
  Object.entries(allRooms).forEach(([hostelId, rooms]) => {
    const hostel = HOSTELS.find(h => h.id === hostelId);
    rooms.forEach(room => {
      allRoomsList.push({
        id: room.id,
        number: room.roomNumber,
        hostel: hostel.name,
        capacity: room.capacity,
        occupants: room.currentOccupants,
        status: room.status === 'full' ? 'full' : (room.currentOccupants > 0 ? 'occupied' : 'available'),
        amenities: hostel.amenities.join(', ')
      });
    });
  });

  return (
    <div>
      <PageHeader
        title="Manage Rooms"
        description="View all rooms and their allocation status"
      />

      <Card>
        {allRoomsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--color-medium-gray)' }}>No rooms available</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-light-gray)' }}>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Room No.</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Hostel</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Capacity</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Occupants</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Amenities</th>
                </tr>
              </thead>
              <tbody>
                {allRoomsList.map(room => (
                  <tr key={room.id} style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                    <td style={{ padding: 'var(--space-md)', fontWeight: '600' }}>{room.number}</td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                      {room.hostel}
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      {room.capacity}-sharing
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontWeight: '600' }}>
                      {room.occupants}/{room.capacity}
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <StatusBadge status={room.status === 'full' ? 'not-allocated' : room.status} />
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                      {room.amenities}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export const AdminAllocationsPage = () => {
  const { allStudents, studentAllocations } = useAuth();

  // Build allocations list
  const allocationsList = Object.entries(studentAllocations).map(([studentId, allocation]) => {
    const student = allStudents.find(s => s.id === studentId);
    return {
      id: studentId,
      studentId: student?.id || 'Unknown',
      studentName: student?.name || 'Unknown',
      room: allocation.roomNumber,
      hostel: allocation.hostelName,
      allocationDate: new Date(allocation.allocatedAt).toLocaleDateString(),
      status: 'allocated',
      capacity: allocation.capacity
    };
  });

  return (
    <div>
      <PageHeader
        title="Student Allocations"
        description="View all student room allocations"
      />

      <Card>
        {allocationsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--color-medium-gray)' }}>No allocations yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-light-gray)' }}>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Student ID</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Room No.</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Hostel</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Capacity</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocationsList.map(allocation => (
                  <tr key={allocation.id} style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                    <td style={{ padding: 'var(--space-md)', fontWeight: '600' }}>{allocation.studentId}</td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      {allocation.studentName}
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontWeight: '600' }}>
                      {allocation.room}
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                      {allocation.hostel}
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                      {allocation.capacity}-sharing
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                      {allocation.allocationDate}
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <StatusBadge status={allocation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
