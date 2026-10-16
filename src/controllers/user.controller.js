import { userService } from '../services/user.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const listUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return sendSuccess(res, users, 'Usuarios obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return sendCreated(res, user, 'Usuario administrativo creado exitosamente');
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, updated, 'Usuario actualizado correctamente');
  } catch (error) {
    next(error);
  }
};
