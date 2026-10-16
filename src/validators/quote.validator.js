import Joi from 'joi';
import { QUOTE_STATUSES } from '../utils/constants.js';

export const createQuoteSchema = Joi.object({
  leadId: Joi.string().uuid().required().messages({
    'string.guid': 'El ID del lead debe ser un UUID válido.',
    'any.required': 'El ID del lead es obligatorio.',
  }),
  amount: Joi.number().min(0).allow(null).optional(),
  currency: Joi.string().length(3).uppercase().default('ARS'),
  status: Joi.string().valid(...Object.values(QUOTE_STATUSES)).default(QUOTE_STATUSES.DRAFT),
  description: Joi.string().trim().max(2000).allow(null, '').optional(),
  sentAt: Joi.date().iso().allow(null).optional(),
});

export const updateQuoteSchema = Joi.object({
  amount: Joi.number().min(0).allow(null).optional(),
  currency: Joi.string().length(3).uppercase().optional(),
  status: Joi.string().valid(...Object.values(QUOTE_STATUSES)).optional(),
  description: Joi.string().trim().max(2000).allow(null, '').optional(),
  sentAt: Joi.date().iso().allow(null).optional(),
}).min(1);
