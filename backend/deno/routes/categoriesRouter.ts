import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";
import { STATUS_CODE } from "jsr:@oak/commons@1/status";

import { client } from "../db.ts";

interface Category {
    id: number;
    name: string;
}

const categoriesRouter = new Router();

// Pobierz wszystkie kategorie
categoriesRouter.get("/categories", async (ctx: Context) => {
    try {
        const result: Category = await client.query("SELECT * FROM Categories");
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

export default categoriesRouter;