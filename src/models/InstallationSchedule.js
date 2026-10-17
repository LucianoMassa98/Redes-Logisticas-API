import { DataTypes, Model } from 'sequelize';
import { INSTALLATION_STATUSES, INSTALLATION_PRIORITIES } from '../utils/constants.js';

export class InstallationSchedule extends Model {
  static initModel(sequelize) {
    return InstallationSchedule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        leadId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'lead_id',
        },
        presetId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'preset_id',
        },
        assignedUserId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'assigned_user_id',
        },
        title: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        clientName: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: 'client_name',
        },
        clientPhone: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'client_phone',
        },
        clientEmail: {
          type: DataTypes.STRING(150),
          allowNull: true,
          field: 'client_email',
        },
        clientAddress: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'client_address',
        },
        locality: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        serviceType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'GENERAL',
          field: 'service_type',
        },
        scheduledDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'scheduled_date',
        },
        startTime: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '09:00',
          field: 'start_time',
        },
        endTime: {
          type: DataTypes.STRING(10),
          allowNull: true,
          defaultValue: '11:00',
          field: 'end_time',
        },
        durationMinutes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 120,
          field: 'duration_minutes',
        },
        technicianName: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'technician_name',
        },
        status: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: INSTALLATION_STATUSES.CONFIRMED,
        },
        priority: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: INSTALLATION_PRIORITIES.NORMAL,
        },
        estimatedPrice: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'estimated_price',
        },
        materials: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'completed_at',
        },
      },
      {
        sequelize,
        modelName: 'InstallationSchedule',
        tableName: 'installation_schedules',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
