import { db } from './drizzle';
import { attendees, organizers, events, tickets, speakers, surveys, payments, reports } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  // Create test organizer
  const organizer = await db.insert(organizers).values({
    name: 'Test Organizer',
    email: 'organizer@test.com',
    password: await bcrypt.hash('password123', 10),
    phoneNumber: '+1234567891',
    organization: 'Test Events Inc',
    bio: 'Test organizer bio',
    profileImage: 'https://example.com/organizer.jpg',
    verificationStatus: true,
    totalEventsOrganized: 0,
    onboardingCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create test attendee
  const attendee = await db.insert(attendees).values({
    name: 'Test Attendee',
    email: 'attendee@test.com',
    password: await bcrypt.hash('password123', 10),
    phoneNumber: '+1234567893',
    interests: 'Technology, Business',
    dietaryRestrictions: 'None',
    totalEventsAttended: 0,
    notificationPreferences: true,
    profileImage: 'https://example.com/attendee.jpg',
    onboardingCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create test event
  const event = await db.insert(events).values({
    name: 'Test Conference 2024',
    location: 'Test Convention Center',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-03'),
    ticketPrice: '299.99',
    seatsAvailable: 500,
    organizerId: organizer[0].id,
    description: 'A test technology conference',
    eventStatus: 'PUBLISHED',
    bannerImage: 'https://example.com/banner.jpg',
    venue: 'Main Hall',
    venueCapacity: 600,
    isPublic: true,
    registrationDeadline: new Date('2024-05-15'),
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create test ticket
  const ticket = await db.insert(tickets).values({
    eventId: event[0].id,
    attendeeId: attendee[0].id,
    ticketType: 'VIP',
    purchaseDate: new Date(),
    status: 'CONFIRMED',
    attendeeName: attendee[0].name,
    ticketNumber: 'TKT-001-2024',
    seatNumber: 'A1',
    qrCode: 'https://example.com/qr/TKT-001-2024',
    groupSize: 1,
    specialRequirements: 'None'
  }).returning();

  // Create test speaker session
  await db.insert(speakers).values({
    eventId: event[0].id,
    organizerId: organizer[0].id,
    sessionTitle: 'Future of Technology',
    sessionDescription: 'A look into emerging tech trends',
    scheduledTime: new Date('2024-06-01T10:00:00'),
    duration: 60,
    roomNumber: 'Room A1',
    presentationUrl: 'https://example.com/presentation.pdf',
    maxAttendees: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create test payment
  await db.insert(payments).values({
    ticketId: ticket[0].id,
    amount: '299.99',
    paymentMethod: 'credit_card',
    paymentStatus: 'COMPLETED',
    transactionId: 'txn_123456789',
    stripeSessionId: 'sess_123456789',
    stripePaymentIntentId: 'pi_123456789',
    paymentDate: new Date()
  }).returning();

  // Create test survey
  await db.insert(surveys).values({
    eventId: event[0].id,
    attendeeId: attendee[0].id,
    rating: 5,
    comments: 'Great event!',
    speakerRating: 5,
    venueRating: 4,
    contentRating: 5,
    organizationRating: 4,
    wouldRecommend: true,
    submittedAt: new Date()
  }).returning();

  // Create test report
  await db.insert(reports).values({
    eventId: event[0].id,
    reportType: 'TICKET_SALES',
    generatedAt: new Date(),
    pdfUrl: 'https://example.com/reports/ticket-sales.pdf',
    reportData: JSON.stringify({ totalSales: 1, revenue: 299.99 }),
    generatedBy: organizer[0].id,
    dateRange: '2024-06-01 to 2024-06-03',
    filters: JSON.stringify({ ticketType: 'VIP' })
  }).returning();
}

seed()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
