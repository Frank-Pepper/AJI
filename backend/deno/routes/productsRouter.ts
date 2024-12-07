import { Router } from "@oak/oak/router";
import { RouterContext } from "@oak/oak/router";
import { STATUS_CODE } from "jsr:@oak/commons@1/status";

import { client } from "../db.ts";

interface Product {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    unit_weight: number;
    category_id: number; // Foreign key reference to Category
}

const productRouter = new Router();

productRouter.get("/products", async (ctx: RouterContext<string>) => {
    try {
        const result = await client.query("SELECT * FROM Products");
        ctx.response.body = result;
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});

// Route to fetch a single product by ID
productRouter.get("/products/:id", async (ctx: RouterContext<string>) => {
    try {
        const id = ctx.params.id;  // Get the 'id' from URL params
        const result = await client.query("SELECT * FROM Products WHERE id = ?", [id]);

        if (result.length === 0) {
            ctx.response.status = STATUS_CODE.NotFound;
            ctx.response.body = { message: "Product not found" };
        } else {
            ctx.response.body = result[0];  // Return the first product if found
        }
    } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
}});

productRouter.post("/products", async (ctx: RouterContext<string>) => {
    try {
        const body: Product = await ctx.request.body.json();
        const { name, description, unit_price, unit_weight, category_id } = body;

        // Validate the input
        if (!name || !unit_price || !unit_weight || !category_id) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "Missing required fields" };
            return;
        }

        if (unit_price <= 0 || unit_weight <= 0) {
            ctx.response.status = STATUS_CODE.BadRequest;
            ctx.response.body = { message: "Missing required fields" };
            return;
        }

        // Insert data into the Products table
        await client.query(
            "INSERT INTO Products (name, description, unit_price, unit_weight, category_id) VALUES (?, ?, ?, ?, ?)",
            [name,
            description,
            unit_price,
            unit_weight,
            category_id]
        );

        // Send success response
        ctx.response.status = STATUS_CODE.Created;
        ctx.response.body = { message: "Product created successfully" };
  } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
}});

async function update(ctx: RouterContext<string>, body: Product) {
    const { name, description, unit_price, unit_weight, category_id, id } = body;

    // Validate the input
    if (!name || !unit_price || !unit_weight || !category_id || !id) {
        ctx.response.status = STATUS_CODE.BadRequest;
        ctx.response.body = { message: "Missing required fields" };
        return;
    }

    // Insert data into the Products table
    const result = await client.query(
        `UPDATE Products SET name = ?, description = ?, unit_price = ?, unit_weight = ?, category_id = ? WHERE id = ?`,
        [name,
        description,
        unit_price,
        unit_weight,
        category_id, id]
    );

    if (result.affectedRows  === 0) {
        ctx.response.status = STATUS_CODE.BadRequest;
        ctx.response.body = { message: "Product not found" };
    }
}

productRouter.put("/products", async (ctx: RouterContext<string>) => {
    try {
        const body: Product[] = await ctx.request.body.json();
        let product: Product
        for (product of body) {
            await update(ctx, product);
        }

        ctx.response.status = STATUS_CODE.OK; // OK
        ctx.response.body = { message: "Products updated successfully" };
    } catch(error) {
        console.error("Error updating product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
});


productRouter.put("/products/:id", async (ctx: RouterContext<string>) => {
    try {
        // Parse the JSON body
        const id = ctx.params.id;
        const body = await ctx.request.body.json();
        body['id'] = id;

        update(ctx, body);
        
        ctx.response.status = STATUS_CODE.OK; // OK
        ctx.response.body = { message: "Product updated successfully" };

    } catch(error) {
        console.error("Error updating product:", error);
        ctx.response.status = STATUS_CODE.InternalServerError;
        ctx.response.body = { message: "Error creating product" };
    }
})

export default productRouter;