import { Router } from 'express';
import { login, refresh, logout, me } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/auth/login', authLimiter, validateRequest(loginSchema, 'body'), login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, me);

export default router;
