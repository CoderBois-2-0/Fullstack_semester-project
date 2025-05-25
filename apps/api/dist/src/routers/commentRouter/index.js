import { OpenAPIHono } from "@hono/zod-openapi";
import { CommentHandler } from "@/db/handlers/commentHandler";
import publicRouter from "./public";
import protectedRouter from "./protected";
/**
 * @var The ticket router
 */
const commentRouter = new OpenAPIHono()
    .use(async (c, next) => {
    c.set("commentHandler", new CommentHandler(c.env.DB_URL));
    await next();
})
    .route("/", publicRouter)
    .route("/", protectedRouter);
export default commentRouter;
