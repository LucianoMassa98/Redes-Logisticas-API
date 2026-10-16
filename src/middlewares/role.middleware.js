import Boom from '@hapi/boom';

export const requireRoles = (roles = []) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return next(Boom.unauthorized('Usuario no autenticado.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(Boom.forbidden('No cuenta con los privilegios suficientes para realizar esta acción.'));
    }

    next();
  };
};
