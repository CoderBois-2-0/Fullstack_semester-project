import { eq, getTableColumns } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { getDBClient } from "@/db/index";
import { eventTable, ticketTable } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
const ticketSelectSchema = createSelectSchema(ticketTable);
/**
 * @description
 * The zod schema for inserting tickets
 */
const ticketInsertSchema = createInsertSchema(ticketTable).omit({ id: true });
/**
 * @description
 * The zod schema for updating a ticket
 */
const ticketUpdateSchema = createUpdateSchema(ticketTable).omit({
    id: true,
});
/**
 * @description
 * The handler for the tickets table in the database.
 */
class TicketHandler {
    #client;
    #table = ticketTable;
    /**
     * @description
     * Will create a new ticket handler for dealing with database operations in regards to tickets
     * @param dbUrl - The url used to connect to the database
     */
    constructor(dbUrl) {
        this.#client = getDBClient(dbUrl);
    }
    /**
     * @description
     * Retrieves all tickets
     * @param query - A query object for allowing dynamic selection
     * @returns A list of all tickets
     */
    async getTickets(query) {
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
            queryBuilder = queryBuilder.innerJoin(eventTable, eq(this.#table.eventId, eventTable.id));
        }
        if (query["user-id"] !== undefined) {
            queryBuilder = queryBuilder.where(eq(this.#table.userId, query["user-id"]));
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
    async findTicketById(ticketId) {
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
    async createTicket(newTicket) {
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
    async updateTicket(ticketId, updatedEvent) {
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
    async deleteTicket(ticketId) {
        const ticketsReturned = await this.#client
            .delete(this.#table)
            .where(eq(this.#table.id, ticketId))
            .returning();
        return ticketsReturned.at(0);
    }
}
export { TicketHandler, ticketSelectSchema, ticketInsertSchema, ticketUpdateSchema, };
