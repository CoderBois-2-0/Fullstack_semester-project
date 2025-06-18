import {
  commentInsertSchema,
  commentUpdateSchema,
} from "@/db/handlers/commentHandler/dto";
import { createRoute, z } from "@hono/zod-openapi";
import { commentQuerySchema, commentResponseSchema } from "./dto";

/**
 * @description
 * The openAPI spec for the get route for comments
 */
const commentGetRoute = createRoute({
  description: "Retrieves all comments",
  tags: ["Comments"],
  method: "get",
  path: "/",
  request: {
    query: commentQuerySchema.openapi({ description: "The comment query" }),
  },
  responses: {
    200: {
      description: "Retrieved all comments",
      content: {
        "application/json": {
          schema: commentResponseSchema.array(),
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
          schema: commentResponseSchema,
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
          schema: commentInsertSchema
            .omit({ userId: true })
            .extend({
              createdAt: z.coerce.date(),
            })
            .strict()
            .openapi("Comment post request"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new comment was created from the provided body",
      content: {
        "application/json": {
          schema: commentResponseSchema,
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
          schema: commentUpdateSchema
            .omit({ userId: true })
            .strict()
            .openapi("Comment put request"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new comment was updated based on the provided body",
      content: {
        "application/json": {
          schema: commentResponseSchema,
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
          schema: commentResponseSchema,
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
