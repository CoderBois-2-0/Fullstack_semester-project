import { OpenAPIHono } from "@hono/zod-openapi";

import { UserHandler } from "@/db/handlers/userHandler";
import { IHonoProperties } from "@/routers/index";
import publicRouter from "./public";
import protectedRouter from "./protected";

/**
 * @description
 * The variables for the auth router
 */
interface IAuthVariables {
  userHandler: UserHandler;
}

interface IAuthHonoProperties extends IHonoProperties<IAuthVariables> {}

/**
 * @var The auth router, used for routes that deal with authentication
 */
const authRouter = new OpenAPIHono<IAuthHonoProperties>()
  .use(async (c, next) => {
    c.set("userHandler", new UserHandler(c.env.DB_URL));

    await next();
  })
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default authRouter;
export { IAuthHonoProperties };
