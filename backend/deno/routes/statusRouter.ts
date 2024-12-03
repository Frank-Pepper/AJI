import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";

import { client } from "../db.ts";

const statusRouter = new Router();
// --- Stan Zamówienia ---
// Pobierz wszystkie możliwe stany zamówienia
statusRouter.get("/status", async (ctx: Context) => {
    const result = await client.query("SELECT * FROM OrderStatuses");
    ctx.response.body = result;
});

export default statusRouter;