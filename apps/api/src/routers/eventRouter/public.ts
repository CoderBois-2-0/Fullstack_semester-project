import { OpenAPIHono } from "@hono/zod-openapi";

import { IEventHonoProperties } from "./index";
import { eventGetByIdRoute, eventGetRoute } from "./openAPI";

/**
 * @var The public router for events
 */
const eventPublicRouter = new OpenAPIHono<IEventHonoProperties>()
  .openapi(eventGetRoute, async (c) => {
    const eventHandler = c.get("eventHandler");
    const query = c.req.valid("query");

    const events = await eventHandler.getEvents(query);

    return c.json(events);
  })
  .openapi(eventGetByIdRoute, async (c) => {
    const eventHandler = c.get("eventHandler");
    const eventId = c.req.param("eventId");

    const event = await eventHandler.findEventById(eventId);
    if (!event) {
      return c.json({ data: "Could not find" }, 404);
    }

    return c.json({ event });
  });

export default eventPublicRouter;
