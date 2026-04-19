import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, StatusBadge, Input, Select } from '../components/index';
import { PageHeader } from '../components/Layout';
import { HOSTELS, getHostelStats } from '../data/hostels';
import { BarChart3, Users, Building2, DoorOpen, TrendingUp, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export const AdminDashboard = () => {
  const { allRooms, allStudents, studentAllocations } = useAuth();

  // Calculate statistics from actual data
  const stats = (() => {
    let totalAllocated = 0;
    let totalCapacity = 0;
    let fullRooms = 0;

    Object.values(allRooms).forEach(rooms => {
      rooms.forEach(room => {
        totalCapacity += room.capacity;
        totalAllocated += room.currentOccupants;
        if (room.status === 'full') fullRooms += 1;
      });
    });

    return {
      totalStudents: allStudents.length,
      totalAdmins: 1,
      totalHostels: HOSTELS.length,
      totalRooms: Object.values(allRooms).reduce((sum, rooms) => sum + rooms.length, 0),
      allocatedRooms: Object.values(allRooms).reduce((sum, rooms) => sum + rooms.filter(r => r.currentOccupants > 0).length, 0),
      fullRooms: fullRooms,
      totalOccupants: totalAllocated,
      totalCapacity: totalCapacity,
      occupancyPercentage: totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0,
    };
  })();

  const recentActivities = Object.entries(studentAllocations)
    .map(([studentId, allocation]) => ({
      id: studentId,
      message: `Room ${allocation.roomNumber} allocated in ${allocation.hostelName}`,
      timestamp: new Date(allocation.allocatedAt).toLocaleDateString()
    }))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="System overview and management statistics"
      />

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={24} color="var(--color-primary)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Total Students
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.totalStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(78, 205, 196, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Building2 size={24} color="var(--color-secondary)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Total Hostels
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.totalHostels}
              </p>
            </div>
          </div>
        </Card>

        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(255, 182, 39, 0.2) 0%, rgba(255, 182, 39, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DoorOpen size={24} color="var(--color-accent-orange)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Total Rooms
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.totalRooms}
              </p>
            </div>
          </div>
        </Card>

        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={24} color="var(--color-accent-green)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Occupancy Rate
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.occupancyPercentage}%
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginTop: '4px' }}>
                {stats.totalOccupants}/{stats.totalCapacity} students
              </p>
            </div>
          </div>
        </Card>

        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BarChart3 size={24} color="var(--color-accent-purple)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Full Rooms
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.fullRooms}
              </p>
            </div>
          </div>
        </Card>

        <Card className="clay-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={24} color="var(--color-accent-blue)" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Allocated Rooms
              </p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700' }}>
                {stats.allocatedRooms}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <Card header={<h3 className="card-title">Recent Allocations</h3>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  background: 'var(--color-light)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--color-secondary)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {activity.message}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export const AdminStudentsPage = () => {
  const { allStudents, studentAllocations } = useAuth();

  return (
    <div>
      <PageHeader
        title="Manage Students"
        description="View all registered students and their allocations"
      />

      <Card>
        {allStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--color-medium-gray)' }}>No students registered yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-light-gray)' }}>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: '600' }}>Allocation</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map(student => {
                  const allocation = studentAllocations[student.id];
                  return (
                    <tr key={student.id} style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: 'var(--space-md)', fontWeight: '600' }}>{student.name}</td>
                      <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                        {student.email}
                      </td>
                      <td style={{ padding: 'var(--space-md)' }}>
                        <StatusBadge status={allocation ? 'allocated' : 'pending'} />
                      </td>
                      <td style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                        {allocation ? (
                          <div>
                            <p style={{ fontWeight: '600' }}>{allocation.hostelName}</p>
                            <p style={{ color: 'var(--color-medium-gray)' }}>Room {allocation.roomNumber}</p>
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export const AdminHostelsPage = () => {
  const { allRooms } = useAuth();

  return (
    <div>
      <PageHeader
        title="Manage Hostels"
        description="View hostel details and room allocation status"
      />

      <div className="grid-2">
        {HOSTELS.map(hostel => {
          const hostelStats = (() => {
            const rooms = allRooms[hostel.id] || [];
            const occupiedRooms = rooms.filter(r => r.currentOccupants > 0).length;
            const fullRooms = rooms.filter(r => r.status === 'full').length;
            const availableRooms = rooms.filter(r => r.currentOccupants < hostel.sharingCapacity).length;
            const totalOccupants = rooms.reduce((sum, room) => sum + room.currentOccupants, 0);
            const totalCapacity = hostel.totalRooms * hostel.sharingCapacity;

            return { occupiedRooms, fullRooms, availableRooms, totalOccupants, totalCapacity };
          })();

          return (
            <Card key={hostel.id} className="clay-block">
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', marginBottom: '8px' }}>
                  {hostel.name}
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)', marginBottom: 'var(--space-lg)' }}>
                  {hostel.location}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ background: 'var(--color-light)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                      Total Rooms
                    </p>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                      {hostel.totalRooms}
                    </p>
                  </div>
                  <div style={{ background: 'var(--color-light)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                      Occupied
                    </p>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                      {hostelStats.occupiedRooms}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ background: 'var(--color-light)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                      Sharing Capacity
                    </p>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                      {hostel.sharingCapacity} students
                    </p>
                  </div>
                  <div style={{ background: 'var(--color-light)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                      Full Rooms
                    </p>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                      {hostelStats.fullRooms}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                    Occupancy Status
                  </p>
                  <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                    {hostelStats.totalOccupants}/{hostelStats.totalCapacity} students
                  </p>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: 'var(--radius-sm)', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(hostelStats.totalOccupants / hostelStats.totalCapacity) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent-blue) 100%)',
                    }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <Button variant="secondary" block disabled>
                  <Edit2 size={18} /> Edit
                </Button>
                <Button variant="outline" block disabled>
                  <Eye size={18} /> Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
