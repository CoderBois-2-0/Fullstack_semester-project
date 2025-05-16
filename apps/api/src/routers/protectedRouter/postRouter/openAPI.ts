import {
  postInsertSchema,
  postSelectSchema,
  postUpdateSchema,
} from "@/db/handlers/postHandler";
import { createRoute } from "@hono/zod-openapi";

/**
 * @var The openAPI spec for the get route for posts
 */
const postGetRoute = createRoute({
  description: "Retrieves all posts",
  tags: ["Posts"],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "All posts were retrieved",
      content: {
        "application/json": {
          schema: postSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the get by id route for posts
 */
const postGetByIdRoute = createRoute({
  description: "Will retrieve the post with the given id",
  tags: ["Posts"],
  method: "get",
  path: "/:postId",
  responses: {
    200: {
      description: "Found the post with the given id",
      content: {
        "application/json": {
          schema: postSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a post with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the post route for posts
 */
const postPostRoute = createRoute({
  description: "Creates a new post based on the provided body",
  tags: ["Posts"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: postInsertSchema.omit({ userId: true }).strict(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new post was created",
      content: {
        "application/json": {
          schema: postSelectSchema.array(),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the put route for posts
 */
const postPutRoute = createRoute({
  description: "Updates the post with the given id based on the provided body",
  tags: ["Posts"],
  method: "post",
  path: "/:postId",
  request: {
    body: {
      content: {
        "application/json": {
          schema: postUpdateSchema.omit({ userId: true }).strict(),
        },
      },
    },
  },
  responses: {
    200: {
      description:
        "The post with the given id was updated with the provided data",
      content: {
        "application/json": {
          schema: postSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a post with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the delete route for posts
 */
const postDeleteRoute = createRoute({
  description: "Will delete the post with the given id",
  tags: ["Posts"],
  method: "delete",
  path: "/:postId",
  responses: {
    200: {
      description: "The post with the given id was deleted",
      content: {
        "application/json": {
          schema: postSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a post with the given id",
    },
  },
});

export {
  postGetRoute,
  postGetByIdRoute,
  postPostRoute,
  postPutRoute,
  postDeleteRoute,
};
