import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, StatusBadge, Loading, Empty } from '../components/index';
import { PageHeader } from '../components/Layout';
import { HOSTELS, getRandomAvailableRoom, allocateStudentToRoom, getAvailableHostels } from '../data/hostels';
import { DoorOpen, CheckCircle, Shuffle, AlertCircle } from 'lucide-react';

export const StudentDashboard = () => {
  const { user, allRooms, updateRooms, studentAllocations, updateAllocations, addStudent } = useAuth();
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [randomRoom, setRandomRoom] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add this student to the context on mount
    if (user && !studentAllocations[user.id]) {
      addStudent(user);
    }

    // Check if student already has allocation
    if (studentAllocations[user?.id]) {
      setAllocation(studentAllocations[user.id]);
    }
  }, [user, studentAllocations, addStudent]);
  const handleSelectHostel = (hostel) => {
    setSelectedHostel(hostel);
    setRandomRoom(null);
    setMessage('');
  };

  const handleGetRandomRoom = () => {
    if (!selectedHostel) {
      setMessage('Please select a hostel first');
      setMessageType('error');
      return;
    }

    const room = getRandomAvailableRoom(selectedHostel.id, allRooms);
    if (!room) {
      setMessage(`No available rooms in ${selectedHostel.name}. All rooms are full!`);
      setMessageType('error');
      setRandomRoom(null);
      return;
    }

    setRandomRoom(room);
    setMessage('');
  };

  const handleAllocateRoom = async () => {
    if (!randomRoom) {
      setMessage('Please select a room first');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      // Allocate student to room
      const result = allocateStudentToRoom(user.id, randomRoom.id, allRooms);

      if (result.success) {
        // Update rooms in context
        updateRooms(allRooms);

        // Update student allocation
        const newAllocations = {
          ...studentAllocations,
          [user.id]: {
            roomId: randomRoom.id,
            hostelId: selectedHostel.id,
            roomNumber: randomRoom.roomNumber,
            hostelName: selectedHostel.name,
            allocatedAt: new Date().toISOString(),
            capacity: selectedHostel.sharingCapacity
          }
        };
        updateAllocations(newAllocations);
        setAllocation(newAllocations[user.id]);

        setMessage(`✓ ${result.message}`);
        setMessageType('success');
        setRandomRoom(null);
        setSelectedHostel(null);
      } else {
        setMessage(`✗ ${result.message}`);
        setMessageType('error');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const availableHostels = getAvailableHostels(allRooms);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name || 'Student'}! 👋`}
        description="Find and allocate your hostel room"
      />

      {/* Current Allocation Status */}
      {allocation && (
        <Card style={{ 
          marginBottom: 'var(--space-2xl)', 
          background: 'linear-gradient(135deg, rgba(76, 224, 106, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
          borderLeft: '4px solid var(--color-accent-green)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <CheckCircle size={28} color="var(--color-accent-green)" />
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                ✓ Room Allocated Successfully
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                {allocation.hostelName} - Room {allocation.roomNumber} 
                ({allocation.capacity}-sharing)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Message Display */}
      {message && (
        <Card style={{ 
          marginBottom: 'var(--space-2xl)', 
          background: messageType === 'success' 
            ? 'linear-gradient(135deg, rgba(76, 224, 106, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)'
            : messageType === 'error'
            ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 184, 0, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
          borderLeft: `4px solid ${messageType === 'success' ? 'var(--color-accent-green)' : messageType === 'error' ? 'var(--color-primary)' : 'var(--color-secondary)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            {messageType === 'error' && <AlertCircle size={20} color="var(--color-primary)" />}
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              {message}
            </p>
          </div>
        </Card>
      )}

      {/* Random Room Selector */}
      {!allocation && (
        <>
          {/* Hostel Selection */}
          <Card style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
                Step 1: Select a Hostel
              </h3>
              <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
                {availableHostels.length === 0 ? (
                  <Empty title="No Hostels Available" description="All hostels are currently full." />
                ) : (
                  availableHostels.map(hostel => (
                    <Card
                      key={hostel.id}
                      style={{
                        cursor: 'pointer',
                        background: selectedHostel?.id === hostel.id 
                          ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                          : 'transparent',
                        borderTop: selectedHostel?.id === hostel.id 
                          ? '3px solid var(--color-primary)' 
                          : 'none',
                        transform: selectedHostel?.id === hostel.id ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleSelectHostel(hostel)}
                    >
                      <div>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{hostel.emoji}</div>
                        <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{hostel.name}</h4>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '8px' }}>
                          {hostel.location}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <Badge variant="primary">{hostel.sharingCapacity}-sharing</Badge>
                          <Badge variant="secondary">{hostel.totalRooms} rooms</Badge>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                          Amenities: {hostel.amenities.join(', ')}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Random Room Selection */}
          {selectedHostel && (
            <Card style={{ marginBottom: 'var(--space-2xl)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
                  Step 2: Get a Random Room
                </h3>
                <Button
                  onClick={handleGetRandomRoom}
                  disabled={loading}
                  style={{
                    width: '100%',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-md)'
                  }}
                >
                  <Shuffle size={20} />
                  Get Random Room in {selectedHostel.name}
                </Button>

                {randomRoom && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                      <DoorOpen size={28} color="var(--color-secondary)" />
                      <div>
                        <p style={{ fontWeight: '600', fontSize: 'var(--font-size-lg)' }}>
                          Room {randomRoom.roomNumber}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                          Capacity: {selectedHostel.sharingCapacity} students
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                          Current Occupants
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                          {randomRoom.currentOccupants}/{randomRoom.capacity}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                          Status
                        </p>
                        <StatusBadge status={randomRoom.currentOccupants >= randomRoom.capacity ? 'not-allocated' : 'allocated'}>
                          {randomRoom.currentOccupants >= randomRoom.capacity ? 'Full' : 'Available'}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>
                )}

                {randomRoom && randomRoom.currentOccupants < selectedHostel.sharingCapacity && (
                  <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <Button
                      onClick={handleAllocateRoom}
                      disabled={loading}
                      className="btn-primary"
                      style={{ flex: 1 }}
                    >
                      {loading ? 'Allocating...' : 'Confirm Allocation'}
                    </Button>
                    <Button
                      onClick={() => setRandomRoom(null)}
                      variant="outline"
                      style={{ flex: 1 }}
                    >
                      Try Another
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Hostel Statistics */}
      <Card>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
          Hostel Availability
        </h3>
        <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
          {HOSTELS.map(hostel => {
            const stats = (() => {
              const rooms = allRooms[hostel.id];
              const occupiedRooms = rooms.filter(r => r.currentOccupants > 0).length;
              const availableRooms = rooms.filter(r => r.currentOccupants < hostel.sharingCapacity).length;
              const totalOccupants = rooms.reduce((sum, room) => sum + room.currentOccupants, 0);
              return { occupiedRooms, availableRooms, totalOccupants };
            })();

            return (
              <Card key={hostel.id} style={{
                background: stats.availableRooms === 0 
                  ? '#f5f5f5' 
                  : '#fafafa',
                borderLeft: `4px solid ${stats.availableRooms === 0 ? '#ff6b6b' : '#22c55e'}`
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: '600' }}>{hostel.name}</h4>
                  {stats.availableRooms === 0 && <Badge variant="danger">Full</Badge>}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <div>
                    <p style={{ color: '#666', marginBottom: '4px', fontWeight: '500' }}>Total Rooms</p>
                    <p style={{ fontWeight: '700', color: '#1a1a1a', fontSize: 'var(--font-size-lg)' }}>{hostel.totalRooms}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', marginBottom: '4px', fontWeight: '500' }}>Occupied</p>
                    <p style={{ fontWeight: '700', color: '#ff6b6b', fontSize: 'var(--font-size-lg)' }}>{stats.occupiedRooms}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', marginBottom: '4px', fontWeight: '500' }}>Available</p>
                    <p style={{ fontWeight: '700', color: '#22c55e', fontSize: 'var(--font-size-lg)' }}>{stats.availableRooms}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
