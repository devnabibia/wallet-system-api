import type { Request, Response } from "express";

import type {
  ILogin,
  IRefreshToken,
  IRegister,
} from "../interface/user.interface";
import { AuthService } from "../services/auth.service";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../constants/status-codes";

export class AuthController {
  private readonly userService = new AuthService();

  /**
   * `POST` /api/auth/login
   */
  login = async (req: Request, res: Response) => {
    const dto = req.body as ILogin;

    res.status(HTTP_STATUS_CREATED).json(await this.userService.login(dto));
  };

  /**
   * `POST` /api/auth/register
   */
  register = async (req: Request, res: Response) => {
    const dto = req.body as IRegister;

    res.status(HTTP_STATUS_OK).json(await this.userService.register(dto));
  };

  /**
   * `POST` /api/auth/refresh-token
   */
  refreshToken = async (req: Request, res: Response) => {
    // TODO: implement refresh token with redis
    const dto = req.body as IRefreshToken;

    res.status(HTTP_STATUS_OK).json(await this.userService.refreshToken(dto));
  };
}
