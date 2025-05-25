import { OpenAPIHono } from "@hono/zod-openapi";

import { TJWTVariables } from "@/auth";
import { IAuthHonoProperties } from "./index";
import { validateRoute } from "./openAPI";
import { IHonoProperties } from "..";

interface IProtectedAuthVariables extends IAuthHonoProperties, TJWTVariables {}

/**
 * @var The protected auth router
 */
const protectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedAuthVariables>
>().openapi(validateRoute, (c) => {
  const user = c.get("jwtPayload");

  return c.json(user);
});

export default protectedRouter;
