import { OpenAPIHono } from "@hono/zod-openapi";
import publicRouter from "./public";
import protectedRouter from "./protected";
/**
 * @var The posts router
 */
const postRouter = new OpenAPIHono()
    .route("/", publicRouter)
    .route("/", protectedRouter);
export default postRouter;
