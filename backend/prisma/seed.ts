import { PrismaClient } from '../src/generated/prisma-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.allocation.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.hostel.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Admins
    console.log('👨‍💼 Creating admin users...');
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@hostel.com',
        password: 'hashed_password_123', // In production, hash this!
        role: 'ADMIN',
        admin: {
          create: {
            adminId: 'A001',
          },
        },
      },
    });
    console.log(`✓ Admin created: ${adminUser.email}`);

    // Create Hostels
    console.log('\n🏢 Creating hostels...');
    const hostel1 = await prisma.hostel.create({
      data: {
        name: 'YourSpace - 1',
        location: 'Central Campus',
        type: 'COED',
        description: '4-sharing accommodation',
      },
    });

    const hostel2 = await prisma.hostel.create({
      data: {
        name: 'YourSpace - 2',
        location: 'North Campus',
        type: 'COED',
        description: '4-sharing accommodation',
      },
    });

    const hostel3 = await prisma.hostel.create({
      data: {
        name: 'Incampus - Boys',
        location: 'East Campus',
        type: 'BOYS',
        description: '3-sharing accommodation',
      },
    });

    const hostel4 = await prisma.hostel.create({
      data: {
        name: 'Incampus - Girls',
        location: 'West Campus',
        type: 'GIRLS',
        description: '3-sharing accommodation',
      },
    });

    console.log(
      `✓ Hostels created: ${[hostel1.name, hostel2.name, hostel3.name, hostel4.name].join(', ')}`
    );

    // Create Rooms for each hostel
    console.log('\n🚪 Creating rooms...');
    const roomsToCreate = [
      // YourSpace - 1: 50 rooms, 4-sharing
      {
        hostelId: hostel1.id,
        count: 50,
        capacity: 4,
        amenities: JSON.stringify(['WiFi', 'AC', 'Common Kitchen', 'Laundry', 'Gym']),
      },
      // YourSpace - 2: 50 rooms, 4-sharing
      {
        hostelId: hostel2.id,
        count: 50,
        capacity: 4,
        amenities: JSON.stringify(['WiFi', 'AC', 'Study Area', 'Cafeteria', 'Sports']),
      },
      // Incampus - Boys: 120 rooms, 3-sharing
      {
        hostelId: hostel3.id,
        count: 120,
        capacity: 3,
        amenities: JSON.stringify(['WiFi', 'AC', 'Library', 'Sports Complex', 'Gym']),
      },
      // Incampus - Girls: 120 rooms, 3-sharing
      {
        hostelId: hostel4.id,
        count: 120,
        capacity: 3,
        amenities: JSON.stringify(['WiFi', 'AC', 'Library', 'Study Center', 'Beauty Salon']),
      },
    ];

    let totalRooms = 0;

    for (const { hostelId, count, capacity, amenities } of roomsToCreate) {
      const hostelData = await prisma.hostel.findUnique({
        where: { id: hostelId },
      });

      for (let i = 1; i <= count; i++) {
        await prisma.room.create({
          data: {
            roomNumber: i,
            capacity,
            amenities,
            hostelId,
          },
        });
      }

      totalRooms += count;
      console.log(`✓ Created ${count} rooms for ${hostelData?.name}`);
    }

    console.log(`\n✓ Total rooms created: ${totalRooms}`);

    // Create Sample Students
    console.log('\n👨‍🎓 Creating sample students...');
    const studentEmails = [
      'john@example.com',
      'jane@example.com',
      'mike@example.com',
      'sarah@example.com',
    ];

    const students = [];

    for (let i = 0; i < studentEmails.length; i++) {
      const user = await prisma.user.create({
        data: {
          name: `Student ${i + 1}`,
          email: studentEmails[i],
          password: 'hashed_password_123',
          role: 'STUDENT',
          student: {
            create: {
              studentId: `S${String(i + 1).padStart(3, '0')}`,
              department: 'Computer Science',
              year: 2,
              phoneNumber: `9876543${String(i).padStart(3, '0')}`,
              address: `Street ${i + 1}, City`,
            },
          },
        },
        include: {
          student: true,
        },
      });

      students.push(user);
      console.log(`✓ Student created: ${user.email}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`
📊 Summary:
  • Hostels: 4
  • Rooms: ${totalRooms}
  • Admins: 1
  • Sample Students: ${students.length}
    `);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
