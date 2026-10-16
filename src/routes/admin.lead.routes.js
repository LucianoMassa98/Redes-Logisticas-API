import { Router } from 'express';
import {
  listLeads,
  getLead,
  updateLead,
  updateStatus,
  updateAssignment,
  addNote,
  getNotes,
  addActivity,
  getActivities,
  exportLeads,
} from '../controllers/lead.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import {
  listLeadsQuerySchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  updateLeadAssignmentSchema,
  createNoteSchema,
  createActivitySchema,
} from '../validators/lead.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN o COMMERCIAL
router.use(requireAuth, requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]));

// Listado paginado y filtros
router.get('/leads', validateRequest(listLeadsQuerySchema, 'query'), listLeads);

// Exportación CSV
router.get('/leads/export', validateRequest(listLeadsQuerySchema, 'query'), exportLeads);

// Detalle del lead
router.get('/leads/:id', validateRequest(uuidParamSchema, 'params'), getLead);

// Actualización general
router.patch(
  '/leads/:id',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(updateLeadSchema, 'body'),
  updateLead
);

// Cambio de estado comercial
router.patch(
  '/leads/:id/status',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(updateLeadStatusSchema, 'body'),
  updateStatus
);

// Asignación de responsable
router.patch(
  '/leads/:id/assignment',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(updateLeadAssignmentSchema, 'body'),
  updateAssignment
);

// Notas internas
router.post(
  '/leads/:id/notes',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(createNoteSchema, 'body'),
  addNote
);
router.get('/leads/:id/notes', validateRequest(uuidParamSchema, 'params'), getNotes);

// Historial y registro de actividades
router.post(
  '/leads/:id/activities',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(createActivitySchema, 'body'),
  addActivity
);
router.get('/leads/:id/activities', validateRequest(uuidParamSchema, 'params'), getActivities);

export default router;
