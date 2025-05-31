import { and, eq, getTableColumns } from "drizzle-orm";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import { getDBClient } from "@/db/index";
import {
  eventTable,
  ticketTable,
  stribeProductEventTable,
  stribePriceEventTable,
} from "../schema";
import { TEventGetQuery } from "@/routers/eventRouter/openAPI";
import StribeHandler from "@/stribe";

const eventSelectSchema = createSelectSchema(eventTable);
/**
 * @description
 * The type for an event when using select
 */
type TEvent = typeof eventTable.$inferSelect;

/**
 * @description
 * The zod schema for inserting events
 */
const eventInsertSchema = createInsertSchema(eventTable).omit({ id: true });
/**
 * @description
 * The zod type of an event that is to be inserted
 */
type TEventInsert = z.infer<typeof eventInsertSchema>;

/**
 * @description
 * The zod schema for updating events
 */
const eventUpdateSchema = createUpdateSchema(eventTable).omit({
  id: true,
  creatorId: true,
});
/**
 * @description
 * The zod type of an event that is to be updated
 */
type TEventUpdate = z.infer<typeof eventUpdateSchema>;

/**
 * @description
 * The handler for the event table in the database.
 */
class EventHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = eventTable;
  #productHandler: EventProductHandler;

  /**
   * @description
   * Will create a new event handler for dealing with database operations in regards to events
   * @param dbUrl - The url used to connect to the database
   */
  constructor(dbUrl: string, stribeSecretKey: string) {
    this.#client = getDBClient(dbUrl);
    this.#productHandler = new EventProductHandler(dbUrl, stribeSecretKey);
  }

  /**
   * @description
   * Retrieves all events
   * @param query - A query to specify which events to retrieve
   * @returns A list of all events
   */
  async getEvents(query: TEventGetQuery) {
    let queryBuilder = this.#client
      .select({
        event: getTableColumns(this.#table),
        ...(query["with-ticket-count"] === true
          ? {
              ticketCount: this.#client.$count(
                ticketTable,
                eq(this.#table.id, ticketTable.eventId)
              ),
            }
          : {}),
      })
      .from(this.#table)
      .$dynamic();

    if (query["user-id"] !== undefined) {
      queryBuilder = queryBuilder.where(
        eq(this.#table.creatorId, query["user-id"])
      );
    }

    if (query.limit !== undefined) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    if (query.page !== undefined) {
      queryBuilder = queryBuilder.offset(query.page);
    }

    return queryBuilder.execute();
  }

  /**
   * @description
   * Tries to find a single event based on a given id
   * @param eventId - The id of a given event to search for
   * @returns An optional event
   */
  async findEventById(eventId: string) {
    return this.#client.query.eventTable.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
  }

  /**
   * @description
   * Attempts to insert a new event into the database
   * @param newEvent - The event to insert into the database
   * @returns The newly created event
   */
  async createEvent(newEvent: TEventInsert, price: number) {
    const eventId = crypto.randomUUID();
    const eventReturned = await this.#client.transaction(async (tx) => {
      const [event] = await this.#client
        .insert(this.#table)
        .values({
          ...newEvent,
          id: eventId,
        })
        .returning();

      if (!event) {
        return undefined;
      }

      const wasProductCreated = await this.#productHandler.createProduct(
        event,
        price
      );
      if (!wasProductCreated) {
        tx.rollback();

        return undefined;
      }

      return event;
    });

    return eventReturned;
  }

  /**
   * @description
   * Attempts to update a given event based on an id
   * @param userId - The id of the creator of the event
   * @param eventId - The id of the event to update
   * @param updatedEvent - The data to update the event with
   * @returns - The updated event with all it's fields
   */
  async updateEvent(
    userId: string,
    eventId: string,
    updatedEvent: TEventUpdate
  ) {
    const eventsReturned = await this.#client
      .update(this.#table)
      .set(updatedEvent)
      .where(
        and(eq(this.#table.creatorId, userId), eq(this.#table.id, eventId))
      )
      .returning();

    return eventsReturned.at(0);
  }

  /**
   * @description
   * Attempts to delete an event, based on it's creator's id and it's own
   * @param userId - The id of the creator of the event
   * @param eventId - The id of the event to delete
   * @returns The deleted event
   */
  async deleteEvent(userId: string, eventId: string) {
    const eventsReturned = await this.#client
      .delete(this.#table)
      .where(
        and(eq(this.#table.creatorId, userId), eq(this.#table.id, eventId))
      )
      .returning();

    return eventsReturned.at(0);
  }
}

/**
 * @description
 * A event product handler that is responsible for the event relevant data from stribe
 */
class EventProductHandler {
  #client: ReturnType<typeof getDBClient>;
  #stribeHandler: StribeHandler;
  #productTable = stribeProductEventTable;
  #priceTable = stribePriceEventTable;

  constructor(dbUrl: string, stribeSecretKey: string) {
    this.#client = getDBClient(dbUrl);
    this.#stribeHandler = new StribeHandler(stribeSecretKey);
  }

  async createProduct(event: TEvent, price: number) {
    const eventProductResponse = await this.#stribeHandler.createProduct(
      event,
      price
    );

    const wasProductedCreated = this.#client.transaction(async (tx) => {
      const [eventProduct] = await tx
        .insert(this.#productTable)
        .values({
          eventId: event.id,
          stribeProductId: eventProductResponse.productId,
        })
        .returning();

      const [eventPrice] = await tx
        .insert(this.#priceTable)
        .values({
          stribeProductId: eventProductResponse.productId,
          stribePriceId: eventProductResponse.priceId,
          price,
        })
        .returning();

      if (!eventProduct || !eventPrice) {
        tx.rollback();

        return false;
      }

      return true;
    });

    return wasProductedCreated;
  }
}

export {
  EventHandler,
  EventProductHandler,
  eventInsertSchema,
  eventUpdateSchema,
  eventSelectSchema,
  TEvent,
};
