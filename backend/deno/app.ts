import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import masterRouter from "./routes/masterRouter.ts";
const app = new Application();
const router = new Router();

router.use(masterRouter.routes())

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
