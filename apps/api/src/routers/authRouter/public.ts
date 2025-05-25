import { OpenAPIHono } from "@hono/zod-openapi";

import { IAuthHonoProperties } from "@/routers/authRouter/index";
import { hash, verify } from "@/crypto";
import { setJWTCookie } from "@/auth";
import { signInRoute, signUpRoute, validateRoute } from "./openAPI";

/**
 * @var The public auth router
 */
const publicRouter = new OpenAPIHono<IAuthHonoProperties>()
  .openapi(signUpRoute, async (c) => {
    const userHandler = c.get("userHandler");

    const { confirmPassword: _confirmPassword, ...newUser } =
      c.req.valid("json");
    console.log(newUser);

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

    const existingUser = await userHandler.findUserByEmail(user.email);
    if (!existingUser) {
      return c.json({ data: "No user found" }, 404);
    }

    const isPasswordValid = await verify(user.password, existingUser.password);
    if (!isPasswordValid) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    setJWTCookie(c, c.env.JWT_SECRET, existingUser);

    return c.json({ user: existingUser });
  });

export default publicRouter;
