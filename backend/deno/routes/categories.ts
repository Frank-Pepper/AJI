import { Router } from "jsr:@oak/oak/router";

import { client } from "../db.ts";

const categoriesRouter = new Router();
// Pobierz wszystkie kategorie
categoriesRouter.get("/categories", async (ctx) => {
    const result = await client.query("SELECT * FROM Categories");
    ctx.response.body = result;
  });

export default categoriesRouter;