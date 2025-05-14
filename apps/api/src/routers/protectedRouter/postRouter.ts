import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "./index";
import {
  PostHandler,
  postInsertSchema,
  postUpdateSchema,
} from "@/db/handlers/postHandler";

/**
 * @description
 * The cloudflare variables for the post router,
 * extends the protected variables from the protected router
 */
interface IPostVariables extends TProtectedVariables {
  /**
   * @property The handler for post
   */
  postHandler: PostHandler;
}

/**
 * @var The validator for the post request for posts
 */
const postPostValidator = zValidator(
  "json",
  postInsertSchema.omit({ userId: true }).strict(),
);

/**
 * @var The validator for the put request for posts
 */
const postPutValidator = zValidator(
  "json",
  postUpdateSchema.omit({ userId: true }).strict(),
);

/**
 * @var The posts router
 */
const postRouter = new Hono<{ Bindings: Bindings; Variables: IPostVariables }>()
  .use(async (c, next) => {
    c.set("postHandler", new PostHandler(c.env.DB_URL));

    await next();
  })
  .get("/", async (c) => {
    const postHandler = c.get("postHandler");

    const posts = await postHandler.getPosts();

    return c.json({ posts });
  })
  .get("/:postId", async (c) => {
    const postId = c.req.param("postId");
    const postHandler = c.get("postHandler");

    const post = await postHandler.findPostById(postId);
    if (!post) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ post });
  })
  .post("/", postPostValidator, async (c) => {
    const user = c.get("jwtPayload");
    const postHandler = c.get("postHandler");
    const newPost = c.req.valid("json");

    const post = await postHandler.createPost({ ...newPost, userId: user.id });
    if (!post) {
      return c.json({ data: "Could not create post" }, 500);
    }

    return c.json({ post });
  })
  .put("/:postId", postPutValidator, async (c) => {
    const postHandler = c.get("postHandler");
    const postId = c.req.param("postId");
    const updatedPost = c.req.valid("json");

    const post = await postHandler.updatePost(postId, updatedPost);
    if (!post) {
      return c.json({ data: "Could not update post" }, 500);
    }

    return c.json({ post });
  })
  .delete("/:postId", async (c) => {
    const postHandler = c.get("postHandler");
    const postId = c.req.param("postId");

    const post = await postHandler.deletePost(postId);

    return c.json({ post });
  });

export default postRouter;
