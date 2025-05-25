import { OpenAPIHono } from "@hono/zod-openapi";
import { EventHandler } from "@/db/handlers/eventHandler";
import eventPublicRouter from "./public";
import eventProtectedRouter from "./protected";
/**
 * @var The router for events
 */
const eventRouter = new OpenAPIHono()
    .use(async (c, next) => {
    c.set("eventHandler", new EventHandler(c.env.DB_URL));
    await next();
})
    .route("/", eventPublicRouter)
    .route("/", eventProtectedRouter);
export default eventRouter;
