
import { StudentRepository } from './repositories/StudentRepository';

import { HostelRepository } from './repositories/HostelRepository';
import { RoomRepository } from './repositories/RoomRepository';
import { AllocationRepository } from './repositories/AllocationRepository';

import { StudentService } from './services/StudentService';

import { HostelService } from './services/HostelService';
import { RoomService } from './services/RoomService';
import { AllocationService } from './services/AllocationService';

import { FirstComeFirstServeStrategy } from './strategies/FirstComeFirstServeStrategy';

export async function demoAllocationSystem(): Promise<void> {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     Hostel Room Allocation System - Demo Flow         ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📦 Initializing repositories...');
    const studentRepository = new StudentRepository();
    
    const hostelRepository = new HostelRepository();
    const roomRepository = new RoomRepository();
    const allocationRepository = new AllocationRepository();

    console.log('🔧 Initializing services...');
    const studentService = new StudentService(studentRepository);
    
    const hostelService = new HostelService(hostelRepository);
    const roomService = new RoomService(roomRepository, hostelService);
    const allocationStrategy = new FirstComeFirstServeStrategy(roomRepository);
    const allocationService = new AllocationService(
      allocationRepository,
      studentService,
      roomService,
      allocationStrategy
    );

    console.log('\n1️⃣  Admin creates hostels...');
    const hostel1 = await hostelService.createHostel('Hostel A', 'Block A, Campus');
    const hostel2 = await hostelService.createHostel('Hostel B', 'Block B, Campus');
    console.log(`   ✓ Created ${hostel1.getName()} at ${hostel1.getLocation()}`);
    console.log(`   ✓ Created ${hostel2.getName()} at ${hostel2.getLocation()}`);

    console.log('\n2️⃣  Admin creates rooms in hostels...');
    const room1 = await roomService.createRoom('A101', 2, hostel1.getHostelId());
    const room2 = await roomService.createRoom('A102', 2, hostel1.getHostelId());
    const room3 = await roomService.createRoom('B101', 3, hostel2.getHostelId());
    console.log(`   ✓ Created Room ${room1.getRoomNumber()} (Capacity: ${room1.getCapacity()})`);
    console.log(`   ✓ Created Room ${room2.getRoomNumber()} (Capacity: ${room2.getCapacity()})`);
    console.log(`   ✓ Created Room ${room3.getRoomNumber()} (Capacity: ${room3.getCapacity()})`);

    console.log('\n3️⃣  Students register...');
    const student1 = await studentService.registerStudent(
      'John Doe',
      'john@example.com',
      'password123',
      'Computer Science',
      2
    );
    const student2 = await studentService.registerStudent(
      'Jane Smith',
      'jane@example.com',
      'password456',
      'Electronics',
      3
    );
    const student3 = await studentService.registerStudent(
      'Mike Johnson',
      'mike@example.com',
      'password789',
      'Mechanical',
      1
    );
    console.log(`   ✓ ${student1.getName()} (ID: ${student1.getStudentId()}) registered`);
    console.log(`   ✓ ${student2.getName()} (ID: ${student2.getStudentId()}) registered`);
    console.log(`   ✓ ${student3.getName()} (ID: ${student3.getStudentId()}) registered`);

    console.log('\n4️⃣  Students apply for rooms...');
    await student1.applyForRoom();
    await student2.applyForRoom();
    await student3.applyForRoom();
    console.log(`   ✓ ${student1.getName()} applied`);
    console.log(`   ✓ ${student2.getName()} applied`);
    console.log(`   ✓ ${student3.getName()} applied`);

    console.log('\n5️⃣  Admin allocates rooms (First Come First Serve)...');
    const allocation1 = await allocationService.allocateRoom(student1.getId());
    const allocation2 = await allocationService.allocateRoom(student2.getId());
    const allocation3 = await allocationService.allocateRoom(student3.getId());

    console.log(`   ✓ ${student1.getName()} → Room ${allocation1.getRoomId()} `);
    console.log(`   ✓ ${student2.getName()} → Room ${allocation2.getRoomId()} `);
    console.log(`   ✓ ${student3.getName()} → Room ${allocation3.getRoomId()} `);

    console.log('\n6️⃣  Checking allocation status...');
    const status1 = await student1.viewAllocationStatus();
    const status2 = await student2.viewAllocationStatus();
    const status3 = await student3.viewAllocationStatus();

    console.log(`   ℹ️  ${student1.getName()}: ${status1}`);
    console.log(`   ℹ️  ${student2.getName()}: ${status2}`);
    console.log(`   ℹ️  ${student3.getName()}: ${status3}`);

    console.log('\n7️⃣  Allocation history...');
    const history = await allocationService.getStudentAllocationHistory(student1.getId());
    for (const alloc of history) {
      const date = alloc.getAllocationDate().toISOString();
      console.log(`   📋 Student ${alloc.getStudentId()} → Room ${alloc.getRoomId()} on ${date}`);
    }

    console.log('\n8️⃣  Available rooms after allocation...');
    const availableRooms = await roomService.getAvailableRooms();
    console.log(`   Remaining available rooms: ${availableRooms.length}`);

    console.log('\n9️⃣  All allocations in system...');
    const allAllocations = await allocationService.getAllAllocations();
    console.log(`   Total allocations: ${allAllocations.length}`);
    for (const alloc of allAllocations) {
      console.log(`   - Student ${alloc.getStudentId()} → Room ${alloc.getRoomId()}`);
    }

    console.log('\n' + '═'.repeat(56));
    console.log('📊 SYSTEM SUMMARY');
    console.log('═'.repeat(56));
    const totalStudents = await studentService.getAllStudents();
    const totalRooms = await roomService.getAllRooms();
    const totalAllocations = await allocationService.getAllAllocations();

    console.log(`✓ Total Students: ${totalStudents.length}`);
    console.log(`✓ Total Rooms: ${totalRooms.length}`);
    console.log(`✓ Total Allocations: ${totalAllocations.length}`);
    console.log(`✓ Available Rooms: ${availableRooms.length}`);
    console.log(`✓ Occupied Rooms: ${totalRooms.length - availableRooms.length}`);
    console.log('═'.repeat(56) + '\n');

    console.log('✅ Demo completed successfully!\n');
  } catch (error) {
    console.error('❌ Demo failed:', error);
    throw error;
  }
}

