import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(4000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),
  CORS_ORIGINS: Joi.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'La variable de entorno DATABASE_URL es requerida.',
  }),
  DATABASE_SSL: Joi.boolean().truthy('true', '1').falsy('false', '0').default(false),
  DATABASE_SSL_REJECT_UNAUTHORIZED: Joi.boolean().truthy('true', '1').falsy('false', '0').default(false),
  DATABASE_POOL_MAX: Joi.number().integer().min(1).default(10),
  DATABASE_POOL_MIN: Joi.number().integer().min(0).default(0),
  DATABASE_POOL_ACQUIRE: Joi.number().integer().default(30000),
  DATABASE_POOL_IDLE: Joi.number().integer().default(10000),

  JWT_ACCESS_SECRET: Joi.string().min(16).default('development_jwt_access_secret_super_secure_key_123'),
  JWT_REFRESH_SECRET: Joi.string().min(16).default('development_jwt_refresh_secret_super_secure_key_456'),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

  ADMIN_INITIAL_NAME: Joi.string().default('Administrador'),
  ADMIN_INITIAL_EMAIL: Joi.string().email().default('admin@serviciostecnologicos.com'),
  ADMIN_INITIAL_PASSWORD: Joi.string().min(8).default('Admin123456!'),

  INSTALLATION_MARKUP_PERCENT: Joi.number().min(0).default(100),

  RATE_LIMIT_WINDOW_MS: Joi.number().integer().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().default(1500),
  AUTH_RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().default(50),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  // If in test and DATABASE_URL is not provided, we can fallback to SQLite in-memory or throw warning
  if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'sqlite::memory:';
  } else {
    const errorDetails = error.details.map((d) => d.message).join('; ');
    console.warn(`[CONFIG WARNING] Problemas al cargar variables de entorno: ${errorDetails}`);
  }
}

export const config = {
  env: envVars.NODE_ENV || process.env.NODE_ENV || 'development',
  isProduction: (envVars.NODE_ENV || process.env.NODE_ENV) === 'production',
  isTest: (envVars.NODE_ENV || process.env.NODE_ENV) === 'test',
  port: Number(envVars.PORT || process.env.PORT || 4000),
  frontendUrl: envVars.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins: (envVars.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  database: {
    url: envVars.DATABASE_URL || process.env.DATABASE_URL,
    ssl: envVars.DATABASE_SSL || process.env.DATABASE_SSL === 'true',
    rejectUnauthorized: envVars.DATABASE_SSL_REJECT_UNAUTHORIZED || process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
    pool: {
      max: Number(envVars.DATABASE_POOL_MAX || 10),
      min: Number(envVars.DATABASE_POOL_MIN || 0),
      acquire: Number(envVars.DATABASE_POOL_ACQUIRE || 30000),
      idle: Number(envVars.DATABASE_POOL_IDLE || 10000),
    },
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET || 'development_jwt_access_secret_super_secure_key_123',
    refreshSecret: envVars.JWT_REFRESH_SECRET || 'development_jwt_refresh_secret_super_secure_key_456',
    accessExpiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  adminInitial: {
    name: envVars.ADMIN_INITIAL_NAME || 'Administrador',
    email: envVars.ADMIN_INITIAL_EMAIL || 'admin@serviciostecnologicos.com',
    password: envVars.ADMIN_INITIAL_PASSWORD || 'Admin123456!',
  },
  installationMarkupPercent: Number(envVars.INSTALLATION_MARKUP_PERCENT !== undefined ? envVars.INSTALLATION_MARKUP_PERCENT : 100),
  rateLimit: {
    windowMs: Number(envVars.RATE_LIMIT_WINDOW_MS || 900000),
    max: Number(envVars.RATE_LIMIT_MAX_REQUESTS || 100),
    authMax: Number(envVars.AUTH_RATE_LIMIT_MAX_REQUESTS || 10),
  },
};
