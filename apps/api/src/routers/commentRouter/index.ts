import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings, IHonoProperties } from "@/routers/index";
import { CommentHandler } from "@/db/handlers/commentHandler";
import publicRouter from "./public";
import protectedRouter from "./protected";

/**
 * @description
 * The cloudflare variables for the comments router,
 * extends the protected variables from the protected router
 */
interface ICommentVariables {
  /**
   * @property The handler for comments
   */
  commentHandler: CommentHandler;
}

interface ICommentHonoProperties extends IHonoProperties<ICommentVariables> {}

/**
 * @var The ticket router
 */
const commentRouter = new OpenAPIHono<ICommentHonoProperties>()
  .use(async (c, next) => {
    c.set("commentHandler", new CommentHandler(c.env.DB_URL));

    await next();
  })
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default commentRouter;
export { ICommentHonoProperties, ICommentVariables };
