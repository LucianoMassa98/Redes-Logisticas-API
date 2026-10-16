import { Router } from 'express';
import { createLead } from '../controllers/lead.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createLeadSchema } from '../validators/lead.validator.js';
import { leadSubmissionLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// POST /api/v1/leads - Captación pública de potenciales clientes
router.post(
  '/leads',
  leadSubmissionLimiter,
  validateRequest(createLeadSchema, 'body'),
  createLead
);

export default router;
