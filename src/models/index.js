import { sequelize } from '../config/database.js';
import { Service } from './Service.js';
import { User } from './User.js';
import { Lead } from './Lead.js';
import { LeadService } from './LeadService.js';
import { LeadNote } from './LeadNote.js';
import { LeadActivity } from './LeadActivity.js';
import { Quote } from './Quote.js';
import { InventoryItem } from './InventoryItem.js';

export const initModels = (seqInstance = sequelize) => {
  if (!seqInstance) {
    return { Service, User, Lead, LeadService, LeadNote, LeadActivity, Quote, InventoryItem, sequelize: null };
  }

  // Inicializar modelos
  Service.initModel(seqInstance);
  User.initModel(seqInstance);
  Lead.initModel(seqInstance);
  LeadService.initModel(seqInstance);
  LeadNote.initModel(seqInstance);
  LeadActivity.initModel(seqInstance);
  Quote.initModel(seqInstance);
  InventoryItem.initModel(seqInstance);

  // Relaciones Lead <-> Service (Muchos a Muchos)
  Lead.belongsToMany(Service, {
    through: LeadService,
    foreignKey: 'lead_id',
    otherKey: 'service_id',
    as: 'services',
  });
  Service.belongsToMany(Lead, {
    through: LeadService,
    foreignKey: 'service_id',
    otherKey: 'lead_id',
    as: 'leads',
  });

  Lead.hasMany(LeadService, { foreignKey: 'lead_id', as: 'leadServices' });
  LeadService.belongsTo(Lead, { foreignKey: 'lead_id' });
  Service.hasMany(LeadService, { foreignKey: 'service_id' });
  LeadService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

  // Relaciones Lead <-> User (Asignación)
  Lead.belongsTo(User, {
    foreignKey: 'assigned_user_id',
    as: 'assignedUser',
  });
  User.hasMany(Lead, {
    foreignKey: 'assigned_user_id',
    as: 'assignedLeads',
  });

  // Relaciones Lead <-> LeadNote
  Lead.hasMany(LeadNote, {
    foreignKey: 'lead_id',
    as: 'notes',
  });
  LeadNote.belongsTo(Lead, {
    foreignKey: 'lead_id',
  });
  LeadNote.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author',
  });
  User.hasMany(LeadNote, {
    foreignKey: 'user_id',
  });

  // Relaciones Lead <-> LeadActivity
  Lead.hasMany(LeadActivity, {
    foreignKey: 'lead_id',
    as: 'activities',
  });
  LeadActivity.belongsTo(Lead, {
    foreignKey: 'lead_id',
  });
  LeadActivity.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
  User.hasMany(LeadActivity, {
    foreignKey: 'user_id',
  });

  // Relaciones Lead <-> Quote
  Lead.hasMany(Quote, {
    foreignKey: 'lead_id',
    as: 'quotes',
  });
  Quote.belongsTo(Lead, {
    foreignKey: 'lead_id',
  });
  Quote.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator',
  });
  User.hasMany(Quote, {
    foreignKey: 'created_by',
  });

  return {
    Service,
    User,
    Lead,
    LeadService,
    LeadNote,
    LeadActivity,
    Quote,
    InventoryItem,
    sequelize: seqInstance,
  };
};

// Inicialización automática si sequelize está disponible
export const models = initModels();
export { Service, User, Lead, LeadService, LeadNote, LeadActivity, Quote, InventoryItem, sequelize };
