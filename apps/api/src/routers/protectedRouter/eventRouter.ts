import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { Bindings } from "@/routers/index";
import {
  EventHandler,
  eventInsertSchema,
  eventUpdateSchema,
} from "@/db/handlers/eventHandler";
import { TProtectedVariables } from "./index";

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
 * @var The validator for the post request for events
 */
const eventPostValidator = zValidator(
  "json",
  eventInsertSchema
    .omit({ creatorId: true })
    .extend({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    })
    .strict(),
);

/**
 * @var The validator for the put request for events
 */
const eventPutValidator = zValidator(
  "json",
  eventUpdateSchema
    .extend({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
    .strict(),
);

/**
 * @var The router for events
 */
const eventRouter = new Hono<{
  Bindings: Bindings;
  Variables: EventVariables;
}>()
  .use(async (c, next) => {
    c.set("eventHandler", new EventHandler(c.env.DB_URL));

    await next();
  })
  .get("/", async (c) => {
    const eventHandler = c.get("eventHandler");

    const events = await eventHandler.getEvents();

    return c.json({ events });
  })
  .get("/:eventId", async (c) => {
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const event = await eventHandler.findEventById(eventId);
    if (!event) {
      return c.json({ data: "Could not find" }, 404);
    }

    return c.json({ event });
  })
  .post("/", eventPostValidator, async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");

    const newEvent = c.req.valid("json");

    const creatorId = user.id;
    const startDate = new Date(newEvent.startDate);
    const endDate = new Date(newEvent.endDate);
    const event = await eventHandler.createEvent({
      ...newEvent,
      creatorId,
      startDate,
      endDate,
    });

    return c.json({ event });
  })
  .put("/:eventId", eventPutValidator, async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const updatedEvent = c.req.valid("json");
    const startDate = updatedEvent.startDate
      ? new Date(updatedEvent.startDate)
      : undefined;
    const endDate = updatedEvent.endDate
      ? new Date(updatedEvent.endDate)
      : undefined;

    const event = await eventHandler.updateEvent(user.id, eventId, {
      ...updatedEvent,
      startDate,
      endDate,
    });
    if (!event) {
      return c.json({ data: "Could not update due to an error" }, 500);
    }

    return c.json({ event });
  })
  .delete("/:eventId", async (c) => {
    const user = c.get("jwtPayload");
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const event = await eventHandler.deleteEvent(user.id, eventId);

    return c.json({ event });
  });

export default eventRouter;
