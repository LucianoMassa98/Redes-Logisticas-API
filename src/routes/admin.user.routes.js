import { Router } from 'express';
import { listUsers, createUser, updateUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

// Exclusivo para usuarios con rol ADMIN
router.use(requireAuth, requireRoles([USER_ROLES.ADMIN]));

router.get('/users', listUsers);
router.post('/users', validateRequest(createUserSchema, 'body'), createUser);
router.patch('/users/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updateUserSchema, 'body'), updateUser);

export default router;
