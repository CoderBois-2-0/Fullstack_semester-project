import { Hono } from "hono";
import { cors } from "hono/cors";

import protectedRouter from "./protectedRouter/index";
import authRouter from "./authRouter";

interface Bindings {
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  DB_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>()
  .use(async (c, next) => {
    const corsHandler = cors({
      origin: c.env.CORS_ORIGIN,
      credentials: true,
    });

    return corsHandler(c, next);
  })
  .route("/auth", authRouter)
  .route("/", protectedRouter);

export default app;
export { type Bindings };
