import { DataTypes, Model } from 'sequelize';
import { QUOTE_STATUSES } from '../utils/constants.js';

export class Quote extends Model {
  static initModel(sequelize) {
    return Quote.init(
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
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'RESTRICT',
        },
        amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: true,
        },
        currency: {
          type: DataTypes.STRING(3),
          defaultValue: 'ARS',
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(QUOTE_STATUSES)),
          defaultValue: QUOTE_STATUSES.DRAFT,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        sentAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'sent_at',
        },
      },
      {
        sequelize,
        modelName: 'Quote',
        tableName: 'quotes',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
