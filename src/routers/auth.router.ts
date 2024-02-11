import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { LoginDto, RefreshTokenDto, RegisterDto } from "../dto/auth.dto";
import { exceptionEscalator } from "../helpers/exception.helper";
import { validator } from "../helpers/validator.helper";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/auth/login/",
  validator({ dto: new LoginDto() }),
  exceptionEscalator(authController.login)
);
authRouter.post(
  "/auth/register/",
  validator({ dto: new RegisterDto() }),
  exceptionEscalator(authController.register)
);
authRouter.post(
  "/auth/refresh-token/",
  validator({ dto: new RefreshTokenDto() }),
  exceptionEscalator(authController.refreshToken)
);
