import { Context } from "hono";
import { jwt, sign, JwtVariables } from "hono/jwt";
import { setCookie } from "hono/cookie";

import { TUser, TSafeUser } from "./db/handlers/userHandler";
import { createMiddleware } from "hono/factory";

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
async function setJWTCookie(
  c: Context,
  jwtSecret: string,
  jwtPayload: TSafeUser
) {
  const jwtToken = await sign(jwtPayload, jwtSecret);

  setCookie(c, AUTH_COOKIE_NAME, jwtToken, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    httpOnly: true,
    secure: false, // should be set with an env
  });
}

/**
 * @description
 * A middleware for the jwt cookie.
 * Ensures a valid jwt cookies is set for this application and if not, returns an unauthorized response
 */
const jwtMiddleware = createMiddleware((c, next) => {
  const jwtHandler = jwt({
    secret: c.env.JWT_SECRET,
    cookie: AUTH_COOKIE_NAME,
  });

  return jwtHandler(c, next);
});
type TJWTVariables = JwtVariables<Omit<TUser, "password">>;

export { AUTH_COOKIE_NAME, setJWTCookie, jwtMiddleware, TJWTVariables };
