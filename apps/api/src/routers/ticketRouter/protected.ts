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
import { UserHandler } from "@/db/handlers/userHandler";

interface IProtectedTicketHVariables extends ITicketVariables, TJWTVariables {
  userHandler: UserHandler;
}

/**
 * @var The ticket router
 */
const protectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedTicketHVariables>
>();

protectedRouter.use(jwtMiddleware);

protectedRouter.use(async (c, next) => {
  c.set("userHandler", new UserHandler(c.env.DB_URL, c.env.STRIBE_SECRET_KEY));
  await next();
});

protectedRouter
  .openapi(ticketGetRoute, async (c) => {
    const query = c.req.valid("query");
    const userHandler = c.get("userHandler");
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
    if (user.role !== "GUEST") {
      return c.json({ data: "Unauthorized, user role must be guest" }, 401);
    }

    const userHandler = c.get("userHandler");
    const ticketHandler = c.get("ticketHandler");

    const newTicket = c.req.valid("json");

    const customer = await userHandler.findUserCustomerByUserId(user.id);
    if (!customer) {
      return c.json({ data: "" }, 500);
    }
    const ticket = await ticketHandler.createTicket(
      user.id,
      customer.stribeCustomerId,
      {
        ...newTicket,
      }
    );
    if (!ticket) {
      return c.json({ data: "Could not create ticket" }, 500);
    }

    return c.json({
      ticket: ticket.ticket,
      ticketSession: ticket.ticketSession,
    });
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
