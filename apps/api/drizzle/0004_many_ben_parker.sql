CREATE TABLE "stribe_customers" (
	"user_id" text,
	"stribe_customer_id" text,
	CONSTRAINT "stribe_customers_user_id_stribe_customer_id_pk" PRIMARY KEY("user_id","stribe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "stribe_price_event_table" (
	"stribe_price_id" text NOT NULL,
	"stribe_product_event_id" text NOT NULL,
	"price" real NOT NULL,
	CONSTRAINT "stribe_price_event_table_stribe_price_id_stribe_product_event_id_pk" PRIMARY KEY("stribe_price_id","stribe_product_event_id")
);
--> statement-breakpoint
CREATE TABLE "stribe_product_table" (
	"product_id" text NOT NULL,
	"stribe_product_id" text NOT NULL,
	CONSTRAINT "stribe_product_table_product_id_stribe_product_id_pk" PRIMARY KEY("product_id","stribe_product_id"),
	CONSTRAINT "stribe_product_table_product_id_unique" UNIQUE("product_id"),
	CONSTRAINT "stribe_product_table_stribe_product_id_unique" UNIQUE("stribe_product_id")
);
--> statement-breakpoint
ALTER TABLE "stribe_customers" ADD CONSTRAINT "stribe_customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stribe_price_event_table" ADD CONSTRAINT "stribe_price_event_table_stribe_product_event_id_stribe_product_table_stribe_product_id_fk" FOREIGN KEY ("stribe_product_event_id") REFERENCES "public"."stribe_product_table"("stribe_product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stribe_product_table" ADD CONSTRAINT "stribe_product_table_product_id_events_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "price";