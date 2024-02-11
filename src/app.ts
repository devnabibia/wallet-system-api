import express from "express";

import { middlewareRouter } from "./middlewares";
import { rootRouter } from "./routers";

export const app = express();

app.use(middlewareRouter);
app.use("/api/", rootRouter);
