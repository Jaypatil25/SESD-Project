import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Input } from '../components/index';
import { PageHeader } from '../components/Layout';
import { MapPin, Users, Wifi, Coffee, Dumbbell, Utensils, Star } from 'lucide-react';
import hostelService from '../services/hostelService';

export const StudentHostelsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all hostels from API
      const response = await hostelService.getAllHostels();
      
      if (response.data && Array.isArray(response.data)) {
        // Map API data to display format
        const formattedHostels = response.data.map(hostel => ({
          id: hostel.id,
          name: hostel.name,
          location: hostel.location,
          capacity: hostel.capacity || 0,
          type: hostel.type,
          available: 0, // Will be calculated from rooms
          totalRooms: hostel.totalRooms || 0,
          rating: hostel.rating || 4.5,
          image: '🏢',
          facilities: hostel.facilities ? (typeof hostel.facilities === 'string' ? JSON.parse(hostel.facilities) : hostel.facilities) : [],
          price: hostel.price || 'Contact Admin',
          description: hostel.description || '',
        }));
        setHostels(formattedHostels);
      }
    } catch (err) {
      console.error('Error fetching hostels:', err);
      setError(err.message || 'Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  const filteredHostels = hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Available Hostels"
          description="Browse and select from our available hostels"
        />
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <p>Loading hostels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Available Hostels"
          description="Browse and select from our available hostels"
        />
        <Card style={{ marginBottom: 'var(--space-2xl)', background: '#fee2e2', border: '1px solid #fca5a5' }}>
          <p style={{ color: '#dc2626', fontWeight: '500' }}>Error: {error}</p>
          <Button variant="primary" style={{ marginTop: 'var(--space-md)' }} onClick={fetchHostels}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Available Hostels"
        description="Browse and select from our available hostels"
      />

      {/* Search Bar */}
      <Card style={{ marginBottom: 'var(--space-2xl)' }}>
        <Input
          placeholder="Search by hostel name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Hostels Grid */}
      <div className="grid-2">
        {filteredHostels.map(hostel => (
          <Card key={hostel.id} className="clay-block">
            {/* Header with Image and Rating */}
            <div style={{
              background: `linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              textAlign: 'center',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '48px' }}>{hostel.image}</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--color-white)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <Star size={16} fill="var(--color-accent-orange)" color="var(--color-accent-orange)" />
                <span style={{ fontWeight: '600' }}>{hostel.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', marginBottom: '4px' }}>
                {hostel.name}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-md)' }}>
                <MapPin size={16} />
                {hostel.location}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
              }}>
                <div style={{
                  background: 'rgba(78, 205, 196, 0.1)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                    {hostel.available}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                    Available
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
                    {hostel.capacity}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)' }}>
                    Total Capacity
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: '8px' }}>
                  Facilities:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {hostel.facilities.map(facility => (
                    <Badge key={facility} variant="primary" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: 'var(--space-lg)',
              }}>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                  Monthly Rate
                </p>
                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700' }}>
                  {hostel.price}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <Button variant="secondary" block>
                View Details
              </Button>
              <Button variant="primary" block>
                Browse Rooms
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const StudentRoomsPage = () => {
  const [filterHostel, setFilterHostel] = useState('all');
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostelsFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoomsAndHostels();
  }, []);

  const fetchRoomsAndHostels = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all rooms and hostels from API
      const [roomsResponse, hostelsResponse] = await Promise.all([
        hostelService.getAllRooms(),
        hostelService.getAllHostels(),
      ]);
      
      if (roomsResponse.data && Array.isArray(roomsResponse.data)) {
        const formattedRooms = roomsResponse.data.map(room => ({
          id: room.id,
          number: room.roomNumber?.toString() || `Room-${room.id}`,
          hostel: room.hostel?.name || 'Unknown Hostel',
          hostelId: room.hostelId,
          type: room.type || 'Standard',
          capacity: room.capacity || 1,
          occupants: room.currentCount || 0,
          amenities: room.amenities ? (typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities) : ['WiFi'],
          price: room.price || 'Contact Admin',
          available: room.isAvailable !== false,
        }));
        setRooms(formattedRooms);
      }

      if (hostelsResponse.data && Array.isArray(hostelsResponse.data)) {
        setHostelsFilter(hostelsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = filterHostel === 'all' 
    ? rooms 
    : rooms.filter(room => {
        const hostel = hostels.find(h => h.id === parseInt(filterHostel));
        return hostel && room.hostelId === hostel.id;
      });

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Available Rooms"
          description="Browse and apply for available hostel rooms"
        />
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Available Rooms"
          description="Browse and apply for available hostel rooms"
        />
        <Card style={{ marginBottom: 'var(--space-2xl)', background: '#fee2e2', border: '1px solid #fca5a5' }}>
          <p style={{ color: '#dc2626', fontWeight: '500' }}>Error: {error}</p>
          <Button variant="primary" style={{ marginTop: 'var(--space-md)' }} onClick={fetchRoomsAndHostels}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Available Rooms"
        description="Browse and apply for available hostel rooms"
      />

      {/* Filter */}
      <Card style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Filter by Hostel:</label>
          <select
            value={filterHostel}
            onChange={(e) => setFilterHostel(e.target.value)}
            className="input-field"
            style={{ flex: 1, maxWidth: '300px' }}
          >
            <option value="all">All Hostels</option>
            {hostels.map(hostel => (
              <option key={hostel.id} value={hostel.id}>
                {hostel.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid-3">
        {filteredRooms.map(room => (
          <Card key={room.id} className={`clay-block ${!room.available ? 'opacity-60' : ''}`} style={{ opacity: room.available ? 1 : 0.6 }}>
            {/* Room Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-lg)',
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>Room {room.number}</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-medium-gray)' }}>
                  {room.hostel}
                </p>
              </div>
              <Badge variant={room.available ? 'success' : 'danger'}>
                {room.available ? 'Available' : 'Occupied'}
              </Badge>
            </div>

            {/* Room Details */}
            <div style={{
              background: 'var(--color-light)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                    Type
                  </p>
                  <p style={{ fontWeight: '600' }}>{room.type}</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                    Capacity
                  </p>
                  <p style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={16} /> {room.occupants}/{room.capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: '8px' }}>
                Amenities:
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {room.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-medium-gray)', marginBottom: '4px' }}>
                Price
              </p>
              <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                {room.price}
              </p>
            </div>

            {/* Action */}
            <Button
              variant="primary"
              block
              disabled={!room.available}
            >
              {room.available ? 'Apply for Room' : 'Not Available'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
