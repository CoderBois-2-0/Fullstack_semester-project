import { env } from "hono/adapter";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { KVNamespace } from "@cloudflare/workers-types";

import authRouter from "./authRouter";
import eventRouter from "./eventRouter";
import postRouter from "./postRouter";
import commentRouter from "./commentRouter";
import ticketRouter from "./ticketRouter";

/**
 * @description
 * The bindings for the base router
 */
interface IBindings {
  /**
   * @property The jwt secret
   */
  JWT_SECRET: string;

  /**
   * @property The origin to set for cors
   */
  CORS_ORIGIN: string;

  /**
   * @property The database url
   */
  DB_URL: string;

  /**
   * @property The stribe secret used to integrate with them
   */
  STRIBE_SECRET_KEY: string;

  /**
   * @property The base url of this app
   */
  BASE_URL: string;

  /**
   * @property The url of the client
   */
  CLIENT_URL: string;

  /**
   * @property The kv for ticket authentication keys, used to authenticate when returning from stribe
   */
  TICKET_KEYS: KVNamespace;
}

interface IHonoProperties<T> {
  Bindings: IBindings;
  Variables: T;
}

/**
 * @var The base router
 */
const app = new OpenAPIHono<{ Bindings: IBindings }>();

app.use(async (c, next) => {
  const e = env<{ CORS_ORIGIN: string }>(c);
  const corsHandler = cors({
    origin: e.CORS_ORIGIN,
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
  .route("/events", eventRouter)
  .route("/tickets", ticketRouter)
  .route("/posts", postRouter)
  .route("/comments", commentRouter);

export default app;
export { IHonoProperties };
