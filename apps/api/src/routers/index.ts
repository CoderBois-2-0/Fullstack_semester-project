import { Hono } from "hono";
import { cors } from "hono/cors";

import protectedRouter from "./protectedRouter/index";
import authRouter from "./authRouter";

/**
 * @description
 * The bindings for the base router
 */
interface Bindings {
  /**
   * @property The jwt secret
   */
  JWT_SECRET: string;
  /**
   * @property The origin to set for cors
   */
  CORS_ORIGIN: string;
  /**
   * @property The database urlj
   */
  DB_URL: string;
}

/**
 * @var The base router
 */
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
