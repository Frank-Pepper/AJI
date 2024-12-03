import { Router } from "jsr:@oak/oak/router";

import productRouter from "./productsRouter.ts";
import ordersRouter from "./ordersRouter.ts";
import statusRouter from "./statusRouter.ts";
import categoriesRouter from "./categories.ts";

const masterRouter = new Router();

masterRouter.use(productRouter.routes());
masterRouter.use(categoriesRouter.routes());
masterRouter.use(ordersRouter.routes());
masterRouter.use(statusRouter.routes());


export default masterRouter;