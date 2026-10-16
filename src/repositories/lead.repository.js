import { Op, fn, col, literal } from 'sequelize';
import { Lead, Service, LeadService, User, LeadNote, LeadActivity, Quote, sequelize } from '../models/index.js';
import { LEAD_STATUSES } from '../utils/constants.js';

export class LeadRepository {
  async createWithServices(leadData, serviceIds, transaction) {
    const lead = await Lead.create(leadData, { transaction });

    if (serviceIds && serviceIds.length > 0) {
      const records = serviceIds.map((serviceId) => ({
        leadId: lead.id,
        serviceId,
      }));
      await LeadService.bulkCreate(records, { transaction });
    }

    return lead;
  }

  async findById(id) {
    return Lead.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['id', 'code', 'name', 'description'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'fullName', 'email', 'role'],
        },
        {
          model: LeadNote,
          as: 'notes',
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'fullName', 'email', 'role'],
            },
          ],
        },
        {
          model: LeadActivity,
          as: 'activities',
          attributes: ['id', 'activityType', 'description', 'metadata', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName', 'email'],
            },
          ],
        },
        {
          model: Quote,
          as: 'quotes',
          attributes: ['id', 'amount', 'currency', 'status', 'description', 'sentAt', 'createdAt'],
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ],
      order: [
        [{ model: LeadNote, as: 'notes' }, 'created_at', 'DESC'],
        [{ model: LeadActivity, as: 'activities' }, 'created_at', 'DESC'],
        [{ model: Quote, as: 'quotes' }, 'created_at', 'DESC'],
      ],
    });
  }

  async findAllPaginated({
    page = 1,
    limit = 10,
    search = '',
    serviceId = null,
    serviceCode = null,
    status = null,
    locality = null,
    customerType = null,
    startDate = null,
    endDate = null,
    assignedUserId = null,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  }) {
    const where = {};

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { fullName: { [Op.iLike || Op.like]: term } },
        { phone: { [Op.iLike || Op.like]: term } },
        { email: { [Op.iLike || Op.like]: term } },
        { locality: { [Op.iLike || Op.like]: term } },
        { address: { [Op.iLike || Op.like]: term } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (locality && locality.trim() !== '') {
      where.locality = { [Op.iLike || Op.like]: `%${locality.trim()}%` };
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        // Fin del día para endDate
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const serviceInclude = {
      model: Service,
      as: 'services',
      attributes: ['id', 'code', 'name'],
      through: { attributes: [] },
    };

    if (serviceId) {
      serviceInclude.where = { id: serviceId };
      serviceInclude.required = true;
    } else if (serviceCode) {
      serviceInclude.where = { code: serviceCode };
      serviceInclude.required = true;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [
        serviceInclude,
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      distinct: true,
      limit,
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      leads: rows,
    };
  }

  async findAllForExport(filters = {}) {
    // Reutiliza los mismos filtros pero sin paginación (límite máximo 5000 por seguridad)
    const result = await this.findAllPaginated({
      ...filters,
      page: 1,
      limit: 5000,
    });
    return result.leads;
  }

  async update(id, updateData, transaction) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    await lead.update(updateData, { transaction });
    return lead;
  }

  async syncServices(leadId, newServiceIds, transaction) {
    await LeadService.destroy({
      where: { leadId },
      transaction,
    });

    if (newServiceIds && newServiceIds.length > 0) {
      const records = newServiceIds.map((serviceId) => ({
        leadId,
        serviceId,
      }));
      await LeadService.bulkCreate(records, { transaction });
    }
  }

  async getMetricsSummary() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalLeads,
      statusCounts,
      last7DaysCount,
      last30DaysCount,
      servicesDistribution,
    ] = await Promise.all([
      Lead.count(),
      Lead.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
      Lead.count({
        where: {
          createdAt: { [Op.gte]: sevenDaysAgo },
        },
      }),
      Lead.count({
        where: {
          createdAt: { [Op.gte]: thirtyDaysAgo },
        },
      }),
      Service.findAll({
        attributes: [
          'id',
          'code',
          'name',
          [fn('COUNT', col('leads.id')), 'leadsCount'],
        ],
        include: [
          {
            model: Lead,
            as: 'leads',
            attributes: [],
            through: { attributes: [] },
          },
        ],
        group: ['Service.id', 'Service.code', 'Service.name'],
        raw: true,
      }),
    ]);

    const statusMap = {};
    Object.values(LEAD_STATUSES).forEach((s) => {
      statusMap[s] = 0;
    });

    statusCounts.forEach((sc) => {
      statusMap[sc.status] = parseInt(sc.count, 10);
    });

    return {
      totalLeads,
      newLeads: statusMap[LEAD_STATUSES.NEW] || 0,
      contactedLeads: statusMap[LEAD_STATUSES.CONTACTED] || 0,
      qualifiedLeads: statusMap[LEAD_STATUSES.QUALIFIED] || 0,
      visitScheduledLeads: statusMap[LEAD_STATUSES.VISIT_SCHEDULED] || 0,
      quoteSentLeads: statusMap[LEAD_STATUSES.QUOTE_SENT] || 0,
      wonLeads: statusMap[LEAD_STATUSES.WON] || 0,
      lostLeads: statusMap[LEAD_STATUSES.LOST] || 0,
      last7DaysLeads: last7DaysCount,
      last30DaysLeads: last30DaysCount,
      serviceDistribution: servicesDistribution.map((sd) => ({
        id: sd.id,
        code: sd.code,
        name: sd.name,
        count: parseInt(sd.leadsCount || 0, 10),
      })),
    };
  }
}

export const leadRepository = new LeadRepository();
