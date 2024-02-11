import express, { Router } from "express";

import { logger } from "./logger.middleware";
import { rateLimiter } from "./rate-limiter.middleware";

export const middlewareRouter = Router();

middlewareRouter.use(logger);
middlewareRouter.use(express.json());
middlewareRouter.use(rateLimiter);
