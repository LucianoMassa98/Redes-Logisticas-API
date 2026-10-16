import Boom from '@hapi/boom';
import { userRepository } from '../repositories/user.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';

export class AuthService {
  async login(email, password) {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw Boom.unauthorized('Credenciales incorrectas o usuario no registrado.');
    }

    if (!user.isActive) {
      throw Boom.unauthorized('Esta cuenta se encuentra desactivada. Contacte al administrador.');
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw Boom.unauthorized('Credenciales incorrectas o usuario no registrado.');
    }

    await userRepository.updateLastLogin(user.id);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw Boom.unauthorized('Refresh token no proporcionado.');
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.id) {
      throw Boom.unauthorized('Refresh token inválido o expirado.');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      throw Boom.unauthorized('El usuario asociado a la sesión ya no está activo.');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw Boom.unauthorized('Usuario no encontrado o inactivo.');
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

export const authService = new AuthService();
