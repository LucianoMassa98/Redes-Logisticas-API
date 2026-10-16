import Joi from 'joi';

export const createInventoryItemSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50).required().messages({
    'string.empty': 'El código o SKU es obligatorio.',
    'any.required': 'El código o SKU es obligatorio.',
  }),
  name: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'El nombre del artículo o material es obligatorio.',
    'any.required': 'El nombre es obligatorio.',
  }),
  category: Joi.string().trim().max(50).default('MATERIALES'),
  costPrice: Joi.number().min(0).required().messages({
    'number.min': 'El precio de costo no puede ser negativo.',
    'any.required': 'El precio de costo es obligatorio.',
  }),
  stockQuantity: Joi.number().integer().min(0).default(0),
  minStockAlert: Joi.number().integer().min(0).default(5),
  unit: Joi.string().trim().max(20).default('UNIDAD'),
  markupPercent: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().trim().max(1000).allow(null, '').optional(),
  isActive: Joi.boolean().default(true),
});

export const updateInventoryItemSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50).optional(),
  name: Joi.string().trim().min(2).max(150).optional(),
  category: Joi.string().trim().max(50).optional(),
  costPrice: Joi.number().min(0).optional(),
  stockQuantity: Joi.number().integer().min(0).optional(),
  minStockAlert: Joi.number().integer().min(0).optional(),
  unit: Joi.string().trim().max(20).optional(),
  markupPercent: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().trim().max(1000).allow(null, '').optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const adjustStockSchema = Joi.object({
  quantity: Joi.number().integer().required().messages({
    'any.required': 'La cantidad es requerida.',
  }),
  type: Joi.string().valid('ADD', 'SUBTRACT', 'SET').default('ADD'),
  reason: Joi.string().trim().max(255).allow(null, '').optional(),
});

export const calculatePriceSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().min(0.01).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Debe incluir al menos un artículo para el cálculo.',
      'any.required': 'La lista de artículos es obligatoria.',
    }),
  laborCost: Joi.number().min(0).default(0),
  customMarkupPercent: Joi.number().min(0).allow(null).optional(),
});
