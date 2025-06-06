import { AUTH_COOKIE_NAME } from "@/auth";
import { safeUserSelectSchema } from "@/db/handlers/userHandler";
import { createRoute, z } from "@hono/zod-openapi";

/**
 * @var The zod schema used for user sign up
 */
const signUpSchema = z
  .object({
    role: z.enum(["ADMIN", "ORGANISER", "GUEST"]),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirm-password"],
  });

/**
 * @var The sign up openAPI spec
 */
const signUpRoute = createRoute({
  description: "Will create a new user and sign them in",
  tags: ["Auth"],
  method: "post",
  path: "/sign-up",
  request: {
    body: {
      content: {
        "application/json": {
          schema: signUpSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User was created",
      content: {
        "application/json": {
          schema: safeUserSelectSchema,
        },
      },
    },
    400: {
      description: "Bad request, see request body specification",
    },
  },
});

/**
 * @var The zod schema used for user sign in
 */
const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

/**
 * @var The sign in openAPI spec
 */
const signInRoute = createRoute({
  description: "Will sign in the specified user if the body is valid",
  tags: ["Auth"],
  method: "post",
  path: "/sign-in",
  request: {
    body: {
      content: {
        "application/json": {
          schema: signInSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User was signed in",
      content: {
        "application/json": {
          schema: safeUserSelectSchema,
        },
      },
    },
    400: {
      description: "Bad request, see request body specification",
    },
  },
});

const validateRoute = createRoute({
  description: "Will validate the user via the auth cookie",
  tags: ["Auth"],
  method: "get",
  path: "/validate",
  request: {
    cookies: z.object({
      [AUTH_COOKIE_NAME]: z.string(),
    }),
  },
  responses: {
    200: {
      description: "User was validated",
      content: {
        "application/json": {
          schema: safeUserSelectSchema,
        },
      },
    },
    400: {
      description: "Bad request, see request specification",
    },
  },
});

const signOutRoute = createRoute({
  description: "Will sign out the user by removing the auth cookie",
  tags: ["Auth"],
  method: "get",
  path: "/sign-out",
  request: {
    cookies: z.object({
      [AUTH_COOKIE_NAME]: z.string(),
    }),
  },
  responses: {
    200: {
      description: "User was validated",
      content: {
        "application/json": {
          schema: safeUserSelectSchema,
        },
      },
    },
    400: {
      description: "Bad request, see request specification",
    },
  },
});

export { signUpRoute, signInRoute, validateRoute, signOutRoute };
