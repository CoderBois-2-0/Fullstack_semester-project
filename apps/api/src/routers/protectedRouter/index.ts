import { Hono } from "hono";
import { jwt } from "hono/jwt";

import eventRouter from "./eventRouter";
import ticketRouter from "./ticketRouter";
import type { Bindings } from "../index";

const AUTH_COOKIE_NAME = 'auth-cookie'

const protectedRouter = new Hono<{ Bindings: Bindings}>()
    .use(async (c, next) => {
        const jwtHandler = jwt({
            secret: c.env.JWT_SECRET,
            cookie: AUTH_COOKIE_NAME
        });

        return jwtHandler(c, next);
    })
    .route('/events', eventRouter)
    .route('/tickets', ticketRouter);

export default protectedRouter;
export {
    AUTH_COOKIE_NAME
};