import { Hono } from "hono";
import { sign } from "hono/jwt";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import argon2 from 'argon2';

import { userHandler } from "@/db/handlers/userHandler.js";
import { type Bindings } from "@/index.js";
import { setCookie } from "hono/cookie";

const signUpSchema = z.object({
    role: z.enum(['ADMIN', 'ORGANISER', 'GUEST']),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string()
}).refine((value) => value.password === value.confirmPassword, { message: 'Passwords must match', path: ['confirm-password']});
const signUpValidator = zValidator('json', signUpSchema);

const signInSchema = z.object({
    email: z.string(),
    password: z.string()
});
const signInValidator = zValidator('json', signInSchema);

const authRouter = new Hono<{ Bindings: Bindings }>()
    .post('/sign-up', signUpValidator, async (c) => {
        const { confirmPassword: _confirmPassword, ...newUser} = c.req.valid('json');

        const hashedPassword = await argon2.hash(newUser.password);
        const { password: _password, ...user } = await userHandler.createUser({ ...newUser, password: hashedPassword });

        const jwtToken = await sign(user, c.env.JWT_SECRET);
        setCookie(c, 'auth-token', jwtToken);

        return c.json({ user });
    })
    .post('/sign-in',signInValidator, async (c) => {
        const user = c.req.valid('json');

        const existingUser = await userHandler.findUserByEmail(user.email);
        if (!existingUser) {
            return c.json({ data: 'No user found' }, 404);
        }

        const isPasswordValid = await argon2.verify(existingUser.password, user.password);
        if (!isPasswordValid) {
            return c.json({ data: 'Unauthorized' }, 401);
        }

        const jwtToken = await sign(user, c.env.JWT_SECRET);
        setCookie(c, 'auth-token', jwtToken);

        return c.json({ user: existingUser });
    });

export default authRouter;