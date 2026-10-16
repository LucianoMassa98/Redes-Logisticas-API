import Joi from 'joi';
import { USER_ROLES } from '../utils/constants.js';

export const createUserSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'El nombre completo es obligatorio.',
    'any.required': 'El nombre completo es obligatorio.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Ingrese un correo electrónico válido.',
    'any.required': 'El correo electrónico es obligatorio.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'any.required': 'La contraseña es obligatoria.',
  }),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.COMMERCIAL),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).allow(null, '').optional(),
  role: Joi.string().valid(...Object.values(USER_ROLES)).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
