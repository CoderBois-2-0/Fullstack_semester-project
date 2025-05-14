import { eq } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { getDBClient } from "@/db/index";
import { ticketTable } from "@/db/schema";

/**
 * @description
 * The zod schema for inserting tickets
 */
const ticketInsertSchema = createInsertSchema(ticketTable).omit({ id: true });
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

  /**
   * @description
   * Will create a new ticket handler for dealing with database operations in regards to tickets
   * @param dbUrl - The url used to connect to the database
   */
  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  /**
   * @description
   * Retrieves all tickets
   * @returns A list of all tickets
   */
  async getTickets() {
    return this.#client.query.ticketTable.findMany();
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
   * @param newTicket - The ticket to insert into the database
   * @returns The newly created ticket
   */
  async createTicket(newTicket: TTicketInsert) {
    const eventId = crypto.randomUUID();
    const ticketsReturned = await this.#client
      .insert(this.#table)
      .values({
        ...newTicket,
        id: eventId,
      })
      .returning();

    return ticketsReturned.at(0);
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

export { TicketHandler, ticketInsertSchema, ticketUpdateSchema };
