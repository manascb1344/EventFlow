import { pgTable, serial, text, timestamp, varchar, decimal, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum types
export const UserRole = {
  ORGANIZER: 'ORGANIZER',
  ATTENDEE: 'ATTENDEE',
} as const;

export const EventStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED', 
  CANCELED: 'CANCELED'
} as const;

export const TicketStatus = {
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED',
  REFUNDED: 'REFUNDED',
  PENDING: 'PENDING',
  USED: 'USED'
} as const;

export const PaymentStatus = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const TicketType = {
  VIP: 'VIP',
  REGULAR: 'REGULAR',
  GROUP: 'GROUP',
  EARLY_BIRD: 'EARLY_BIRD'
} as const;

export const ReportType = {
  TICKET_SALES: 'TICKET_SALES',
  REVENUE_SUMMARY: 'REVENUE_SUMMARY',
  SURVEY_FEEDBACK: 'SURVEY_FEEDBACK',
  ATTENDANCE: 'ATTENDANCE',
  SPEAKER_SCHEDULE: 'SPEAKER_SCHEDULE'
} as const;

// Tables
export const organizers = pgTable('organizers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  organization: varchar('organization', { length: 255 }).notNull(),
  bio: text('bio'),
  verificationStatus: boolean('verification_status').default(false),
  stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }).unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  organizerRating: decimal('organizer_rating', { precision: 3, scale: 2 }),
  totalEventsOrganized: integer('total_events_organized').default(0),
  profileImage: text('profile_image'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const attendees = pgTable('attendees', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  interests: text('interests'),
  dietaryRestrictions: text('dietary_restrictions'),
  totalEventsAttended: integer('total_events_attended').default(0),
  preferredPaymentMethod: varchar('preferred_payment_method', { length: 50 }),
  notificationPreferences: boolean('notification_preferences').default(true),
  profileImage: text('profile_image'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  organizerId: integer('organizer_id').notNull().references(() => organizers.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  stripeProductId: varchar('stripe_product_id', { length: 255 }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  location: text('location').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  ticketPrice: decimal('ticket_price', { precision: 10, scale: 2 }).notNull(),
  seatsAvailable: integer('seats_available').notNull(),
  description: text('description').notNull(),
  eventStatus: varchar('event_status', { length: 20 }).notNull().$type<keyof typeof EventStatus>(),
  bannerImage: text('banner_image'),
  venue: text('venue'),
  venueCapacity: integer('venue_capacity'),
  isPublic: boolean('is_public').default(true),
  registrationDeadline: timestamp('registration_deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).unique(),
  eventId: integer('event_id').notNull().references(() => events.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  attendeeId: integer('attendee_id').notNull().references(() => attendees.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  ticketType: varchar('ticket_type', { length: 20 }).notNull().$type<keyof typeof TicketType>(),
  purchaseDate: timestamp('purchase_date').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).notNull().$type<keyof typeof TicketStatus>(),
  attendeeName: varchar('attendee_name', { length: 255 }).notNull(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  seatNumber: varchar('seat_number', { length: 20 }),
  qrCode: text('qr_code'),
  groupSize: integer('group_size').default(1),
  specialRequirements: text('special_requirements'),
});

export const speakers = pgTable('speakers', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  organizerId: integer('organizer_id').notNull().references(() => organizers.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }).unique(),
  sessionTitle: varchar('session_title', { length: 255 }).notNull(),
  sessionDescription: text('session_description').notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  duration: integer('duration').notNull(),
  roomNumber: varchar('room_number', { length: 50 }),
  presentationUrl: text('presentation_url'),
  maxAttendees: integer('max_attendees'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull().references(() => tickets.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().$type<keyof typeof PaymentStatus>(),
  transactionId: varchar('transaction_id', { length: 255 }).notNull().unique(),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).unique(),
  stripeRefundId: varchar('stripe_refund_id', { length: 255 }).unique(),
  refundReason: text('refund_reason'),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
});

export const surveys = pgTable('surveys', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  attendeeId: integer('attendee_id').notNull().references(() => attendees.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  rating: integer('rating').notNull(),
  comments: text('comments'),
  speakerRating: integer('speaker_rating'),
  venueRating: integer('venue_rating'),
  contentRating: integer('content_rating'),
  organizationRating: integer('organization_rating'),
  wouldRecommend: boolean('would_recommend'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id),
  reportType: varchar('report_type', { length: 50 }).notNull().$type<keyof typeof ReportType>(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  pdfUrl: text('pdf_url'),
  reportData: text('report_data'),
  generatedBy: integer('generated_by').references(() => organizers.id),
  dateRange: text('date_range'),
  filters: text('filters'),
});

export const savedEvents = pgTable('saved_events', {
  id: serial('id').primaryKey(),
  attendeeId: integer('attendee_id').notNull().references(() => attendees.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  eventId: integer('event_id').notNull().references(() => events.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const organizersRelations = relations(organizers, ({ many }) => ({
  events: many(events),
  speakers: many(speakers),
}));

export const attendeesRelations = relations(attendees, ({ many }) => ({
  tickets: many(tickets),
  surveys: many(surveys),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(organizers, {
    fields: [events.organizerId],
    references: [organizers.id],
  }),
  tickets: many(tickets),
  speakers: many(speakers),
  surveys: many(surveys),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  attendee: one(attendees, {
    fields: [tickets.attendeeId],
    references: [attendees.id],
  }),
}));

export const speakersRelations = relations(speakers, ({ one }) => ({
  event: one(events, {
    fields: [speakers.eventId],
    references: [events.id],
  }),
  organizer: one(organizers, {
    fields: [speakers.organizerId],
    references: [organizers.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [payments.ticketId],
    references: [tickets.id],
  }),
}));

export const surveysRelations = relations(surveys, ({ one }) => ({
  event: one(events, {
    fields: [surveys.eventId],
    references: [events.id],
  }),
  attendee: one(attendees, {
    fields: [surveys.attendeeId],
    references: [attendees.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  event: one(events, {
    fields: [reports.eventId],
    references: [events.id],
  }),
  generator: one(organizers, {
    fields: [reports.generatedBy],
    references: [organizers.id],
  }),
}));

export const savedEventsRelations = relations(savedEvents, ({ one }) => ({
  attendee: one(attendees, {
    fields: [savedEvents.attendeeId],
    references: [attendees.id],
  }),
  event: one(events, {
    fields: [savedEvents.eventId],
    references: [events.id],
  }),
}));