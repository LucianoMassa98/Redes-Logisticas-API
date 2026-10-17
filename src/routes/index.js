import { Router } from 'express';
import healthRoutes from './health.routes.js';
import serviceRoutes from './service.routes.js';
import leadRoutes from './lead.routes.js';
import authRoutes from './auth.routes.js';
import adminLeadRoutes from './admin.lead.routes.js';
import adminDashboardRoutes from './admin.dashboard.routes.js';
import adminUserRoutes from './admin.user.routes.js';
import adminQuoteRoutes from './admin.quote.routes.js';
import adminInventoryRoutes from './admin.inventory.routes.js';
import adminPresetRoutes from './admin.preset.routes.js';

const apiRouter = Router();

// Rutas públicas
apiRouter.use(healthRoutes);
apiRouter.use(serviceRoutes);
apiRouter.use(leadRoutes);
apiRouter.use(authRoutes);

// Rutas administrativas (bajo /admin)
apiRouter.use('/admin', adminLeadRoutes);
apiRouter.use('/admin', adminDashboardRoutes);
apiRouter.use('/admin', adminUserRoutes);
apiRouter.use('/admin', adminQuoteRoutes);
apiRouter.use('/admin', adminInventoryRoutes);
apiRouter.use('/admin', adminPresetRoutes);

export default apiRouter;
