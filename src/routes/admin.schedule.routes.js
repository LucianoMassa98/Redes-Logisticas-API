import { Router } from 'express';
import {
  listSchedules,
  getCalendarStats,
  getScheduleById,
  createSchedule,
  updateSchedule,
  updateScheduleStatus,
  deleteSchedule,
} from '../controllers/schedule.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import {
  createScheduleSchema,
  updateScheduleSchema,
  updateScheduleStatusSchema,
  queryScheduleSchema,
} from '../validators/schedule.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

// Todas las rutas de agenda requieren autenticación (ADMIN o COMMERCIAL)
router.use(requireAuth, requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]));

router.get('/schedules', validateRequest(queryScheduleSchema, 'query'), listSchedules);
router.get('/schedules/stats', getCalendarStats);
router.get('/schedules/:id', validateRequest(uuidParamSchema, 'params'), getScheduleById);
router.post('/schedules', validateRequest(createScheduleSchema, 'body'), createSchedule);
router.put('/schedules/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updateScheduleSchema, 'body'), updateSchedule);
router.patch('/schedules/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updateScheduleSchema, 'body'), updateSchedule);
router.patch('/schedules/:id/status', validateRequest(uuidParamSchema, 'params'), validateRequest(updateScheduleStatusSchema, 'body'), updateScheduleStatus);
router.delete('/schedules/:id', validateRequest(uuidParamSchema, 'params'), deleteSchedule);

export default router;
