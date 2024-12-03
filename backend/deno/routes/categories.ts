import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";

import { client } from "../db.ts";

const categoriesRouter = new Router();

// Pobierz wszystkie kategorie
categoriesRouter.get("/categories", async (ctx: Context) => {
    try {
        const result = await client.query("SELECT * FROM Categories");
    ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});

export default categoriesRouter;