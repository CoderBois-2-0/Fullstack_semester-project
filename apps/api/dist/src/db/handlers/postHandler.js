import { eq } from "drizzle-orm";
import { createSelectSchema, createInsertSchema, createUpdateSchema, } from "drizzle-zod";
import { getDBClient } from "@/db/index";
import { postTable } from "@/db/schema";
const postSelectSchema = createSelectSchema(postTable);
/**
 * @description
 * The zod schema for inserting posts
 */
const postInsertSchema = createInsertSchema(postTable).omit({ id: true });
/**
 * @description
 * The zod schema for updating a psot
 */
const postUpdateSchema = createUpdateSchema(postTable).omit({
    id: true,
});
/**
 * @description
 * The handler for the post table in the database.
 */
class PostHandler {
    #client;
    #table = postTable;
    /**
     * @description
     * Will create a new post handler for dealing with database operations in regards to posts
     * @param dbUrl - The url used to connect to the database
     */
    constructor(dbUrl) {
        this.#client = getDBClient(dbUrl);
    }
    /**
     * @description
     * Retrieves all posts
     * @returns A list of all events
     */
    async getPosts() {
        return this.#client.query.postTable.findMany();
    }
    /**
     * @description
     * Tries to find a single post based on a given id
     * @param postId - The id of a given post to search for
     * @returns An optional post
     */
    async findPostById(postId) {
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
    async createPost(newPost) {
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
    async updatePost(postId, updatedPost) {
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
    async deletePost(postId) {
        const postsReturned = await this.#client
            .delete(this.#table)
            .where(eq(this.#table.id, postId))
            .returning();
        return postsReturned.at(0);
    }
}
export { PostHandler, postSelectSchema, postInsertSchema, postUpdateSchema };
