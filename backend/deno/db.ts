import { Client } from "https://deno.land/x/mysql/mod.ts";

// Load environment variables
const DB_HOST = "127.0.0.1";
const DB_USER = "shopuser";
const DB_PASSWORD = "shoppassword";
const DB_DATABASE = "shop";

// Initialize MySQL client
export const client = await new Client().connect({
  hostname: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  db: DB_DATABASE,
  port: 3306,
});