import { postTable } from "@/db/schema";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { safeUserSelectSchema } from "../userHandler";

/**
 * @description
 * The base post schema used for query operations
 */
const postSchema = z.object({
  post: createSelectSchema(postTable),
  user: safeUserSelectSchema.pick({ username: true }),
});

/**
 * @description
 * The base post used for query operations
 */
type TPost = z.infer<typeof postSchema>;

/**
 * @description
 * The zod schema for inserting posts
 */
const postInsertSchema = createInsertSchema(postTable).omit({ id: true });
/**
 * @description
 * The zod type of a post that is to be inserted
 */
type TPostInsert = z.infer<typeof postInsertSchema>;

/**
 * @description
 * The zod schema for updating a psot
 */
const postUpdateSchema = createUpdateSchema(postTable).omit({
  id: true,
});
/**
 * @description
 * The zod type of a post that is to be updated
 */
type TPostUpdate = z.infer<typeof postUpdateSchema>;

export {
  postSchema,
  TPost,
  postInsertSchema,
  TPostInsert,
  postUpdateSchema,
  TPostUpdate,
};
