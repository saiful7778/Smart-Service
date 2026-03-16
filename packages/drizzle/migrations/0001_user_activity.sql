CREATE TYPE "public"."UserEventCategoryEnum" AS ENUM('AUTH', 'PROFILE', 'ORG', 'ADMIN', 'CONTENT');--> statement-breakpoint
CREATE TABLE "user_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"login_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"logout_at" timestamp (3) with time zone,
	"last_seen_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"actor_id" uuid,
	"category" "UserEventCategoryEnum" NOT NULL,
	"action" varchar(255) NOT NULL,
	"metadata" jsonb,
	"ip_address" varchar(45),
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activity_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_event_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_activity_user_id_idx" ON "user_activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_activity_login_at_idx" ON "user_activities" USING btree ("login_at");--> statement-breakpoint
CREATE INDEX "session_activity_last_seen_at_idx" ON "user_activities" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "user_event_user_id_idx" ON "user_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_event_category_idx" ON "user_events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "user_event_created_at_idx" ON "user_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_event_user_category_idx" ON "user_events" USING btree ("user_id","category");