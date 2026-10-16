import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.get(
  '/dashboard',
  requireAuth,
  requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]),
  getDashboardMetrics
);

export default router;
