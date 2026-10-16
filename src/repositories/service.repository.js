import { Op } from 'sequelize';
import { Service } from '../models/index.js';

export class ServiceRepository {
  async findAllActive() {
    return Service.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });
  }

  async findByIdOrCode(identifier) {
    return Service.findOne({
      where: {
        [Op.or]: [{ id: identifier }, { code: identifier }],
      },
    });
  }

  async resolveServices(identifiers = []) {
    if (!identifiers || identifiers.length === 0) return [];

    return Service.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.in]: identifiers } },
          { code: { [Op.in]: identifiers } },
        ],
      },
    });
  }
}

export const serviceRepository = new ServiceRepository();
