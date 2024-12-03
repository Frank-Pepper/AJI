import { Router } from "jsr:@oak/oak/router";

import { client } from "../db.ts";

const statusRouter = new Router();
// --- Stan Zamówienia ---
// Pobierz wszystkie możliwe stany zamówienia
statusRouter.get("/status", async (ctx) => {
    const result = await client.query("SELECT * FROM OrderStatuses");
    ctx.response.body = result;
});

export default statusRouter;