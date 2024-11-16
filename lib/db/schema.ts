import { pgTable, serial, text, timestamp, varchar, decimal, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum types
export const UserRole = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer', 
  SPEAKER: 'speaker',
  ATTENDEE: 'attendee',
} as const;

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed', 
  CANCELED: 'canceled'
} as const;

export const TicketStatus = {
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  USED: 'used'
} as const;

export const PaymentStatus = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const TicketType = {
  VIP: 'vip',
  REGULAR: 'regular',
  GROUP: 'group',
  EARLY_BIRD: 'early_bird'
} as const;

export const ReportType = {
  TICKET_SALES: 'ticket_sales',
  REVENUE_SUMMARY: 'revenue_summary',
  SURVEY_FEEDBACK: 'survey_feedback',
  ATTENDANCE: 'attendance',
  SPEAKER_SCHEDULE: 'speaker_schedule'
} as const;

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().$type<keyof typeof UserRole>(),
  bio: text('bio'),
  profileImage: text('profile_image'),
  organization: varchar('organization', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  stripeProductId: varchar('stripe_product_id', { length: 255 }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  location: text('location').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  ticketPrice: decimal('ticket_price', { precision: 10, scale: 2 }).notNull(),
  seatsAvailable: integer('seats_available').notNull(),
  createdBy: integer('created_by').notNull().references(() => users.id),
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
  eventId: integer('event_id').notNull().references(() => events.id),
  userId: integer('user_id').notNull().references(() => users.id),
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
  stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }).unique(),
  eventId: integer('event_id').notNull().references(() => events.id),
  userId: integer('user_id').notNull().references(() => users.id),
  sessionTitle: varchar('session_title', { length: 255 }).notNull(),
  sessionDescription: text('session_description').notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  duration: integer('duration').notNull(), // in minutes
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
  eventId: integer('event_id').notNull().references(() => events.id),
  userId: integer('user_id').notNull().references(() => users.id),
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
  generatedBy: integer('generated_by').references(() => users.id),
  dateRange: text('date_range'),
  filters: text('filters'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdEvents: many(events, { relationName: 'organizer' }),
  tickets: many(tickets),
  speakerSessions: many(speakers),
  surveys: many(surveys),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.createdBy],
    references: [users.id],
    relationName: 'organizer'
  }),
  tickets: many(tickets),
  speakers: many(speakers),
  surveys: many(surveys),
  reports: many(reports),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  attendee: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const speakersRelations = relations(speakers, ({ one }) => ({
  event: one(events, {
    fields: [speakers.eventId],
    references: [events.id],
  }),
  speaker: one(users, {
    fields: [speakers.userId],
    references: [users.id],
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
  attendee: one(users, {
    fields: [surveys.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  event: one(events, {
    fields: [reports.eventId],
    references: [events.id],
  }),
  generator: one(users, {
    fields: [reports.generatedBy],
    references: [users.id],
  }),
}));