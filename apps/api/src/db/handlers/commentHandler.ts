import { eq } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import { getDBClient } from "@/db/index";
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

/**
 * @description
 * The handler for the comments table in the database.
 */
class CommentHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = commentTable;

  /**
   * @description
   * Will create a new comment handler for dealing with database operations in regards to comments
   * @param dbUrl - The url used to connect to the database
   */
  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  /**
   * @description
   * Retrieves all comments
   * @returns A list of all comments
   */
  async getComments() {
    return this.#client.query.commentTable.findMany();
  }

  /**
   * @description
   * Tries to find a single comment based on a given id
   * @param commentId - The id of a given comment to search for
   * @returns An optional comment
   */
  async findCommentById(commentId: string) {
    return this.#client.query.commentTable.findFirst({
      where: (comment, { eq }) => eq(comment.id, commentId),
    });
  }

  /**
   * @description
   * Attempts to insert a new comment into the database
   * @param newComment - The comment to insert into the database
   * @returns The newly created comment
   */
  async createComment(newComment: TCommentInsert) {
    const commentId = crypto.randomUUID();
    const commentsReturned = await this.#client
      .insert(this.#table)
      .values({
        ...newComment,
        id: commentId,
      })
      .returning();

    return commentsReturned.at(0);
  }

  /**
   * @description
   * Attempts to update a given comment based on an id
   * @param commentId - The id of the comment to update
   * @param updatedComment - The data to update the comment with
   * @returns - The updated comment with all it's fields
   */
  async updateComment(commentId: string, updatedComment: TCommentUpdate) {
    const commentsReturned = await this.#client
      .update(this.#table)
      .set(updatedComment)
      .where(eq(this.#table.id, commentId))
      .returning();

    return commentsReturned.at(0);
  }

  /**
   * @description
   * Attempts to delete a comment, based on it's id
   * @param commentId - The id of the comment to delete
   * @returns The deleted comment
   */
  async deleteComment(commentId: string) {
    const commentsReturned = await this.#client
      .delete(this.#table)
      .where(eq(this.#table.id, commentId))
      .returning();

    return commentsReturned.at(0);
  }
}

export {
  CommentHandler,
  commentSelectSchema,
  commentInsertSchema,
  commentUpdateSchema,
};
