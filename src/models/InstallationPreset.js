import { DataTypes, Model } from 'sequelize';

export class InstallationPreset extends Model {
  static initModel(sequelize) {
    return InstallationPreset.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        category: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'GENERAL',
        },
        icon: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'Layers',
        },
        laborCost: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'labor_cost',
        },
        markupPercent: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'markup_percent',
        },
        items: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'is_active',
        },
      },
      {
        sequelize,
        modelName: 'InstallationPreset',
        tableName: 'installation_presets',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
