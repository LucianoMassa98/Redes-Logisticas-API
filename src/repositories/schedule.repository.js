import { Op } from 'sequelize';
import { InstallationSchedule, Lead, InstallationPreset, User } from '../models/index.js';
import { INSTALLATION_STATUSES } from '../utils/constants.js';

export class ScheduleRepository {
  async findAll({
    startDate = null,
    endDate = null,
    status = null,
    technician = null,
    serviceType = null,
    search = null,
    leadId = null,
  } = {}) {
    const where = {};

    if (startDate && endDate) {
      where.scheduledDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.scheduledDate = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      where.scheduledDate = {
        [Op.lte]: endDate,
      };
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (serviceType && serviceType !== 'ALL') {
      where.serviceType = serviceType;
    }

    if (technician && technician !== 'ALL') {
      where.technicianName = technician;
    }

    if (leadId) {
      where.leadId = leadId;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { clientName: { [Op.iLike]: `%${search}%` } },
        { clientPhone: { [Op.iLike]: `%${search}%` } },
        { clientAddress: { [Op.iLike]: `%${search}%` } },
        { locality: { [Op.iLike]: `%${search}%` } },
        { technicianName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    return InstallationSchedule.findAll({
      where,
      include: [
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'fullName', 'phone', 'email', 'status', 'address', 'locality', 'customerType'],
          required: false,
        },
        {
          model: InstallationPreset,
          as: 'preset',
          attributes: ['id', 'name', 'code', 'category', 'icon'],
          required: false,
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'fullName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['scheduled_date', 'ASC'],
        ['start_time', 'ASC'],
      ],
    });
  }

  async findById(id) {
    return InstallationSchedule.findByPk(id, {
      include: [
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'fullName', 'phone', 'email', 'status', 'address', 'locality', 'customerType'],
          required: false,
        },
        {
          model: InstallationPreset,
          as: 'preset',
          attributes: ['id', 'name', 'code', 'category', 'icon', 'laborCost'],
          required: false,
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'fullName', 'email', 'role'],
          required: false,
        },
      ],
    });
  }

  async create(data) {
    return InstallationSchedule.create(data);
  }

  async update(id, updateData) {
    const [rowsUpdated] = await InstallationSchedule.update(updateData, {
      where: { id },
    });
    return rowsUpdated > 0;
  }

  async delete(id) {
    const rowsDeleted = await InstallationSchedule.destroy({
      where: { id },
    });
    return rowsDeleted > 0;
  }

  async getMetrics({ startDate = null, endDate = null } = {}) {
    const where = {};
    if (startDate && endDate) {
      where.scheduledDate = { [Op.between]: [startDate, endDate] };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const [all, confirmed, pending, inProgress, completed, cancelled, upcoming] = await Promise.all([
      InstallationSchedule.count({ where }),
      InstallationSchedule.count({ where: { ...where, status: INSTALLATION_STATUSES.CONFIRMED } }),
      InstallationSchedule.count({ where: { ...where, status: INSTALLATION_STATUSES.PENDING } }),
      InstallationSchedule.count({ where: { ...where, status: INSTALLATION_STATUSES.IN_PROGRESS } }),
      InstallationSchedule.count({ where: { ...where, status: INSTALLATION_STATUSES.COMPLETED } }),
      InstallationSchedule.count({ where: { ...where, status: INSTALLATION_STATUSES.CANCELLED } }),
      InstallationSchedule.count({
        where: {
          scheduledDate: { [Op.gte]: todayStr },
          status: {
            [Op.notIn]: [INSTALLATION_STATUSES.COMPLETED, INSTALLATION_STATUSES.CANCELLED],
          },
        },
      }),
    ]);

    // Obtener técnicos únicos asignados
    const technicians = await InstallationSchedule.findAll({
      attributes: ['technicianName'],
      where: {
        technicianName: {
          [Op.ne]: null,
        },
      },
      group: ['technicianName'],
      raw: true,
    });

    return {
      total: all,
      confirmed,
      pending,
      inProgress,
      completed,
      cancelled,
      upcoming,
      technicians: technicians.map((t) => t.technicianName).filter(Boolean),
    };
  }
}
