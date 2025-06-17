import { OpenAPIHono } from "@hono/zod-openapi";

import { IEventVariables } from "@/routers/eventRouter/index";
import { eventDeleteRoute, eventPostRoute, eventPutRoute } from "./openAPI";
import { jwtMiddleware, TJWTVariables } from "@/auth";
import { IHonoProperties } from "..";
import StribeHandler from "@/stribe";

interface IProtectedEventVariables extends IEventVariables, TJWTVariables {}

/**
 * @var The protected router for events
 */
const eventProtectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedEventVariables>
>();

eventProtectedRouter.use(jwtMiddleware);

eventProtectedRouter
  .openapi(eventPostRoute, async (c) => {
    const user = c.get("jwtPayload");

    const eventHandler = c.get("eventHandler");

    const { price, ...newEvent } = c.req.valid("json");

    const creatorId = user.id;
    const event = await eventHandler.createEvent(
      {
        ...newEvent,
        creatorId,
      },
      price
    );

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

export default eventProtectedRouter;
