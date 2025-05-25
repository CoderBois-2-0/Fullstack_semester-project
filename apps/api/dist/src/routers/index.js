import { env } from "hono/adapter";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import authRouter from "./authRouter";
import eventRouter from "./eventRouter";
import postRouter from "./postRouter";
import commentRouter from "./commentRouter";
import ticketRouter from "./ticketRouter";
/**
 * @var The base router
 */
const app = new OpenAPIHono();
app.use(async (c, next) => {
    const e = env(c);
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
