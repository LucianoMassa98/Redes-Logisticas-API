import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Seguridad de cabeceras HTTP con Helmet
app.use(
  helmet({
    contentSecurityPolicy: config.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

// Configuración de CORS restrictivo
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como apps móviles, Postman o curl) o si está en la lista de permitidos
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origen ${origin} no permitido por las políticas CORS.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging HTTP con Morgan
if (!config.isTest) {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// Parseo de cookies (para refresh token seguro)
app.use(cookieParser());

// Limitador de tamaño y parseo de payloads JSON y urlencoded
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Documentación OpenAPI / Swagger
try {
  const swaggerDoc = JSON.parse(readFileSync(path.join(__dirname, 'docs', 'openapi.json'), 'utf8'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (err) {
  console.warn('[DOCS] No se pudo cargar documentación Swagger:', err.message);
}

// Rate limiting general en rutas de la API
app.use('/api', generalLimiter);

// Rutas de la API v1
app.use('/api/v1', apiRouter);

// Manejador 404 para rutas inexistentes
app.use(notFoundHandler);

// Manejador central de errores
app.use(errorHandler);

export default app;
