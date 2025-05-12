import { Hono } from "hono";

const ticketRouter = new Hono()
  .get("/", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  })
  .get("/:ticketId", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  })
  .post("/", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  })
  .put("/:ticketId", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  })
  .delete("/:ticketId", (c) => {
    return c.json({ data: "Not implemented" }, 500);
  });

export default ticketRouter;
