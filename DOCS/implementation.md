# EventFlow - Implementation Documentation

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Authentication System](#authentication-system)
5. [Database Design](#database-design)
6. [API Architecture](#api-architecture)
7. [Frontend Implementation](#frontend-implementation)
8. [Payment Integration](#payment-integration)
9. [External Services](#external-services)
10. [Deployment](#deployment)

## Technology Stack

### Frontend
- **Next.js 15**: Server-side rendering and static site generation
- **React 19**: UI component library
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Drizzle ORM**: Type-safe database toolkit
- **PostgreSQL**: Primary database
- **Redis**: Caching layer
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### External Services
- **Stripe**: Payment processing
- **Google OAuth**: Social authentication
- **UploadThing**: File storage
- **Nodemailer**: Email service

### Infrastructure
- **Docker**: Containerization
- **NGINX**: Reverse proxy
- **SSL/TLS**: Security layer

## Project Structure

```
EventFlow/
├── app/                    # Next.js app directory
│   ├── (landing)/         # Public landing pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── attendee/      # Attendee dashboard
│   │   └── organizer/     # Organizer dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   └── shared/           # Shared components
├── lib/                  # Core utilities
│   ├── db/              # Database configuration
│   ├── auth/            # Authentication logic
│   └── api/             # API utilities
├── public/              # Static assets
└── providers/           # React context providers
```

## Core Components

### Event Management System
```typescript
// Event creation and management
interface Event {
  id: number;
  organizerId: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  ticketPrice: number;
  seatsAvailable: number;
  description: string;
  eventStatus: EventStatus;
  // ... other fields
}

// Event service implementation
class EventService {
  async createEvent(data: CreateEventDTO): Promise<Event>;
  async updateEvent(id: number, data: UpdateEventDTO): Promise<Event>;
  async deleteEvent(id: number): Promise<void>;
  async getEvent(id: number): Promise<Event>;
  async listEvents(filters: EventFilters): Promise<Event[]>;
}
```

### Ticket Management System
```typescript
interface Ticket {
  id: number;
  eventId: number;
  attendeeId: number;
  ticketType: TicketType;
  status: TicketStatus;
  purchaseDate: Date;
  // ... other fields
}

class TicketService {
  async purchaseTicket(eventId: number, attendeeId: number): Promise<Ticket>;
  async cancelTicket(ticketId: number): Promise<void>;
  async validateTicket(ticketId: number): Promise<boolean>;
  async generateQRCode(ticketId: number): Promise<string>;
}
```

## Authentication System

### Implementation Details
- JWT-based authentication
- Role-based access control (RBAC)
- Social authentication with Google
- Secure password hashing with bcrypt
- Session management

```typescript
// Authentication configuration
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // ... credentials configuration
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    // ... authentication callbacks
  }
};
```

## Database Design

### Schema Overview
```typescript
// Core tables
export const organizers = pgTable('organizers', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  // ... organizer fields
});

export const attendees = pgTable('attendees', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  // ... attendee fields
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  organizerId: integer('organizer_id').notNull(),
  // ... event fields
});

// Relationship tables
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull(),
  attendeeId: integer('attendee_id').notNull(),
  // ... ticket fields
});
```

## API Architecture

### RESTful Endpoints
```typescript
// API routes structure
/api
  /auth
    /signin
    /signup
    /signout
  /events
    /[id]
    /create
    /update
    /delete
  /tickets
    /purchase
    /cancel
    /validate
  /users
    /profile
    /settings
```

### Server Actions
```typescript
// Example server action
export async function purchaseTicket(formData: FormData) {
  'use server'
  
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  
  // Implementation
}
```

## Frontend Implementation

### Component Architecture
```typescript
// Example component structure
interface EventCardProps {
  event: Event;
  onSave?: () => void;
  onRegister?: () => void;
}

export function EventCard({ event, onSave, onRegister }: EventCardProps) {
  // Implementation
}
```

### State Management
- Server components for data fetching
- React Context for global state
- Form state with React Hook Form
- Validation with Zod schemas

## Payment Integration

### Stripe Implementation
```typescript
// Payment processing
export async function processPayment(
  amount: number,
  currency: string,
  customerId: string
): Promise<PaymentIntent> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  return await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    // ... other options
  });
}
```

## External Services

### Email Service
```typescript
// Email notification system
export async function sendEventConfirmation(
  to: string,
  eventDetails: EventDetails,
  ticketInfo: TicketInfo
) {
  const transporter = nodemailer.createTransport({
    // ... configuration
  });
  
  await transporter.sendMail({
    to,
    subject: 'Event Registration Confirmation',
    html: generateEmailTemplate(eventDetails, ticketInfo),
  });
}
```

### File Storage
```typescript
// UploadThing integration
export const ourFileRouter = {
  eventImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Authentication/authorization
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Handle upload completion
    }),
};
```

## Deployment

### Docker Configuration
```yaml
# docker-compose.yml
services:
  eventflow_db:
    image: postgres:16
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    ports:
      - '5435:5432'
    volumes:
      - eventflow_postgres_data:/var/lib/postgresql/data

  eventflow_pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
```

### Environment Configuration
```env
# .env example
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/postgres
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

This documentation provides a comprehensive overview of the EventFlow implementation. For specific details about any component or feature, please refer to the corresponding source code files.
