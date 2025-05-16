import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
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
const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.use(async (c, next) => {
  const corsHandler = cors({
    origin: c.env.CORS_ORIGIN,
    credentials: true,
  });

  return corsHandler(c, next);
});

app
  .doc("/doc", {
    openapi: "3.0.0",
    tags: [
      { name: "Auth" },
      { name: "Events" },
      { name: "Tickets" },
      { name: "Posts" },
      { name: "Comments" },
    ],
    info: {
      version: "1.0.0",
      title: "Queue Up API",
    },
  })
  .get("/doc/ui", swaggerUI({ url: "/doc" }))
  .route("/auth", authRouter)
  .route("/", protectedRouter);

export default app;
export { type Bindings };
