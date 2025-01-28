import { oakCors } from "https://deno.land/x/cors/mod.ts";

app.use(oakCors()); // Umożliwia CORS
app.use(async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/frontend/dist`,
      index: "index.html",
    });
  } catch {
    ctx.response.status = 404;
  }
});
