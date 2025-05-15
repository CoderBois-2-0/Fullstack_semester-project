import {
  commentInsertSchema,
  commentSelectSchema,
  commentUpdateSchema,
} from "@/db/handlers/commentHandler";
import { createRoute } from "@hono/zod-openapi";

/**
 * @var The openAPI spec for the get route for comments
 */
const commentGetRoute = createRoute({
  description: "Retrieves all comments",
  tags: ["Comments"],
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Retrieved all comments",
      content: {
        "application/json": {
          schema: commentSelectSchema.array(),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the get by id route for comments
 */
const commentGetByIdRoute = createRoute({
  description: "Retrieves the comment with the given id",
  tags: ["Comments"],
  method: "get",
  path: "/:commentId",
  responses: {
    200: {
      description: "Retrieved the comment with the given id",
      content: {
        "application/json": {
          schema: commentSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the post route for comments
 */
const commentPostRoute = createRoute({
  description: "Creates a new comment based on the provided body",
  tags: ["Comments"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: commentInsertSchema.omit({ userId: true }).strict(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new comment was created from the provided body",
      content: {
        "application/json": {
          schema: commentSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the put route for comments
 */
const commentPutRoute = createRoute({
  description:
    "Updates the comment with the given id based on the provided body",
  tags: ["Comments"],
  method: "put",
  path: "/:commentId",
  request: {
    body: {
      content: {
        "application/json": {
          schema: commentUpdateSchema.omit({ userId: true }).strict(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new comment was updated based on the provided body",
      content: {
        "application/json": {
          schema: commentSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a comment with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the delete route for comments
 */
const commentDeleteRoute = createRoute({
  description: "Deletes the comment with the given id",
  tags: ["Comments"],
  method: "delete",
  path: "/:commentId",
  responses: {
    200: {
      description: "The comment with the given id was deleted",
      content: {
        "application/json": {
          schema: commentSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

export {
  commentGetRoute,
  commentGetByIdRoute,
  commentPostRoute,
  commentPutRoute,
  commentDeleteRoute,
};
