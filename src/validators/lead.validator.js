import Joi from 'joi';
import { LEAD_STATUSES, CUSTOMER_TYPES, PREFERRED_CONTACT_METHODS, ACTIVITY_TYPES } from '../utils/constants.js';

export const createLeadSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).required().messages({
    'string.empty': 'El nombre y apellido son obligatorios.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'any.required': 'El nombre y apellido son obligatorios.',
  }),
  phone: Joi.string().trim().min(6).max(30).required().messages({
    'string.empty': 'El teléfono de contacto es obligatorio.',
    'any.required': 'El teléfono de contacto es obligatorio.',
  }),
  email: Joi.string().email().allow(null, '').optional().messages({
    'string.email': 'El formato de correo electrónico no es válido.',
  }),
  address: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'La dirección del servicio es obligatoria.',
    'any.required': 'La dirección del servicio es obligatoria.',
  }),
  locality: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'La localidad es obligatoria.',
    'any.required': 'La localidad es obligatoria.',
  }),
  province: Joi.string().trim().max(100).allow(null, '').default('Argentina'),
  customerType: Joi.string()
    .valid(...Object.values(CUSTOMER_TYPES))
    .required()
    .messages({
      'any.only': 'El tipo de cliente seleccionado no es válido.',
      'any.required': 'Debe seleccionar un tipo de cliente.',
    }),
  services: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.min': 'Debe seleccionar al menos un servicio de interés.',
      'any.required': 'Los servicios de interés son obligatorios.',
    }),
  latitude: Joi.number().min(-90).max(90).allow(null).optional(),
  longitude: Joi.number().min(-180).max(180).allow(null).optional(),
  locationReference: Joi.string().trim().max(500).allow(null, '').optional(),
  description: Joi.string().trim().max(2000).allow(null, '').optional(),
  preferredContactMethod: Joi.string()
    .valid(...Object.values(PREFERRED_CONTACT_METHODS))
    .default(PREFERRED_CONTACT_METHODS.WHATSAPP),
  privacyAccepted: Joi.boolean().valid(true).required().messages({
    'any.only': 'Debe aceptar la política de privacidad para enviar la solicitud.',
    'any.required': 'La aceptación de la política de privacidad es obligatoria.',
  }),
})
  // Rechazar campos no permitidos que un atacante pudiera enviar para autoasignarse estado o roles
  .unknown(false);

export const updateLeadSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).optional(),
  phone: Joi.string().trim().min(6).max(30).optional(),
  email: Joi.string().email().allow(null, '').optional(),
  address: Joi.string().trim().min(3).max(255).optional(),
  locality: Joi.string().trim().min(2).max(100).optional(),
  province: Joi.string().trim().max(100).allow(null, '').optional(),
  customerType: Joi.string().valid(...Object.values(CUSTOMER_TYPES)).optional(),
  latitude: Joi.number().min(-90).max(90).allow(null).optional(),
  longitude: Joi.number().min(-180).max(180).allow(null).optional(),
  locationReference: Joi.string().trim().max(500).allow(null, '').optional(),
  description: Joi.string().trim().max(2000).allow(null, '').optional(),
  preferredContactMethod: Joi.string().valid(...Object.values(PREFERRED_CONTACT_METHODS)).optional(),
  services: Joi.array().items(Joi.string()).min(1).optional(),
}).min(1);

export const updateLeadStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(LEAD_STATUSES))
    .required()
    .messages({
      'any.only': 'El estado comercial no es válido.',
      'any.required': 'El nuevo estado comercial es obligatorio.',
    }),
  note: Joi.string().trim().max(1000).allow(null, '').optional(),
});

export const updateLeadAssignmentSchema = Joi.object({
  assignedUserId: Joi.string().uuid().allow(null).required().messages({
    'any.required': 'El campo assignedUserId es obligatorio (puede ser null para desasignar).',
  }),
});

export const listLeadsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(null, '').optional(),
  serviceId: Joi.string().trim().allow(null, '').optional(),
  serviceCode: Joi.string().trim().allow(null, '').optional(),
  status: Joi.string().valid(...Object.values(LEAD_STATUSES), '').allow(null).optional(),
  locality: Joi.string().trim().allow(null, '').optional(),
  customerType: Joi.string().valid(...Object.values(CUSTOMER_TYPES), '').allow(null).optional(),
  startDate: Joi.date().iso().allow(null).optional(),
  endDate: Joi.date().iso().allow(null).optional(),
  assignedUserId: Joi.string().uuid().allow(null, '').optional(),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'full_name', 'status', 'last_contact_at').default('created_at'),
  sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
});

export const createNoteSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'El contenido de la nota no puede estar vacío.',
    'any.required': 'El contenido de la nota es obligatorio.',
  }),
});

export const createActivitySchema = Joi.object({
  activityType: Joi.string().valid(...Object.values(ACTIVITY_TYPES)).required().messages({
    'any.only': 'Tipo de actividad no válido.',
    'any.required': 'El tipo de actividad es obligatorio.',
  }),
  description: Joi.string().trim().min(3).max(1000).required().messages({
    'string.empty': 'La descripción de la actividad es obligatoria.',
    'any.required': 'La descripción de la actividad es obligatoria.',
  }),
  metadata: Joi.object().allow(null).optional(),
});
