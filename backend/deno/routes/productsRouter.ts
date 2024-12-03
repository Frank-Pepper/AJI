import { Router } from "jsr:@oak/oak/router";

import { client } from "../db.ts";

const productRouter = new Router();

productRouter.get("/products", async (ctx) => {
    const result = await client.query("SELECT * FROM Products");
    ctx.response.body = result;
});

// Route to fetch a single product by ID
productRouter.get("/products/:id", async (ctx) => {
    const id = ctx.params.id;  // Get the 'id' from URL params
    const result = await client.query("SELECT * FROM Products WHERE id = ?", [id]);

    if (result.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Product not found" };
    } else {
        ctx.response.body = result[0];  // Return the first product if found
    }
});

productRouter.post("/products", async (ctx) => {
    try {
        // Parse the JSON body
        const body = await ctx.request.body.json();
        const { name, description, unit_price, unit_weight, category_id } = body;

        // Validate the input
        if (!name || !unit_price || !unit_weight || !category_id) {
            ctx.response.status = 400;
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
        ctx.response.status = 201;
        ctx.response.body = { message: "Product created successfully" };
  } catch (error) {
        console.error("Error inserting product:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error creating product" };
  }});

export default productRouter;