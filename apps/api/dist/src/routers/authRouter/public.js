import { OpenAPIHono } from "@hono/zod-openapi";
import { hash, verify } from "@/crypto";
import { setJWTCookie } from "@/auth";
import { signInRoute, signUpRoute } from "./openAPI";
/**
 * @var The public auth router
 */
const publicRouter = new OpenAPIHono()
    .openapi(signUpRoute, async (c) => {
    const userHandler = c.get("userHandler");
    const { confirmPassword: _confirmPassword, ...newUser } = c.req.valid("json");
    const hashedPassword = await hash(newUser.password);
    const createdUser = await userHandler.createUser({
        ...newUser,
        password: hashedPassword,
    });
    if (!createdUser) {
        return c.json({ data: "User not created" }, 500);
    }
    setJWTCookie(c, c.env.JWT_SECRET, createdUser);
    return c.json({ createdUser });
})
    .openapi(signInRoute, async (c) => {
    const userHandler = c.get("userHandler");
    const user = c.req.valid("json");
    const unsafeExistingUser = await userHandler.unsafeFindUserByEmail(user.email);
    if (!unsafeExistingUser) {
        return c.json({ data: "No user found" }, 404);
    }
    const isPasswordValid = await verify(user.password, unsafeExistingUser.password);
    if (!isPasswordValid) {
        return c.json({ data: "Unauthorized" }, 401);
    }
    const { password: _password, ...safeExistingUser } = unsafeExistingUser;
    setJWTCookie(c, c.env.JWT_SECRET, safeExistingUser);
    return c.json({ ...safeExistingUser });
});
export default publicRouter;
