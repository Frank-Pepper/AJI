import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";

import { client } from "../db.ts";

const ordersRouter = new Router();

// Pobierz wszystkie zamówienia
ordersRouter.get("/orders", async (ctx: Context) => {
    const result = await client.query("SELECT * FROM Orders");
    ctx.response.body = result;
});
  
// Pobierz zamówienia dla konkretnej nazwy użytkownika
ordersRouter.get("/orders/user/:username", async (ctx: Context) => {
    const username = ctx.params.username;
    const result = await client.query("SELECT * FROM Orders WHERE username = ?", [username]);
    ctx.response.body = result;
});
  
// Pobierz zamówienie po ID
ordersRouter.get("/orders/:id", async (ctx: Context) => {
    const id = ctx.params.id;
    const result = await client.query("SELECT * FROM Orders WHERE id = ?", [id]);

    if (result.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Order not found" };
    } else {
        ctx.response.body = result[0];
    }
});

// Dodaj zamówienie
ordersRouter.post("/orders", async (ctx: Context) => {
    const { confirmation_date, status_id, username, email, phone_number } = await ctx.request.body().value;
    await client.execute(
        "INSERT INTO Orders (confirmation_date, status_id, username, email, phone_number) VALUES (?, ?, ?, ?, ?)",
        [confirmation_date, status_id, username, email, phone_number],
    );
    ctx.response.status = 201;
    ctx.response.body = { message: "Order added successfully" };
});

// Zmień stan zamówienia (z walidacją)
ordersRouter.patch("/orders/:id", async (ctx: Context) => {
    const id = ctx.params.id;
    const { status_id } = await ctx.request.body().value;

    // Pobierz bieżący stan zamówienia
    const currentOrder = await client.query("SELECT status_id FROM Orders WHERE id = ?", [id]);

    if (currentOrder.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Order not found" };
        return;
    }

    const currentStatus = currentOrder[0].status_id;

    // Walidacja przejść stanu
    const invalidTransitions = {
        3: [4], // ANULOWANE -> nie można przejść na ZREALIZOWANE
        4: [1, 2, 3], // ZREALIZOWANE -> nie można zmienić stanu
    };

    if (invalidTransitions[currentStatus]?.includes(status_id)) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid status transition" };
        return;
    }

    // Aktualizacja stanu
    await client.execute("UPDATE Orders SET status_id = ? WHERE id = ?", [status_id, id]);
    ctx.response.body = { message: "Order status updated successfully" };
});

// Pobierz zamówienia wg stanu
ordersRouter.get("/orders/status/:id", async (ctx: Context) => {
    const status_id = ctx.params.id;
    const result = await client.query("SELECT * FROM Orders WHERE status_id = ?", [status_id]);
    ctx.response.body = result;
});

export default ordersRouter;