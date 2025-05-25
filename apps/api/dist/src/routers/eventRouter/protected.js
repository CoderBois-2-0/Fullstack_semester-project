import { OpenAPIHono } from "@hono/zod-openapi";
import { eventDeleteRoute, eventPostRoute, eventPutRoute } from "./openAPI";
import { jwtMiddleware } from "@/auth";
/**
 * @var The protected router for events
 */
const eventProtectedRouter = new OpenAPIHono();
eventProtectedRouter.use(jwtMiddleware);
eventProtectedRouter
    .openapi(eventPostRoute, async (c) => {
    const user = c.get("jwtPayload");
    if (user.role !== "ORGANISER") {
        return c.json({ data: "Only organisers can create events" }, 401);
    }
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
export default eventProtectedRouter;
