import jwt from "jsonwebtoken";

import {
  JWT_ACCESS_EXPIRY,
  JWT_ACCESS_KEY,
  JWT_ISSUER,
  JWT_REFRESH_EXPIRY,
  JWT_REFRESH_KEY,
} from "../constants/env-vars";

export type JwtSub = string | Record<string, any>;

export class JwtHelper {
  async generateTokens(sub: JwtSub) {
    return {
      access: await this.generateAccessToken(sub),
      refresh: await this.generateRefreshToken(sub),
    };
  }

  async generateAccessToken(sub: JwtSub) {
    return jwt.sign(sub, JWT_ACCESS_KEY, {
      expiresIn: JWT_ACCESS_EXPIRY,
      issuer: JWT_ISSUER,
    });
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_KEY, {
      issuer: JWT_ISSUER,
    });
  }

  async generateRefreshToken(sub: JwtSub) {
    return jwt.sign(sub, JWT_REFRESH_KEY, {
      expiresIn: JWT_REFRESH_EXPIRY,
      issuer: JWT_ISSUER,
    });
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_KEY, {
      issuer: JWT_ISSUER,
    });
  }
}
