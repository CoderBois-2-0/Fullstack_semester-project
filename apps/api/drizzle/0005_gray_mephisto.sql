CREATE TYPE "public"."ticket_state_kind" AS ENUM('PENDING', 'COMPLETED', 'CANCELED');--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "ticket_state_kinticket_state_kindd" "ticket_state_kind";