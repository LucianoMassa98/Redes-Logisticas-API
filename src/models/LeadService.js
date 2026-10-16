import { DataTypes, Model } from 'sequelize';

export class LeadService extends Model {
  static initModel(sequelize) {
    return LeadService.init(
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
        serviceId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'service_id',
          references: {
            model: 'services',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
      },
      {
        sequelize,
        modelName: 'LeadService',
        tableName: 'lead_services',
        underscored: true,
        timestamps: true,
        updatedAt: false,
        indexes: [
          {
            unique: true,
            fields: ['lead_id', 'service_id'],
            name: 'lead_service_unique_composite',
          },
        ],
      }
    );
  }
}
