import { OpenAPIHono } from "@hono/zod-openapi";

import { commentGetRoute, commentGetByIdRoute } from "./openAPI";
import { ICommentHonoProperties } from "./index";

/**
 * @var The public comment router
 */
const publicRouter = new OpenAPIHono<ICommentHonoProperties>()
  .openapi(commentGetRoute, async (c) => {
    const commentHandler = c.get("commentHandler");
    const query = c.req.valid("query");

    const comment = await commentHandler.getComments(query);

    return c.json(comment);
  })
  .openapi(commentGetByIdRoute, async (c) => {
    const commentId = c.req.param("commentId");
    const commentHandler = c.get("commentHandler");

    const comment = await commentHandler.findCommentById(commentId);
    if (!comment) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json(comment);
  });

export default publicRouter;
