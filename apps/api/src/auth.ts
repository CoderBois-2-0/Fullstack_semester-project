import { Context } from "hono";
import { jwt, sign, JwtVariables } from "hono/jwt";
import { setCookie } from "hono/cookie";

import { rateLimiter } from "hono-rate-limiter";
import { WorkersKVStore } from "@hono-rate-limiter/cloudflare";

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

const rateLimiterHandler = createMiddleware((c, next) => {
  const rateLimiterHandler = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => {
      const user = c.get("jwtPayload");
      console.log(user);

      return user && user.id ? `${user.id}:${c.req.url}` : c.req.url;
    },
    store: new WorkersKVStore({ namespace: c.env.RATE_LIMITER }),
  });

  return rateLimiterHandler(c, next);
});

export {
  AUTH_COOKIE_NAME,
  setJWTCookie,
  jwtMiddleware,
  TJWTVariables,
  rateLimiterHandler,
};
