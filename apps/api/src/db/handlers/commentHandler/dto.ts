import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { commentTable } from "@/db/schema";

const commentSelectSchema = createSelectSchema(commentTable);

type TComment = z.infer<typeof commentSelectSchema>;

/**
 * @description
 * The zod schema for inserting comments
 */
const commentInsertSchema = createInsertSchema(commentTable).omit({ id: true });
/**
 * @description
 * The zod type of a comment that is to be inserted
 */
type TCommentInsert = z.infer<typeof commentInsertSchema>;

/**
 * @description
 * The zod schema for updating a comment
 */
const commentUpdateSchema = createUpdateSchema(commentTable).omit({
  id: true,
});
/**
 * @description
 * The zod type of a comment that is to be updated
 */
type TCommentUpdate = z.infer<typeof commentUpdateSchema>;

export {
  commentSelectSchema,
  TComment,
  commentInsertSchema,
  TCommentInsert,
  commentUpdateSchema,
  TCommentUpdate,
};
