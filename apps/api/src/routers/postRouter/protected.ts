import { OpenAPIHono } from "@hono/zod-openapi";
import { IPostVariables } from "./index";
import {
  postDeleteRoute,
  postGetByIdRoute,
  postGetRoute,
  postPostRoute,
  postPutRoute,
} from "./openAPI";
import { jwtMiddleware, TJWTVariables } from "@/auth";
import { IHonoProperties } from "@/routers/index";

interface IProtectedPostVariables extends IPostVariables, TJWTVariables {}

/**
 * @var The protected router for posts
 */
const protectedRouter = new OpenAPIHono<
  IHonoProperties<IProtectedPostVariables>
>();

protectedRouter.use(jwtMiddleware);

protectedRouter
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

export default protectedRouter;
