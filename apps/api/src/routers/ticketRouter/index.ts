import { OpenAPIHono } from "@hono/zod-openapi";

import { IHonoProperties } from "@/routers/index";
import { TicketHandler } from "@/db/handlers/ticketHandler";
import protectedRouter from "./protected";
import publicRouter from "./public";

/**
 * @description
 * The cloudflare variables for the event router,
 * extends the protected variables from the protected router
 */
interface ITicketVariables {
  /**
   * @property The handler for tickets
   */
  ticketHandler: TicketHandler;
}

interface ITicketHonoProperties extends IHonoProperties<ITicketVariables> {}

/**
 * @var The ticket router
 */
const ticketRouter = new OpenAPIHono<ITicketHonoProperties>()

  .use(async (c, next) => {
    c.set(
      "ticketHandler",
      new TicketHandler(
        c.env.DB_URL,
        c.env.STRIBE_SECRET_KEY,
        c.env.BASE_URL,
        c.env.CLIENT_URL
      )
    );

    await next();
  })
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default ticketRouter;
export { ITicketHonoProperties, ITicketVariables };
