import rateLimit from 'express-rate-limit';
import Boom from '@hapi/boom';
import { config } from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.isProduction ? config.rateLimit.max : 10000,
  skip: (req) => {
    // En desarrollo o pruebas, no limitar las solicitudes locales
    if (!config.isProduction) return true;
    // Omitir para solicitudes autenticadas de administración
    if (req.headers.authorization && req.path.includes('/admin/')) return true;
    return false;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Demasiadas solicitudes desde esta dirección IP. Por favor intente más tarde.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isProduction ? config.rateLimit.authMax : 100,
  skip: () => !config.isProduction,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Demasiados intentos de autenticación fallidos. Por seguridad, intente en 15 minutos.'));
  },
});

export const leadSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isProduction ? 20 : 500,
  skip: () => !config.isProduction,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Ha enviado varias solicitudes recientemente. Un asesor se comunicará a la brevedad.'));
  },
});
