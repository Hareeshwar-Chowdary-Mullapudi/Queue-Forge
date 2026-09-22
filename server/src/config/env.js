import dotenv from 'dotenv';
import { AppError } from '../../../shared/index.js';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new AppError(`Missing required environment variable: ${name}`, 500);
  }
  return value;
}

/**
 * Validated server config. DATABASE_URL / JWT are required once those phases start;
 * for Project Setup we keep them optional with safe defaults for local boot.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  isDev: (process.env.NODE_ENV || 'development') !== 'production',
};

/** Call before using DB or auth features. */
export function assertDatabaseConfigured() {
  requireEnv('DATABASE_URL');
}

/** Call before issuing/verifying JWTs. */
export function assertAuthConfigured() {
  requireEnv('JWT_SECRET');
}
