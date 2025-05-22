import { OpenAPIHono } from "@hono/zod-openapi";

import {
  commentPostRoute,
  commentPutRoute,
  commentDeleteRoute,
} from "./openAPI";
import { ICommentVariables } from ".";
import { jwtMiddleware, TJWTVariables } from "@/auth";
import { IHonoProperties } from "..";

interface IProtectedCommentVariables extends ICommentVariables, TJWTVariables {}

/**
 * @var The protected comment router
 */
const commentRouter = new OpenAPIHono<
  IHonoProperties<IProtectedCommentVariables>
>();

commentRouter.use(jwtMiddleware);

commentRouter
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
