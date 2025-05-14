import { Hono } from "hono";
import { jwt, type JwtVariables } from "hono/jwt";

import { AUTH_COOKIE_NAME } from "@/auth";
import type { TUser } from "@/db/handlers/userHandler";
import eventRouter from "./eventRouter";
import ticketRouter from "./ticketRouter";
import type { Bindings } from "@/routers/index";
import postRouter from "./postRouter";
import commentRouter from "./commentRouter";

type TProtectedVariables = JwtVariables<Omit<TUser, "password">>;

/**
 * @var The router for routes that should be protected by jwt
 */
const protectedRouter = new Hono<{ Bindings: Bindings }>()
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
