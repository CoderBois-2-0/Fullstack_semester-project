import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "hono/adapter";
import { jwt, type JwtVariables } from "hono/jwt";

import { AUTH_COOKIE_NAME } from "@/auth";
import type { TUser } from "@/db/handlers/userHandler";
import type { Bindings } from "@/routers/index";
import eventRouter from "@/routers/protectedRouter/eventRouter/index";
import ticketRouter from "@/routers/protectedRouter/ticketRouter/index";
import postRouter from "@/routers/protectedRouter/postRouter/index";
import commentRouter from "@/routers/protectedRouter/commentRouter/index";

type TProtectedVariables = JwtVariables<Omit<TUser, "password">>;

/**
 * @var The router for routes that should be protected by jwt
 */
const protectedRouter = new OpenAPIHono<{ Bindings: Bindings }>()
  .use(async (c, next) => {
    const jwtHandler = jwt({
      secret: c.env.JWT_SECRET,
      cookie: AUTH_COOKIE_NAME,
    });

    return jwtHandler(c, next);
  })
  .route("/events", eventRouter)
  .route("/tickets", ticketRouter)
  .route("/posts", postRouter)
  .route("/comments", commentRouter);

export default protectedRouter;
export { AUTH_COOKIE_NAME, TProtectedVariables };
