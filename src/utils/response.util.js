/**
 * Formateadores estándar de respuestas HTTP para la API REST
 */

export const sendSuccess = (res, data = null, message = 'Operación realizada con éxito', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = (res, data = null, message = 'Recurso creado exitosamente') => {
  return sendSuccess(res, data, message, 201);
};

export const sendError = (res, message = 'Ocurrió un error inesperado', errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};
