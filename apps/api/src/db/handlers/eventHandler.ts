import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { getDBClient } from "@/db/index";
import { eventTable } from "../schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

const eventInsertSchema = createInsertSchema(eventTable).omit({ id: true });
type TEventInsert = z.infer<typeof eventInsertSchema>;

const eventUpdateSchema = createUpdateSchema(eventTable).omit({ id: true, creatorId: true });
type TEventUpdate = z.infer<typeof eventUpdateSchema>;

class EventHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = eventTable;

  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  async getEvents() {
    return this.#client.query.eventTable.findMany();
  }

  async findEventById(eventId: string) {
    return this.#client.query.eventTable.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
  }

  async createEvent(newEvent: TEventInsert) {
    const eventId = crypto.randomUUID();
    const eventsReturned = await this.#client.insert(this.#table).values({
      ...newEvent,
      id: eventId,
    }).returning();

    return eventsReturned.at(0);
  }

  async updateEvent(userId: string, eventId: string, updatedEvent: TEventUpdate) {
    const eventsReturned = await this.#client.update(this.#table).set(updatedEvent).where(and(eq(this.#table.creatorId, userId), eq(this.#table.id, eventId))).returning();

    return eventsReturned.at(0);
  }

  async deleteEvent(userId: string, eventId: string) {
    const eventsReturned = await this.#client.delete(this.#table).where(and(eq(this.#table.creatorId, userId), eq(this.#table.id, eventId))).returning();

    return eventsReturned.at(0);
  }
}

export { EventHandler, eventInsertSchema, eventUpdateSchema };
