import { LeadNote, User } from '../models/index.js';

export class NoteRepository {
  async create(noteData, transaction) {
    return LeadNote.create(noteData, { transaction });
  }

  async findByLeadId(leadId) {
    return LeadNote.findAll({
      where: { leadId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
}

export const noteRepository = new NoteRepository();
