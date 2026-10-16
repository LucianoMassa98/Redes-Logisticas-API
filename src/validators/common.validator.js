import Joi from 'joi';

export const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'El identificador proporcionado debe ser un UUID válido.',
    'any.required': 'El parámetro id es obligatorio.',
  }),
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'full_name', 'status', 'last_contact_at').default('created_at'),
  sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
}).unknown(true);
