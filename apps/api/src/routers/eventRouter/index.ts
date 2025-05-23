import { OpenAPIHono } from "@hono/zod-openapi";

import { IHonoProperties } from "@/routers/index";
import { EventHandler } from "@/db/handlers/eventHandler";
import eventPublicRouter from "./public";
import eventProtectedRouter from "./protected";

/**
 * @description
 * The cloudflare variables for the event router,
 * extends the protected variables from the protected router
 */
interface IEventVariables {
  /**
   * @property The handler for events
   */
  eventHandler: EventHandler;
}

interface IEventHonoProperties extends IHonoProperties<IEventVariables> {}

/**
 * @var The router for events
 */
const eventRouter = new OpenAPIHono<IEventHonoProperties>()
  .use(async (c, next) => {
    c.set("eventHandler", new EventHandler(c.env.DB_URL));

    await next();
  })
  .route("/", eventPublicRouter)
  .route("/", eventProtectedRouter);

export default eventRouter;
export { IEventHonoProperties, IEventVariables };
