import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "./index";
import {
  TicketHandler,
  ticketInsertSchema,
  ticketUpdateSchema,
} from "@/db/handlers/ticketHandler";

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
 * @var The validator for the post request for events
 */
const ticketPostValidator = zValidator(
  "json",
  ticketInsertSchema.omit({ userId: true }).strict(),
);

/**
 * @var The validator for the put request for events
 */
const ticketPutValidator = zValidator(
  "json",
  ticketUpdateSchema.omit({ userId: true }).strict(),
);

/**
 * @var The ticket router
 */
const ticketRouter = new Hono<{
  Bindings: Bindings;
  Variables: ITicketVariables;
}>()
  .use(async (c, next) => {
    c.set("ticketHandler", new TicketHandler(c.env.DB_URL));

    await next();
  })
  .get("/", async (c) => {
    const tickethandler = c.get("ticketHandler");

    const tickets = await tickethandler.getTickets();

    return c.json({ tickets });
  })
  .get("/:ticketId", async (c) => {
    const ticketId = c.req.param("ticketId");
    const ticketHandler = c.get("ticketHandler");

    const ticket = await ticketHandler.findTicketById(ticketId);
    if (!ticket) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ ticket });
  })
  .post("/", ticketPostValidator, async (c) => {
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
  .put("/:ticketId", ticketPutValidator, async (c) => {
    const ticketHandler = c.get("ticketHandler");
    const ticketId = c.req.param("ticketId");
    const updatedTicket = c.req.valid("json");

    const ticket = await ticketHandler.updateTicket(ticketId, updatedTicket);
    if (!ticket) {
      return c.json({ data: "Could not update ticket" }, 500);
    }

    return c.json({ ticket });
  })
  .delete("/:ticketId", async (c) => {
    const ticketHandler = c.get("ticketHandler");
    const ticketId = c.req.param("ticketId");

    const ticket = await ticketHandler.deleteTicket(ticketId);

    return c.json({ ticket });
  });

export default ticketRouter;
