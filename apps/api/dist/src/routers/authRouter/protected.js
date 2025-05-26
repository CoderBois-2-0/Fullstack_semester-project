import { OpenAPIHono } from "@hono/zod-openapi";
import { AUTH_COOKIE_NAME, jwtMiddleware } from "@/auth";
import { signOutRoute, validateRoute } from "./openAPI";
import { deleteCookie } from "hono/cookie";
/**
 * @var The protected auth router
 */
const protectedRouter = new OpenAPIHono();
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
