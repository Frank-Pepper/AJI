import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";
import { STATUS_CODE } from "jsr:@oak/commons@1/status";

import { client } from "../db.ts";

const statusRouter = new Router();

// Pobierz wszystkie możliwe stany zamówienia
statusRouter.get("/status", async (ctx: Context) => {
    try {
        const result = await client.query("SELECT * FROM OrderStatuses");
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

export default statusRouter;