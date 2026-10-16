import { dashboardService } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.util.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const metrics = await dashboardService.getDashboardMetrics();
    return sendSuccess(res, metrics, 'Métricas de dashboard calculadas exitosamente');
  } catch (error) {
    next(error);
  }
};
