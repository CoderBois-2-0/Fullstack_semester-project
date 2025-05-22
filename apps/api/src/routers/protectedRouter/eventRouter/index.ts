import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/routers/index";
import { EventHandler } from "@/db/handlers/eventHandler";
import { TProtectedVariables } from "@/routers/protectedRouter/index";
import {
  eventDeleteRoute,
  eventGetByIdRoute,
  eventGetRoute,
  eventPostRoute,
  eventPutRoute,
} from "./openAPI";
import { env } from "hono/adapter";

/**
 * @description
 * The cloudflare variables for the event router,
 * extends the protected variables from the protected router
 */
interface EventVariables extends TProtectedVariables {
  /**
   * @property The handler for events
   */
  eventHandler: EventHandler;
}

/**
 * @var The router for events
 */
const eventRouter = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: EventVariables;
}>();

eventRouter.use(async (c, next) => {
  c.set("eventHandler", new EventHandler(c.env.DB_URL));

  await next();
});

eventRouter
  .openapi(eventGetRoute, async (c) => {
    const eventHandler = c.get("eventHandler");
    const query = c.req.valid("query");

    const events = await eventHandler.getEvents(query);

    return c.json({ events });
  })
  .openapi(eventGetByIdRoute, async (c) => {
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const event = await eventHandler.findEventById(eventId);
    if (!event) {
      return c.json({ data: "Could not find" }, 404);
    }

    return c.json({ event });
  })
  .openapi(eventPostRoute, async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");

    const newEvent = c.req.valid("json");

    const creatorId = user.id;
    const event = await eventHandler.createEvent({
      ...newEvent,
      creatorId,
    });

    return c.json({ event });
  })
  .openapi(eventPutRoute, async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const updatedEvent = c.req.valid("json");

    const event = await eventHandler.updateEvent(user.id, eventId, {
      ...updatedEvent,
    });
    if (!event) {
      return c.json({ data: "Could not update due to an error" }, 500);
    }

    return c.json({ event });
  })
  .openapi(eventDeleteRoute, async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const event = await eventHandler.deleteEvent(user.id, eventId);

    return c.json({ event });
  });

export default eventRouter;
