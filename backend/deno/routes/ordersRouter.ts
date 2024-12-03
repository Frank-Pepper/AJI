import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak/context";

import { client } from "../db.ts";

const ordersRouter = new Router();

// Pobierz wszystkie zamówienia
ordersRouter.get("/orders", async (ctx: Context) => {
    try{
        const result = await client.query("SELECT * FROM Orders");
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});
  
// Pobierz zamówienia dla konkretnej nazwy użytkownika
ordersRouter.get("/orders/user/:username", async (ctx: Context) => {
    try {
    const username = ctx.params.username;
    const result = await client.query("SELECT * FROM Orders WHERE username = ?", [username]);
    ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});
  
// Pobierz zamówienie po ID
ordersRouter.get("/orders/:id", async (ctx: Context) => {
    try {
    const id = ctx.params.id;
    const result = await client.query("SELECT * FROM Orders WHERE id = ?", [id]);

    if (result.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Order not found" };
    } else {
        ctx.response.body = result[0];
    }
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});

// Dodaj zamówienie
ordersRouter.post("/orders", async (ctx: Context) => {
    try {
        const body = await ctx.request.body.json();
        const { confirmation_date, status_id, username, email, phone_number } = body;
        await client.execute(
            "INSERT INTO Orders (confirmation_date, status_id, username, email, phone_number) VALUES (?, ?, ?, ?, ?)",
            [confirmation_date, status_id, username, email, phone_number],
        );
        ctx.response.status = 201;
        ctx.response.body = { message: "Order added successfully" };
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});

async function patch(ctx: Context, body) {

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

}

ordersRouter.patch("/orders", async (ctx: Context) => {
    try {
        const body = await ctx.request.body.json();
        console.log(body);
        for (var order of body) {
            patch(ctx, order);
        }
        ctx.response.status = 200; // OK
        ctx.response.body = { message: "Products updated successfully" };
    } catch(error) {
        console.error("Error updating product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
})

// Zmień stan zamówienia (z walidacją)
ordersRouter.patch("/orders/:id", async (ctx: Context) => {
    try {
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

    ctx.response.status = 200; // OK
    ctx.response.body = { message: "Order status updated successfully" };
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});

// Pobierz zamówienia wg stanu
ordersRouter.get("/orders/status/:id", async (ctx: Context) => {
    try {
    const status_id = ctx.params.id;
    const result = await client.query("SELECT * FROM Orders WHERE status_id = ?", [status_id]);
    ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
    }
});

export default ordersRouter;