import { OpenAPIHono } from "@hono/zod-openapi";

import { AUTH_COOKIE_NAME, jwtMiddleware, TJWTVariables } from "@/auth";
import { IAuthHonoProperties } from "./index";
import { signOutRoute, validateRoute } from "./openAPI";
import { IHonoProperties } from "..";
import { deleteCookie } from "hono/cookie";

interface IProtectedAuthVariables extends IAuthHonoProperties, TJWTVariables {}

/**
 * @var The protected auth router
 */
const protectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedAuthVariables>
>();

protectedRouter.use(jwtMiddleware);

protectedRouter
  .openapi(validateRoute, (c) => {
    const user = c.get("jwtPayload");

    return c.json({ ...user });
  })
  .openapi(signOutRoute, (c) => {
    deleteCookie(c, AUTH_COOKIE_NAME);

    return c.json({ data: "User signed out" });
  });

export default protectedRouter;
