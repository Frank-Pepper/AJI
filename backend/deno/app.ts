import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Client } from "https://deno.land/x/mysql/mod.ts";

// Load environment variables
const DB_HOST = "127.0.0.1";
const DB_USER = "shopuser";
const DB_PASSWORD = "shoppassword";
const DB_DATABASE = "shop";

// Initialize MySQL client
const client = await new Client().connect({
  hostname: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  db: DB_DATABASE,
  port: 3306,
});

const app = new Application();
const router = new Router();

router.get("/products", async (ctx) => {
  const result = await client.query("SELECT * FROM Products");
  ctx.response.body = result;
});

// Route to fetch a single product by ID
router.get("/products/:id", async (ctx) => {
  const id = ctx.params.id;  // Get the 'id' from URL params
  const result = await client.query("SELECT * FROM Products WHERE id = ?", [id]);

  if (result.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Product not found" };
  } else {
    ctx.response.body = result[0];  // Return the first product if found
  }
});

router.post("/products", async (ctx) => {
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
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
