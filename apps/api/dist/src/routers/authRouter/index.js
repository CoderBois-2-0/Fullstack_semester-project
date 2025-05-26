import { OpenAPIHono } from "@hono/zod-openapi";
import { UserHandler } from "@/db/handlers/userHandler";
import publicRouter from "./public";
import protectedRouter from "./protected";
/**
 * @var The auth router, used for routes that deal with authentication
 */
const authRouter = new OpenAPIHono()
    .use(async (c, next) => {
    c.set("userHandler", new UserHandler(c.env.DB_URL));
    await next();
})
    .route("/", publicRouter)
    .route("/", protectedRouter);
export default authRouter;
