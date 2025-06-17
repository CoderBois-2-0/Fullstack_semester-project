import { z } from "@hono/zod-openapi";

const querySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export { querySchema };
