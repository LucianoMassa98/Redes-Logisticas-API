import { serviceRepository } from '../repositories/service.repository.js';

export class ServiceService {
  async getActiveServices() {
    return serviceRepository.findAllActive();
  }
}

export const serviceService = new ServiceService();
