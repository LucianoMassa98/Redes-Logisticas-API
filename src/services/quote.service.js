import Boom from '@hapi/boom';
import { sequelize } from '../config/database.js';
import { quoteRepository } from '../repositories/quote.repository.js';
import { leadRepository } from '../repositories/lead.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { LEAD_STATUSES, QUOTE_STATUSES, ACTIVITY_TYPES } from '../utils/constants.js';

export class QuoteService {
  async createQuote(quoteData, user) {
    const lead = await leadRepository.findById(quoteData.leadId);
    if (!lead) {
      throw Boom.notFound('El lead asociado no existe.');
    }

    const t = await sequelize.transaction();

    try {
      const quote = await quoteRepository.create(
        {
          ...quoteData,
          createdBy: user.id,
        },
        t
      );

      // Si el presupuesto se crea en estado SENT, actualizar lead a QUOTE_SENT
      if (quoteData.status === QUOTE_STATUSES.SENT) {
        await leadRepository.update(lead.id, { status: LEAD_STATUSES.QUOTE_SENT }, t);
        await activityRepository.create(
          {
            leadId: lead.id,
            userId: user.id,
            activityType: ACTIVITY_TYPES.QUOTE_SENT,
            description: `Presupuesto por $${quote.amount || 0} ${quote.currency} enviado por ${user.fullName}.`,
            metadata: { quoteId: quote.id, amount: quote.amount },
          },
          t
        );
      } else {
        await activityRepository.create(
          {
            leadId: lead.id,
            userId: user.id,
            activityType: ACTIVITY_TYPES.QUOTE_CREATED,
            description: `Presupuesto preliminar registrado por ${user.fullName}.`,
            metadata: { quoteId: quote.id, amount: quote.amount },
          },
          t
        );
      }

      await t.commit();
      return quoteRepository.findById(quote.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async listQuotes(query) {
    return quoteRepository.findAll(query);
  }

  async updateQuote(id, updateData, user) {
    const quote = await quoteRepository.findById(id);
    if (!quote) {
      throw Boom.notFound('El presupuesto no existe.');
    }

    const t = await sequelize.transaction();

    try {
      await quoteRepository.update(id, updateData, t);

      if (updateData.status === QUOTE_STATUSES.SENT && quote.status !== QUOTE_STATUSES.SENT) {
        await leadRepository.update(quote.leadId, { status: LEAD_STATUSES.QUOTE_SENT }, t);
        await activityRepository.create(
          {
            leadId: quote.leadId,
            userId: user.id,
            activityType: ACTIVITY_TYPES.QUOTE_SENT,
            description: `Presupuesto actualizado y enviado al cliente por ${user.fullName}.`,
            metadata: { quoteId: quote.id },
          },
          t
        );
      }

      await t.commit();
      return quoteRepository.findById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export const quoteService = new QuoteService();
