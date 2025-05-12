import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { Bindings } from "../index";
import {
  EventHandler,
  eventInsertSchema,
  eventUpdateSchema,
} from "@/db/handlers/eventHandler";
import { z } from "zod";
import { TProtectedVariables } from ".";

interface EventVariables {
  protected: TProtectedVariables;
  eventHandler: EventHandler;
}

const eventPostValidator = zValidator(
  "json",
  eventInsertSchema.omit({ creatorId: true }).extend({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
);
const eventPutValidator = zValidator(
  "json",
  eventUpdateSchema.omit({ id: true, creatorId: true }).extend({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
);

const eventRouter = new Hono<
  { Bindings: Bindings; Variables: EventVariables }
>()
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
    const user = c.get("protected").jwtPayload;
    const eventHandler = c.get("eventHandler");

    const newEvent = c.req.valid("json");

    const creatorId = user.id;
    const startDate = new Date(newEvent.startDate);
    const endDate = new Date(newEvent.endDate);
    const event = await eventHandler.createEvent({ ...newEvent, creatorId, startDate, endDate });

    return c.json({ event });
  })
  .put("/:eventId", eventPutValidator, (c) => {
    return c.json({ data: "Not implemented" }, 500);
  })
  .delete("/:eventId", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  });

export default eventRouter;
