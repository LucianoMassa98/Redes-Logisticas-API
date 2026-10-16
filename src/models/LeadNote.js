import { DataTypes, Model } from 'sequelize';

export class LeadNote extends Model {
  static initModel(sequelize) {
    return LeadNote.init(
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
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'RESTRICT',
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'LeadNote',
        tableName: 'lead_notes',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
