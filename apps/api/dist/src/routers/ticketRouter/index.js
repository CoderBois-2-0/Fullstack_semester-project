import { OpenAPIHono } from "@hono/zod-openapi";
import { TicketHandler } from "@/db/handlers/ticketHandler";
import protectedRouter from "./protected";
/**
 * @var The ticket router
 */
const ticketRouter = new OpenAPIHono()
    .use(async (c, next) => {
    c.set("ticketHandler", new TicketHandler(c.env.DB_URL));
    await next();
})
    .route("/", protectedRouter);
export default ticketRouter;
