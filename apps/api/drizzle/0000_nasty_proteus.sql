CREATE TYPE "public"."user_role" AS ENUM('GUEST', 'ORGANISER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"location" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"creator_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "user_role" NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
