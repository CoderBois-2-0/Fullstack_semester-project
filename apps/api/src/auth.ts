import { Context } from "hono";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

import { TUser } from "./db/handlers/userHandler";

/**
 * @var The cookie name for the jwt token
 */
const AUTH_COOKIE_NAME = "auth-cookie";

/**
 * @description
 * Signs and sets the jwt cookie based on the provided secret and payload
 * @param c - The Hono context
 * @param jwtSecret - The secret used to sign the jwt with
 * @param jwtPayload - The payload used when signing  the jwt
 */
async function setJWTCookie(c: Context, jwtSecret: string, jwtPayload: TUser) {
  const { password, ...safeJWtPayload } = jwtPayload;
  const jwtToken = await sign(safeJWtPayload, jwtSecret);

  setCookie(c, AUTH_COOKIE_NAME, jwtToken, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    httpOnly: true,
    secure: false, // should be set with an env
  });
}

export { AUTH_COOKIE_NAME, setJWTCookie };
