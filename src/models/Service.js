import { DataTypes, Model } from 'sequelize';

export class Service extends Model {
  static initModel(sequelize) {
    return Service.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'is_active',
        },
      },
      {
        sequelize,
        modelName: 'Service',
        tableName: 'services',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
