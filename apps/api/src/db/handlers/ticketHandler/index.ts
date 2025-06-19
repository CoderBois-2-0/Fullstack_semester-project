import { eq, getTableColumns } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { getDBClient } from "@/db/index";
import { eventTable, ticketTable } from "@/db/schema";
import { TTicketGetQuery } from "@/routers/ticketRouter/openAPI";
import { createSelectSchema } from "drizzle-zod";
import StribeHandler from "@/stribe";

const ticketSelectSchema = createSelectSchema(ticketTable);
/**
 * @description
 * The type for a ticket when using select
 */
type TTicket = z.infer<typeof ticketSelectSchema>;

/**
 * @description
 * The zod schema for inserting tickets
 */
const ticketInsertSchema = createInsertSchema(ticketTable).omit({
  id: true,
  stateKind: true,
});
/**
 * @description
 * The zod type of an ticket that is to be inserted
 */
type TTicketInsert = z.infer<typeof ticketInsertSchema>;

/**
 * @description
 * The zod schema for updating a ticket
 */
const ticketUpdateSchema = createUpdateSchema(ticketTable).omit({
  id: true,
});
/**
 * @description
 * The zod type of a ticket that is to be updated
 */
type TTicketUpdate = z.infer<typeof ticketUpdateSchema>;

/**
 * @description
 * The handler for the tickets table in the database.
 */
class TicketHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = ticketTable;
  #sessionHandler: TicketSessionHandler;

  /**
   * @description
   * Will create a new ticket handler for dealing with database operations in regards to tickets
   * @param dbUrl - The url used to connect to the database
   */
  constructor(
    dbUrl: string,
    stribeSecretKey: string,
    baseUrl: string,
    clientUrl: string
  ) {
    this.#client = getDBClient(dbUrl);
    this.#sessionHandler = new TicketSessionHandler(
      dbUrl,
      stribeSecretKey,
      baseUrl,
      clientUrl
    );
  }

  /**
   * @description
   * Retrieves all tickets
   * @param query - A query object for allowing dynamic selection
   * @returns A list of all tickets
   */
  async getTickets(query: TTicketGetQuery) {
    let queryBuilder = this.#client
      .select({
        ticket: getTableColumns(this.#table),
        ...(query["with-event"] !== undefined
          ? { event: getTableColumns(eventTable) }
          : {}),
      })
      .from(this.#table)
      .$dynamic();

    if (query["with-event"] !== undefined) {
      queryBuilder = queryBuilder.innerJoin(
        eventTable,
        eq(this.#table.eventId, eventTable.id)
      );
    }

    if (query["user-id"] !== undefined) {
      queryBuilder = queryBuilder.where(
        eq(this.#table.userId, query["user-id"])
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
   * Tries to find a single ticket based on a given id
   * @param ticketId - The id of a given ticket to search for
   * @returns An optional ticket
   */
  async findTicketById(ticketId: string) {
    return this.#client.query.ticketTable.findFirst({
      where: (ticket, { eq }) => eq(ticket.id, ticketId),
    });
  }

  /**
   * @description
   * Attempts to insert a new ticket into the database
   * @param userId - the user id to use as the customer when creating a ticket in stribe
   * @param newTicket - The ticket to insert into the database
   * @returns The newly created ticket
   */
  async createTicket(userId: string, newTicket: Omit<TTicketInsert, "userId">) {
    const eventId = crypto.randomUUID();
    const ticketsReturned = await this.#client
      .insert(this.#table)
      .values({
        ...newTicket,
        id: eventId,
        userId,
        stateKind: "PENDING",
      })
      .returning();

    const ticket = ticketsReturned.at(0);
    if (!ticket) {
      return undefined;
    }

    return ticket;
  }

  /**
   * @description
   * Creates a stribe session from a pending ticket
   * @param customerId - The stribe customer id
   * @param ticket - The ticket to associated with the session
   * @param key - The key to authenticate with when returning from stribe
   * @returns The stribe session
   */
  async creatSession(customerId: string, ticket: TTicket, key: string) {
    const ticketSession = await this.#sessionHandler.createSession(
      customerId,
      ticket,
      key
    );

    return ticketSession;
  }

  /**
   * @description
   * Attempts to update a given ticket based on an id
   * @param ticketId - The id of the ticket to update
   * @param updatedEvent - The data to update the ticket with
   * @returns - The updated ticket with all it's fields
   */
  async updateTicket(ticketId: string, updatedEvent: TTicketUpdate) {
    const ticketsReturned = await this.#client
      .update(this.#table)
      .set(updatedEvent)
      .where(eq(this.#table.id, ticketId))
      .returning();

    return ticketsReturned.at(0);
  }

  /**
   * @description
   * Attempts to delete an ticket, based on it's id
   * @param ticketId - The id of the event to delete
   * @returns The deleted event
   */
  async deleteTicket(ticketId: string) {
    const ticketsReturned = await this.#client
      .delete(this.#table)
      .where(eq(this.#table.id, ticketId))
      .returning();

    return ticketsReturned.at(0);
  }
}

class TicketSessionHandler {
  #baseUrl: string;
  #clientUrl: string;
  #stribeHandler: StribeHandler;
  #client: ReturnType<typeof getDBClient>;

  constructor(
    dbUrl: string,
    stribeSecretKey: string,
    baseUrl: string,
    clientUrl: string
  ) {
    this.#stribeHandler = new StribeHandler(stribeSecretKey);
    this.#client = getDBClient(dbUrl);
    this.#baseUrl = baseUrl;
    this.#clientUrl = clientUrl;
  }

  /**
   * @description
   * Will create a stribe session to buy a ticket with
   * @param customerId - The stribe customer id
   * @param ticket - The ticket to buy
   * @param key - The key used to authenticate when returning succesfully from stribe
   * @returns The stribe session
   */
  async createSession(customerId: string, ticket: TTicket, key: string) {
    const stribeProductEvent =
      await this.#client.query.stribeProductEventTable.findFirst({
        columns: {},
        where: (eventProduct, { eq }) =>
          eq(eventProduct.eventId, ticket.eventId),
        with: {
          eventPrices: true,
        },
      });
    if (!stribeProductEvent) {
      return undefined;
    }

    const stribePrice = stribeProductEvent.eventPrices.at(0);
    if (!stribePrice) {
      return undefined;
    }

    const session = await this.#stribeHandler.createSession(
      customerId,
      { priceId: stribePrice.stribePriceId, quantity: ticket.quantity },
      {
        success: `${this.#baseUrl}/tickets/stribe-cb?key=${key}`,
        cancel: `${this.#clientUrl}/${ticket.eventId}`,
      }
    );

    return session;
  }
}

export {
  TicketHandler,
  ticketSelectSchema,
  ticketInsertSchema,
  ticketUpdateSchema,
};
