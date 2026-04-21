export const DB_URI = "mongodb://127.0.0.1:27017/social-media";
export const PORT = process.env.PORT;
export const REDIS_URL = process.env.REDIS_URL;

//SymmetricService
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
export const IV_LENGTH = process.env.IV_LENGTH;

//====user===================================
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
//=========admin================================
export const ADMIN_ACCESS_TOKEN_SECRET_KEY =
  process.env.ADMIN_ACCESS_TOKEN_SECRET;
export const ADMIN_REFRESH_TOKEN_SECRET_KEY =
  process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY;

export const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
//=========SMTP / GMAIL=================
export const SMTP_PASSWORD_KEY = process.env.SMTP_PASSWORD_KEY;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
