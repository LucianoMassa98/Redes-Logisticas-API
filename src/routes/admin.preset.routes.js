import { Router } from 'express';
import {
  listPresets,
  getPresetById,
  createPreset,
  updatePreset,
  deletePreset,
} from '../controllers/preset.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { createPresetSchema, updatePresetSchema } from '../validators/preset.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

// Todas las rutas requieren rol ADMIN o COMMERCIAL
router.use(requireAuth, requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]));

router.get('/presets', listPresets);
router.get('/presets/:id', validateRequest(uuidParamSchema, 'params'), getPresetById);
router.post('/presets', validateRequest(createPresetSchema, 'body'), createPreset);
router.patch('/presets/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updatePresetSchema, 'body'), updatePreset);
router.delete('/presets/:id', validateRequest(uuidParamSchema, 'params'), deletePreset);

export default router;
