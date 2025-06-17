import { OpenAPIHono } from "@hono/zod-openapi";

import { ticketStribeCB } from "./openAPI";
import { ITicketHonoProperties } from "./index";

/**
 * @var The public posts router
 */
const publicRouter = new OpenAPIHono<ITicketHonoProperties>().openapi(
  ticketStribeCB,
  async (c) => {
    const { key } = c.req.valid("query");
    const ticketId = await c.env.TICKET_KEYS.get(key);

    if (!ticketId) {
      return c.json({ data: "Could not find ticket with given key" }, 404);
    }

    const ticketHandler = c.get("ticketHandler");

    const ticket = await ticketHandler.updateTicket(ticketId, {
      stateKind: "COMPLETED",
    });
    if (!ticket) {
      return c.json({ data: "Could not update ticket" });
    }

    c.env.TICKET_KEYS.delete(key);

    return c.json({ data: "Ticket purchase completed" });
  }
);

export default publicRouter;
