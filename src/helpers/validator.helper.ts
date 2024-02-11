import { ValidationError, validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS_BAD_REQUEST } from "../constants/status-codes";

interface IValidatorOptions {
  dto: object;
}

function formatValidatorError(errors: ValidationError[]) {
  return errors.map((error) => {
    return (
      error.property &&
      error.constraints && {
        [error.property]: Object.values(error.constraints),
      }
    );
  });
}

export const validator = (options: IValidatorOptions) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, any>;
      const dto = options.dto as Record<string, any>;

      Object.keys(body).forEach((key) => {
        dto[key] = body[key];
      });

      await validateOrReject(dto, {
        validationError: { target: false },
        forbidUnknownValues: true,
        // whitelist: true,
      });
    } catch (error) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .json(formatValidatorError(error as ValidationError[]));
    }

    next();
  };
};
