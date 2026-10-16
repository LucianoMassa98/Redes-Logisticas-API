import { User } from '../models/index.js';

export class UserRepository {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async findAll() {
    return User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'isActive', 'lastLoginAt', 'createdAt'],
      order: [['fullName', 'ASC']],
    });
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(updateData);
    return user;
  }

  async updateLastLogin(id) {
    return User.update(
      { lastLoginAt: new Date() },
      { where: { id } }
    );
  }
}

export const userRepository = new UserRepository();
