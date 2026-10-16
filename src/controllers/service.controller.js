import { serviceService } from '../services/service.service.js';
import { sendSuccess } from '../utils/response.util.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await serviceService.getActiveServices();
    return sendSuccess(res, services, 'Servicios obtenidos exitosamente');
  } catch (error) {
    next(error);
  }
};
