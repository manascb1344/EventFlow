import { db } from './drizzle';
import { attendees, organizers, events, tickets, speakers, surveys, payments, reports } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const getRandomImage = async (query: string) => {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`);
    const data = await response.json();
    return data.urls.regular;
  };

  const organizer = await db.insert(organizers).values({
    name: 'Test Organizer',
    email: 'organizer@test.com', 
    password: await bcrypt.hash('password123', 10),
    phoneNumber: '+1234567891',
    organization: 'Test Events Inc',
    bio: 'Test organizer bio',
    profileImage: await getRandomImage('profile'),
    verificationStatus: true,
    totalEventsOrganized: 0,
    onboardingCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  const attendee = await db.insert(attendees).values({
    name: 'Test Attendee',
    email: 'attendee@test.com',
    password: await bcrypt.hash('password123', 10),
    phoneNumber: '+1234567893',
    interests: 'Technology, Business',
    dietaryRestrictions: 'None', 
    totalEventsAttended: 0,
    notificationPreferences: true,
    profileImage: await getRandomImage('profile'),
    onboardingCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  const eventNames = [
    'Tech Summit 2024',
    'Business Conference 2024',
    'Design Workshop',
    'Marketing Masterclass',
    'Startup Pitch Night',
    'AI & ML Conference',
    'Web3 Summit',
    'Product Management Forum',
    'UX Research Conference',
    'Digital Marketing Summit'
  ];

  const venues = [
    'Convention Center A',
    'Grand Hotel Ballroom',
    'Innovation Hub',
    'Tech Campus',
    'Business Center',
    'Conference Hall',
    'Exhibition Center',
    'Downtown Arena',
    'University Auditorium',
    'Science Center'
  ];

  const descriptions = [
    'Join industry leaders for cutting-edge tech insights',
    'Network with business professionals and learn growth strategies',
    'Master modern design principles and tools',
    'Learn advanced marketing techniques from experts',
    'Watch innovative startups pitch their ideas',
    'Explore the latest in artificial intelligence',
    'Dive deep into blockchain and cryptocurrency',
    'Learn product management best practices',
    'Understanding user research methodologies',
    'Latest trends in digital marketing'
  ];

  const futureEvents = await Promise.all(
    eventNames.map(async (name, index) => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1);
      startDate.setDate(startDate.getDate() + (index * 15));
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);

      return db.insert(events).values({
        name,
        location: `${venues[index]} Location`,
        startDate,
        endDate,
        ticketPrice: `${299 + (index * 50)}.99`,
        seatsAvailable: 200 + (index * 50),
        organizerId: organizer[0].id,
        description: descriptions[index],
        eventStatus: 'PUBLISHED',
        bannerImage: await getRandomImage(name),
        venue: venues[index],
        venueCapacity: 300 + (index * 50),
        isPublic: true,
        registrationDeadline: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
    })
  );

  const pastEventNames = [
    'Tech Summit 2023',
    'Business Conference 2023',
    'Design Workshop 2023',
    'Marketing Masterclass 2023',
    'Startup Pitch Night 2023'
  ];

  await Promise.all(
    pastEventNames.map(async (name, index) => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      startDate.setDate(startDate.getDate() - (index * 30));
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);

      return db.insert(events).values({
        name,
        location: `${venues[index]} Location`,
        startDate,
        endDate,
        ticketPrice: `${299 + (index * 50)}.99`,
        seatsAvailable: 0,
        organizerId: organizer[0].id,
        description: descriptions[index],
        eventStatus: 'COMPLETED',
        bannerImage: await getRandomImage(name),
        venue: venues[index],
        venueCapacity: 300 + (index * 50),
        isPublic: true,
        registrationDeadline: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(endDate)
      }).returning();
    })
  );

  const ticket = await db.insert(tickets).values({
    eventId: futureEvents[0][0].id,
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

  await db.insert(speakers).values({
    eventId: futureEvents[0][0].id,
    organizerId: organizer[0].id,
    sessionTitle: 'Future of Technology',
    sessionDescription: 'A look into emerging tech trends',
    scheduledTime: new Date(futureEvents[0][0].startDate.getTime() + 2 * 60 * 60 * 1000),
    duration: 60,
    roomNumber: 'Room A1',
    presentationUrl: await getRandomImage('presentation'),
    maxAttendees: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

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

  await db.insert(surveys).values({
    eventId: futureEvents[0][0].id,
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

  await db.insert(reports).values({
    eventId: futureEvents[0][0].id,
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
