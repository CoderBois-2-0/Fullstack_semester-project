import "reflect-metadata";
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import authRouter from "./routers/authRouter.js";
import eventRouter from "./routers/eventRouter.js";

export interface Bindings {
  JWT_SECRET: string
};

const app = new Hono<{ Bindings: Bindings }>()
  .route('/auth', authRouter)
  .route('/events', eventRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
