import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { getDBClient } from "@/db/index";
import { eventTable } from "../schema";
import { z } from "zod";

const eventInsertSchema = createInsertSchema(eventTable).omit({ id: true });
type TEventInsert = z.infer<typeof eventInsertSchema>;

const eventUpdateSchema = createUpdateSchema(eventTable);
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
}

export { EventHandler, eventInsertSchema, eventUpdateSchema };
