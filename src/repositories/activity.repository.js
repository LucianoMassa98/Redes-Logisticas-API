import { LeadActivity, User } from '../models/index.js';

export class ActivityRepository {
  async create(activityData, transaction) {
    return LeadActivity.create(activityData, { transaction });
  }

  async findByLeadId(leadId) {
    return LeadActivity.findAll({
      where: { leadId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
}

export const activityRepository = new ActivityRepository();
