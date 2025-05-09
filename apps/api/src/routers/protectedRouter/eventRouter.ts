import { Hono } from "hono";
import { Bindings } from "../index";
import { EventHandler } from "@/db/handlers/eventHandler";

interface Variables {
    eventHandler: EventHandler;
}

const eventRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>()
    .use(async (c, next) => {
        c.set('eventHandler', new EventHandler(c.env.DB_URL));

        await next();
    })
    .get('/', async (c) => {
        const eventHandler = c.get('eventHandler');

        const events = await eventHandler.getEvents()

        return c.json({ events });
    })
    .get('/:eventId', async (c) => {
        const eventHandler = c.get('eventHandler');
        const eventId = c.req.param('eventId');
        
        const event = await eventHandler.findEventById(eventId);
        return c.json({ event });
    })
    .post('/', (c) => {
        return c.json({ data: 'Not implemented' }, 500);
    })
    .put('/:eventId', (c) => {
        return c.json({ data: 'Not implemented' }, 500);
    })
    .delete('/:eventId', (c) => {
        return c.json({ data: 'Not implemented' }, 500);
    });

export default eventRouter;