import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { Bindings } from "@/routers/index";
import { TProtectedVariables } from "./index";
import {
  CommentHandler,
  commentInsertSchema,
  commentUpdateSchema,
} from "@/db/handlers/commentHandler";

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
 * @var The validator for the post request for comments
 */
const commentPostValidator = zValidator(
  "json",
  commentInsertSchema.omit({ userId: true }).strict(),
);

/**
 * @var The validator for the put request for comments
 */
const commentPutValidator = zValidator(
  "json",
  commentUpdateSchema.omit({ userId: true }).strict(),
);

/**
 * @var The ticket router
 */
const commentRouter = new Hono<{
  Bindings: Bindings;
  Variables: ICommentVariables;
}>()
  .use(async (c, next) => {
    c.set("commentHandler", new CommentHandler(c.env.DB_URL));

    await next();
  })
  .get("/", async (c) => {
    const commentHandler = c.get("commentHandler");

    const comment = await commentHandler.getComments();

    return c.json({ comment });
  })
  .get("/:commentId", async (c) => {
    const commentId = c.req.param("commentId");
    const commentHandler = c.get("commentHandler");

    const comment = await commentHandler.findCommentById(commentId);
    if (!comment) {
      return c.json({ data: "Not found" }, 404);
    }

    return c.json({ comment });
  })
  .post("/", commentPostValidator, async (c) => {
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
  .put("/:commentId", commentPutValidator, async (c) => {
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
  .delete("/:commentId", async (c) => {
    const commentHandler = c.get("commentHandler");
    const commentId = c.req.param("commentId");

    const comment = await commentHandler.deleteComment(commentId);

    return c.json({ comment });
  });

export default commentRouter;
