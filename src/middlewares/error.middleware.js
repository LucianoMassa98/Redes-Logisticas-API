import Boom from '@hapi/boom';
import { config } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  next(Boom.notFound(`La ruta ${req.method} ${req.originalUrl} no fue encontrada en este servidor.`));
};

export const errorHandler = (err, req, res, next) => {
  let boomError = err;

  // Si no es un error de Boom, normalizarlo
  if (!Boom.isBoom(err)) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors?.[0]?.path || 'campo';
      boomError = Boom.conflict(`Ya existe un registro con ese valor para: ${field}`);
      boomError.output.payload.errors = err.errors?.map((e) => ({
        field: e.path,
        message: e.message,
      }));
    } else if (err.name === 'SequelizeValidationError') {
      boomError = Boom.badData('Error de validación en la base de datos');
      boomError.output.payload.errors = err.errors?.map((e) => ({
        field: e.path,
        message: e.message,
      }));
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
      boomError = Boom.badRequest('Referencia a una entidad inexistente o relación inválida.');
    } else if (err.name === 'JsonWebTokenError') {
      boomError = Boom.unauthorized('Token de autenticación inválido.');
    } else if (err.name === 'TokenExpiredError') {
      boomError = Boom.unauthorized('La sesión o token ha expirado. Por favor ingrese nuevamente.');
    } else {
      // Error genérico no controlado
      console.error('[UNHANDLED ERROR]', err);
      boomError = Boom.badImplementation('Ocurrió un error interno en el servidor.');
    }
  }

  const { output } = boomError;
  const statusCode = output.statusCode || 500;
  const message = output.payload.message || 'Error en la solicitud';
  const errors = output.payload.errors || [];

  // En producción jamás enviar stack traces ni detalles técnicos
  const response = {
    success: false,
    message,
    errors,
  };

  if (!config.isProduction && statusCode === 500 && err.stack) {
    response.debug = {
      name: err.name,
      stack: err.stack,
    };
  }

  return res.status(statusCode).json(response);
};
