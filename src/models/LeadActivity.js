import { DataTypes, Model } from 'sequelize';

export class LeadActivity extends Model {
  static initModel(sequelize) {
    return LeadActivity.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        leadId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'lead_id',
          references: {
            model: 'leads',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        activityType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'activity_type',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'LeadActivity',
        tableName: 'lead_activities',
        underscored: true,
        timestamps: true,
        updatedAt: false,
      }
    );
  }
}
