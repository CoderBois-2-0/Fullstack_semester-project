import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "../index";
import { TicketHandler } from "@/db/handlers/ticketHandler";
import {
  ticketGetRoute,
  ticketGetByIdRoute,
  ticketPostRoute,
  ticketPutRoute,
  ticketDeleteRoute,
} from "./openAPI";
import { createMiddleware } from "hono/factory";

/**
 * @description
 * The cloudflare variables for the event router,
 * extends the protected variables from the protected router
 */
interface ITicketVariables extends TProtectedVariables {
  /**
   * @property The handler for tickets
   */
  ticketHandler: TicketHandler;
}

/**
 * @var The ticket router
 */
const ticketRouter = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: ITicketVariables;
}>();

ticketRouter.use(async (c, next) => {
  c.set("ticketHandler", new TicketHandler(c.env.DB_URL));

  await next();
});

ticketRouter
  .openapi(ticketGetRoute, async (c) => {
    const query = c.req.valid("query");
    const tickethandler = c.get("ticketHandler");

    const tickets = await tickethandler.getTickets(query);

    return c.json({ tickets });
  })
  .openapi(ticketGetByIdRoute, async (c) => {
    const ticketId = c.req.param("ticketId");
    const ticketHandler = c.get("ticketHandler");

    const ticket = await ticketHandler.findTicketById(ticketId);
    if (!ticket) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ ticket });
  })
  .openapi(ticketPostRoute, async (c) => {
    const user = c.get("jwtPayload");
    const ticketHandler = c.get("ticketHandler");
    const newTicket = c.req.valid("json");

    const ticket = await ticketHandler.createTicket({
      ...newTicket,
      userId: user.id,
    });
    if (!ticket) {
      return c.json({ data: "Could not create ticket" }, 500);
    }

    return c.json({ ticket });
  })
  .openapi(ticketPutRoute, async (c) => {
    const ticketHandler = c.get("ticketHandler");
    const ticketId = c.req.param("ticketId");
    const updatedTicket = c.req.valid("json");

    const ticket = await ticketHandler.updateTicket(ticketId, updatedTicket);
    if (!ticket) {
      return c.json({ data: "Could not update ticket" }, 500);
    }

    return c.json({ ticket });
  })
  .openapi(ticketDeleteRoute, async (c) => {
    const ticketHandler = c.get("ticketHandler");
    const ticketId = c.req.param("ticketId");

    const ticket = await ticketHandler.deleteTicket(ticketId);

    return c.json({ ticket });
  });

export default ticketRouter;
