import { Hono } from "hono";

const eventRouter = new Hono()
    .get('/', async (c) => {
        return c.json({  }, 500);
    })
    .get('/:eventId', (c) => {
        return c.json({ data: 'Not implemented' }, 500);
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