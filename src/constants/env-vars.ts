export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY as string;
export const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY as string;
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY as string;
export const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY as string;
export const JWT_ISSUER = process.env.JWT_ISSUER as string;
