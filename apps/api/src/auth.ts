import { Context } from "hono";
import { setCookie } from "hono/cookie";

import { TUser } from "./db/handlers/userHandler";
import { sign } from "hono/jwt";

const AUTH_COOKIE_NAME = "auth-cookie";

async function setJWTCookie(c: Context, jwtSecret: string, jwtPayload: TUser) {
    const { password, ...safeJWtPayload } = jwtPayload;
    const jwtToken = await sign(safeJWtPayload, jwtSecret);

    setCookie(c, AUTH_COOKIE_NAME, jwtToken);
}

export {
    AUTH_COOKIE_NAME,
    setJWTCookie
}