import { leadRepository } from '../repositories/lead.repository.js';

export class DashboardService {
  async getDashboardMetrics() {
    return leadRepository.getMetricsSummary();
  }
}

export const dashboardService = new DashboardService();
