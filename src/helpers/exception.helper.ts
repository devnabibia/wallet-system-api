import type { NextFunction, Request, Response } from "express";

import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
} from "../constants/status-codes";
import {
  DatabaseException,
  translateToStatusCode,
} from "../exceptions/database.exception";
import { HttpException } from "../exceptions/http.exception";

export const exceptionFilter = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof DatabaseException) {
    return res
      .status(translateToStatusCode(error.code))
      .json({ message: error.message });
  } else if (error instanceof HttpException) {
    return res.status(error.statusCode).json({ message: error.message });
  } else {
    console.error(error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const exceptionEscalator =
  (controller: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
export function error404Handler() {
  return (_: any, res: Response) => {
    res.status(HTTP_STATUS_NOT_FOUND).json({ message: "not found" });
  };
}
