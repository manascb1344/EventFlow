CREATE TABLE IF NOT EXISTS "attendees" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"name" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"stripe_customer_id" varchar(255),
	"interests" text,
	"dietary_restrictions" text,
	"total_events_attended" integer DEFAULT 0,
	"preferred_payment_method" varchar(50),
	"notification_preferences" boolean DEFAULT true,
	"profile_image" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "attendees_email_unique" UNIQUE("email"),
	CONSTRAINT "attendees_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizer_id" integer NOT NULL,
	"stripe_product_id" varchar(255),
	"stripe_price_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"location" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"ticket_price" numeric(10, 2) NOT NULL,
	"seats_available" integer NOT NULL,
	"description" text NOT NULL,
	"event_status" varchar(20) NOT NULL,
	"banner_image" text,
	"venue" text,
	"venue_capacity" integer,
	"is_public" boolean DEFAULT true,
	"registration_deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_stripe_product_id_unique" UNIQUE("stripe_product_id"),
	CONSTRAINT "events_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"name" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"organization" varchar(255) NOT NULL,
	"bio" text,
	"verification_status" boolean DEFAULT false,
	"stripe_connect_account_id" varchar(255),
	"stripe_customer_id" varchar(255),
	"organizer_rating" numeric(3, 2),
	"total_events_organized" integer DEFAULT 0,
	"profile_image" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizers_email_unique" UNIQUE("email"),
	CONSTRAINT "organizers_stripe_connect_account_id_unique" UNIQUE("stripe_connect_account_id"),
	CONSTRAINT "organizers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(20) NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"stripe_session_id" varchar(255),
	"stripe_payment_intent_id" varchar(255),
	"stripe_refund_id" varchar(255),
	"refund_reason" text,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id"),
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id"),
	CONSTRAINT "payments_stripe_refund_id_unique" UNIQUE("stripe_refund_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"report_type" varchar(50) NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"pdf_url" text,
	"report_data" text,
	"generated_by" integer,
	"date_range" text,
	"filters" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saved_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendee_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speakers" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"organizer_id" integer NOT NULL,
	"stripe_connect_account_id" varchar(255),
	"session_title" varchar(255) NOT NULL,
	"session_description" text NOT NULL,
	"scheduled_time" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"room_number" varchar(50),
	"presentation_url" text,
	"max_attendees" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "speakers_stripe_connect_account_id_unique" UNIQUE("stripe_connect_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"attendee_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comments" text,
	"speaker_rating" integer,
	"venue_rating" integer,
	"content_rating" integer,
	"organization_rating" integer,
	"would_recommend" boolean,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"event_id" integer NOT NULL,
	"attendee_id" integer NOT NULL,
	"ticket_type" varchar(20) NOT NULL,
	"purchase_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) NOT NULL,
	"attendee_name" varchar(255) NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"seat_number" varchar(20),
	"qr_code" text,
	"group_size" integer DEFAULT 1,
	"special_requirements" text,
	CONSTRAINT "tickets_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id"),
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_organizers_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."organizers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_attendee_id_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speakers" ADD CONSTRAINT "speakers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speakers" ADD CONSTRAINT "speakers_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "surveys" ADD CONSTRAINT "surveys_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "surveys" ADD CONSTRAINT "surveys_attendee_id_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_attendee_id_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
