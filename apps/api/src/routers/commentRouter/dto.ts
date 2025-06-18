import { commentSelectSchema } from "@/db/handlers/commentHandler/dto";
import { querySchema } from "../dto";
import { z } from "@hono/zod-openapi";

const commentResponseSchema = commentSelectSchema.openapi("Comment Response");

const commentQuerySchema = querySchema.extend({
  "post-id": z.string().uuid().optional(),
});
type TCommentQuery = z.infer<typeof commentQuerySchema>;

export { commentResponseSchema, commentQuerySchema, TCommentQuery };
