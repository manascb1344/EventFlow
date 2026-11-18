ALTER TABLE "payments" DROP CONSTRAINT "payments_ticket_id_tickets_id_fk";
--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "email_notifications" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "push_notifications" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_status_start_date_idx" ON "events" USING btree ("event_status","start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_ticket_id_idx" ON "payments" USING btree ("ticket_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "saved_events_attendee_event_idx" ON "saved_events" USING btree ("attendee_id","event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "saved_events_attendee_id_idx" ON "saved_events" USING btree ("attendee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tickets_event_id_idx" ON "tickets" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tickets_attendee_id_idx" ON "tickets" USING btree ("attendee_id");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_seats_non_negative" CHECK ("events"."seats_available" >= 0);