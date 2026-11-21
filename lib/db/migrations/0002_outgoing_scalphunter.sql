ALTER TABLE "attendees" ADD COLUMN "marketing_emails" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "attendees" ADD COLUMN "public_profile" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "attendees" ADD COLUMN "show_attendance" boolean DEFAULT false;