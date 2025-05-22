import { OpenAPIHono } from "@hono/zod-openapi";

import {
  ticketGetRoute,
  ticketGetByIdRoute,
  ticketPostRoute,
  ticketPutRoute,
  ticketDeleteRoute,
} from "./openAPI";
import { ITicketVariables } from "./index";
import { jwtMiddleware, TJWTVariables } from "@/auth";
import { IHonoProperties } from "..";

interface IProtectedTicketHVariables extends ITicketVariables, TJWTVariables {}

/**
 * @var The ticket router
 */
const protectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedTicketHVariables>
>();

protectedRouter.use(jwtMiddleware);

protectedRouter
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

export default protectedRouter;
