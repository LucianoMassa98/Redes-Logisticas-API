import { Router } from 'express';
import { listQuotes, createQuote, updateQuote } from '../controllers/quote.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { createQuoteSchema, updateQuoteSchema } from '../validators/quote.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth, requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]));

router.get('/quotes', listQuotes);
router.post('/quotes', validateRequest(createQuoteSchema, 'body'), createQuote);
router.patch('/quotes/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updateQuoteSchema, 'body'), updateQuote);

export default router;
