import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "@/routers/protectedRouter/index";
import { CommentHandler } from "@/db/handlers/commentHandler";
import {
  commentDeleteRoute,
  commentGetByIdRoute,
  commentGetRoute,
  commentPostRoute,
  commentPutRoute,
} from "./openAPI";

/**
 * @description
 * The cloudflare variables for the comments router,
 * extends the protected variables from the protected router
 */
interface ICommentVariables extends TProtectedVariables {
  /**
   * @property The handler for comments
   */
  commentHandler: CommentHandler;
}

/**
 * @var The ticket router
 */
const commentRouter = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: ICommentVariables;
}>();

commentRouter.use(async (c, next) => {
  c.set("commentHandler", new CommentHandler(c.env.DB_URL));

  await next();
});

commentRouter
  .openapi(commentGetRoute, async (c) => {
    const commentHandler = c.get("commentHandler");

    const comment = await commentHandler.getComments();

    return c.json({ comment });
  })
  .openapi(commentGetByIdRoute, async (c) => {
    const commentId = c.req.param("commentId");
    const commentHandler = c.get("commentHandler");

    const comment = await commentHandler.findCommentById(commentId);
    if (!comment) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ comment });
  })
  .openapi(commentPostRoute, async (c) => {
    const user = c.get("jwtPayload");
    const commentHandler = c.get("commentHandler");
    const newComment = c.req.valid("json");

    const comment = await commentHandler.createComment({
      ...newComment,
      userId: user.id,
    });
    if (!comment) {
      return c.json({ data: "Could not create ticket" }, 500);
    }

    return c.json({ comment });
  })
  .openapi(commentPutRoute, async (c) => {
    const commentHandler = c.get("commentHandler");
    const commentId = c.req.param("commentId");
    const updatedComment = c.req.valid("json");

    const comment = await commentHandler.updateComment(
      commentId,
      updatedComment,
    );
    if (!comment) {
      return c.json({ data: "Could not update ticket" }, 500);
    }

    return c.json({ comment });
  })
  .openapi(commentDeleteRoute, async (c) => {
    const commentHandler = c.get("commentHandler");
    const commentId = c.req.param("commentId");

    const comment = await commentHandler.deleteComment(commentId);

    return c.json({ comment });
  });

export default commentRouter;
