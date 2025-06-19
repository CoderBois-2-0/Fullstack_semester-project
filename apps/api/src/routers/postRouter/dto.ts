import { postSchema } from "@/db/handlers/postHandler/dto";
import { z } from "@hono/zod-openapi";
import { querySchema } from "@/routers/dto";

/**
 * @description
 * The base post response schema
 */
const postResponseSchema = postSchema.openapi("Post response");

/**
 * @description
 * The shcema for a post query
 */
const postQuerySchema = querySchema
  .extend({
    "event-id": z
      .string()
      .uuid()
      .openapi({ description: "The query for a post get request" }),
  })
  .openapi({ description: "The post query parameters" });
type TPostQuery = z.infer<typeof postQuerySchema>;

export { postQuerySchema, postResponseSchema, TPostQuery };
