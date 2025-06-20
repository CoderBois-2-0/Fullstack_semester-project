import { eq, getTableColumns } from "drizzle-orm";

import { getDBClient } from "@/db/index";
import { commentTable, postTable, userTable } from "@/db/schema";
import { TCommentInsert, TCommentUpdate } from "./dto";
import { TCommentQuery } from "@/routers/commentRouter/dto";

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
  async getComments(query: TCommentQuery) {
    let queryBuider = this.#client
      .select({
        comment: getTableColumns(this.#table),
        user: {
          username: userTable.username,
        },
      })
      .from(this.#table)
      .innerJoin(userTable, eq(this.#table.userId, userTable.id))
      .$dynamic();

    const postId = query["post-id"];
    if (postId) {
      queryBuider = queryBuider.where(eq(this.#table.postId, postId));
    }

    return queryBuider.execute();
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

export { CommentHandler };
