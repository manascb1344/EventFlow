import { db } from './drizzle';
import { users, events, tickets, speakers, payments, surveys, reports } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seed() {
  // Create test users
  const adminUser = await db.insert(users).values([{
    name: 'Admin User',
    email: 'admin@test.com',
    password: await hashPassword('password123'),
    phoneNumber: '+1234567890',
    role: 'ADMIN',
    bio: 'Test admin bio',
    profileImage: 'https://example.com/admin.jpg',
    organization: 'Test Org',
    createdAt: new Date(),
    updatedAt: new Date()
  }]).returning();

  const organizerUser = await db.insert(users).values([{
    name: 'Test Organizer',
    email: 'organizer@test.com',
    password: await hashPassword('password123'),
    phoneNumber: '+1234567891',
    role: 'ORGANIZER',
    bio: 'Test organizer bio',
    profileImage: 'https://example.com/organizer.jpg',
    organization: 'Test Events Inc',
    createdAt: new Date(),
    updatedAt: new Date()
  }]).returning();

  const speakerUser = await db.insert(users).values([{
    name: 'Test Speaker',
    email: 'speaker@test.com',
    password: await hashPassword('password123'),
    phoneNumber: '+1234567892',
    role: 'SPEAKER',
    bio: 'Test speaker bio',
    profileImage: 'https://example.com/speaker.jpg',
    organization: 'Speaking Pros',
    createdAt: new Date(),
    updatedAt: new Date()
  }]).returning();

  const attendeeUser = await db.insert(users).values([{
    name: 'Test Attendee',
    email: 'attendee@test.com',
    password: await hashPassword('password123'),
    phoneNumber: '+1234567893',
    role: 'ATTENDEE',
    bio: 'Test attendee bio',
    profileImage: 'https://example.com/attendee.jpg',
    organization: 'Attendee Corp',
    createdAt: new Date(),
    updatedAt: new Date()
  }]).returning();

  // Create test event
  const event = await db.insert(events).values([{
    name: 'Test Conference 2024',
    location: 'Test Convention Center',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-03'),
    ticketPrice: '299.99',
    seatsAvailable: 500,
    createdBy: organizerUser[0].id,
    description: 'A test technology conference',
    eventStatus: 'PUBLISHED',
    bannerImage: 'https://example.com/banner.jpg',
    venue: 'Main Hall',
    venueCapacity: 600,
    isPublic: true,
    registrationDeadline: new Date('2024-05-15'),
    createdAt: new Date(),
    updatedAt: new Date()
  }]).returning();

  // Create test ticket
  const ticket = await db.insert(tickets).values([{
    eventId: event[0].id,
    userId: attendeeUser[0].id,
    ticketType: 'VIP',
    purchaseDate: new Date(),
    status: 'CONFIRMED',
    attendeeName: attendeeUser[0].name,
    ticketNumber: 'TKT-001-2024',
    seatNumber: 'A1',
    qrCode: 'https://example.com/qr/TKT-001-2024',
    groupSize: 1,
    specialRequirements: 'None'
  }]).returning();

  // Create test speaker session
  await db.insert(speakers).values([{
    eventId: event[0].id,
    userId: speakerUser[0].id,
    sessionTitle: 'Future of Technology',
    sessionDescription: 'A look into emerging tech trends',
    scheduledTime: new Date('2024-06-01T10:00:00'),
    duration: 60,
    roomNumber: 'Room 101',
    presentationUrl: 'https://example.com/presentation.pdf',
    maxAttendees: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  }]);

  // Create test payment
  await db.insert(payments).values([{
    ticketId: ticket[0].id,
    amount: '299.99',
    paymentMethod: 'credit_card',
    paymentStatus: 'COMPLETED',
    transactionId: 'TXN-001-2024',
    paymentDate: new Date()
  }]);

  // Create test survey
  await db.insert(surveys).values([{
    eventId: event[0].id,
    userId: attendeeUser[0].id,
    rating: 5,
    comments: 'Great event!',
    speakerRating: 5,
    venueRating: 4,
    contentRating: 5,
    organizationRating: 4,
    wouldRecommend: true,
    submittedAt: new Date()
  }]);

  // Create test report
  await db.insert(reports).values([{
    eventId: event[0].id,
    reportType: 'TICKET_SALES',
    generatedAt: new Date(),
    pdfUrl: 'https://example.com/report.pdf',
    reportData: JSON.stringify({
      totalSales: 1,
      revenue: 299.99
    }),
    generatedBy: adminUser[0].id,
    dateRange: '2024-06-01 to 2024-06-03',
    filters: JSON.stringify({
      ticketType: 'all'
    })
  }]);
}

seed()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
