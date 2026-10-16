import Boom from '@hapi/boom';
import { userRepository } from '../repositories/user.repository.js';
import { User } from '../models/index.js';

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async createUser({ fullName, email, password, role }) {
    const existing = await userRepository.findByEmail(email.toLowerCase().trim());
    if (existing) {
      throw Boom.conflict('Ya existe un usuario con este correo electrónico.');
    }

    const passwordHash = await User.hashPassword(password);
    const user = await userRepository.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isActive: true,
    });

    return user;
  }

  async updateUser(id, updateData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw Boom.notFound('El usuario no existe.');
    }

    const payload = { ...updateData };

    if (payload.email) {
      const existing = await userRepository.findByEmail(payload.email.toLowerCase().trim());
      if (existing && existing.id !== id) {
        throw Boom.conflict('El correo electrónico ya se encuentra registrado por otro usuario.');
      }
      payload.email = payload.email.toLowerCase().trim();
    }

    if (payload.password) {
      payload.passwordHash = await User.hashPassword(payload.password);
      delete payload.password;
    }

    await userRepository.update(id, payload);
    return userRepository.findById(id);
  }
}

export const userService = new UserService();
