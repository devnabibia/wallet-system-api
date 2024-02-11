import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { HTTP_STATUS_UNAUTHORIZED } from "../constants/status-codes";
import { HttpException } from "../exceptions/http.exception";
import { JwtHelper } from "../helpers/jwt.helper";

export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      next(
        new HttpException(HTTP_STATUS_UNAUTHORIZED, "bearer token is required")
      );
    }

    const jwtHelper = new JwtHelper();
    const payload = (await jwtHelper.verifyAccessToken(
      authToken as string
    )) as JwtPayload;

    (req as any).user = { id: payload.id as string };

    next();
  } catch (error: any) {
    next(
      new HttpException(
        HTTP_STATUS_UNAUTHORIZED,
        error?.message || "invalid token"
      )
    );
  }
};
