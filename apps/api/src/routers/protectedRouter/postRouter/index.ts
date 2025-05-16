import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "@/routers/protectedRouter/index";
import { PostHandler } from "@/db/handlers/postHandler";
import {
  postDeleteRoute,
  postGetByIdRoute,
  postGetRoute,
  postPostRoute,
  postPutRoute,
} from "./openAPI";

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
 * @var The posts router
 */
const postRouter = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: IPostVariables;
}>();

postRouter.use(async (c, next) => {
  c.set("postHandler", new PostHandler(c.env.DB_URL));

  await next();
});

postRouter
  .openapi(postGetRoute, async (c) => {
    const postHandler = c.get("postHandler");

    const posts = await postHandler.getPosts();

    return c.json({ posts });
  })
  .openapi(postGetByIdRoute, async (c) => {
    const postId = c.req.param("postId");
    const postHandler = c.get("postHandler");

    const post = await postHandler.findPostById(postId);
    if (!post) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ post });
  })
  .openapi(postPostRoute, async (c) => {
    const user = c.get("jwtPayload");
    const postHandler = c.get("postHandler");
    const newPost = c.req.valid("json");

    const post = await postHandler.createPost({ ...newPost, userId: user.id });
    if (!post) {
      return c.json({ data: "Could not create post" }, 500);
    }

    return c.json({ post });
  })
  .openapi(postPutRoute, async (c) => {
    const postHandler = c.get("postHandler");
    const postId = c.req.param("postId");
    const updatedPost = c.req.valid("json");

    const post = await postHandler.updatePost(postId, updatedPost);
    if (!post) {
      return c.json({ data: "Could not update post" }, 500);
    }

    return c.json({ post });
  })
  .openapi(postDeleteRoute, async (c) => {
    const postHandler = c.get("postHandler");
    const postId = c.req.param("postId");

    const post = await postHandler.deletePost(postId);

    return c.json({ post });
  });

export default postRouter;
