import {
  eventInsertSchema,
  eventSelectSchema,
  eventUpdateSchema,
} from "@/db/handlers/eventHandler/index";
import { createRoute, z } from "@hono/zod-openapi";

const eventResponseSchema = eventSelectSchema.openapi("Event");

/**
 * @var The zod schema for the events get route's query string
 */
const eventGetQuerySchema = z
  .object({
    "user-id": z.string().optional(),
    "with-ticket-count": z.coerce.boolean().optional(),
    limit: z.coerce.number().min(0).max(100).optional(),
    page: z.coerce.number().min(1).optional(),
  })
  .openapi("Event query");
/**
 * @description
 * The type for event's get query string
 */
type TEventGetQuery = z.infer<typeof eventGetQuerySchema>;

/**
 * @var The openAPI spec for the events get route
 */
const eventGetRoute = createRoute({
  description: "Retrieves all events",
  tags: ["Events"],
  method: "get",
  path: "/",
  request: {
    query: eventGetQuerySchema,
  },
  responses: {
    200: {
      description: "The new event was created",
      content: {
        "application/json": {
          schema: eventResponseSchema.array(),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the events get by id route
 */
const eventGetByIdRoute = createRoute({
  description: "Attempts to retrieve an event with the given id",
  tags: ["Events"],
  method: "get",
  path: "/:eventId",
  responses: {
    200: {
      description: "Found an event with the given id",
      content: {
        "application/json": {
          schema: eventResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find an even with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the events post route
 */
const eventPostRoute = createRoute({
  description: "Will create a new event based on the provided body",
  tags: ["Events"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: eventInsertSchema
            .omit({ creatorId: true })
            .extend({
              startDate: z.coerce.date(),
              endDate: z.coerce.date(),
              price: z.coerce.number(),
            })
            .strict()
            .openapi("Event Post request"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new event was created",
      content: {
        "application/json": {
          schema: eventSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the events put route
 */
const eventPutRoute = createRoute({
  description:
    "Updates the event with the given id, based on the provided body",
  tags: ["Events"],
  method: "put",
  path: "/:eventId",
  request: {
    body: {
      content: {
        "application/json": {
          schema: eventUpdateSchema
            .extend({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .strict()
            .openapi("Event update request"),
        },
      },
    },
  },
  responses: {
    200: {
      description:
        "Found an event with the given id and updated it based on the provided body",
      content: {
        "application/json": {
          schema: eventSelectSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find event with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the events delete route
 */
const eventDeleteRoute = createRoute({
  description: "Deletes the event with the given id",
  tags: ["Events"],
  method: "delete",
  path: "/:eventId",
  responses: {
    200: {
      description: "Event with the given id was deleted",
      content: {
        "application/json": {
          schema: eventResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find an event with the given id",
    },
  },
});

export {
  eventGetRoute,
  TEventGetQuery,
  eventGetByIdRoute,
  eventPostRoute,
  eventPutRoute,
  eventDeleteRoute,
};
