import { getDBClient } from "@/db/index";
import { eventTable } from "../schema";

class EventHandler {
    #client: ReturnType<typeof getDBClient>
    #table = eventTable;

    constructor(dbUrl: string) {
        this.#client = getDBClient(dbUrl);
    }

    async getEvents() {
        return this.#client.query.eventTable.findMany();
    }

    async findEventById(eventId: string) {
        return this.#client.query.eventTable.findFirst({
            where: (event, { eq }) => eq(event.id, eventId)
        });
    }
}

export {
    EventHandler
};