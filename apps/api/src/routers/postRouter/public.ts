import { OpenAPIHono } from "@hono/zod-openapi";

import { postGetByIdRoute, postGetRoute } from "./openAPI";
import { IPostHonoProperties } from "./index";

/**
 * @description
 * The public posts router
 */
const publicRouter = new OpenAPIHono<IPostHonoProperties>()
  .openapi(postGetRoute, async (c) => {
    const postHandler = c.get("postHandler");
    const query = c.req.valid("query");

    const posts = await postHandler.getPosts(query);

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
  });

export default publicRouter;
