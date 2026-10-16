import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { config } from '../config/env.js';

const COOKIE_NAME = 'jid_refresh';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/api/v1/auth',
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());

    return sendSuccess(
      res,
      {
        user,
        accessToken,
      },
      'Inicio de sesión exitoso'
    );
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME] || req.body?.refreshToken;
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);

    res.cookie(COOKIE_NAME, newRefreshToken, getCookieOptions());

    return sendSuccess(
      res,
      {
        user,
        accessToken,
      },
      'Sesión renovada exitosamente'
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      path: '/api/v1/auth',
    });

    return sendSuccess(res, null, 'Sesión cerrada correctamente');
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    return sendSuccess(res, profile, 'Perfil de usuario obtenido');
  } catch (error) {
    next(error);
  }
};
