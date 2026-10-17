import Joi from 'joi';

export const createPresetSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'El nombre de la plantilla es obligatorio.',
    'any.required': 'El nombre de la plantilla es obligatorio.',
  }),
  code: Joi.string().trim().uppercase().min(2).max(50).required().messages({
    'string.empty': 'El código identificador es obligatorio.',
    'any.required': 'El código identificador es obligatorio.',
  }),
  description: Joi.string().trim().max(1000).allow(null, '').optional(),
  category: Joi.string().trim().max(50).default('GENERAL'),
  icon: Joi.string().trim().max(50).default('Layers'),
  laborCost: Joi.number().min(0).default(0),
  markupPercent: Joi.number().min(0).allow(null).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        code: Joi.string().trim().optional(),
        quantity: Joi.number().min(0.01).required(),
        notes: Joi.string().trim().max(255).allow(null, '').optional(),
      })
    )
    .default([]),
  isActive: Joi.boolean().default(true),
});

export const updatePresetSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).optional(),
  code: Joi.string().trim().uppercase().min(2).max(50).optional(),
  description: Joi.string().trim().max(1000).allow(null, '').optional(),
  category: Joi.string().trim().max(50).optional(),
  icon: Joi.string().trim().max(50).optional(),
  laborCost: Joi.number().min(0).optional(),
  markupPercent: Joi.number().min(0).allow(null).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        code: Joi.string().trim().optional(),
        quantity: Joi.number().min(0.01).required(),
        notes: Joi.string().trim().max(255).allow(null, '').optional(),
      })
    )
    .optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
