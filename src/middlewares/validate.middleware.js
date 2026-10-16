import Boom from '@hapi/boom';

export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: property === 'body', // Strip unknown only for bodies, leave queries as permitted by schema
    });

    if (error) {
      const errorDetails = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      const boomError = Boom.badRequest('Error de validación en los datos proporcionados');
      boomError.output.payload.errors = errorDetails;
      return next(boomError);
    }

    req[property] = value;
    next();
  };
};
