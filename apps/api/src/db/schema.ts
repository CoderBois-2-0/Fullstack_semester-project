import { relations } from "drizzle-orm";
import { foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

const userRole = pgEnum("user_role", ["GUEST", "ORGANISER", "ADMIN"]);

const userTable = pgTable("users", {
  id: text("id").primaryKey(),
  role: userRole("role").notNull(),
  username: text("username").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

const userRelation = relations(userTable, ({ many }) => {
  return {
    tickets: many(ticketTable),
    posts: many(postTable),
    comments: many(commentTable),
    events: many(eventTable),
  };
});

const stribeCustomerTable = pgTable(
  "stribe_customers",
  {
    userId: text("user_id").notNull(),
    stribeCustomerId: text("stribe_customer_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.stribeCustomerId],
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
    }),
  ]
);

const stribeCustomerRelation = relations(stribeCustomerTable, ({ one }) => {
  return {
    user: one(userTable, {
      fields: [stribeCustomerTable.userId],
      references: [userTable.id],
    }),
  };
});

const eventTable = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    creatorId: text("creator_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [userTable.id],
    }),
  ]
);

const eventRelation = relations(eventTable, ({ one, many }) => {
  return {
    creator: one(userTable, {
      fields: [eventTable.creatorId],
      references: [userTable.id],
    }),
    tickets: many(ticketTable),
    posts: many(postTable),
  };
});

const stribeProductEventTable = pgTable(
  "stribe_product_table",
  {
    eventId: text("product_id").notNull().unique(),
    stribeProductId: text("stribe_product_id").notNull().unique(),
  },
  (table) => [
    primaryKey({
      columns: [table.eventId, table.stribeProductId],
    }),
    foreignKey({ columns: [table.eventId], foreignColumns: [eventTable.id] }),
  ]
);

const stribeProductEventRelation = relations(
  stribeProductEventTable,
  ({ many }) => {
    return {
      eventPrices: many(stribePriceEventTable),
    };
  }
);

const stribePriceEventTable = pgTable(
  "stribe_price_event_table",
  {
    stribePriceId: text("stribe_price_id").notNull(),
    stribeProductId: text("stribe_product_event_id").notNull(),
    price: real("price").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.stribePriceId, table.stribeProductId],
    }),
    foreignKey({
      columns: [table.stribeProductId],
      foreignColumns: [stribeProductEventTable.stribeProductId],
    }),
  ]
);

const stribePriceEventRelation = relations(stribePriceEventTable, ({ one }) => {
  return {
    stribeProductEvent: one(stribeProductEventTable, {
      fields: [stribePriceEventTable.stribeProductId],
      references: [stribeProductEventTable.stribeProductId],
    }),
  };
});

const ticketStateKind = pgEnum("ticket_state_kind", [
  "PENDING",
  "COMPLETED",
  "CANCELED",
]);

const ticketTable = pgTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    quantity: integer("quantity").notNull(),
    stateKind: ticketStateKind("ticket_state_kinticket_state_kindd"),
    eventId: text("event_id").notNull(),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [eventTable.id],
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
    }),
  ]
);

const ticketRelation = relations(ticketTable, ({ one, many }) => {
  return {
    user: one(userTable, {
      fields: [ticketTable.userId],
      references: [userTable.id],
    }),
    event: one(eventTable, {
      fields: [ticketTable.eventId],
      references: [eventTable.id],
    }),
    posts: many(postTable),
  };
});

const postTable = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull(),
    eventId: text("event_id").notNull(),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [eventTable.id],
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
    }),
  ]
);

const postRelation = relations(postTable, ({ one, many }) => {
  return {
    event: one(eventTable, {
      fields: [postTable.eventId],
      references: [eventTable.id],
    }),
    user: one(userTable, {
      fields: [postTable.userId],
      references: [userTable.id],
    }),
    comments: many(commentTable),
  };
});

const commentTable = pgTable(
  "comments",
  {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull(),
    userId: text("user_id").notNull(),
    postId: text("post_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
    }),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [postTable.id],
    }),
  ]
);

const commentRelation = relations(commentTable, ({ one }) => {
  return {
    user: one(userTable, {
      fields: [commentTable.userId],
      references: [userTable.id],
    }),
    post: one(postTable, {
      fields: [commentTable.postId],
      references: [postTable.id],
    }),
  };
});

export {
  commentRelation,
  commentTable,
  eventRelation,
  eventTable,
  stribeProductEventTable,
  stribeProductEventRelation,
  stribePriceEventRelation,
  stribePriceEventTable,
  postRelation,
  postTable,
  ticketStateKind,
  ticketRelation,
  ticketTable,
  userRelation,
  userRole,
  userTable,
  stribeCustomerTable,
  stribeCustomerRelation,
};
