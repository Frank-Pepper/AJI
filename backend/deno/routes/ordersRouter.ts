import { Router } from "@oak/oak/router";
import { RouterContext } from "@oak/oak/router";
import { STATUS_CODE } from "jsr:@oak/commons@1/status";

import { client } from "../db.ts";

interface Order {
    confirmation_date: string;
    id: string;
    status_id: string;        
    username: string;         
    email: string;            
    phone_number: string;     
  }

const NIEZATWIERDZONE :string = "NIEZATWIERDZONE"
const ZATWIERDZONE :string ="ZATWIERDZONE"   
const ANULOWANE :string = "ANULOWANE"      
const ZREALIZOWANE :string = "ZREALIZOWANE"   

const ordersRouter = new Router();

// Pobierz wszystkie zamówienia
ordersRouter.get("/orders", async (ctx: RouterContext<string>) => {
    try{
        const result = await client.query("SELECT * FROM Orders");
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});
  
// Pobierz zamówienia dla konkretnej nazwy użytkownika
ordersRouter.get("/orders/user/:username", async (ctx: RouterContext<string>) => {
    try {
        const username = ctx.params.username;
        const result = await client.query("SELECT * FROM Orders WHERE username = ?", [username]);
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});
  
// Pobierz zamówienie po ID
ordersRouter.get("/orders/:id", async (ctx: RouterContext<string>) => {
    try {
        const id = ctx.params.id;
        const result = await client.query("SELECT * FROM Orders WHERE id = ?", [id]);

        if (result.length === 0) {
            ctx.response.status = STATUS_CODE.NotFound;
            ctx.response.body = { message: "Order not found" };
        } else {
            ctx.response.body = result[0];
        }
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

// Dodaj zamówienie
ordersRouter.post("/orders", async (ctx: RouterContext<string>) => {
    try {
        const body: Order = await ctx.request.body.json();
        const { username, email, phone_number } = body;
        const status_id = NIEZATWIERDZONE;
        // const confirmation_date = new Date("1970-01-01T00:00:00Z");

        if (!username || !email || !phone_number) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "User information fields (username, email, phone_number) are required." };
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "Invalid email format." };
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[\d+\-()\s]+$/;
        if (!phoneRegex.test(phone_number)) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "Invalid phone number format." };
            return;
        }

        const result = await client.execute(
            "INSERT INTO Orders (status_id, username, email, phone_number) VALUES (?, ?, ?, ?)",
            [status_id, username, email, phone_number],
        );
        console.log(result)
        ctx.response.status = STATUS_CODE.Created;
        ctx.response.body = { message: `Order added successfully, id: ${result.lastInsertId}` };
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

async function patch(ctx: RouterContext<string>, body: Order) {
    const { status_id , id } = body;

    // Pobierz bieżący stan zamówienia
    const currentOrder = await client.query("SELECT status_id FROM Orders WHERE id = ?", [id]);

    if (currentOrder.length === 0) {
        ctx.response.status = STATUS_CODE.NotFound;
        ctx.response.body = { message: "Order not found" };
        return;
    }

    const currentStatus: string = currentOrder[0].status_id;

    // Walidacja przejść stanu
    const invalidTransitions: { [key: string]: string[] }= {
        NIEZATWIERDZONE: [ZREALIZOWANE],
        ANULOWANE: [ZREALIZOWANE], // ANULOWANE -> nie można przejść na ZREALIZOWANE
        ZREALIZOWANE: [NIEZATWIERDZONE, ZATWIERDZONE, ANULOWANE], // ZREALIZOWANE -> nie można zmienić stanu
    };
    const val: boolean = invalidTransitions[currentStatus]?.includes(status_id)

    if (val) {
        ctx.response.status = STATUS_CODE.BadRequest;
        ctx.response.body = { message: "Invalid status transition" };
        return;
    }

    // Aktualizacja stanu
    if (status_id == ZATWIERDZONE) {
        const confirmation_date = new Date();
        await client.execute("UPDATE Orders SET status_id = ?, confirmation_date = ? WHERE id = ?", [status_id, confirmation_date, id]);
    } else {
        await client.execute("UPDATE Orders SET status_id = ? WHERE id = ?", [status_id, id]);
    }
    

}

ordersRouter.patch("/orders", async (ctx: RouterContext<string>) => {
    try {
        const body: Order[] = await ctx.request.body.json();
        const failed: Order[] = [];
        console.log(body);
        let order: Order;
        for (order of body) {
            await patch(ctx, order);
            if (ctx.response.status != 200) {
                failed.push(order);
            }
            ctx.response.status = STATUS_CODE.OK; // OK
        }

        if (body.length == failed.length) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "No products updated successfully",
                failed: failed
            };
        } else {
            ctx.response.status = STATUS_CODE.OK; // OK
            if (failed.length == 0) {
                ctx.response.body = { message: "Products updated successfully",
                    failed: failed
                };
            } else {
                ctx.response.body = { message: "Products updated successfully" };
            }
        }
    } catch(error) {
        console.error("Error updating product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
})

// Zmień stan zamówienia (z walidacją)
ordersRouter.patch("/orders/:id", async (ctx: RouterContext<string>) => {
    try {
        const id = ctx.params.id;
        const body: Order = await ctx.request.body.json();
        if (Array.isArray(body)) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "Array in body instead of single order" };
            return;
        }
        body['id'] = id;

        await patch(ctx, body);

        ctx.response.status = STATUS_CODE.OK; // OK
        ctx.response.body = { message: "Order status updated successfully" };
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

// Pobierz zamówienia wg stanu
ordersRouter.get("/orders/status/:id", async (ctx: RouterContext<string>) => {
    try {
        const status_id = ctx.params.id;
        const result = await client.query("SELECT * FROM Orders WHERE status_id = ?", [status_id]);
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

export default ordersRouter;