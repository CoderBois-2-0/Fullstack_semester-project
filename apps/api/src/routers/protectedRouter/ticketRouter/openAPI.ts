import { createRoute, z } from "@hono/zod-openapi";

import {
  ticketSelectSchema,
  ticketInsertSchema,
  ticketUpdateSchema,
} from "@/db/handlers/ticketHandler";

const ticketResponseSchema = ticketSelectSchema.openapi("Ticket reponse");

/**
 * @var The zod schema for the get route's query string
 */
const ticketGetQuerySchema = z
  .object({
    "user-id": z.string().optional(),
    "with-event": z.coerce.boolean(),
    limit: z.coerce.number().min(0).max(100).optional(),
    page: z.coerce.number().min(1).optional(),
  })
  .openapi("Ticket query");

/**
 * @description
 * The type for the query string for the ticket get route
 */
type TTicketGetQuery = z.infer<typeof ticketGetQuerySchema>;

/**
 * @var The openAPI spec for the ticket get route
 */
const ticketGetRoute = createRoute({
  description:
    "Retrieves all the tickets in the database, see query for filtering",
  tags: ["Tickets"],
  method: "get",
  path: "/",
  request: {
    query: ticketGetQuerySchema,
  },
  responses: {
    200: {
      description: "All tickets where retrieved",
      content: {
        "application/json": {
          schema: ticketResponseSchema.array(),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

const ticketGetByIdRoute = createRoute({
  description: "Finds a ticket based on it's id",
  tags: ["Tickets"],
  method: "get",
  path: "/:ticketId",
  responses: {
    200: {
      description: "Found the ticket with the given id",
      content: {
        "application/json": {
          schema: ticketResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a ticket with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the ticket post route
 */
const ticketPostRoute = createRoute({
  description: "Creates a new ticket based on the provided body",
  tags: ["Tickets"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ticketInsertSchema
            .omit({ userId: true })
            .strict()
            .openapi("Ticket post request"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The new ticket was created",
      content: {
        "application/json": {
          schema: ticketResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

/**
 * @var The openAPI spec for the ticket put route
 */
const ticketPutRoute = createRoute({
  description:
    "Will update the ticket with the given id, based on the provided body",
  tags: ["Tickets"],
  method: "put",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ticketUpdateSchema
            .omit({ userId: true })
            .strict()
            .openapi("Ticket put request"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "The ticket with the given id was updated",
      content: {
        "application/json": {
          schema: ticketResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a ticket with the given id",
    },
  },
});

/**
 * @var The openAPI spec for the ticket delete route
 */
const ticketDeleteRoute = createRoute({
  description: "Will delete the ticket with the given id",
  tags: ["Tickets"],
  method: "delete",
  path: "/:ticketId",
  responses: {
    200: {
      description: "The ticket with the given id was deleted",
      content: {
        "application/json": {
          schema: ticketResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Could not find a ticket with the given id",
    },
  },
});

export {
  TTicketGetQuery,
  ticketGetRoute,
  ticketGetByIdRoute,
  ticketPostRoute,
  ticketPutRoute,
  ticketDeleteRoute,
};
