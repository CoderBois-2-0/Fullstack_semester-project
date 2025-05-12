import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { UserHandler } from "@/db/handlers/userHandler";
import { type Bindings } from "@/routers/index";
import { hash, verify } from "@/crypto";
import { setJWTCookie } from "@/auth";

interface Variables {
  userHandler: UserHandler;
}

const signUpSchema = z.object({
  role: z.enum(["ADMIN", "ORGANISER", "GUEST"]),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords must match",
  path: ["confirm-password"],
});
const signUpValidator = zValidator("json", signUpSchema);

const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});
const signInValidator = zValidator("json", signInSchema);

const authRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  .use(async (c, next) => {
    c.set("userHandler", new UserHandler(c.env.DB_URL));

    await next();
  })
  .post("/sign-up", signUpValidator, async (c) => {
    const userHandler = c.get("userHandler");

    const { confirmPassword: _confirmPassword, ...newUser } = c.req.valid(
      "json",
    );

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
  .post("/sign-in", signInValidator, async (c) => {
    const userHandler = c.get("userHandler");
    const user = c.req.valid("json");

    const existingUser = await userHandler.findUserByEmail(user.email);
    if (!existingUser) {
      return c.json({ data: "No user found" }, 404);
    }

    const isPasswordValid = await verify(existingUser.password, user.password);
    if (!isPasswordValid) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    setJWTCookie(c, c.env.JWT_SECRET, existingUser);

    return c.json({ user: existingUser });
  });

export default authRouter;
