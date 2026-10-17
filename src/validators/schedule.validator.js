import Joi from 'joi';
import { INSTALLATION_STATUSES, INSTALLATION_PRIORITIES } from '../utils/constants.js';

const validStatuses = Object.values(INSTALLATION_STATUSES);
const validPriorities = Object.values(INSTALLATION_PRIORITIES);

export const createScheduleSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'El título o resumen de la instalación es obligatorio.',
    'any.required': 'El título o resumen de la instalación es obligatorio.',
  }),
  clientName: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'El nombre del cliente es obligatorio.',
    'any.required': 'El nombre del cliente es obligatorio.',
  }),
  clientPhone: Joi.string().trim().min(6).max(50).required().messages({
    'string.empty': 'El teléfono o WhatsApp de contacto es obligatorio.',
    'any.required': 'El teléfono o WhatsApp de contacto es obligatorio.',
  }),
  clientEmail: Joi.string().email().trim().max(150).allow(null, '').optional(),
  clientAddress: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'La dirección o ubicación de instalación es obligatoria.',
    'any.required': 'La dirección o ubicación de instalación es obligatoria.',
  }),
  locality: Joi.string().trim().max(100).allow(null, '').optional(),
  serviceType: Joi.string().trim().max(50).default('GENERAL'),
  scheduledDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'La fecha programada debe tener el formato YYYY-MM-DD.',
      'any.required': 'La fecha programada es obligatoria.',
    }),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .default('09:00')
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener el formato HH:mm (24 horas).',
    }),
  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .allow(null, '')
    .optional(),
  durationMinutes: Joi.number().integer().min(15).max(1440).default(120),
  technicianName: Joi.string().trim().max(100).allow(null, '').optional(),
  assignedUserId: Joi.string().uuid().allow(null, '').optional(),
  leadId: Joi.string().uuid().allow(null, '').optional(),
  presetId: Joi.string().uuid().allow(null, '').optional(),
  status: Joi.string()
    .valid(...validStatuses)
    .default(INSTALLATION_STATUSES.CONFIRMED),
  priority: Joi.string()
    .valid(...validPriorities)
    .default(INSTALLATION_PRIORITIES.NORMAL),
  estimatedPrice: Joi.number().min(0).default(0),
  materials: Joi.array().default([]),
  notes: Joi.string().trim().max(2000).allow(null, '').optional(),
});

export const updateScheduleSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  clientName: Joi.string().trim().min(2).max(150).optional(),
  clientPhone: Joi.string().trim().min(6).max(50).optional(),
  clientEmail: Joi.string().email().trim().max(150).allow(null, '').optional(),
  clientAddress: Joi.string().trim().min(3).max(255).optional(),
  locality: Joi.string().trim().max(100).allow(null, '').optional(),
  serviceType: Joi.string().trim().max(50).optional(),
  scheduledDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, '').optional(),
  durationMinutes: Joi.number().integer().min(15).max(1440).optional(),
  technicianName: Joi.string().trim().max(100).allow(null, '').optional(),
  assignedUserId: Joi.string().uuid().allow(null, '').optional(),
  leadId: Joi.string().uuid().allow(null, '').optional(),
  presetId: Joi.string().uuid().allow(null, '').optional(),
  status: Joi.string().valid(...validStatuses).optional(),
  priority: Joi.string().valid(...validPriorities).optional(),
  estimatedPrice: Joi.number().min(0).optional(),
  materials: Joi.array().optional(),
  notes: Joi.string().trim().max(2000).allow(null, '').optional(),
}).min(1);

export const updateScheduleStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...validStatuses)
    .required()
    .messages({
      'any.required': 'El estado de la instalación es obligatorio.',
    }),
  notes: Joi.string().trim().max(1000).allow(null, '').optional(),
});

export const queryScheduleSchema = Joi.object({
  startDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: Joi.string().optional(),
  serviceType: Joi.string().optional(),
  technician: Joi.string().optional(),
  search: Joi.string().trim().max(100).optional(),
  leadId: Joi.string().uuid().optional(),
});
