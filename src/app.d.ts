import { Request as ExpressRequest } from "express";

declare global {
  interface Request extends ExpressRequest {
    user: {
      id?: string;
    };
  }
}
