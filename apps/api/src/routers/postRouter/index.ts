import { OpenAPIHono } from "@hono/zod-openapi";

import { PostHandler } from "@/db/handlers/postHandler";
import { IHonoProperties } from "@/routers/index";
import publicRouter from "./public";
import protectedRouter from "./protected";

/**
 * @description
 * The cloudflare variables for the post router,
 * extends the protected variables from the protected router
 */
interface IPostVariables {
  /**
   * @property The handler for post
   */
  postHandler: PostHandler;
}

interface IPostHonoProperties extends IHonoProperties<IPostVariables> {}

/**
 * @var The posts router
 */
const postRouter = new OpenAPIHono<IPostHonoProperties>()
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default postRouter;
export { IPostHonoProperties, IPostVariables };
