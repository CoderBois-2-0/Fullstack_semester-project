import { asc, desc, eq, getTableColumns } from "drizzle-orm";

import { getDBClient } from "@/db/index";
import { postTable, userTable } from "@/db/schema";
import { TPostQuery } from "@/routers/postRouter/dto";
import { TPost, TPostInsert, TPostUpdate } from "./dto";

/**
 * @description
 * The handler for the post table in the database.
 */
class PostHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = postTable;

  /**
   * @description
   * Will create a new post handler for dealing with database operations in regards to posts
   * @param dbUrl - The url used to connect to the database
   */
  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  /**
   * @description
   * Retrieves all posts
   * @param query - A query object used for dynamic filtering of posts
   * @returns A list of all posts
   */
  async getPosts(query: TPostQuery): Promise<TPost[]> {
    let queryBuilder = this.#client
      .select({
        post: getTableColumns(this.#table),
        user: {
          username: userTable.username,
        },
      })
      .from(this.#table)
      .orderBy(desc(this.#table.createdAt))
      .innerJoin(userTable, eq(this.#table.userId, userTable.id))
      .$dynamic();

    if (query["event-id"]) {
      queryBuilder = queryBuilder.where(
        eq(this.#table.eventId, query["event-id"])
      );
    }
    const limit = query.limit ? query.limit : 12;
    if (query.limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    if (query.page) {
      queryBuilder = queryBuilder.offset((query.page - 1) * limit);
    }

    return queryBuilder.execute();
  }

  /**
   * @description
   * Tries to find a single post based on a given id
   * @param postId - The id of a given post to search for
   * @returns An optional post
   */
  async findPostById(postId: string) {
    return this.#client.query.postTable.findFirst({
      where: (post, { eq }) => eq(post.id, postId),
    });
  }

  /**
   * @description
   * Attempts to insert a new post into the database
   * @param newPost - The post to insert into the database
   * @returns The newly created post
   */
  async createPost(newPost: TPostInsert) {
    const postId = crypto.randomUUID();
    const postsReturned = await this.#client
      .insert(this.#table)
      .values({
        ...newPost,
        id: postId,
      })
      .returning();

    return postsReturned.at(0);
  }

  /**
   * @description
   * Attempts to update a given post based on an id
   * @param postId - The id of the post to update
   * @param updatedPost - The data to update the post with
   * @returns - The updated post with all it's fields
   */
  async updatePost(postId: string, updatedPost: TPostUpdate) {
    const postsReturned = await this.#client
      .update(this.#table)
      .set(updatedPost)
      .where(eq(this.#table.id, postId))
      .returning();

    return postsReturned.at(0);
  }

  /**
   * @description
   * Attempts to delete a post, based on it's id
   * @param postId - The id of the post to delete
   * @returns The deleted post
   */
  async deletePost(postId: string) {
    const postsReturned = await this.#client
      .delete(this.#table)
      .where(eq(this.#table.id, postId))
      .returning();

    return postsReturned.at(0);
  }
}

export { PostHandler };
