import { Quote, User, Lead } from '../models/index.js';

export class QuoteRepository {
  async create(quoteData, transaction) {
    return Quote.create(quoteData, { transaction });
  }

  async findById(id) {
    return Quote.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: Lead, attributes: ['id', 'fullName', 'phone', 'email'] },
      ],
    });
  }

  async findAll({ page = 1, limit = 20, leadId = null }) {
    const where = {};
    if (leadId) where.leadId = leadId;

    const offset = (page - 1) * limit;

    const { count, rows } = await Quote.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: Lead, attributes: ['id', 'fullName', 'phone'] },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      quotes: rows,
    };
  }

  async update(id, updateData, transaction) {
    const quote = await Quote.findByPk(id);
    if (!quote) return null;
    await quote.update(updateData, { transaction });
    return quote;
  }
}

export const quoteRepository = new QuoteRepository();
