import rateLimit from 'express-rate-limit';
import Boom from '@hapi/boom';
import { config } from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Demasiadas solicitudes desde esta dirección IP. Por favor intente más tarde.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Demasiados intentos de autenticación fallidos. Por seguridad, intente en 15 minutos.'));
  },
});

export const leadSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 envíos por cada 15 minutos por IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(Boom.tooManyRequests('Ha enviado varias solicitudes recientemente. Un asesor se comunicará a la brevedad.'));
  },
});
