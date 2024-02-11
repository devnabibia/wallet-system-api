import { Router } from "express";

import { error404Handler, exceptionFilter } from "../helpers/exception.helper";
import { authRouter } from "../routers/auth.router";
import { walletRouter } from "../routers/wallet.router";

export const rootRouter = Router();

rootRouter.use(authRouter);
rootRouter.use(walletRouter);

rootRouter.use(exceptionFilter);
rootRouter.get("*", error404Handler());
