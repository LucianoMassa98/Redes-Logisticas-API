import Boom from '@hapi/boom';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { User } from '../models/index.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(Boom.unauthorized('Token de autorización no proporcionado o formato inválido.'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return next(Boom.unauthorized('Token de acceso inválido o expirado.'));
    }

    // Verificar si el usuario aún existe y está activo
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return next(Boom.unauthorized('El usuario no existe o se encuentra inactivo.'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
