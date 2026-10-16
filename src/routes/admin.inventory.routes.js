import { Router } from 'express';
import {
  getInventory,
  getItemById,
  createItem,
  updateItem,
  adjustStock,
  calculateQuotePrice,
  getConfig,
} from '../controllers/inventory.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  adjustStockSchema,
  calculatePriceSchema,
} from '../validators/inventory.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

// Todas las rutas requieren autenticación administrativa
router.use(requireAuth, requireRoles([USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL]));

// Configuración y variables del sistema (Margen .env)
router.get('/inventory/config', getConfig);

// Calculador automático de precio de instalaciones
router.post('/inventory/calculate', validateRequest(calculatePriceSchema, 'body'), calculateQuotePrice);

// Listado de inventario con filtros de búsqueda y categoría
router.get('/inventory', getInventory);

// Detalle de un artículo
router.get('/inventory/:id', validateRequest(uuidParamSchema, 'params'), getItemById);

// Creación de artículos (Admin y Comercial)
router.post('/inventory', validateRequest(createInventoryItemSchema, 'body'), createItem);

// Edición de artículos
router.patch('/inventory/:id', validateRequest(uuidParamSchema, 'params'), validateRequest(updateInventoryItemSchema, 'body'), updateItem);

// Ajuste rápido de stock (+ / - / set)
router.patch('/inventory/:id/stock', validateRequest(uuidParamSchema, 'params'), validateRequest(adjustStockSchema, 'body'), adjustStock);

export default router;
